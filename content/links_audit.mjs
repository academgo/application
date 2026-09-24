// Аудит перелинковки: node content/links_audit.mjs
// Хаб должен ссылаться на все 9 своих страниц; каждая страница — на хаб.
import fs from 'fs';
import path from 'path';

const root = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, '')), 'drafts');
const read = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');

for (const country of fs.readdirSync(root)) {
  const cdir = path.join(root, country);
  if (!fs.statSync(cdir).isDirectory()) continue;
  for (const lang of ['ru', 'en']) {
    const pages = fs.readdirSync(cdir).filter(p => p.endsWith('-' + lang) && fs.existsSync(path.join(cdir, p, 'draft.md')));
    if (!pages.length) continue;
    const url = {}, links = {};
    for (const p of pages) {
      const src = read(path.join(cdir, p, 'draft.md'));
      const body = src.split('<!-- editor-notes -->')[0];
      url[p] = src.match(/^url:\s*(\S+)/m)?.[1] ?? '';
      links[p] = new Set([...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map(m => m[1]));
    }
    const hub = pages.find(p => p.startsWith('hub-'));
    if (!hub) { console.log(`${country}/${lang}: нет хаба`); continue; }
    const missingFromHub = pages.filter(p => p !== hub && !links[hub].has(url[p]));
    const noHubLink = pages.filter(p => p !== hub && !links[p].has(url[hub]));
    const orphans = pages.filter(p => p !== hub && !pages.some(q => q !== p && links[q].has(url[p])));
    const line = [];
    if (missingFromHub.length) line.push(`хаб не ссылается на: ${missingFromHub.join(', ')}`);
    if (noHubLink.length) line.push(`нет ссылки на хаб: ${noHubLink.join(', ')}`);
    if (orphans.length) line.push(`ни одна страница не ссылается: ${orphans.join(', ')}`);
    console.log(`${line.length ? '⚠' : '✓'} ${country}/${lang}  ${line.join(' | ')}`);
  }
}
