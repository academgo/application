// Добавляет ссылку на хаб страны в конец вступительного блока страниц, где её нет.
// Запуск: node content/add_hub_links.mjs [--dry]
import fs from 'fs';
import path from 'path';

const dry = process.argv.includes('--dry');
const root = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, '')), 'drafts');
const read = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const short = h1 => h1.replace(/^["']|["']$/g, '').split(/[:—]/)[0].trim();

for (const country of fs.readdirSync(root)) {
  const cdir = path.join(root, country);
  if (!fs.statSync(cdir).isDirectory()) continue;
  for (const lang of ['ru', 'en']) {
    const pages = fs.readdirSync(cdir).filter(p => p.endsWith('-' + lang) && fs.existsSync(path.join(cdir, p, 'draft.md')));
    const hub = pages.find(p => p.startsWith('hub-'));
    if (!hub) continue;
    const hubSrc = read(path.join(cdir, hub, 'draft.md'));
    const hubUrl = hubSrc.match(/^url:\s*(\S+)/m)[1];
    const hubName = short(hubSrc.match(/^h1:\s*(.*)$/m)[1]);
    for (const p of pages) {
      if (p === hub) continue;
      const file = path.join(cdir, p, 'draft.md');
      const src = read(file);
      const [body, tail = ''] = src.split('<!-- editor-notes -->');
      if (body.includes(`](${hubUrl})`)) continue;
      // конец первого блока textContent (до второго маркера блока)
      const blocks = body.split(/(?=<!-- block:)/);
      const firstIdx = blocks.findIndex(b => b.startsWith('<!-- block: textContent'));
      if (firstIdx === -1) { console.log('нет textContent:', country + '/' + p); continue; }
      const sentence = lang === 'ru'
        ? `\nОбщий обзор направления — на странице «[${hubName}](${hubUrl})».\n`
        : `\nFor the full country overview, see our [${hubName}](${hubUrl}) guide.\n`;
      blocks[firstIdx] = blocks[firstIdx].replace(/\s*$/, '\n') + sentence;
      const out = blocks.join('') + (tail ? '<!-- editor-notes -->' + tail : '');
      if (!dry) fs.writeFileSync(file, out);
      console.log(`+ ${country}/${p}`);
    }
  }
}
