/**
 * Короткая цена на карточке блока «Направления» на главной.
 *
 *   node content/import/home-prices.mjs                      # сухой прогон
 *   node content/import/home-prices.mjs --apply              # в черновики
 *   node content/import/home-prices.mjs --apply --publish    # сразу в живые
 *
 * Пишет только одно поле — homePrice. Плашки (homeBadge) и порядок
 * (homeOrder) скрипт не трогает: они уже выставлены в админке вручную,
 * и перезаписывать их нельзя.
 *
 * Почему отдельное поле, а не comparison.tuitionFrom: та же строка выводится
 * в таблице «Сравнить страны» и в списке стран, и там детали вроде
 * «в госвузах, частные дороже» нужны. На карточке они ломали вёрстку —
 * цена занимала три-четыре строки и низ карточек в ряду расходился.
 * Старые значения остаются на своих местах, карточка берёт homePrice.
 *
 * Цены — по таблице клиента от ноября 2026. Это ориентиры «от» и диапазоны,
 * а не прайс конкретного вуза: точные цены лежат на страницах стран.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");
const PUBLISH = process.argv.includes("--publish");

const liveId = id => id.replace(/^drafts\./, "");

/** Ключ — код страны. Порядок в комментариях — порядок плитки на главной */
const PRICES = {
  spain: { ru: "€1 200–8 200 в год", en: "€1,200–8,200 per year" }, // 1
  poland: { ru: "от €1 500 в год", en: "from €1,500 per year" }, // 2
  georgia: { ru: "€5 000–7 000 в год", en: "€5,000–7,000 per year" }, // 3
  uae: { ru: "€14 000–19 000 в год", en: "€14,000–19,000 per year" }, // 4
  "south-cyprus": { ru: "€9 000–11 800 в год", en: "€9,000–11,800 per year" }, // 5
  turkey: { ru: "€430–3 500+ в год", en: "€430–3,500+ per year" }, // 6
  malaysia: { ru: "€7 600–9 800 в год", en: "€7,600–9,800 per year" }, // 7
  italy: { ru: "от €160 в год", en: "from €160 per year" }, // 8
  hungary: { ru: "€6 000–10 000 в год", en: "€6,000–10,000 per year" }, // 9
  "north-cyprus": { ru: "€2 800–5 600 в год", en: "€2,800–5,600 per year" } // 10
};

const token = () => {
  const envPath = path.join(ROOT, ".env.local");
  const names = ["SANITY_API_WRITE_TOKEN", "SANITY_API_TOKEN"];

  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const name of names) {
      const line = lines.find(item => item.startsWith(`${name}=`));
      if (line) return line.split("=").slice(1).join("=").trim();
    }
  }

  return names.map(name => process.env[name]).find(Boolean);
};

const api = async (urlPath, options = {}) => {
  const response = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}${urlPath}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`,
        ...(options.headers || {})
      }
    }
  );

  const result = await response.json();
  if (!response.ok) {
    console.error("Ошибка Sanity:", JSON.stringify(result, null, 2));
    process.exit(1);
  }
  return result;
};

const main = async () => {
  if (!token()) {
    console.error(
      "Не найден токен записи. Положи SANITY_API_WRITE_TOKEN в .env.local"
    );
    process.exit(1);
  }

  const query = encodeURIComponent(
    '*[_type == "country" && code in $codes]{_id, code, title, language, homePrice}'
  );
  const params = encodeURIComponent(JSON.stringify(Object.keys(PRICES)));
  const { result: found } = await api(
    `/data/query/${DATASET}?query=${query}&$codes=${params}`
  );

  // Запрос отдаёт и черновики, и опубликованные версии одного документа
  const countries = [];
  const seen = new Set();
  for (const country of found) {
    const id = liveId(country._id);
    const key = `${id}|${country.language}`;
    if (seen.has(key)) continue;
    seen.add(key);
    countries.push({ ...country, _id: id });
  }

  const target = id => (PUBLISH ? id : `drafts.${id}`);
  const mutations = [];

  for (const country of countries) {
    const price = PRICES[country.code]?.[country.language];
    if (!price) {
      console.log(
        `  пропуск: ${country.code} / ${country.language} — цены нет в таблице`
      );
      continue;
    }

    mutations.push({
      patch: { id: target(country._id), set: { homePrice: price } }
    });

    console.log(
      `  ${country.title} (${country.language}): «${country.homePrice || "—"}» → «${price}»`
    );
  }

  const missing = Object.keys(PRICES).filter(
    code => !countries.some(country => country.code === code)
  );
  if (missing.length) {
    console.log(`\nНе найдены страны с кодами: ${missing.join(", ")}`);
  }

  console.log(`\nМутаций: ${mutations.length}`);

  if (!APPLY) {
    console.log("Сухой прогон. Чтобы записать — добавь --apply");
    return;
  }

  // Патч не создаёт документ: если черновика нет, сначала клонируем живой
  if (!PUBLISH) {
    const draftIds = [...new Set(mutations.map(m => m.patch.id))];
    const existing = encodeURIComponent("*[_id in $ids]._id");
    const existingParams = encodeURIComponent(JSON.stringify(draftIds));
    const { result: haveDraft } = await api(
      `/data/query/${DATASET}?query=${existing}&$ids=${existingParams}`
    );

    const needClone = draftIds.filter(id => !(haveDraft || []).includes(id));

    if (needClone.length) {
      const liveQuery = encodeURIComponent("*[_id in $ids]");
      const liveParams = encodeURIComponent(
        JSON.stringify(needClone.map(liveId))
      );
      const { result: live } = await api(
        `/data/query/${DATASET}?query=${liveQuery}&$ids=${liveParams}`
      );

      const clones = (live || []).map(doc => ({
        createIfNotExists: { ...doc, _id: `drafts.${doc._id}` }
      }));

      if (clones.length) {
        console.log(`Создаю черновики: ${clones.length}`);
        await api(`/data/mutate/${DATASET}`, {
          method: "POST",
          body: JSON.stringify({ mutations: clones })
        });
      }
    }
  }

  await api(`/data/mutate/${DATASET}`, {
    method: "POST",
    body: JSON.stringify({ mutations })
  });

  console.log(
    PUBLISH
      ? "\nГотово: записано в живые документы, изменения видны на сайте."
      : "\nГотово: записано в черновики. Опубликуй их в студии."
  );
};

main();
