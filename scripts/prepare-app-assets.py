"""Create app-only asset catalog, local font faces, and complete standalone SVGs.

Archived originals remain unchanged; derived vectors include referenced definitions.
"""
import copy
import hashlib
import html
import json
import re
import shutil
import xml.etree.ElementTree as ET
from urllib.parse import unquote
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
manifest = json.loads((ROOT / 'docs/reference/asset-manifest.json').read_text())
routes = json.loads((ROOT / 'docs/reference/routes.json').read_text())['routes']
by_url = {asset['source_url']: asset for asset in manifest['assets'] if not asset.get('source_fragment')}
definition_cache = {}


def parse_vector(text):
    # Data-URI SVGs came from CSS and retain percent/CSS quote escaping.
    if '%22' in text or '%3C' in text:
        text = unquote(text)
    text = text.replace('\\"', '"').replace("\\'", "'")
    if '=&quot;' in text[:250]:
        text = html.unescape(text)
    # Original HTML SVG uses href, and occasionally includes an unqualified xlink.
    if 'xlink:' in text and 'xmlns:xlink' not in text:
        text = text.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"', 1)
    return ET.fromstring(text)


def definitions(route):
    if route in definition_cache:
        return definition_cache[route]
    record = next(record for record in routes if record['path'] == route)
    text = (ROOT / record['raw_html_path']).read_text()
    result = {}
    for match in re.finditer(r'<svg\b[^>]*>.*?</svg>', text, re.S):
        try:
            node = parse_vector(match.group())
            if node.get('id'):
                result[node.get('id')] = node
        except ET.ParseError:
            continue
    definition_cache[route] = result
    return result


catalog = {}
resolved = ROOT / 'public/assets/resolved-svg'
resolved.mkdir(parents=True, exist_ok=True)
unresolved = []
for asset in manifest['assets']:
    local = asset['local_path']
    if asset.get('source_fragment'):
        try:
            vector = parse_vector((ROOT / local).read_text())
            # SSR initial animation styles are layout state, not the vector artwork.
            vector.attrib.pop('class', None)
            vector.attrib.pop('style', None)
            vector.attrib['xmlns'] = 'http://www.w3.org/2000/svg'
            if asset.get('svg_dependencies'):
                route = asset['reference_routes'][0]
                available = definitions(route)
                seen = set()
                closure = []

                def collect(identifier):
                    if identifier in seen:
                        return
                    seen.add(identifier)
                    if identifier not in available:
                        unresolved.append({'asset': asset['id'], 'symbol': identifier, 'route': route})
                        return
                    node = copy.deepcopy(available[identifier])
                    closure.append(node)
                    for element in node.iter():
                        for value in element.attrib.values():
                            if value.startswith('#'):
                                collect(value[1:])
                            for reference in re.findall(r'url\(#([^)]+)\)', value):
                                collect(reference)

                for dependency in asset['svg_dependencies']:
                    collect(dependency)
                defs = ET.Element('defs')
                defs.extend(closure)
                vector.insert(0, defs)
            output = resolved / f"{asset['id']}.svg"
            ET.ElementTree(vector).write(output, encoding='unicode')
            local = str(output.relative_to(ROOT))
        except ET.ParseError as error:
            unresolved.append({'asset': asset['id'], 'error': str(error)})
    catalog[asset['id']] = {
        'url': '/' + local.removeprefix('public/'),
        'kind': asset['kind'],
        'sourceUrl': asset['source_url'],
        'dimensions': asset.get('intrinsic_dimensions'),
    }

font_faces = []
index = (ROOT / 'docs/reference/raw/index.html').read_text()
for match in re.finditer(r'@font-face\s*\{[^}]+\}', index):
    face = match.group()
    for remote in re.findall(r'url\([\"\']?([^\)\"\']+)', face):
        asset = by_url.get(remote)
        if asset:
            face = face.replace(remote, '/' + asset['local_path'].removeprefix('public/'))
    if 'https://' not in face:
        font_faces.append(face)

(ROOT / 'src/assets').mkdir(parents=True, exist_ok=True)
(ROOT / 'src/styles').mkdir(parents=True, exist_ok=True)
(ROOT / 'src/assets/catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, separators=(',', ':')) + '\n')
responsive_catalog = {}
responsive_manifest = ROOT / 'docs/reference/responsive-assets.json'
if responsive_manifest.exists():
    variant_widths = {390: 'phone', 810: 'tablet', 1440: 'desktop', 1620: 'xxl'}
    for response in json.loads(responsive_manifest.read_text())['assets']:
        destination = ROOT / response['local_path']
        if not destination.exists():
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / response['local_evidence_path'], destination)
        if hashlib.sha256(destination.read_bytes()).hexdigest() != response['sha256']:
            raise ValueError(f"Responsive asset hash mismatch: {destination}")
        variants = responsive_catalog.setdefault(response['canonicalAssetId'], {})
        for width in response['viewports']:
            variants[variant_widths[width]] = '/' + response['local_path'].removeprefix('public/')
(ROOT / 'src/assets/responsive-catalog.json').write_text(json.dumps(responsive_catalog, separators=(',', ':')) + '\n')
(ROOT / 'src/styles/fonts.css').write_text('/* Original local font faces; generated by prepare-app-assets.py. */\n' + '\n'.join(dict.fromkeys(font_faces)) + '\n')
(ROOT / 'qa/F01').mkdir(parents=True, exist_ok=True)
(ROOT / 'qa/F01/asset-preparation.json').write_text(json.dumps({'catalogAssets': len(catalog), 'fontFaces': len(font_faces), 'unresolved': unresolved}, indent=2) + '\n')
print(json.dumps({'catalogAssets': len(catalog), 'fontFaces': len(font_faces), 'unresolved': unresolved}, indent=2))
if unresolved:
    raise SystemExit(1)
