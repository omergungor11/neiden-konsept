document.fonts.ready.then(async () => {
  await new Promise(resolve => setTimeout(resolve, 8000));
  const root = document.querySelector('[data-section="H01"]');
  const classNode = name => [...root.querySelectorAll('*')].find(element => typeof element.className === 'string' && element.className.startsWith('_' + name + '_'));
  const rect = element => Object.fromEntries(['x','y','width','height'].map(key => [key, element.getBoundingClientRect()[key]]));
  const describe = element => {
    const style = getComputedStyle(element);
    return { rect: rect(element), opacity: style.opacity, transform: style.transform, filter: style.filter, fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing };
  };
  const names = ['wrapper','primary','services','logoFrame','wordmarkText','tagline','description','actions','ctaCell','reviewCell','reviews','people','rating','social','slots','clients','tickerReveal'];
  const nodes = Object.fromEntries(names.map(name => [name, describe(classNode(name))]));
  nodes.hero = describe(root);
  nodes.body = describe(root.querySelector('[data-hero-description]'));
  const settleTargets = [...root.querySelectorAll('[data-hero-primary],[data-hero-service],[data-hero-logo-appear],[data-hero-characters="tagline"] > span,[data-hero-description],[data-hero-cta],[data-hero-reviews],[data-hero-ticker]')];
  const settled = settleTargets.map(describe);
  await new Promise(resolve => setTimeout(resolve, 200));
  const stable = settleTargets.every((element, index) => JSON.stringify(describe(element)) === JSON.stringify(settled[index]));
  const video = root.querySelector('video');
  return { capturedAt: new Date().toISOString(), viewport: { width: innerWidth,height:innerHeight,contentWidth:document.documentElement.clientWidth,dpr:devicePixelRatio },scrollY,fontStatus:document.fonts.status,nodes,settled,stable,preloader:{visible:!!document.querySelector('[data-hero-preloader]'),probe:window.__h01Probe},video:{src:video.currentSrc,duration:video.duration,time:video.currentTime,paused:video.paused,autoplay:video.autoplay,muted:video.muted,loop:video.loop,playsInline:video.playsInline,readyState:video.readyState,error:video.error},triggers:window.__neidenMotion?.triggerCount() };
})
