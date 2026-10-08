import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const session = `about-independent-${process.pid}`;
const run = (...args) => execFileSync('npx', ['--offline', '--yes', 'agent-browser@0.27.0', '--session', session, ...args], { encoding: 'utf8', timeout: 60000 });
const evaluate = source => JSON.parse(execFileSync('npx', ['--offline', '--yes', 'agent-browser@0.27.0', '--session', session, 'eval', '--stdin'], { input: source, encoding: 'utf8', timeout: 60000 }));
const inspect = `(() => {
 const root=document.querySelector('[data-section="H02"]'),chars=[...(root?.querySelectorAll('[data-about-character]')??[])];
 return {path:location.pathname,scrollY,viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,variant:root?.dataset.aboutVariant,headlineSize:root?getComputedStyle(root.querySelector('h2')).fontSize:null,colors:chars.reduce((counts,n)=>{const c=getComputedStyle(n).color;counts[c]=(counts[c]??0)+1;return counts},{}),images:[...(root?.querySelectorAll('[data-about-parallax]')??[])].map(n=>({factor:n.dataset.aboutParallax,transform:getComputedStyle(n).transform})),appear:[...(root?.querySelectorAll('[data-about-appear]')??[])].map(n=>({opacity:getComputedStyle(n).opacity,transform:getComputedStyle(n).transform})),lenis:!!window.__neidenMotion.lenis,stopped:window.__neidenMotion.lenis?.isStopped,triggers:window.__neidenMotion.triggerCount(),hero:!!document.querySelector('[data-section="H01"]')};
})()`;
const evidence = {};
try {
 run('open','about:blank');run('set','viewport','1440','1000');run('open','http://127.0.0.1:5173/');
 evaluate('document.fonts.ready.then(()=>new Promise(r=>setTimeout(()=>r(true),8500)))');
 evaluate('window.__neidenMotion.scrollTo(600,{immediate:true});new Promise(r=>setTimeout(()=>r(true),700))');
 evidence.scroll600=evaluate(inspect);
 run('screenshot',`${process.cwd()}/qa/H02/about-motion-600-local.png`);
 run('set','media','reduced-motion');evaluate('new Promise(r=>setTimeout(()=>r(true),500))');
 evidence.reduced=evaluate(inspect);
 run('set','viewport','810','1000');evaluate('new Promise(r=>setTimeout(()=>r(true),500))');
 evidence.tabletReduced=evaluate(inspect);
 run('set','media','light');evaluate('new Promise(r=>setTimeout(()=>r(true),700))');
 evidence.tabletRestored=evaluate(inspect);
 evaluate(`document.querySelector('a[href="/contacts"]').click();new Promise(r=>setTimeout(()=>r(true),700))`);
 evidence.routeUnmount=evaluate(inspect);
 evidence.errors=run('errors');
 writeFileSync('qa/H02/independent-motion.json',JSON.stringify(evidence,null,2));
 process.stdout.write(JSON.stringify(evidence)+'\n');
} finally {run('close')}
