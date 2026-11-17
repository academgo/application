/**
 * Название страны «Южный Кипр» → «Кипр».
 *
 *   node content/import/cyprus-title.mjs                      # сухой прогон
 *   node content/import/cyprus-title.mjs --apply              # в черновики
 *   node content/import/cyprus-title.mjs --apply --publish    # сразу в живые
 *
 * Меняется поле title документа страны. Этого достаточно: оттуда название
 * берут мега-меню, футер, плитка «Направления» и таблица сравнения.
 *
 * Тексты статей скрипт не трогает намеренно. В них «Южный Кипр» местами
 * стоит рядом с «Северным Кипром» и противопоставлен ему — там разница
 * между странами и есть смысл фразы. Заголовки страниц и подписи к
 * картинкам тоже оставлены: это отдельное решение по текстам.
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

const CODE = "south-cyprus";
const TITLES = { ru: "Кипр", en: "Cyprus" };

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

  const { result: found } = await api(
    `/data/query/${DATASET}?query=${encodeURIComponent(
      `*[_type == "country" && code == "${CODE}"]{_id, language, title}`
    )}`
  );

  const seen = new Set();
  const countries = [];
  for (const country of found || []) {
    const id = liveId(country._id);
    const mark = `${id}|${country.language}`;
    if (seen.has(mark)) continue;
    seen.add(mark);
    countries.push({ ...country, _id: id });
  }

  const target = id => (PUBLISH ? id : `drafts.${id}`);
  const mutations = [];

  for (const country of countries) {
    const title = TITLES[country.language];

    if (!title) {
      console.log(`  пропуск: язык ${country.language} не описан`);
      continue;
    }

    if (country.title === title) {
      console.log(`  ${country.language}: уже «${title}» — пропускаю`);
      continue;
    }

    console.log(`  ${country.language}: «${country.title}» → «${title}»`);
    mutations.push({ patch: { id: target(country._id), set: { title } } });
  }

  if (!countries.length) {
    console.log(`Страна с кодом ${CODE} не найдена`);
  }

  console.log(`\nМутаций: ${mutations.length}`);

  if (!mutations.length) return;

  if (!APPLY) {
    console.log("Сухой прогон. Чтобы записать — добавь --apply");
    return;
  }

  // Патч не создаёт документ: если черновика нет, сначала клонируем живой
  if (!PUBLISH) {
    const draftIds = [...new Set(mutations.map(m => m.patch.id))];
    const { result: haveDraft } = await api(
      `/data/query/${DATASET}?query=${encodeURIComponent(
        "*[_id in $ids]._id"
      )}&$ids=${encodeURIComponent(JSON.stringify(draftIds))}`
    );

    const needClone = draftIds.filter(id => !(haveDraft || []).includes(id));

    if (needClone.length) {
      const { result: live } = await api(
        `/data/query/${DATASET}?query=${encodeURIComponent(
          "*[_id in $ids]"
        )}&$ids=${encodeURIComponent(JSON.stringify(needClone.map(liveId)))}`
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
