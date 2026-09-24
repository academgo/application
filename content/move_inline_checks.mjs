// Переносит пометки [ПРОВЕРИТЬ: ...] из тела страницы в блок editor-notes.
// Запуск: node content/move_inline_checks.mjs [--dry]
import fs from 'fs';
import path from 'path';

const dry = process.argv.includes('--dry');
const root = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, '')), 'drafts');
let pages = 0, moved = 0;

for (const country of fs.readdirSync(root)) {
  const cdir = path.join(root, country);
  if (!fs.statSync(cdir).isDirectory()) continue;
  for (const page of fs.readdirSync(cdir)) {
    const file = path.join(cdir, page, 'draft.md');
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const marker = '<!-- editor-notes -->';
    const idx = src.indexOf(marker);
    if (idx === -1) { console.log('НЕТ editor-notes:', country + '/' + page); continue; }
    let body = src.slice(0, idx), tail = src.slice(idx);
    const found = [...body.matchAll(/\s*\[ПРОВЕРИТЬ[^\]]*\]/g)].map(m => m[0].trim());
    if (!found.length) continue;
    body = body.replace(/\s*\[ПРОВЕРИТЬ[^\]]*\]/g, '');
    // чистим двойные пробелы и пробел перед точкой, появившиеся после удаления
    body = body.replace(/[ \t]{2,}/g, ' ').replace(/ ([.,;:)])/g, '$1');
    const notes = found.map(n => `- ${n} — перенесено из текста страницы при финальной вычитке`).join('\n');
    const out = body + tail.replace(marker, marker + '\n' + notes);
    if (!dry) fs.writeFileSync(file, out);
    pages++; moved += found.length;
    console.log(`${country}/${page}: перенесено ${found.length}`);
  }
}
console.log(`\nИтого: ${moved} пометок на ${pages} страницах${dry ? ' (пробный запуск)' : ''}`);
