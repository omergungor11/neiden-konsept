import { readFileSync, existsSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve(new URL('..', import.meta.url).pathname);
const read = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const queue = read('docs/TASKS.json');
const manifest = read('docs/reference/asset-manifest.json');
const routesDocument = read('docs/reference/routes.json');
const problems = [];
const tasks = queue.tasks;
const ids = new Set(tasks.map((task) => task.id));
if (ids.size !== tasks.length) problems.push('Görev ID tekrarları var.');
if (queue.maxConcurrentIncludingIntegrator !== 4) problems.push('Ajan slot üst sınırı dört olmalı.');
if (queue.planningModel !== 'gpt-6-astra') problems.push('Planlama modeli kullanıcı talebindeki Astra olmalı.');
const graph = new Map(tasks.map((task) => [task.id, task.dependsOn]));
const visiting = new Set();
const visited = new Set();
const walk = (id) => {
  if (visiting.has(id)) { problems.push(`Bağımlılık döngüsü: ${id}`); return; }
  if (visited.has(id)) return;
  visiting.add(id);
  for (const dependency of graph.get(id) ?? []) {
    if (!ids.has(dependency)) problems.push(`Bilinmeyen bağımlılık: ${id} → ${dependency}`);
    else walk(dependency);
  }
  visiting.delete(id);
  visited.add(id);
};
for (const task of tasks) {
  walk(task.id);
  if (!queue.allowedStatuses.includes(task.status)) problems.push(`Geçersiz statü: ${task.id}`);
  for (const input of task.inputs) if (!existsSync(resolve(root, input))) problems.push(`Eksik görev girdisi: ${task.id} ${input}`);
  for (const evidence of task.evidence ?? []) if (!existsSync(resolve(root, evidence))) problems.push(`Eksik görev kanıtı: ${task.id} ${evidence}`);
  if (!task.owns?.length || !task.outputs?.length || !task.acceptanceGate) problems.push(`Eksik görev sözleşmesi: ${task.id}`);
}
const roleFiles = ['README', 'TASK_TEMPLATE', 'PLANNER_INTEGRATOR', 'REFERENCE_ASSETS', 'SECTION_BUILDER', 'MOTION_ENGINEER', 'VISUAL_QA'];
for (const role of roleFiles) if (!existsSync(resolve(root, `docs/agents/${role}.md`))) problems.push(`Eksik rol dosyası: ${role}`);
for (const input of ['AGENTS.md', 'docs/reference/motion-audit.md', 'docs/reference/design-tokens.json', 'docs/reference/home-desktop-dom.json', 'docs/reference/home-mobile-dom.json']) {
  if (!existsSync(resolve(root, input))) problems.push(`Eksik kanıt/sözleşme: ${input}`);
}
const localPaths = new Map();
let verifiedBytes = 0;
for (const asset of manifest.assets) {
  if (asset.status !== 'downloaded') { problems.push(`İndirilmemiş varlık: ${asset.id}`); continue; }
  const path = resolve(root, asset.local_path);
  if (relative(root, path).startsWith('..')) { problems.push(`Proje dışına çıkan varlık yolu: ${asset.id}`); continue; }
  if (!existsSync(path)) { problems.push(`Eksik varlık: ${asset.local_path}`); continue; }
  const size = statSync(path).size;
  const hash = createHash('sha256').update(readFileSync(path)).digest('hex');
  if (size !== asset.bytes || hash !== asset.sha256) problems.push(`Boyut/hash farklı: ${asset.local_path}`);
  const previousHash = localPaths.get(asset.local_path);
  if (previousHash && previousHash !== asset.sha256) problems.push(`Aynı yola iki farklı varlık: ${asset.local_path}`);
  localPaths.set(asset.local_path, asset.sha256);
  verifiedBytes += size;
}
const routes = Array.isArray(routesDocument) ? routesDocument : routesDocument.routes;
if (!Array.isArray(routes)) problems.push('Rota manifestinde routes dizisi yok.');
else {
  if (routes.length !== 26) problems.push(`Beklenen26rota yerine ${routes.length}.`);
  const urls = routes.map((route) => route.url ?? route.path);
  if (new Set(urls).size !== urls.length) problems.push('Tekrarlanan rota var.');
}
if (verifiedBytes !== manifest.summary.downloaded_bytes) problems.push('Manifest toplam byte sayısı farklı.');
const captures = [];
for (const directory of ['desktop', 'mobile']) {
  const path = `docs/reference/screenshots/${directory}`;
  const indexPath = `${path}/capture-index.json`;
  if (!existsSync(resolve(root, indexPath))) { problems.push(`Eksik capture index: ${directory}`); continue; }
  const index = read(indexPath);
  for (const capture of index.records) {
    if (!existsSync(resolve(root, path, capture.filename))) problems.push(`Eksik screenshot: ${capture.filename}`);
    if (capture.viewport.width !== index.width || capture.viewport.height !== index.height) problems.push(`Screenshot viewport farklı: ${capture.filename}`);
  }
  captures.push({ directory, viewport: [index.width, index.height], screenshots: index.records.length });
}
const result = {
  checkedAt: new Date().toISOString(),
  status: problems.length ? 'failed' : 'passed',
  scope: 'Plan grafiği, girdi/rol dosyaları, rota envanteri ve yerel asset SHA256. Uygulama görsel/motion QA değildir.',
  tasks: tasks.length,
  routes: routes?.length ?? 0,
  assets: manifest.assets.length,
  uniqueLocalFiles: localPaths.size,
  verifiedBytes,
  captures,
  problems,
};
mkdirSync(resolve(root, 'docs/qa'), { recursive: true });
writeFileSync(resolve(root, 'docs/qa/planning-validation.json'), JSON.stringify(result, null, 2) + '\n');
process.stdout.write(JSON.stringify(result, null, 2) + '\n');
if (problems.length) process.exitCode = 1;
