/**
 * Стартовый замер позиций перед публикацией новых страниц.
 *
 *   node content/seo/baseline.mjs             # полный замер
 *   node content/seo/baseline.mjs --sample 15 # меньше ключей в проверке выдачи
 *
 * Два источника:
 *  1. DataForSEO Labs — все запросы, по которым домен уже ранжируется.
 *     Работает не везде: из наших рынков доступны Казахстан, Азербайджан,
 *     Индия, Нигерия, Пакистан и Польша.
 *  2. SERP — проверка конкретных целевых запросов там, где Labs недоступен
 *     (Узбекистан, Кыргызстан). По России и Беларуси данных нет ни там, ни там:
 *     Google их не отдаёт, позиции по ним смотрим только в Search Console.
 *
 * Результат: JSON с сырыми данными и отчёт в markdown — точка отсчёта,
 * с которой сравниваем замер через месяц после запуска.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const DRAFTS = path.join(ROOT, "content/drafts");

const TARGET = "academgo.com";
const LIMIT = 500;

const args = process.argv.slice(2);
const SAMPLE = args.includes("--sample")
  ? Number(args[args.indexOf("--sample") + 1])
  : 12;

// рынки, где Labs отдаёт ranked keywords
const LABS_MARKETS = [
  { name: "Казахстан", location_code: 2398, language_code: "ru" },
  { name: "Азербайджан", location_code: 2031, language_code: "az" },
  { name: "Индия", location_code: 2356, language_code: "en" },
  { name: "Нигерия", location_code: 2566, language_code: "en" },
  { name: "Пакистан", location_code: 2586, language_code: "en" },
  { name: "Польша", location_code: 2616, language_code: "pl" }
];

// рынки, где позиции снимаем точечно по выдаче
const SERP_MARKETS = [
  { name: "Узбекистан", location_code: 2860, language_code: "ru" },
  { name: "Кыргызстан", location_code: 2417, language_code: "ru" }
];

// запросы, по которым проверяем выдачу вручную: головные для главной,
// сравнения, лид-магнитов и хабов самых важных стран
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

const auth = Buffer.from(
  `${envValue("DATAFORSEO_API_LOGIN")}:${envValue("DATAFORSEO_API_PASSWORD")}`
).toString("base64");

const post = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return response.json();
};

/** Ключевые слова новых страниц — из frontmatter черновиков */
const targetKeywords = () => {
  const keywords = new Map();

  for (const country of fs.readdirSync(DRAFTS)) {
    const countryDir = path.join(DRAFTS, country);
    if (!fs.statSync(countryDir).isDirectory()) continue;

    for (const folder of fs.readdirSync(countryDir)) {
      const file = path.join(countryDir, folder, "draft.md");
      if (!fs.existsSync(file)) continue;

      const raw = fs.readFileSync(file, "utf8");
      const primary = raw.match(/^primary_keyword:\s*(.*)$/m)?.[1];
      const url = raw.match(/^url:\s*(.*)$/m)?.[1];

      if (primary) {
        keywords.set(
          primary.replace(/^["']|["']$/g, "").trim().toLowerCase(),
          (url || "").trim()
        );
      }
    }
  }

  const extra = {
    "учеба за границей": "/ru",
    "образование за рубежом": "/ru",
    "обучение за рубежом": "/ru",
    "study abroad consultant": "/",
    "study abroad agency": "/",
    "в какой стране лучше учиться": "/ru/ucheba-za-rubezhom",
    "где дешевле учиться за границей": "/ru/ucheba-za-rubezhom",
    "best countries to study abroad": "/study-abroad",
    "мотивационное письмо": "/ru/motivacionnoe-pismo",
    "motivation letter template": "/motivation-letter-template",
    "апостиль на аттестат": "/ru/dokumenty-dlya-postupleniya-za-granicu",
    "нострификация аттестата": "/ru/dokumenty-dlya-postupleniya-za-granicu"
  };

  Object.entries(extra).forEach(([keyword, url]) => keywords.set(keyword, url));

  return keywords;
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
    console.error(`${market.name}: ${task?.status_message}`);
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
    return { keyword, market: market.name, position: null, cost: task?.cost || 0 };
  }

  const hit = (task.result?.[0]?.items || []).find(
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

const main = async () => {
  const stamp = new Date().toISOString().slice(0, 10);
  const targets = targetKeywords();
  const labs = [];
  const serp = [];
  let cost = 0;

  console.log("Позиции по домену (DataForSEO Labs)\n");

  for (const market of LABS_MARKETS) {
    const result = await fetchLabs(market);
    labs.push(result);
    cost += result.cost;

    console.log(
      `${market.name.padEnd(12)} ключей: ${String(result.items.length).padStart(
        4
      )}  топ-10: ${String(
        result.items.filter(item => item.position <= 10).length
      ).padStart(3)}  топ-3: ${String(
        result.items.filter(item => item.position <= 3).length
      ).padStart(3)}`
    );
  }

  console.log("\nПроверка выдачи по ключевым запросам (SERP)\n");

  for (const market of SERP_MARKETS) {
    for (const keyword of SERP_KEYWORDS.slice(0, SAMPLE)) {
      const result = await fetchSerp(market, keyword);
      serp.push(result);
      cost += result.cost;

      console.log(
        `${market.name.padEnd(12)} ${keyword.padEnd(28)} ${
          result.position ? `позиция ${result.position}` : "нет в топ-100"
        }`
      );
    }
  }

  const covered = [];

  for (const { market, items } of labs) {
    for (const item of items) {
      const keyword = (item.keyword || "").toLowerCase();
      if (targets.has(keyword)) {
        covered.push({
          keyword,
          market: market.name,
          position: item.position,
          volume: item.volume,
          currentUrl: item.url,
          plannedUrl: targets.get(keyword)
        });
      }
    }
  }

  fs.writeFileSync(
    path.join(__dirname, `baseline-${stamp}.json`),
    JSON.stringify(
      { date: stamp, target: TARGET, labs, serp, covered, cost },
      null,
      2
    )
  );

  const report = [
    "# Стартовый замер позиций academgo.com",
    "",
    `Дата: ${stamp}. Замер сделан **до публикации** новых страниц: 186 страниц по десяти странам лежат в Sanity черновиками.`,
    `Источники: DataForSEO Labs (позиции по домену) и SERP (проверка выдачи по конкретным запросам). Стоимость замера: $${cost.toFixed(
      2
    )}.`,
    "",
    "## Позиции по домену",
    "",
    "| Рынок | Ключей в топ-100 | В топ-10 | В топ-3 | Лучшая позиция |",
    "| --- | --- | --- | --- | --- |",
    ...labs.map(({ market, items }) => {
      const best = items.length
        ? Math.min(...items.map(item => item.position))
        : null;

      return `| ${market.name} | ${items.length} | ${
        items.filter(item => item.position <= 10).length
      } | ${items.filter(item => item.position <= 3).length} | ${best ?? "—"} |`;
    }),
    "",
    "По России, Беларуси, Узбекистану и Кыргызстану DataForSEO Labs данных не даёт: этих рынков нет в базе. Для них ниже — точечная проверка выдачи.",
    "",
    "## Проверка выдачи по ключевым запросам",
    "",
    "| Запрос | Рынок | Позиция | Страница |",
    "| --- | --- | --- | --- |",
    ...serp.map(
      item =>
        `| ${item.keyword} | ${item.market} | ${
          item.position ?? "нет в топ-100"
        } | ${item.url || "—"} |`
    ),
    "",
    "## Целевые ключи новых страниц",
    "",
    `Всего целевых ключей: ${targets.size}. Домен уже ранжируется по ${covered.length} из них.`,
    "",
    covered.length
      ? [
          "| Запрос | Рынок | Позиция | Частота | Сейчас отвечает | Будет отвечать |",
          "| --- | --- | --- | --- | --- | --- |",
          ...covered
            .sort((a, b) => a.position - b.position)
            .map(
              item =>
                `| ${item.keyword} | ${item.market} | ${item.position} | ${
                  item.volume ?? "—"
                } | ${item.currentUrl || "—"} | ${item.plannedUrl} |`
            )
        ].join("\n")
      : "По целевым ключам новых страниц домен пока не ранжируется — это и есть ожидаемая точка отсчёта.",
    "",
    "## Топ-20 текущих позиций",
    "",
    "| Запрос | Рынок | Позиция | Частота | Страница |",
    "| --- | --- | --- | --- | --- |",
    ...labs
      .flatMap(({ market, items }) =>
        items.map(item => ({ ...item, market: market.name }))
      )
      .sort((a, b) => a.position - b.position)
      .slice(0, 20)
      .map(
        item =>
          `| ${item.keyword} | ${item.market} | ${item.position} | ${
            item.volume ?? "—"
          } | ${item.url || "—"} |`
      ),
    ""
  ].join("\n");

  fs.writeFileSync(path.join(__dirname, `baseline-${stamp}.md`), report);

  console.log(`\nОтчёт: content/seo/baseline-${stamp}.md`);
  console.log(`Потрачено: $${cost.toFixed(2)}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
