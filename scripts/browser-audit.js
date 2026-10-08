// agent-browser eval --stdin < scripts/browser-audit.js
// Salt okunur DOM ölçümü; sayfa içeriğini veya formları değiştirmez.
(() => {
  const rect = (element) => {
    const value = element.getBoundingClientRect();
    return Object.fromEntries(["x", "y", "width", "height"].map((key) => [key, Math.round(value[key] * 100) / 100]));
  };
  const describe = (element) => {
    const style = getComputedStyle(element);
    return {
      tag: element.tagName,
      name: element.getAttribute("data-framer-name"),
      id: element.id,
      class: element.className,
      rect: rect(element),
      documentY: Math.round(element.getBoundingClientRect().y + scrollY),
      display: style.display,
      position: style.position,
      top: style.top,
      color: style.color,
      background: style.backgroundColor,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      transform: style.transform,
      opacity: style.opacity,
    };
  };
  return {
    capturedAt: new Date().toISOString(),
    url: location.href,
    title: document.title,
    viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio, contentWidth: document.documentElement.clientWidth },
    scroll: { x: scrollX, y: scrollY, height: document.documentElement.scrollHeight },
    sections: [...document.querySelectorAll("section, main, footer, header")].map(describe),
    headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((element) => ({ ...describe(element), text: element.innerText })),
    stickyElements: [...document.querySelectorAll("#main *")].filter((element) => ["sticky", "fixed"].includes(getComputedStyle(element).position)).map(describe),
    fonts: [...document.fonts].filter((font) => font.status === "loaded").map((font) => ({ family: font.family, style: font.style, weight: font.weight })),
    videos: [...document.querySelectorAll("video")].map((element) => ({ ...describe(element), src: element.currentSrc || element.src, poster: element.poster, autoplay: element.autoplay, loop: element.loop, muted: element.muted, controls: element.controls, duration: Number.isFinite(element.duration) ? element.duration : null })),
    forms: [...document.forms].map((form) => ({ action: form.action, method: form.method, fields: [...form.elements].map((element) => ({ tag: element.tagName, type: element.type, name: element.name, placeholder: element.placeholder, required: element.required })) })),
  };
})();
