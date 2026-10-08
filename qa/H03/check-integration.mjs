import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const session=`services-independent-${process.pid}`;
const run=(...args)=>execFileSync('npx',['--offline','--yes','agent-browser@0.27.0','--session',session,...args],{encoding:'utf8',timeout:60000});
const evaluate=source=>JSON.parse(execFileSync('npx',['--offline','--yes','agent-browser@0.27.0','--session',session,'eval','--stdin'],{input:source,encoding:'utf8',timeout:60000}));
const inspect=`(() => {const root=document.querySelector('[data-section="H03"]'),targets=[...(root?.querySelectorAll('[data-services-appear],[data-services-image],[data-services-word]')??[])];return {path:location.pathname,scrollY,sectionY:root?root.getBoundingClientRect().y+scrollY:null,height:root?.getBoundingClientRect().height,stickyY:root?.querySelector('[class*="_sticky_"]').getBoundingClientRect().y,lenis:!!window.__neidenMotion.lenis,triggers:window.__neidenMotion.triggerCount(),width:document.documentElement.scrollWidth,targets:targets.map(n=>({opacity:getComputedStyle(n).opacity,transform:getComputedStyle(n).transform})),images:[...(root?.querySelectorAll('img[src*="/responsive/"]')??[])].map(n=>({src:n.currentSrc,complete:n.complete,naturalWidth:n.naturalWidth}))}})()`;
const evidence={};
try {
 run('open','about:blank');run('set','viewport','1440','1000');run('open','http://127.0.0.1:5173/');
 evaluate('document.fonts.ready.then(()=>new Promise(r=>setTimeout(()=>r(true),8500)))');
 for(const y of [1850,2461,3072,3800]) {
  evaluate(`window.__neidenMotion.scrollTo(${y},{immediate:true});new Promise(r=>setTimeout(()=>r(true),1800))`);
  evidence[y]=evaluate(inspect);
  if(y!==3800)run('screenshot',`${process.cwd()}/qa/H03/services-${y}-desktop-local.png`);
 }
 evaluate(`window.__neidenMotion.scrollTo(2461,{immediate:true});document.querySelector('[data-section="H03"] a').focus();new Promise(r=>setTimeout(()=>r(true),1000))`);
 evidence.cta=evaluate(`(() => {const a=document.querySelector('[data-section="H03"] a'),s=getComputedStyle(a);return {href:a.getAttribute('href'),focused:document.activeElement===a,color:s.backgroundColor,radius:s.borderRadius,angle:s.getPropertyValue('--services-plus-angle')}})()`);
 run('set','media','reduced-motion');evaluate('new Promise(r=>setTimeout(()=>r(true),500))');evidence.reduced=evaluate(inspect);
 run('set','media','light');evaluate('new Promise(r=>setTimeout(()=>r(true),500))');evidence.restored=evaluate(inspect);
 evaluate(`document.querySelector('[data-section="H03"] a').click();new Promise(r=>setTimeout(()=>r(true),600))`);evidence.unmount=evaluate(inspect);
 evidence.errors=run('errors');writeFileSync('qa/H03/independent-motion.json',JSON.stringify(evidence,null,2));
 process.stdout.write(JSON.stringify({sticky:[evidence[2461].stickyY,evidence[3072].stickyY],cta:evidence.cta,reduced:{lenis:evidence.reduced.lenis,triggers:evidence.reduced.triggers,hidden:evidence.reduced.targets.filter(n=>n.opacity!=='1').length},unmount:evidence.unmount,errors:evidence.errors})+'\n');
}finally{run('close')}
