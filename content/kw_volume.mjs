// Usage: node content/kw_volume.mjs <name> <lang> <loc1,loc2,...|world> [keywords.txt]
// Список ключей читается из файла, если он указан четвёртым аргументом,
// иначе из stdin. В Git Bash перенаправление `< file` не работает
// (node там идёт через winpty), поэтому путь к файлу надёжнее.
import fs from 'fs';
const [name, lang, locs, file] = process.argv.slice(2);
const source = file ? fs.readFileSync(file, 'utf8') : fs.readFileSync(0, 'utf8');
const kws = source.split('\n').map(s => s.trim()).filter(Boolean);
// Доступы берём из окружения, а если их там нет — из .env.local,
// как это делает content/seo/baseline.mjs: обычный node файл сам не читает
const envFile = (() => {
  try {
    return fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  } catch {
    return '';
  }
})();
const envValue = key =>
  process.env[key] ||
  (envFile.split(/\r?\n/).find(line => line.startsWith(`${key}=`)) || '')
    .slice(key.length + 1)
    .trim()
    .replace(/^["']|["']$/g, '');

const login = envValue('DATAFORSEO_API_LOGIN');
const password = envValue('DATAFORSEO_API_PASSWORD');
if (!login || !password) {
  console.error('Нет доступов DataForSEO: задайте DATAFORSEO_API_LOGIN и DATAFORSEO_API_PASSWORD в .env.local');
  process.exit(1);
}
const auth = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64');
const out = {}; let cost = 0;
for (const loc of locs.split(',')) {
  process.stderr.write(`${loc}… `); // видно, что скрипт жив: ответ одной локации идёт до минуты
  const task = { language_code: lang, keywords: kws };
  if (loc !== 'world') task.location_code = +loc;
  let t;
  for (let attempt = 0; attempt < 6; attempt++) {
    const r = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', { method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/json' }, body: JSON.stringify([task]), signal: AbortSignal.timeout(90000) }).then(r => r.json()).catch(e => ({ tasks: [{ status_message: `network: ${e.message}` }] }));
    t = r.tasks?.[0] ?? { status_message: r.status_message };
    if (!/rates limit/i.test(t.status_message ?? '')) break;
    await new Promise(res => setTimeout(res, 20000)); // лимит DataForSEO: 12 запросов в минуту
  }
  cost += t.cost || 0;
  if (t.status_code !== 20000) { console.error('\n' + loc, t.status_message); continue; }
  for (const x of t.result || []) { (out[x.keyword] ??= {})[loc] = x.search_volume ?? 0; }
}
process.stderr.write('\n');
fs.mkdirSync('content/keywords', { recursive: true });
fs.writeFileSync(`content/keywords/${name}.json`, JSON.stringify(out, null, 1));
const rows = Object.entries(out).map(([k, v]) => [k, v, Object.values(v).reduce((a, b) => a + (b || 0), 0)]).sort((a, b) => b[2] - a[2]);
console.log(`${name}: cost $${cost.toFixed(3)}`);
for (const [k, v, s] of rows) console.log(String(s).padStart(6), k, JSON.stringify(v));
