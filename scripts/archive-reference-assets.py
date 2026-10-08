#!/usr/bin/env python3
"""Arşiv yalnızca herkese açık referans URL'lerini ve gerçek rotaları kullanır."""
from __future__ import annotations

import concurrent.futures
from collections import Counter
from datetime import datetime, timezone
import hashlib
import html
from html.parser import HTMLParser
from importlib.util import find_spec
import io
import json
import mimetypes
from pathlib import Path
import re
import shutil
import subprocess
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "docs/reference/raw"
PUBLIC = ROOT / "public/assets"
ORIGIN = "https://neiden.framer.media"
UA = "Mozilla/5.0 (public reference archive)"
MEDIA_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg", ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".webm", ".mov", ".ico"}
URL_RE = re.compile(r'https://(?:framerusercontent\.com|fonts\.gstatic\.com)/[A-Za-z0-9/_~.%-]+(?:\?[A-Za-z0-9%&=._~+\-]+)?')
MODULE_RE = re.compile(r'["`](\./[^"`]+\.mjs)["`]')
RUNTIME_NAMES = ("rolldown-runtime.", "react.", "motion.", "framer.")


def fetch(url: str, target: Path, timeout: int = 60) -> dict:
    target.parent.mkdir(parents=True, exist_ok=True)
    try:
        with urlopen(Request(url, headers={"User-Agent": UA}), timeout=timeout) as response:
            data = response.read()
            target.write_bytes(data)
            return {"status": "downloaded", "http_status": response.status,
                    "mime": response.headers.get_content_type(), "bytes": len(data),
                    "sha256": hashlib.sha256(data).hexdigest(), "final_url": response.geturl()}
    except HTTPError as exc:
        # /404 is a real sitemap route with a deliberately non-success status.
        # Its public error-page body is still useful reference evidence.
        if target.suffix == ".html":
            data = exc.read()
            target.write_bytes(data)
            return {"status": "downloaded", "http_status": exc.code,
                    "mime": exc.headers.get_content_type(), "bytes": len(data),
                    "sha256": hashlib.sha256(data).hexdigest(), "final_url": url}
        return {"status": "failed", "http_status": exc.code, "error": str(exc)}
    except Exception as exc:
        return {"status": "failed", "error": repr(exc)}


def fetch_evidence(url: str, target: Path) -> dict:
    if target.exists():
        data = target.read_bytes()
        return {"status": "downloaded", "http_status": 404 if route_path(url) == "/404" else 200,
                "mime": mimetypes.guess_type(str(target))[0], "bytes": len(data),
                "sha256": hashlib.sha256(data).hexdigest(), "final_url": url,
                "reused_public_reference_archive": True}
    result = fetch(url, target)
    if result["status"] == "failed":
        result = fetch(url, target)
    return result


def route_path(url: str) -> str | None:
    p = urlsplit(url)
    if p.netloc != "neiden.framer.media":
        return None
    return p.path.rstrip("/") or "/"


def raw_html_path(route: str) -> Path:
    return RAW / ("index.html" if route == "/" else "pages/" + route.lstrip("/") + ".html")


def media_key(url: str) -> str:
    p = urlsplit(html.unescape(url))
    # Framer image query parameters are output transforms. The query-free URL is
    # the accessible original; all observed transforms remain in the manifest.
    if p.netloc == "framerusercontent.com" and p.path.startswith("/images/"):
        return urlunsplit((p.scheme, p.netloc, p.path, "", ""))
    return urlunsplit((p.scheme, p.netloc, p.path, p.query, ""))


def media_kind(url: str) -> str:
    ext = Path(urlsplit(url).path).suffix.lower()
    if ext in {".woff", ".woff2", ".ttf", ".otf"}:
        return "font"
    if ext in {".mp4", ".webm", ".mov"}:
        return "video"
    if ext == ".svg":
        return "svg"
    return "image"


