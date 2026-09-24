// Автопроверка черновика: node content/qa.mjs content/drafts/<country>/<page>
// Проверяет: объём, запрещённые фразы, ссылки вне брифа, существование и статусы фактов, пометки [ПРОВЕРИТЬ].
import fs from 'fs';
import path from 'path';

const dir = process.argv[2];
const read = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const draft = read(path.join(dir, 'draft.md'));
const brief = read(path.join(dir, 'brief.md'));

const fm = draft.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
const body = draft.replace(/^---[\s\S]*?\n---/, '').split('<!-- editor-notes -->')[0];
const lang = fm.match(/lang:\s*(\w+)/)?.[1];
const type = fm.match(/page_type:\s*([\w-]+)/)?.[1];

// Объём (без разметки блоков и таблиц)
const text = body.replace(/<!--[\s\S]*?-->/g, ' ').replace(/[|#*`>\-]/g, ' ');
const words = text.split(/\s+/).filter(w => /[\p{L}\d]/u.test(w)).length;
const limits = { 'country-hub': [2000, 2800], 'university-card': [1400, 2000], topic: [1500, 2200] }[type] ?? [0, 1e9];

// Запрещённые фразы
const banned = lang === 'en'
  ? ['unlock', 'gateway to', 'world-class', "in today's world", 'look no further', 'embark on', 'vibrant', 'nestled', 'cutting-edge', 'seamless']
  : ['уникальн', 'незабываем', 'широкие возможности', 'открывает двери', 'в современном мире', 'данный', 'осуществля', 'на сегодняшний день', 'ни для кого не секрет', 'в этой статье'];
const low = body.toLowerCase();
const bannedHits = banned.filter(b => new RegExp(`(^|[^\\p{L}])${b}`, 'u').test(low));

// B2B-утечки (комиссии агентству и т.п.); отборочные и приёмные комиссии — не B2B
const lowB2b = low
  .replace(/national medical commission|european commission|higher education commission|commissioners? of oaths?|joint commission international|commission for academic accreditation|accreditation commission|engineering accreditation commission/g, '')
  .replace(/комисси\S*\s+(caa|eac|abet)|(его|её)\s+комисси\S*\s+caa|аккредитац\S*\s+комисси\S*|комисси\S*\s+по\s+аккредитац\S*/g, '')
  .replace(/(отборочн\S*|приёмн\S*|приемн\S*|экзаменационн\S*)\s+комисси\S*/g, '')
  .replace(/решени\S*\s+комисси\S*/g, '');
const b2b = ['комисси', 'commission', 'маржин', 'rack rate', 'tier 1', 'money maker', 'лидов', 'лиды', 'воронк'].filter(b => lowB2b.includes(b));

// Ссылки
const allowed = new Set([...brief.matchAll(/`(\/[^`\s]*)`/g)].map(m => m[1]));
const links = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map(m => m[1]);
const badLinks = links.filter(l => !allowed.has(l));

// Факты: ID из facts_used → статус в сводках
const factIds = (fm.match(/facts_used:\s*\[([^\]]*)\]/)?.[1] ?? '').split(',').map(s => s.trim()).filter(Boolean);
const factsDir = path.join(path.dirname(path.dirname(path.dirname(dir))), 'facts');
const status = {};
for (const f of fs.readdirSync(factsDir)) {
  for (const line of read(path.join(factsDir, f)).split('\n')) {
    const m = line.match(/^\|\s*([A-Z]+-\d+[a-z]?)\s*\|/);
    if (!m || status[m[1]]) continue;
    const lastCell = line.split('|').map(s => s.trim()).filter(Boolean).pop() ?? '';
    if (/^❌ устарело/.test(lastCell)) status[m[1]] = 'outdated';
    else status[m[1]] = line.includes('❓') && !/✅|🟡/.test(line) ? '❓' : 'ok';
  }
}
const missing = factIds.filter(id => !status[id]);
const unconfirmed = factIds.filter(id => status[id] === '❓');
const outdated = factIds.filter(id => status[id] === 'outdated');
const checks = (draft.match(/\[ПРОВЕРИТЬ[^\]]*\]/g) ?? []).length;
const bodyChecks = (body.match(/\[ПРОВЕРИТЬ[^\]]*\]/g) ?? []).length;

const res = {
  page: dir, lang, type, words, withinLimits: words >= limits[0] && words <= limits[1], limits,
  bannedHits, b2bHits: b2b, badLinks, facts: factIds.length, missingFacts: missing,
  unconfirmedFactsReview: unconfirmed, // ❓-факт допустим только как «не опубликовано / уточняйте»
  outdatedFacts: outdated,
  checkNotesTotal: checks, checkNotesInBody: bodyChecks,
  metaTitleLen: (fm.match(/meta_title:\s*"?(.*?)"?\s*$/m)?.[1] ?? '').length,
  metaDescLen: (fm.match(/meta_description:\s*"?(.*?)"?\s*$/m)?.[1] ?? '').length,
};
console.log(JSON.stringify(res));
