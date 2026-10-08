(async () => {
  await document.fonts.ready;
  await new Promise(resolve => setTimeout(resolve, 8000));
  const root = document.querySelector('[data-section="H03"]');
  window.__neidenMotion.scrollTo(Math.round(root.getBoundingClientRect().y + scrollY), { immediate: true, force: true });
  await new Promise(resolve => setTimeout(resolve, 2500));
  const find = (scope, name) => [...scope.querySelectorAll('*')].find(element => typeof element.className === 'string' && element.className.startsWith('_' + name + '_'));
  const describe = element => {
    const style = getComputedStyle(element);
    return { rect: Object.fromEntries(['x','y','width','height'].map(key => [key, element.getBoundingClientRect()[key] + (key === 'y' ? scrollY : 0)])), opacity: style.opacity, transform: style.transform, filter: style.filter, fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing, padding: style.padding, gap: style.gap, position: style.position, top: style.top, text: element.textContent, ...(element.tagName === 'IMG' ? { src: element.currentSrc, naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight, complete: element.complete, objectFit: style.objectFit, objectPosition: style.objectPosition } : {}) };
  };
  const nodes = Object.fromEntries(['boxed','headingWrapper','sticky','inner','headingBase','label','headline','introduction','cards','facts','booking','delivery'].map(name => [name, find(root,name) ? describe(find(root,name)) : null]));
  nodes.section = describe(root);
  const cards = [...root.querySelectorAll('[data-services-card]')].map(card => ({ card: describe(card), ...Object.fromEntries(['cardHeader','eyebrow','cardTitle','media','cardFooter','copy','description','price','tags'].map(name => [name, describe(find(card,name))])), images: [...card.querySelectorAll('[data-services-image]')].map(frame => ({ frame: describe(frame), image: describe(frame.querySelector('img')) })), tagRows: [...card.querySelectorAll('ul')].map(row => ({ row: describe(row), tags: [...row.children].map(describe) })), words: [...card.querySelectorAll('[data-services-word]')].map(describe) }));
  const targets = [...root.querySelectorAll('[data-services-appear],[data-services-title-line],[data-services-word],[data-services-image]')];
  const state = targets.map(describe);
  await new Promise(resolve => setTimeout(resolve, 200));
  return { capturedAt: new Date().toISOString(), viewport: { width: innerWidth,height:innerHeight,contentWidth:document.documentElement.clientWidth,dpr:devicePixelRatio }, scrollY, fontStatus: document.fonts.status, variant: root.dataset.servicesVariant, nodes, cards, stable: targets.every((target,index) => JSON.stringify(describe(target)) === JSON.stringify(state[index])), triggerCount: window.__neidenMotion.triggerCount() };
})()
