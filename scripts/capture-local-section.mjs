import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Browser evidence only. The application never reads these measurements.
const [section = 'H02', width = '1440', height = '1000', prefix = section.toLowerCase()] = process.argv.slice(2);
const session = `neiden-local-${process.pid}`;
const command = (...args) => execFileSync('npx', ['--offline', '--yes', 'agent-browser@0.27.0', '--session', session, ...args], { encoding: 'utf8', timeout: 60000 });
const evaluate = source => JSON.parse(execFileSync('npx', ['--offline', '--yes', 'agent-browser@0.27.0', '--session', session, 'eval', '--stdin'], { input: source, encoding: 'utf8', timeout: 60000 }));
const directory = resolve(`qa/${section}`);
mkdirSync(directory, { recursive: true });
try {
  command('open', 'about:blank');
  command('set', 'viewport', width, height);
  command('open', 'http://127.0.0.1:5173/');
  evaluate('document.fonts.ready.then(()=>new Promise(r=>setTimeout(()=>r(true),8500)))');
  const result = evaluate(`(async () => {
    const root=document.querySelector('[data-section="${section}"]');
    if(!root) throw new Error('Missing section ${section}');
    const sectionY=root.getBoundingClientRect().top+scrollY;
    window.__neidenMotion.scrollTo(sectionY,{immediate:true});
    await new Promise(r=>setTimeout(r,1800));
    const properties=['position','fontFamily','fontSize','fontWeight','letterSpacing','lineHeight','color','opacity','transform','filter','objectFit','objectPosition','mixBlendMode'];
    const nodes=[root,...root.querySelectorAll('*')].filter(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0}).map(n=>{
      const r=n.getBoundingClientRect(),s=getComputedStyle(n);
      return {tag:n.tagName,class:n.getAttribute('class'),data:Object.fromEntries(Object.entries(n.dataset)),text:[...n.childNodes].filter(x=>x.nodeType===3).map(x=>x.textContent).join('')||undefined,src:n.currentSrc||n.getAttribute('src')||undefined,href:n.getAttribute('href')||undefined,rect:{x:r.x,y:r.y+scrollY,width:r.width,height:r.height},style:Object.fromEntries(properties.map(p=>[p,s[p]]))};
    });
    return {url:location.href,viewport:{width:innerWidth,height:innerHeight,contentWidth:document.documentElement.clientWidth,dpr:devicePixelRatio},sectionY,scrollY,sectionHeight:root.getBoundingClientRect().height,documentWidth:document.documentElement.scrollWidth,fonts:document.fonts.status,triggers:window.__neidenMotion.triggerCount(),lenisStopped:window.__neidenMotion.lenis?.isStopped,nodes};
  })()`);
  writeFileSync(resolve(directory, `${prefix}-${width}-local.json`), JSON.stringify(result, null, 2));
  command('screenshot', resolve(directory, `${prefix}-${width}-local.png`));
  writeFileSync(resolve(directory, `${prefix}-${width}-errors.txt`), command('errors'));
  process.stdout.write(JSON.stringify({section,width,result:{sectionY:result.sectionY,height:result.sectionHeight,scrollY:result.scrollY,documentWidth:result.documentWidth,triggers:result.triggers}})+'\n');
} finally { command('close'); }
