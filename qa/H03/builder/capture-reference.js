(async () => {
  await document.fonts.ready;
  await new Promise(resolve => setTimeout(resolve, 8000));
  const root = document.querySelector('.framer-kleuev');
  window.scrollTo({ top: Math.round(root.getBoundingClientRect().y + scrollY), behavior: 'instant' });
  await new Promise(resolve => setTimeout(resolve, 3000));
  const describe = element => {
    const style = getComputedStyle(element);
    return { tag: element.tagName, class: element.getAttribute('class'), name: element.getAttribute('data-framer-name'), text: element.textContent, rect: Object.fromEntries(['x','y','width','height'].map(key => [key, element.getBoundingClientRect()[key] + (key === 'y' ? scrollY : 0)])), style: Object.fromEntries(['fontSize','fontWeight','lineHeight','letterSpacing','fontFeatureSettings','padding','gap','position','top','objectFit','objectPosition','transform','opacity','filter','gridTemplateColumns','display','flexDirection'].map(key => [key,style[key]])), ...(element.tagName === 'IMG' ? { src: element.currentSrc,naturalWidth:element.naturalWidth,naturalHeight:element.naturalHeight } : {}) };
  };
  return { viewport: { width: innerWidth,height:innerHeight,contentWidth:document.documentElement.clientWidth,dpr:devicePixelRatio }, scrollY, fontStatus:document.fonts.status, nodes: [root,...root.querySelectorAll('*')].filter(element => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0).map(describe) };
})()
