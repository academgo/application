/**
 * Замер через месяц после публикации новых страниц.
 *
 *   node content/seo/month-check.mjs                  # полный замер
 *   node content/seo/month-check.mjs --only=pages     # только позиции новых страниц
 *   node content/seo/month-check.mjs --only=labs      # только позиции по домену
 *   node content/seo/month-check.mjs --resume         # продолжить после обрыва
 *   node content/seo/month-check.mjs --concurrency 4  # меньше параллельных запросов
 *
 * Отличие от baseline.mjs: кроме замера по домену и 12 головных запросов
 * добавлена проверка выдачи по всем основным ключам новых страниц
 * в Казахстане и Узбекистане. Labs по-русски отдаёт только Казахстан,
 * поэтому без этой проверки позиций новых страниц почти не видно.
 *
 * Результат: content/seo/month-<дата>.json — сырые данные для сравнения
 * с content/seo/baseline-2026-09-24.json.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const DRAFTS = path.join(ROOT, "content/drafts");
const PROGRESS = path.join(__dirname, ".month-check-progress.json");

const TARGET = "academgo.com";
const LIMIT = 500;

const args = process.argv.slice(2);
const argValue = name => {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
};
const ONLY = (argValue("--only") || args.find(a => a.startsWith("--only="))?.split("=")[1] || "all");
const RESUME = args.includes("--resume");
const CONCURRENCY = Number(argValue("--concurrency")) || 6;
const SAMPLE = Number(argValue("--sample")) || 12;

// рынки, где Labs отдаёт позиции по домену
const LABS_MARKETS = [
  { name: "Казахстан", location_code: 2398, language_code: "ru" },
  { name: "Азербайджан", location_code: 2031, language_code: "az" },
  { name: "Индия", location_code: 2356, language_code: "en" },
  { name: "Нигерия", location_code: 2566, language_code: "en" },
  { name: "Пакистан", location_code: 2586, language_code: "en" },
  { name: "Польша", location_code: 2616, language_code: "pl" }
];

// рынки для точечной проверки головных запросов — как в baseline
const SERP_MARKETS = [
  { name: "Узбекистан", location_code: 2860, language_code: "ru" },
  { name: "Кыргызстан", location_code: 2417, language_code: "ru" }
];

// рынки, в которых проверяем ключи новых страниц
const PAGE_MARKETS = [
  { name: "Казахстан", location_code: 2398, language_code: "ru" },
  { name: "Узбекистан", location_code: 2860, language_code: "ru" }
];

const SERP_KEYWORDS = [
  "учеба за границей",
  "образование за рубежом",
  "обучение за рубежом",
  "мотивационное письмо",
  "учеба в турции",
  "учеба в оаэ",
  "учеба в малайзии",
  "учеба в италии",
  "учеба в испании",
  "учеба в венгрии",
  "учеба в грузии",
  "учеба на северном кипре",
  "обучение в польше",
  "поступление в польшу"
];

const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const envValue = name =>
  env
    .split(/\r?\n/)
    .find(line => line.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=")
    .trim();

const login = envValue("DATAFORSEO_API_LOGIN");
const password = envValue("DATAFORSEO_API_PASSWORD");

if (!login || !password) {
  console.error("В .env.local нет DATAFORSEO_API_LOGIN или DATAFORSEO_API_PASSWORD");
  process.exit(1);
}

const auth = Buffer.from(`${login}:${password}`).toString("base64");

const post = async (url, body, attempt = 1) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120000)
    });

    return await response.json();
  } catch (error) {
    if (attempt < 3) {
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      return post(url, body, attempt + 1);
    }
    return { _error: String(error) };
  }
};

/** Основные ключи новых страниц из frontmatter черновиков */
const draftKeywords = () => {
  const rows = [];

  for (const country of fs.readdirSync(DRAFTS)) {
    const countryDir = path.join(DRAFTS, country);
    if (!fs.statSync(countryDir).isDirectory()) continue;

    for (const folder of fs.readdirSync(countryDir)) {
      const file = path.join(countryDir, folder, "draft.md");
      if (!fs.existsSync(file)) continue;

      const raw = fs.readFileSync(file, "utf8");
      const primary = raw.match(/^primary_keyword:\s*(.*)$/m)?.[1];
      const url = raw.match(/^url:\s*(.*)$/m)?.[1];
      if (!primary) continue;

      rows.push({
        country,
        keyword: primary.replace(/^["']|["']$/g, "").trim().toLowerCase(),
        plannedUrl: (url || "").trim()
      });
    }
  }

  // один ключ может встретиться в нескольких черновиках
  const unique = new Map();
  rows.forEach(row => unique.has(row.keyword) || unique.set(row.keyword, row));
  return [...unique.values()];
};

const fetchLabs = async market => {
  const data = await post(
    "https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live",
    [
      {
        target: TARGET,
        location_code: market.location_code,
        language_code: market.language_code,
        limit: LIMIT,
        order_by: ["ranked_serp_element.serp_item.rank_group,asc"]
      }
    ]
  );

  const task = data.tasks?.[0];

  if (task?.status_code !== 20000) {
    console.error(`${market.name}: ${task?.status_message || data._error}`);
    return { market, items: [], cost: task?.cost || 0 };
  }

  const items = (task.result?.[0]?.items || []).map(item => ({
    keyword: item.keyword_data?.keyword,
    volume: item.keyword_data?.keyword_info?.search_volume,
    position: item.ranked_serp_element?.serp_item?.rank_group,
    url: item.ranked_serp_element?.serp_item?.relative_url
  }));

  return { market, items, cost: task.cost || 0 };
};

const fetchSerp = async (market, keyword) => {
  const data = await post(
    "https://api.dataforseo.com/v3/serp/google/organic/live/advanced",
    [
      {
        keyword,
        location_code: market.location_code,
        language_code: market.language_code,
        depth: 100
      }
    ]
  );

  const task = data.tasks?.[0];

  if (task?.status_code !== 20000) {
    return {
      keyword,
      market: market.name,
      position: null,
      url: null,
      failed: true,
      cost: task?.cost || 0
    };
  }

  const items = task.result?.[0]?.items || [];
  const hit = items.find(
    item => item.type === "organic" && (item.domain || "").includes(TARGET)
  );

  return {
    keyword,
    market: market.name,
    position: hit?.rank_group ?? null,
    url: hit?.relative_url ?? null,
    cost: task.cost || 0
  };
};

/** Очередь с ограничением параллельности и записью чекпоинта */
const runPool = async (jobs, worker, done, label) => {
  const results = [...done];
  const seen = new Set(results.map(item => item._key));
  const queue = jobs.filter(job => !seen.has(job._key));

  if (!queue.length) {
    console.log(`${label}: всё уже снято в прошлом запуске (${results.length})`);
    return results;
  }

  console.log(`${label}: ${queue.length} запросов, параллельно ${CONCURRENCY}`);

  let index = 0;
  let finished = 0;

  const run = async () => {
    while (index < queue.length) {
      const job = queue[index++];
      const result = await worker(job);
      results.push({ ...result, _key: job._key });
      finished += 1;

      if (finished % 10 === 0 || finished === queue.length) {
        process.stderr.write(
          `  ${finished}/${queue.length} готово\n`
        );
        saveProgress(label, results);
      }
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, run));
  saveProgress(label, results);
  return results;
};

const progressState = RESUME && fs.existsSync(PROGRESS)
  ? JSON.parse(fs.readFileSync(PROGRESS, "utf8"))
  : {};

const saveProgress = (label, results) => {
  progressState[label] = results;
  fs.writeFileSync(PROGRESS, JSON.stringify(progressState, null, 2));
};

const main = async () => {
  const stamp = new Date().toISOString().slice(0, 10);
  const drafts = draftKeywords();
  let cost = 0;

  console.log(`Замер ${stamp}. Ключей новых страниц: ${drafts.length}\n`);

  const labs = [];

  if (ONLY === "all" || ONLY === "labs") {
    console.log("Позиции по домену (DataForSEO Labs)\n");

    for (const market of LABS_MARKETS) {
      const result = await fetchLabs(market);
      labs.push(result);
      cost += result.cost;

      console.log(
        `${market.name.padEnd(12)} ключей: ${String(
          result.items.length
        ).padStart(4)}  топ-10: ${String(
          result.items.filter(item => item.position <= 10).length
        ).padStart(3)}  топ-3: ${String(
          result.items.filter(item => item.position <= 3).length
        ).padStart(3)}`
      );
    }
    console.log("");
  }

  let serp = [];

  if (ONLY === "all" || ONLY === "serp") {
    const jobs = [];
    for (const market of SERP_MARKETS) {
      for (const keyword of SERP_KEYWORDS.slice(0, SAMPLE)) {
        jobs.push({ market, keyword, _key: `head|${market.name}|${keyword}` });
      }
    }

    serp = await runPool(
      jobs,
      job => fetchSerp(job.market, job.keyword),
      progressState["Головные запросы"] || [],
      "Головные запросы"
    );
    serp.forEach(item => (cost += item.cost || 0));
    console.log("");
  }

  let pages = [];

  if (ONLY === "all" || ONLY === "pages") {
    const jobs = [];
    for (const market of PAGE_MARKETS) {
      for (const draft of drafts) {
        jobs.push({
          market,
          keyword: draft.keyword,
          country: draft.country,
          plannedUrl: draft.plannedUrl,
          _key: `page|${market.name}|${draft.keyword}`
        });
      }
    }

    pages = await runPool(
      jobs,
      async job => ({
        ...(await fetchSerp(job.market, job.keyword)),
        country: job.country,
        plannedUrl: job.plannedUrl
      }),
      progressState["Ключи новых страниц"] || [],
      "Ключи новых страниц"
    );
    pages.forEach(item => (cost += item.cost || 0));
    console.log("");
  }

  const inTop = (rows, limit) =>
    rows.filter(row => row.position && row.position <= limit).length;

  if (pages.length) {
    console.log("Ключи новых страниц — сводка\n");
    for (const market of PAGE_MARKETS) {
      const rows = pages.filter(row => row.market === market.name);
      console.log(
        `${market.name.padEnd(12)} в топ-100: ${String(
          inTop(rows, 100)
        ).padStart(3)}  топ-20: ${String(inTop(rows, 20)).padStart(
          3
        )}  топ-10: ${String(inTop(rows, 10)).padStart(3)}  топ-3: ${String(
          inTop(rows, 3)
        ).padStart(3)}  из ${rows.length}`
      );
    }
    const failed = pages.filter(row => row.failed).length;
    if (failed) console.log(`\nНе ответили: ${failed} — перезапусти с --resume`);
    console.log("");
  }

  const out = path.join(__dirname, `month-${stamp}.json`);
  fs.writeFileSync(
    out,
    JSON.stringify(
      { date: stamp, target: TARGET, only: ONLY, labs, serp, pages, cost },
      null,
      2
    )
  );

  if (fs.existsSync(PROGRESS) && !pages.some(row => row.failed)) {
    fs.rmSync(PROGRESS);
  }

  console.log(`Стоимость замера: $${cost.toFixed(2)}`);
  console.log(`Данные: content/seo/month-${stamp}.json`);
};

main();
