import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Read-only targeted discovery. These measurements are evidence, never app input.
const [names = 'Hello,Services', width = '1440', height = '1000'] = process.argv.slice(2);
const session = `neiden-inspect-${process.pid}`;
const run = (...args) => execFileSync('npx', ['--offline', '--yes', 'agent-browser@0.27.0', '--session', session, ...args], { encoding: 'utf8', timeout: 60000 });
const evaluate = (source) => JSON.parse(execFileSync('npx', ['--offline', '--yes', 'agent-browser@0.27.0', '--session', session, 'eval', '--stdin'], { input: source, encoding: 'utf8', timeout: 60000 }));
const directory = resolve(`docs/reference/section-layout/${width}`);
mkdirSync(directory, { recursive: true });
try {
  run('open', 'about:blank');
  run('set', 'viewport', width, height);
  run('open', 'https://neiden.framer.media/');
  evaluate('document.fonts.ready.then(()=>new Promise(r=>setTimeout(()=>r(true),8000)))');
  for (const name of names.split(',')) {
    const data = evaluate(`(async () => {
      const matches=[...document.querySelectorAll('[data-framer-name]')].filter(n=>n.getAttribute('data-framer-name')===${JSON.stringify(name)} && n.getBoundingClientRect().height>300);
      const root=matches.find(n=>['SECTION','FOOTER'].includes(n.tagName))??matches[0];
      if(!root) return {name:${JSON.stringify(name)},error:'section not found'};
      const sectionY=root.getBoundingClientRect().top+scrollY;
      window.scrollTo({top:sectionY,behavior:'instant'});
      await new Promise(r=>setTimeout(r,1000));
      const nodes=[root,...root.querySelectorAll('*')].filter(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0;}).map(n=>{
        const r=n.getBoundingClientRect(),s=getComputedStyle(n);
        const properties=['display','position','top','left','right','bottom','padding','margin','gap','flexDirection','alignItems','justifyContent','gridTemplateColumns','background','backgroundImage','color','fontFamily','fontSize','fontWeight','letterSpacing','lineHeight','textAlign','opacity','transform','filter','mixBlendMode','objectFit','objectPosition','border','borderRadius','overflow'];
        return {tag:n.tagName,name:n.getAttribute('data-framer-name'),class:n.getAttribute('class'),id:n.id||undefined,parentClass:n.parentElement?.getAttribute('class'),text:[...n.childNodes].filter(x=>x.nodeType===3).map(x=>x.textContent).join('').trim()||undefined,href:n.getAttribute('href')||undefined,src:n.currentSrc||n.getAttribute('src')||undefined,alt:n.getAttribute('alt')||undefined,rect:{x:r.x,y:r.y+scrollY,width:r.width,height:r.height},style:Object.fromEntries(properties.map(p=>[p,s[p]]))};
      });
      return {name:${JSON.stringify(name)},url:location.href,viewport:{width:innerWidth,height:innerHeight,contentWidth:document.documentElement.clientWidth,dpr:devicePixelRatio},scrollY,sectionY,sectionHeight:root.getBoundingClientRect().height,nodes};
    })()`);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    writeFileSync(resolve(directory, `${slug}.json`), JSON.stringify(data, null, 2));
    process.stdout.write(`${name}: ${data.nodes?.length ?? data.error}\n`);
  }
} finally { run('close'); }
