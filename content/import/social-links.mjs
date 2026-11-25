/**
 * Новые адреса соцсетей.
 *
 *   node content/import/social-links.mjs                   # сухой прогон
 *   node content/import/social-links.mjs --apply           # в черновики
 *   node content/import/social-links.mjs --apply --publish # сразу в живые
 *
 * Ссылки лежат в разных местах: футер, блок контактов, страница «спасибо»,
 * финальный экран квиза. Поэтому не перечисляем поля, а обходим документы
 * целиком и заменяем всё, что совпало по узнаваемому куску адреса.
 *
 * Русские и английские профили различаются самим старым адресом, так что
 * язык документа проверять не нужно: совпадение однозначно.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(__dirname, "out");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");
const PUBLISH = process.argv.includes("--publish");

const liveId = id => id.replace(/^drafts\./, "");

/**
 * Узнаваемый кусок старого адреса → новый адрес целиком.
 * Кусок берём без протокола и www: в базе попадаются оба написания,
 * а иногда и хвост с параметрами, который тоже надо отрезать.
 */
const REPLACEMENTS = [
  // русский сайт: меняется только инстаграм
  ["instagram.com/personal.legal.pl", "https://www.instagram.com/academgo"],
  // английский сайт
  ["instagram.com/personal.legal.eu", "https://www.instagram.com/academgo.abroad"],
  ["tiktok.com/@academgo.en", "https://www.tiktok.com/@academgo.abroad"],
  ["youtube.com/@academgo_en", "https://www.youtube.com/@academgo.abroad"]
];

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

const dedupe = docs => {
  const out = [];
  const seen = new Set();
  for (const doc of docs || []) {
    const id = liveId(doc._id);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ ...doc, _id: id });
  }
  return out;
};

/** Какая замена подходит этой строке */
const matchFor = value => {
  if (typeof value !== "string") return null;
  const lower = value.toLowerCase();
  return REPLACEMENTS.find(([marker]) => lower.includes(marker)) || null;
};

/**
 * Обходим документ и собираем пути до строк со старыми адресами.
 * Элементы массивов адресуем по _key: позиция может измениться, ключ нет.
 */
const walk = (node, basePath, found) => {
  if (Array.isArray(node)) {
    for (const item of node) {
      if (!item || typeof item !== "object") continue;
      const key = item._key;
      walk(item, key ? `${basePath}[_key=="${key}"]` : basePath, found);
    }
    return;
  }

  if (!node || typeof node !== "object") return;

  for (const [field, value] of Object.entries(node)) {
    if (field.startsWith("_")) continue;
    const at = basePath ? `${basePath}.${field}` : field;

    if (typeof value === "string") {
      const hit = matchFor(value);
      if (hit) found.push({ path: at, was: value, becomes: hit[1] });
      continue;
    }

    if (value && typeof value === "object") walk(value, at, found);
  }
};

const main = async () => {
  if (!token()) {
    console.error(
      "Не найден токен записи. Положи SANITY_API_WRITE_TOKEN в .env.local"
    );
    process.exit(1);
  }

  const target = id => (PUBLISH ? id : `drafts.${id}`);
  const mutations = [];
  const backup = {};
  let replaced = 0;

  // Берём все документы, кроме служебных записей о файлах и картинках
  const { result: rawDocs } = await api(
    `/data/query/${DATASET}?query=${encodeURIComponent(
      '*[!(_type match "sanity.*")]'
    )}`
  );

  for (const doc of dedupe(rawDocs)) {
    const found = [];
    walk(doc, "", found);
    if (!found.length) continue;

    const set = {};
    console.log(`\n${doc._type} (${doc.language ?? "без языка"}) ${doc._id}`);

    for (const { path: at, was, becomes } of found) {
      if (was === becomes) {
        console.log(`    ${at}: уже верный адрес — пропускаю`);
        continue;
      }
      set[at] = becomes;
      backup[`${doc._id}|${at}`] = was;
      replaced += 1;
      console.log(`    ${at}`);
      console.log(`        было:  ${was}`);
      console.log(`        стало: ${becomes}`);
    }

    if (!Object.keys(set).length) continue;

    mutations.push({ patch: { id: target(doc._id), set } });
  }

  if (Object.keys(backup).length) {
    fs.mkdirSync(OUT, { recursive: true });
    const file = path.join(OUT, "social-links-backup.json");
    fs.writeFileSync(file, JSON.stringify(backup, null, 2), "utf8");
    console.log(`\nПрежние адреса сохранены: ${file}`);
  }

  console.log(`\nДокументов к правке: ${mutations.length}, ссылок: ${replaced}`);

  if (!mutations.length) {
    console.log("Старых адресов не найдено.");
    return;
  }

  if (!APPLY) {
    console.log("Сухой прогон. Чтобы записать — добавь --apply");
    return;
  }

  // Патч не создаёт документ: если черновика нет, сначала клонируем живой
  if (!PUBLISH) {
    const draftIds = [
      ...new Set(mutations.filter(m => m.patch).map(m => m.patch.id))
    ];
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
