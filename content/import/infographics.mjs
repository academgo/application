/**
 * Инфографика на новых страницах: столбики, шкала по времени или карта
 * страны — по одной на страницу. Данные лежат в content/infographics/*.json.
 *
 *   node content/import/infographics.mjs                          # сухой прогон
 *   node content/import/infographics.mjs --only academgo.georgia.tsmu.ru
 *   node content/import/infographics.mjs --apply
 *
 * Формат файла: { "<id страницы>": { "afterHeading": "<текст H2>",
 * "block": { "_type": "barChartBlock" | "timelineBlock" | "countryMapBlock", ... } } }
 *
 * Блок встаёт в конец секции с заголовком afterHeading. Если на странице уже
 * есть инфографика, она заменяется — скрипт можно запускать повторно после
 * правки JSON. Перед записью данные проверяются; страницы с ошибками
 * пропускаются и выводятся списком. Запускать после page-layout.mjs.
 *
 * Меняются только черновики (drafts.academgo.*).
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const DATA_DIR = (() => {
  const index = process.argv.indexOf("--data");
  return index > -1
    ? path.resolve(process.argv[index + 1])
    : path.join(ROOT, "content/infographics");
})();
const SHAPES_FILE = path.join(
  ROOT,
  "src/app/components/CountryMapBlock/countryShapes.ts"
);

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");
const ONLY = (() => {
  const index = process.argv.indexOf("--only");
  return index > -1 ? process.argv[index + 1] : null;
})();

const INFOGRAPHIC_TYPES = ["barChartBlock", "timelineBlock", "countryMapBlock"];

// Секция заканчивается там, где начинается следующая или идут служебные блоки
const SECTION_BREAKS = [
  "consultationFormBlock",
  "surveyBlock",
  "accordionBlock",
  "leadMagnetBlock",
  "countriesLinksBlock",
  "countryUniversitiesBlock"
];

const key = () => crypto.randomBytes(6).toString("hex");

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

// Контуры и проекция — из того же файла, что рисует карту на сайте
const SHAPES = (() => {
  const source = fs.readFileSync(SHAPES_FILE, "utf8");
  const json = source.match(/COUNTRY_SHAPES[^=]*=\s*(\{[\s\S]*?\n\});/)[1];
  return JSON.parse(json);
})();

const project = (shape, lat, lon) => ({
  x: shape.scale * ((lon * Math.PI) / 180) + shape.tx,
  y:
    shape.ty -
    shape.scale * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
});

// ------------------------------------------------------------ проверки

const validate = (entry, urls) => {
  const errors = [];
  const block = entry.block || {};
  const text = value => typeof value === "string" && value.trim().length > 0;

  if (!text(entry.afterHeading)) errors.push("нет afterHeading");
  if (!INFOGRAPHIC_TYPES.includes(block._type)) {
    errors.push(`неизвестный тип ${block._type}`);
    return errors;
  }
  if (!text(block.title)) errors.push("нет title");

  const items = block.items || [];

  if (block._type === "barChartBlock") {
    if (items.length < 3 || items.length > 8) {
      errors.push(`столбиков ${items.length}, нужно 3–8`);
    }
    items.forEach((item, index) => {
      if (!text(item.label)) errors.push(`столбик ${index + 1}: нет label`);
      if (typeof item.value !== "number" || item.value < 0) {
        errors.push(`столбик ${index + 1}: value не число`);
      }
      if (item.valueMax !== undefined && !(item.valueMax > item.value)) {
        errors.push(`столбик ${index + 1}: valueMax не больше value`);
      }
      if (!text(item.valueLabel)) {
        errors.push(`столбик ${index + 1}: нет valueLabel`);
      }
    });
    if (items.filter(item => item.highlight).length > 1) {
      errors.push("выделено больше одного столбика");
    }
  }

  if (block._type === "timelineBlock") {
    if (items.length < 3 || items.length > 6) {
      errors.push(`этапов ${items.length}, нужно 3–6`);
    }
    items.forEach((item, index) => {
      if (!text(item.title)) errors.push(`этап ${index + 1}: нет title`);
    });
  }

  if (block._type === "countryMapBlock") {
    const shape = SHAPES[block.country];
    const points = block.points || [];
    if (!shape) errors.push(`нет контура для страны ${block.country}`);
    if (!points.length) errors.push("нет городов");

    points.forEach(point => {
      if (shape && typeof point.lat === "number" && typeof point.lon === "number") {
        const { x, y } = project(shape, point.lat, point.lon);
        // город должен попасть в кадр карты своей страны
        if (x < 0 || y < 0 || x > shape.width || y > shape.height) {
          errors.push(`${point.city}: координаты вне карты ${block.country}`);
        }
      } else {
        errors.push(`${point.city}: нет координат`);
      }
      (point.universities || []).forEach(university => {
        if (university.href && !urls.has(university.href)) {
          errors.push(`${university.name}: нет страницы ${university.href}`);
        }
      });
    });
  }

  return errors;
};

// ------------------------------------------------------------ сборка блока

const withKeys = block => {
  const result = { ...block, _key: key() };

  if (result.items) {
    result.items = result.items.map(item => ({ ...item, _key: key() }));
  }
  if (result.points) {
    result.points = result.points.map(point => ({
      ...point,
      _key: key(),
      universities: (point.universities || []).map(university => ({
        ...university,
        _key: key()
      }))
    }));
  }

  return result;
};

const headingOf = block =>
  block._type === "textContent" && block.content?.[0]?.style === "h2"
    ? (block.content[0].children || []).map(child => child.text).join("")
    : null;

const insertInfographic = (blocks, entry) => {
  // Прошлая версия инфографики уходит, чтобы повторный запуск её заменял
  const clean = blocks.filter(
    block => !INFOGRAPHIC_TYPES.includes(block._type)
  );

  const start = clean.findIndex(
    block => headingOf(block)?.trim() === entry.afterHeading.trim()
  );
  if (start < 0) return null;

  let end = start + 1;
  while (
    end < clean.length &&
    !headingOf(clean[end]) &&
    !SECTION_BREAKS.includes(clean[end]._type)
  ) {
    end++;
  }

  const next = [...clean];
  next.splice(end, 0, withKeys(entry.block));
  return { blocks: next, position: end };
};

// ------------------------------------------------------------ Sanity

const api = async (endpoint, body) => {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/${endpoint}`;
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));
  return json;
};

const main = async () => {
  if (!token()) throw new Error("Нет SANITY_API_WRITE_TOKEN в .env.local");

  const entries = {};
  for (const file of fs.readdirSync(DATA_DIR).filter(name => name.endsWith(".json"))) {
    Object.assign(
      entries,
      JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"))
    );
  }

  // Адреса всех страниц — для проверки ссылок на карте. Родители тоже лежат
  // черновиками, поэтому читаем в перспективе drafts.
  const urlParams = new URLSearchParams({
    perspective: "drafts",
    query: `*[_type in ["subpage", "singlepage"]]{_type, language, slug, "parent": parentPage->slug}`
  });
  const { result: allPages } = await api(`query/${DATASET}?${urlParams}`);
  const urls = new Set(
    allPages
      .map(page => {
        const own = page.slug?.[page.language]?.current;
        if (!own) return null;
        const prefix = page.language === "en" ? "" : `/${page.language}`;
        const parent = page.parent?.[page.language]?.current;
        return page._type === "subpage" && parent
          ? `${prefix}/${parent}/${own}`
          : `${prefix}/${own}`;
      })
      .filter(Boolean)
  );

  const ids = Object.keys(entries).filter(id => !ONLY || id === ONLY);
  const params = new URLSearchParams({
    perspective: "raw",
    query: `*[_id in $ids]{_id, _rev, contentBlocks}`,
    $ids: JSON.stringify(ids.map(id => `drafts.${id}`))
  });
  const { result: pages } = await api(`query/${DATASET}?${params}`);

  const mutations = [];
  const failed = [];

  for (const id of ids) {
    const entry = entries[id];
    const page = pages.find(item => item._id === `drafts.${id}`);
    const errors = page ? validate(entry, urls) : ["черновик страницы не найден"];

    const inserted = errors.length ? null : insertInfographic(page.contentBlocks || [], entry);
    if (!errors.length && !inserted) {
      errors.push(`нет секции «${entry.afterHeading}»`);
    }

    if (errors.length) {
      failed.push(`${id}: ${errors.join("; ")}`);
      continue;
    }

    console.log(
      `${id}: ${entry.block._type} после «${entry.afterHeading}» (блок ${inserted.position + 1})`
    );
    mutations.push({
      patch: {
        id: page._id,
        ifRevisionID: page._rev,
        set: { contentBlocks: inserted.blocks }
      }
    });
  }

  console.log(`\nВ данных: ${ids.length}, готово к записи: ${mutations.length}`);
  if (failed.length) console.log(`\nОшибки (${failed.length}):\n${failed.join("\n")}`);

  if (!APPLY) {
    console.log("\nСухой прогон. Для записи: --apply");
    return;
  }

  for (let index = 0; index < mutations.length; index += 50) {
    await api(`mutate/${DATASET}`, {
      mutations: mutations.slice(index, index + 50)
    });
  }
  console.log(`Записано: ${mutations.length}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
