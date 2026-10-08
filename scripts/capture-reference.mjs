import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Planlama ve sonraki karşılaştırmalar için aynı viewport/scroll noktalarını kaydeder.
// Kullanım: node scripts/capture-reference.mjs [url] [çıktı-dizini] [genişlik] [yükseklik]
const [url = 'https://neiden.framer.media/', output = 'docs/reference/screenshots/desktop', width = '1440', height = '1000'] = process.argv.slice(2);
const target = new URL(url);
if (!['http:', 'https:'].includes(target.protocol)) throw new Error('HTTP(S) URL gerekli.');
if (![width, height].every((value) => /^\d+$/.test(value) && Number(value) > 0)) throw new Error('Pozitif viewport ölçüleri gerekli.');
const session = `neiden-capture-${process.pid}`;
const directory = resolve(output);
mkdirSync(directory, { recursive: true });
const run = (...args) => execFileSync('npx', ['--yes', 'agent-browser@0.27.0', '--session', session, ...args], { encoding: 'utf8', timeout: 120000 });
const evaluate = (source) => JSON.parse(execFileSync('npx', ['--yes', 'agent-browser@0.27.0', '--session', session, 'eval', '--stdin'], { input: source, encoding: 'utf8', timeout: 120000 }));
const records = [];
try {
  // Viewport sayfa mount edilmeden kurulur; split-text ölçümü resize sonrası farklı kalabilir.
  run('open', 'about:blank');
  run('set', 'viewport', width, height);
  run('open', url);
  // Kaynak Home preloader 4 s; ticker ve karakter stagger'ları daha uzun sürer.
  // 8 s muhafazakâr capture beklemesidir. Kesin son durum motion QA'da computed
  // transform/opacity/filter ve layout kararlılığıyla ayrıca doğrulanır.
  evaluate('document.fonts.ready.then(() => new Promise(resolve => setTimeout(() => { window.scrollTo({top:0,behavior:"instant"}); requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))); }, 8000)))');
  const audit = evaluate(readFileSync(new URL('./browser-audit.js', import.meta.url), 'utf8'));
  writeFileSync(resolve(directory, 'initial-dom.json'), JSON.stringify(audit, null, 2));
  const sections = audit.sections.filter((section) => section.rect.width > 0 && section.rect.height > 300 && section.name);
  const unique = [...new Map(sections.map((section) => [section.documentY, section])).values()];
  let count = 0;
  for (const section of unique) {
    const positions = section.rect.height > Number(height) * 5 ? [0, 0.2, 0.4, 0.6, 0.8, 1] : section.rect.height > Number(height) * 2 ? [0, 0.5, 1] : [0];
    for (const progress of positions) {
      const y = Math.max(0, Math.round(section.documentY + (section.rect.height - Number(height)) * progress));
      const state = evaluate(`window.scrollTo({top:${y},behavior:'instant'}); new Promise(resolve => setTimeout(() => resolve({y:scrollY,height:document.documentElement.scrollHeight,viewport:{width:innerWidth,height:innerHeight},videos:[...document.querySelectorAll('video')].filter(v=>{const r=v.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map(v=>({src:v.currentSrc,time:v.currentTime,paused:v.paused}))}),700))`);
      const filename = `${String(++count).padStart(2, '0')}-${section.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Math.round(progress * 100)}.png`;
      run('screenshot', resolve(directory, filename));
      records.push({ section: section.name, requestedY: y, ...state, filename });
      process.stdout.write(`${count}: ${section.name} y=${state.y}\n`);
    }
  }
  writeFileSync(resolve(directory, 'capture-index.json'), JSON.stringify({ url, width: Number(width), height: Number(height), records }, null, 2));
} finally {
  run('close');
}
