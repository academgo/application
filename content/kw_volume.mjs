// Usage: node content/kw_volume.mjs <name> <lang> <loc1,loc2,...|world> < keywords.txt
import fs from 'fs';
const [name, lang, locs] = process.argv.slice(2);
const kws = fs.readFileSync(0, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
const auth = 'Basic ' + Buffer.from(process.env.DATAFORSEO_API_LOGIN + ':' + process.env.DATAFORSEO_API_PASSWORD).toString('base64');
const out = {}; let cost = 0;
for (const loc of locs.split(',')) {
  const task = { language_code: lang, keywords: kws };
  if (loc !== 'world') task.location_code = +loc;
  let t;
  for (let attempt = 0; attempt < 6; attempt++) {
    const r = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', { method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/json' }, body: JSON.stringify([task]) }).then(r => r.json());
    t = r.tasks?.[0] ?? { status_message: r.status_message };
    if (!/rates limit/i.test(t.status_message ?? '')) break;
    await new Promise(res => setTimeout(res, 20000)); // лимит DataForSEO: 12 запросов в минуту
  }
  cost += t.cost || 0;
  if (t.status_code !== 20000) { console.error(loc, t.status_message); continue; }
  for (const x of t.result || []) { (out[x.keyword] ??= {})[loc] = x.search_volume ?? 0; }
}
fs.mkdirSync('content/keywords', { recursive: true });
fs.writeFileSync(`content/keywords/${name}.json`, JSON.stringify(out, null, 1));
const rows = Object.entries(out).map(([k, v]) => [k, v, Object.values(v).reduce((a, b) => a + (b || 0), 0)]).sort((a, b) => b[2] - a[2]);
console.log(`${name}: cost $${cost.toFixed(3)}`);
for (const [k, v, s] of rows) console.log(String(s).padStart(6), k, JSON.stringify(v));
