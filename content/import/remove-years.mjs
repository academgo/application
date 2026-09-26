/**
 * Годы, которые устаревают каждый год (учебные годы, наборы, годы прайсов,
 * «на сентябрь 2026»), убраны из текстов сайта. Правки подготовлены по
 * фрагментам и лежат в JSON: [{ id, path, text, new }], где text — исходный
 * фрагмент, new — переписанный.
 *
 *   node content/import/remove-years.mjs <папка с JSON>            # проверка
 *   node content/import/remove-years.mjs <папка с JSON> --apply    # запись
 *
 * Перед записью каждая правка проверяется: фрагмент в CMS не менялся, в новом
 * тексте нет чисел, которых не было в исходном, сохранены пробелы на краях
 * фрагмента, не осталось учебных годов вида 2026/27. Правки с ошибками
 * пропускаются и выводятся списком.
 *
 * Меняются документы с теми id, что в JSON: черновики новых страниц и
 * опубликованные старые страницы (это живой сайт).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const DIR = process.argv[2];
const APPLY = process.argv.includes("--apply");

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

// «a[_key=="x"].b[0].c» → значение внутри документа
const resolve = (doc, pathString) => {
  const parts = pathString.match(/[^.[\]]+|\[[^\]]+\]/g) || [];
  let value = doc;
  for (const part of parts) {
    if (value == null) return undefined;
    if (part.startsWith("[")) {
      const inner = part.slice(1, -1);
      const byKey = inner.match(/^_key=="(.+)"$/);
      value = byKey
        ? (value || []).find(item => item && item._key === byKey[1])
        : value[Number(inner)];
    } else {
      value = value[part];
    }
  }
  return value;
};

const numbers = text => text.match(/\d+/g) || [];
// Текущие и будущие учебные годы: прошлые («с 2024/25», «2019–2020») — история
const ACADEMIC_YEAR = /\b20(2[5-9]|3\d)\s?[/–-]\s?(20)?(2[6-9]|3\d)\b/;

const check = change => {
  const errors = [];
  const oldNumbers = new Set(numbers(change.text));
  const added = numbers(change.new).filter(number => !oldNumbers.has(number));
  if (added.length) errors.push(`новые числа: ${added.join(", ")}`);
  if (ACADEMIC_YEAR.test(change.new)) errors.push("остался учебный год");
  return errors;
};

// Пробелы на краях фрагмента — как в исходном: иначе слова абзаца слипнутся
const keepEdges = (from, to) => {
  const lead = from.match(/^\s*/)[0];
  const trail = from.match(/\s*$/)[0];
  const core = to.trim();
  return core ? `${lead}${core}${trail}` : from.trim() ? "" : from;
};

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
  if (!DIR) throw new Error("Укажите папку с JSON правок");
  if (!token()) throw new Error("Нет SANITY_API_WRITE_TOKEN в .env.local");

  const changes = fs
    .readdirSync(DIR)
    .filter(name => name.endsWith(".json"))
    .flatMap(name => JSON.parse(fs.readFileSync(path.join(DIR, name), "utf8")));

  const ids = [...new Set(changes.map(change => change.id))];
  const docs = new Map();
  for (let index = 0; index < ids.length; index += 100) {
    const params = new URLSearchParams({
      perspective: "raw",
      query: "*[_id in $ids]",
      $ids: JSON.stringify(ids.slice(index, index + 100))
    });
    const { result } = await api(`query/${DATASET}?${params}`);
    for (const doc of result) docs.set(doc._id, doc);
  }

  const sets = new Map();
  const rejected = [];
  let unchanged = 0;

  for (const change of changes) {
    const doc = docs.get(change.id);
    const current = doc ? resolve(doc, change.path) : undefined;
    const label = `${change.id} :: ${change.text.slice(0, 60)}`;

    if (current !== change.text) {
      rejected.push(`${label} — фрагмент в CMS уже другой`);
      continue;
    }
    const next = keepEdges(change.text, change.new);
    if (next === change.text) {
      unchanged++;
      continue;
    }
    const errors = check({ ...change, new: next });
    if (errors.length) {
      rejected.push(`${label} → ${next.slice(0, 60)} — ${errors.join("; ")}`);
      continue;
    }
    if (!sets.has(change.id)) sets.set(change.id, {});
    sets.get(change.id)[change.path] = next;
  }

  const total = [...sets.values()].reduce(
    (sum, set) => sum + Object.keys(set).length,
    0
  );
  console.log(
    `Правок: ${changes.length}, к записи: ${total} в ${sets.size} документах, без изменений: ${unchanged}, отклонено: ${rejected.length}`
  );
  if (rejected.length) console.log(`\nОтклонено:\n${rejected.join("\n")}`);

  if (!APPLY) {
    console.log("\nПроверка. Для записи: --apply");
    return;
  }

  const mutations = [...sets.entries()].map(([id, set]) => ({
    patch: { id, ifRevisionID: docs.get(id)._rev, set }
  }));
  for (let index = 0; index < mutations.length; index += 25) {
    await api(`mutate/${DATASET}`, {
      mutations: mutations.slice(index, index + 25)
    });
  }
  console.log(`Записано документов: ${mutations.length}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