class PageParser(HTMLParser):
    def __init__(self, route: str):
        super().__init__(convert_charrefs=True)
        self.route = route
        self.links = set()
        self.assets = []
        self.sections = []
        self.names = []
        self.stack = []
        self.title = []
        self.text = []
        self.motion_targets = []
        self.skip_depth = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        name = a.get("data-framer-name")
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}:
            self.stack.append((tag, name))
        if name:
            self.names.append(name)
        if a.get("id"):
            self.sections.append({"id": a["id"], "name": name, "tag": tag})
        if tag == "a" and a.get("href"):
            target = route_path(urljoin(ORIGIN + self.route, a["href"]))
            if target:
                self.links.add(target)
        context = " / ".join(n for _, n in self.stack if n)[-240:]
        if a.get("data-framer-appear-id"):
            self.motion_targets.append({"appear_id": a["data-framer-appear-id"], "tag": tag,
                    "class": a.get("class"), "name": name, "context": context})
        for attr in ("src", "poster", "srcset", "style", "href", "content"):
            for url in URL_RE.findall(html.unescape(a.get(attr, ""))):
                if Path(urlsplit(url).path).suffix.lower() in MEDIA_EXTENSIONS:
                    self.assets.append((url, {"route": self.route, "tag": tag,
                                            "attribute": attr, "context": context,
                                            "alt": a.get("alt")}))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def handle_data(self, text):
        if self.stack and self.stack[-1][0] == "title":
            self.title.append(text)
        if not any(t in {"script", "style", "svg"} for t, _ in self.stack):
            text = text.strip()
            if text:
                self.text.append(text)


def font_metadata(source: str):
    found = []
    for block in re.findall(r"@font-face\s*\{[^}]+\}", source):
        urls = URL_RE.findall(block)
        values = {}
        for key in ("font-family", "font-style", "font-weight", "font-display", "unicode-range"):
            match = re.search(r"\b" + key + r"\s*:\s*([^;]+)", block)
            if match:
                values[key] = match[1].strip(" '\"")
        for url in urls:
            found.append((url, values))
    return found


def dimensions(target: Path, kind: str, mime: str | None):
    if kind == "video" and shutil.which("ffprobe"):
        try:
            data = json.loads(subprocess.check_output([
                "ffprobe", "-v", "error", "-show_entries", "stream=width,height,codec_name:format=duration",
                "-of", "json", str(target)], text=True, timeout=40))
            streams = [s for s in data.get("streams", []) if s.get("width")]
            result = {"width": streams[0]["width"], "height": streams[0]["height"]} if streams else {}
            if data.get("format", {}).get("duration"):
                result["duration_seconds"] = float(data["format"]["duration"])
            return result or None
        except Exception:
            return None
    if kind == "font":
        return None
    if kind == "svg":
        try:
            s = target.read_text()
            result = {}
            match = re.search(r'viewBox=["\']([^"\']+)', s, re.I)
            if match:
                result["viewBox"] = match[1]
            opening = s.split(">", 1)[0]
            for key in ("width", "height"):
                match = re.search(r'\b' + key + r'=["\']([0-9.]+)(?:px)?["\']', opening)
                if match:
                    result[key] = float(match[1])
            return result or None
        except Exception:
            return None
    try:
        from PIL import Image
        with Image.open(target) as im:
            return {"width": im.width, "height": im.height, "format": im.format}
    except Exception:
        return None


def font_binary_metadata(target: Path):
    if find_spec("brotli") is None:
        return {"inspection_error": "No module named brotli"}
    try:
        from fontTools.ttLib import TTFont
        with TTFont(target) as font:
            names = font["name"]
            result = {"family_name": names.getDebugName(1), "subfamily_name": names.getDebugName(2),
                      "full_name": names.getDebugName(4), "postscript_name": names.getDebugName(6)}
            if "OS/2" in font:
                result["weight_class"] = font["OS/2"].usWeightClass
            if "fvar" in font:
                result["variable_axes"] = [{"tag": a.axisTag, "min": a.minValue, "max": a.maxValue, "default": a.defaultValue} for a in font["fvar"].axes]
            return result
    except Exception as exc:
        return {"inspection_error": str(exc)}


