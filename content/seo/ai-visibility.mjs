/**
 * Видимость academgo.com в блоке ИИ-ответа Google (AI Overviews).
 *
 *   node content/seo/ai-visibility.mjs            # Казахстан и Узбекистан
 *   node content/seo/ai-visibility.mjs --raw      # ещё и сырой ответ в файл
 *
 * По каждому запросу смотрим три вещи:
 *   1. показывается ли вообще блок ИИ-ответа;
 *   2. есть ли academgo.com среди его источников;
 *   3. какие сайты в источниках вместо него.
 *
 * Результат: content/seo/ai-<дата>.json и таблица в консоли.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const TARGET = "academgo.com";
const RAW = process.argv.includes("--raw");

const MARKETS = [
  { name: "Казахстан", location_code: 2398, language_code: "ru" },
  { name: "Узбекистан", location_code: 2860, language_code: "ru" }
];

// вопросы, которые задаёт абитуриент, по новым направлениям
const QUERIES = [
  "где учиться за границей после 11 класса",
  "в какой стране дешевле учиться за границей",
  "как поступить в университет за границей",
  "учеба в венгрии для иностранцев",
  "медицина в венгрии обучение для иностранцев",
  "сколько стоит учеба в оаэ",
  "университеты дубая для иностранных студентов",
  "магистратура в испании для русскоговорящих",
  "студенческая виза в италию",
  "учеба на северном кипре признание диплома",
  "учеба в турции для иностранцев",
  "учеба в грузии на английском",
  "сколько стоит обучение в малайзии",
  "стипендия stipendium hungaricum как получить",
  "агентство по поступлению в зарубежные вузы"
];

const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const envValue = name =>
  env.split(/\r?\n/).find(l => l.startsWith(`${name}=`))?.split("=").slice(1).join("=").trim();

const auth = Buffer.from(
  `${envValue("DATAFORSEO_API_LOGIN")}:${envValue("DATAFORSEO_API_PASSWORD")}`
).toString("base64");

const post = async (url, body, attempt = 1) => {
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120000)
    });
    return await r.json();
  } catch (e) {
    if (attempt < 3) {
      await new Promise(r => setTimeout(r, 2000 * attempt));
      return post(url, body, attempt + 1);
    }
    return { _error: String(e) };
  }
};

/** Вытаскиваем все домены из блока ИИ-ответа, как бы он ни был вложен */
const links = (node, out = new Set()) => {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) {
    node.forEach(n => links(n, out));
    return out;
  }
  if (typeof node.domain === "string") out.add(node.domain);
  if (typeof node.url === "string") {
    try {
      out.add(new URL(node.url).hostname.replace(/^www\./, ""));
    } catch {}
  }
  Object.values(node).forEach(v => links(v, out));
  return out;
};

const check = async (market, keyword) => {
  const data = await post(
    "https://api.dataforseo.com/v3/serp/google/organic/live/advanced",
    [
      {
        keyword,
        location_code: market.location_code,
        language_code: market.language_code,
        depth: 20,
        load_async_ai_overview: true
      }
    ]
  );

  const task = data.tasks?.[0];
  if (task?.status_code !== 20000) {
    return { keyword, market: market.name, error: task?.status_message || data._error, cost: task?.cost || 0 };
  }

  const items = task.result?.[0]?.items || [];
  const ai = items.filter(i => i.type === "ai_overview");
  const sources = ai.length ? [...links(ai)] : [];

  return {
    keyword,
    market: market.name,
    hasAiOverview: ai.length > 0,
    targetInAi: sources.some(d => d.includes(TARGET)),
    sources,
    itemTypes: [...new Set(items.map(i => i.type))],
    raw: RAW ? ai : undefined,
    cost: task.cost || 0
  };
};

const main = async () => {
  const stamp = new Date().toISOString().slice(0, 10);
  const results = [];
  let cost = 0;

  for (const market of MARKETS) {
    console.log(`\n${market.name}\n`);
    for (const keyword of QUERIES) {
      const r = await check(market, keyword);
      results.push(r);
      cost += r.cost || 0;

      if (r.error) {
        console.log(`  ${keyword.slice(0, 46).padEnd(48)} ОШИБКА: ${r.error}`);
      } else {
        console.log(
          `  ${keyword.slice(0, 46).padEnd(48)}` +
            (r.hasAiOverview
              ? (r.targetInAi ? "ИИ-ответ: ЕСТЬ, сайт В ИСТОЧНИКАХ" : "ИИ-ответ: есть, сайта нет")
              : "ИИ-ответа нет")
        );
      }
    }
  }

  const withAi = results.filter(r => r.hasAiOverview).length;
  const withUs = results.filter(r => r.targetInAi).length;

  console.log(`\nИтого: проверок ${results.length}, блок ИИ-ответа показан в ${withAi}, сайт в источниках в ${withUs}.`);
  console.log(`Стоимость: $${cost.toFixed(2)}`);

  fs.writeFileSync(
    path.join(__dirname, `ai-${stamp}.json`),
    JSON.stringify({ date: stamp, target: TARGET, results, cost }, null, 2)
  );
  console.log(`Данные: content/seo/ai-${stamp}.json`);
};

main();
