/**
 * Английская версия блока «Направления» по образцу русской.
 *
 *   node content/import/home-en-sync.mjs                    # сухой прогон
 *   node content/import/home-en-sync.mjs --apply            # в черновики
 *   node content/import/home-en-sync.mjs --apply --publish  # сразу в живые
 *
 * Зачем. Страна в Sanity — отдельный документ на каждый язык, поэтому
 * порядок в плитке и тексты плашек, выставленные вручную в русских
 * документах, на английскую версию не переносятся. Там оставались старый
 * порядок (без Грузии и Турции, зато с Венгрией и Северным Кипром на
 * десктопе) и длинные плашки вроде «Residence permit and work rights»,
 * которые на телефоне теперь обрезались бы многоточием.
 *
 * Что делает:
 *   1. Читает homeOrder из русских документов стран и переносит его
 *      на английские — порядок задаётся в одном месте.
 *   2. Записывает короткие английские плашки (BADGES_EN ниже).
 *   3. Обновляет тексты блока на английской главной (BLOCK_EN ниже).
 *
 * Цены (homePrice) скрипт не трогает: их пишет home-prices.mjs.
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

/**
 * Короткие английские плашки — перевод тех, что стоят в русской версии.
 * Правило то же: максимум два-три слова, иначе на телефоне обрежется.
 * Правь прямо здесь.
 */
const BADGES_EN = {
  spain: "Residency permit", // Переезд и ВНЖ
  poland: "Top choice", // Топ выбор
  georgia: "No visa needed", // Без визы
  uae: "British degree", // Британский диплом
  "south-cyprus": "An EU degree", // Диплом ЕС
  turkey: "Scholarships", // Стипендии
  malaysia: "UK and US degrees", // Дипломы UK и US
  italy: "100% grants", // 100% гранты
  hungary: "Tuition-free", // на десктопе не показывается, но пусть будет коротко
  "north-cyprus": "Taught in English"
};

/** Тексты блока на английской главной. Правь прямо здесь */
const BLOCK_EN = {
  eyebrow: "Destinations",
  title: "Choose a country that fits your budget",
  titleHighlight: "and passport",
  description:
    "Tuition prices per year, in euros. Visa and degree-recognition risks are on each country's page.",
  cardLinkLabel: "Check your chances",
  ctaLabel: "Help me pick a country",
  allLabel: "Compare all 10 countries",
  maxCards: 8
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

/** Запрос отдаёт и черновики, и опубликованные версии — убираем дубли */
const dedupe = docs => {
  const out = [];
  const seen = new Set();
  for (const doc of docs || []) {
    const id = liveId(doc._id);
    const key = `${id}|${doc.language}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ...doc, _id: id });
  }
  return out;
};

const main = async () => {
  if (!token()) {
    console.error(
      "Не найден токен записи. Положи SANITY_API_WRITE_TOKEN в .env.local"
    );
    process.exit(1);
  }

  const codes = encodeURIComponent(JSON.stringify(Object.keys(BADGES_EN)));
  const countryQuery = encodeURIComponent(
    '*[_type == "country" && code in $codes]{_id, code, title, language, homeOrder, homeBadge, isFeatured}'
  );
  const { result: rawCountries } = await api(
    `/data/query/${DATASET}?query=${countryQuery}&$codes=${codes}`
  );
  const countries = dedupe(rawCountries);

  // Порядок — из русских документов, они источник правды
  const orderByCode = {};
  for (const country of countries) {
    if (country.language === "ru" && typeof country.homeOrder === "number") {
      orderByCode[country.code] = country.homeOrder;
    }
  }

  const target = id => (PUBLISH ? id : `drafts.${id}`);
  const mutations = [];

  console.log("Страны (английские документы):");
  for (const country of countries.filter(item => item.language === "en")) {
    const order = orderByCode[country.code];
    const badge = BADGES_EN[country.code];

    if (order === undefined) {
      console.log(
        `  пропуск: ${country.code} — в русском документе не задан homeOrder`
      );
      continue;
    }

    mutations.push({
      patch: {
        id: target(country._id),
        set: { homeOrder: order, homeBadge: badge }
      }
    });

    console.log(
      `  ${order}. ${country.title}: «${country.homeBadge || "—"}» → «${badge}»`
    );
  }

  const noEn = Object.keys(BADGES_EN).filter(
    code =>
      !countries.some(item => item.code === code && item.language === "en")
  );
  if (noEn.length) {
    console.log(`\nНет английского документа у стран: ${noEn.join(", ")}`);
  }

  // Тексты блока на английской главной
  const homeQuery = encodeURIComponent(
    '*[_type == "homepage" && language == "en"]{_id, language, "currentTitle": countriesBlock.title}'
  );
  const { result: rawHome } = await api(
    `/data/query/${DATASET}?query=${homeQuery}`
  );
  const homepages = dedupe(rawHome);

  console.log("\nГлавная (en):");
  for (const home of homepages) {
    const set = {};
    for (const [field, value] of Object.entries(BLOCK_EN)) {
      set[`countriesBlock.${field}`] = value;
    }

    mutations.push({
      patch: {
        id: target(home._id),
        set,
        // ссылка кнопке больше не нужна: она открывает всплывающее окно
        unset: ["countriesBlock.ctaLink"]
      }
    });

    console.log(
      `  ${home._id}: «${home.currentTitle || "—"}» → «${BLOCK_EN.title}»`
    );
  }

  if (!homepages.length) {
    console.log("  английская главная не найдена");
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