def main():
    RAW.mkdir(parents=True, exist_ok=True)
    fetch(ORIGIN + "/robots.txt", RAW / "robots.txt")
    fetch(ORIGIN + "/sitemap.xml", RAW / "sitemap.xml")
    sitemap_urls = [x.text for x in ET.parse(RAW / "sitemap.xml").getroot() if x.tag.endswith("url") for x in x if x.tag.endswith("loc")]
    routes = {route_path(url): {"path": route_path(url), "source_url": url,
              "discovered_via": ["sitemap.xml"]} for url in sitemap_urls}
    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        jobs = {pool.submit(fetch_evidence, item["source_url"], raw_html_path(path)): path for path, item in routes.items()}
        for future in concurrent.futures.as_completed(jobs):
            path = jobs[future]
            results[path] = future.result()
            print("page", path, results[path]["status"], results[path].get("bytes"), flush=True)

    assets = {}
    module_urls = set()
    font_records = {}
    inline_svgs = {}
    search_urls = set()

    def add_asset(url, context):
        key = media_key(url)
        item = assets.setdefault(key, {"id": hashlib.sha256(key.encode()).hexdigest()[:16],
                "source_url": key, "kind": media_kind(key), "reference_routes": set(),
                "contexts": [], "alt": set(), "variants": set()})
        if context["route"].startswith("/"):
            item["reference_routes"].add(context["route"])
        else:
            context = {**context, "route": None, "source_type": "generated-module",
                       "source_module": "docs/reference/raw/modules/" + context["context"]}
        if context not in item["contexts"]:
            item["contexts"].append(context)
        if context.get("alt"):
            item["alt"].add(context["alt"])
        item["variants"].add(url)

    for path, item in routes.items():
        result = results[path]
        item.update(result)
        item["raw_html_path"] = str(raw_html_path(path).relative_to(ROOT)) if result["status"] == "downloaded" else None
        if result["status"] != "downloaded":
            continue
        source = raw_html_path(path).read_text()
        parser = PageParser(path)
        parser.feed(source)
        item["title"] = "".join(parser.title)
        item["internal_links"] = sorted(parser.links)
        item["html_ids"] = parser.sections
        item["framer_names"] = list(dict.fromkeys(parser.names))
        item["text_evidence_path"] = str(raw_html_path(path).with_suffix(".text.txt").relative_to(ROOT))
        raw_html_path(path).with_suffix(".text.txt").write_text("\n".join(parser.text))
        motion = {"route": path, "targets": parser.motion_targets}
        for script_id, key in [("__framer__appearAnimationsContent", "appear_animations"), ("__framer__breakpoints", "breakpoints")]:
            match = re.search(r'<script[^>]*id="' + script_id + r'"[^>]*>(.*?)</script>', source, re.S)
            if match:
                motion[key] = json.loads(match[1])
        motion_path = raw_html_path(path).with_suffix(".motion.json")
        motion_path.write_text(json.dumps(motion, ensure_ascii=False, indent=2))
        item["motion_evidence_path"] = str(motion_path.relative_to(ROOT))
        for url, context in parser.assets:
            add_asset(url, context)
        for url in URL_RE.findall(html.unescape(source)):
            if Path(urlsplit(url).path).suffix.lower() in MEDIA_EXTENSIONS:
                add_asset(url, {"route": path, "tag": "source", "attribute": "raw-reference", "context": "HTML/CSS", "alt": None})
        for url, metadata in font_metadata(source):
            font_records.setdefault(media_key(url), metadata)
        for url in re.findall(r'https://framerusercontent\.com/sites/[^"\s<>]+\.mjs', source):
            if not Path(urlsplit(url).path).name.startswith(RUNTIME_NAMES):
                module_urls.add(url)
        search_urls.update(re.findall(r'https://framerusercontent\.com/sites/[^"\s<>]+searchIndex[^"\s<>]+\.json', source))
        for svg in re.findall(r'<svg\b[^>]*>.*?</svg>', source, re.S):
            key = hashlib.sha256(svg.encode()).hexdigest()
            entry = inline_svgs.setdefault(key, {"svg": svg, "routes": set()})
            entry["routes"].add(path)

    # Generated design modules are evidence only. React, Motion, Framer and the
    # bundler runtime are deliberately excluded from this evidence archive.
    module_records = []
    seen_modules = set()
    for depth in range(3):
        pending = module_urls - seen_modules
        if not pending:
            break
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
            jobs = {pool.submit(fetch_evidence, u, RAW / "modules" / Path(urlsplit(u).path).name): u for u in pending}
            for future in concurrent.futures.as_completed(jobs):
                url = jobs[future]
                seen_modules.add(url)
                result = future.result()
                local = RAW / "modules" / Path(urlsplit(url).path).name
                module_records.append({"source_url": url, "local_path": str(local.relative_to(ROOT)), **result})
                if result["status"] == "downloaded":
                    source = local.read_text()
                    for block in re.findall(r'\{(?:cssFamilyName|family):`[^`]+`,[^}]+\}', source):
                        match = re.search(r'url:`([^`]+)`', block)
                        if match:
                            metadata = {}
                            for src_key, dest_key in [("cssFamilyName", "font-family"), ("style", "font-style"), ("weight", "font-weight"), ("unicodeRange", "unicode-range")]:
                                value = re.search(src_key + r':`([^`]+)`', block)
                                if value:
                                    metadata[dest_key] = value[1]
                            if "font-family" not in metadata:
                                value = re.search(r'family:`([^`]+)`', block)
                                if value:
                                    metadata["font-family"] = value[1]
                            font_records.setdefault(media_key(match[1]), metadata)
                    for relative in MODULE_RE.findall(source):
                        if not Path(relative).name.startswith(RUNTIME_NAMES):
                            module_urls.add(urljoin(url, relative))
                    for media in URL_RE.findall(source):
                        if Path(urlsplit(media).path).suffix.lower() in MEDIA_EXTENSIONS:
                            add_asset(media, {"route": "generated-module", "tag": "module", "attribute": "literal", "context": local.name, "alt": None})
        print("design module evidence", depth, len(seen_modules), flush=True)
    (RAW / "module-manifest.json").write_text(json.dumps(module_records, indent=2, ensure_ascii=False))
    for url in search_urls:
        fetch(url, RAW / Path(urlsplit(url).path).name)

    records = list(assets.values())
    basename_counts = Counter((media_kind(a["source_url"]), Path(urlsplit(a["source_url"]).path).name) for a in records)
    for item in records:
        name = Path(urlsplit(item["source_url"]).path).name
        if basename_counts[(item["kind"], name)] > 1:
            name = item["id"] + "-" + name
        folder = {"image": "images", "video": "videos", "font": "fonts", "svg": "svg"}[item["kind"]]
        item["local_path"] = "public/assets/" + folder + "/" + name
        if item["source_url"] in font_records:
            item["font_metadata"] = font_records[item["source_url"]]
        item["variants"] = [{"source_url": u, "canonical_source_url": item["source_url"],
                             "relationship": "canonical" if u == item["source_url"] else "responsive-transform",
                             "archived_separately": False} for u in sorted(item["variants"])]
        item["reference_routes"] = sorted(item["reference_routes"])
        item["alt"] = sorted(item["alt"])

    previous_manifest_path = ROOT / "docs/reference/asset-manifest.json"
    previous_records = {}
    if previous_manifest_path.exists():
        previous_records = {a["source_url"]: a for a in json.loads(previous_manifest_path.read_text())["assets"] if not a.get("source_fragment")}

    def download_asset(item):
        target = ROOT / item["local_path"]
        previous = previous_records.get(item["source_url"])
        if previous and previous.get("status") == "downloaded":
            previous_target = ROOT / previous["local_path"]
            if previous_target.exists() and hashlib.sha256(previous_target.read_bytes()).hexdigest() == previous["sha256"]:
                target.parent.mkdir(parents=True, exist_ok=True)
                if target != previous_target:
                    shutil.copyfile(previous_target, target)
                keys = ("status", "http_status", "mime", "bytes", "sha256", "final_url", "intrinsic_dimensions")
                return item, {**{k: previous[k] for k in keys if k in previous}, "reused_verified_archive": True}
        result = fetch(item["source_url"], target, timeout=120)
        if result["status"] == "downloaded":
            result["intrinsic_dimensions"] = dimensions(target, item["kind"], result.get("mime"))
        return item, result

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        jobs = [pool.submit(download_asset, item) for item in records]
        for future in concurrent.futures.as_completed(jobs):
            item, result = future.result()
            item.update(result)
            if item["kind"] == "font" and result["status"] == "downloaded":
                item["font_binary_metadata"] = font_binary_metadata(ROOT / item["local_path"])
            print("asset", item["kind"], Path(item["local_path"]).name, result["status"], result.get("bytes"), flush=True)

    for sha, entry in inline_svgs.items():
        target = PUBLIC / "svg" / ("inline-" + sha[:16] + ".svg")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(entry["svg"])
        records.append({"id": sha[:16], "kind": "svg", "source_url": ORIGIN + sorted(entry["routes"])[0],
              "source_fragment": "inline-svg:" + sha, "local_path": str(target.relative_to(ROOT)),
              "sha256": sha, "bytes": target.stat().st_size, "mime": "image/svg+xml",
              "status": "downloaded", "http_status": 200, "reference_routes": sorted(entry["routes"]),
              "contexts": [{"route": p, "tag": "svg", "attribute": "inline-markup", "context": "Özgün HTML içi SVG"} for p in sorted(entry["routes"])],
              "variants": [], "alt": [], "intrinsic_dimensions": dimensions(target, "svg", "image/svg+xml")})
        records[-1]["svg_dependencies"] = sorted(set(re.findall(r'(?:href|xlink:href)=["\']#([^"\']+)', entry["svg"])))

    captured = datetime.now(timezone.utc).isoformat()
    summary = {"total": len(records), "downloaded": sum(r["status"] == "downloaded" for r in records),
        "failed": sum(r["status"] == "failed" for r in records), "by_kind": dict(Counter(r["kind"] for r in records)),
        "downloaded_bytes": sum(r.get("bytes", 0) for r in records),
        "observed_variant_urls": sum(len(r.get("variants", [])) for r in records)}
    manifest = {"schema_version": 1, "reference_origin": ORIGIN, "captured_at_utc": captured,
         "policy": "Herkese açık özgün varlıklar; Framer görsel dönüşümleri tek erişilebilir özgün dosyaya gruplanmıştır. HTML/modüller yalnızca docs/reference/raw altında kanıttır.",
         "summary": summary, "assets": sorted(records, key=lambda a: (a["kind"], a["source_url"], a.get("source_fragment", "")))}
    home_module = RAW / "modules/2uQbRrDtoxfE3UZHZ-2wgMSI-vEbDwSP3FN7xx0FUAc.DVuEzT9_.mjs"
    if home_module.exists():
        manifest["external_media_references"] = [{"source_url": u, "reference_routes": ["/"],
            "context": "Ana sayfa showreel YouTube hedefi; özgün video dosyası URL'si değil.",
            "status": "not-archived-external-player", "local_path": None,
            "evidence": str(home_module.relative_to(ROOT))} for u in sorted(set(re.findall(r'https://youtu\.be/[A-Za-z0-9_-]+', home_module.read_text())))]
    (ROOT / "docs/reference/asset-manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
    (ROOT / "docs/reference/routes.json").write_text(json.dumps({"reference_origin": ORIGIN,
         "captured_at_utc": captured, "discovery": "Aynı köken sitemap.xml ve arşivlenmiş gerçek HTML bağlantıları",
         "route_count": len(routes), "routes": sorted(routes.values(), key=lambda r: r["path"])}, indent=2, ensure_ascii=False))
    print("FINAL", json.dumps(summary), "routes", len(routes), "modules", len(module_records), flush=True)


if __name__ == "__main__":
    main()
