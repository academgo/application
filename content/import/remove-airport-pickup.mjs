/**
 * 1. Встреча в аэропорту: AcademGo эту услугу не оказывает — убираем её
 *    отовсюду, включая польские страницы: пункты пакетов и таблиц цен,
 *    блок в пакете VIP, формулировки в «О нас», на главной и в статьях.
 *    Меняются и опубликованные версии (живой сайт), и черновики.
 * 2. Цены пока только для Польши: страница «Стоимость услуг» в черновике
 *    возвращается к польской версии (опубликованной) с пометкой, что по
 *    другим странам цену называем на консультации; на главной (черновик)
 *    заголовок ценового блока уточняет, что цены — для Польши.
 *
 *   node content/import/remove-airport-pickup.mjs            # сухой прогон
 *   node content/import/remove-airport-pickup.mjs --apply    # запись
 *
 * Встречу в аэропорту, которую организует сам вуз (UCSI, APU в Малайзии),
 * не трогаем — это факт о вузе, а не наша услуга.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { key, markdownToPortableText } from "./markdown-to-portable-text.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

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

const AIRPORT = /аэропорт|airport/i;

// Страницы «Стоимость услуг»: RU и EN
const PRICE_PAGES = {
  "7ea6b79a-c216-435b-a98e-924645a89518":
    "Цены ниже — для поступления в Польшу. Стоимость услуг по другим странам назовём на бесплатной консультации.",
  "c8d2de2c-dfba-4a77-8278-02f7e88c7347":
    "The prices below are for admission to Poland. For other countries, we will quote the cost in a free consultation."
};

// Главная: заголовок ценового блока (только черновики — это мультистрановая главная)
const HOMEPAGE_PRICE_TITLE = {
  "drafts.31524895-0e8e-4e42-8ef0-614766aa1e00":
    "Стоимость наших услуг для поступления в Польшу",
  "drafts.387c8a6f-fe32-4c84-bb65-bfb143fa1044":
    "Cost of our services for admission to Poland"
};

// Точечные правки текста: объект с этим _key → поле → новое значение
const TEXT_EDITS = [
  // Главная RU: шаг «Встречаем в Польше…»
  {
    key: "e871758c8735",
    field: "title",
    value: "Лично с вами подаём документы в университет в Польше. "
  },
  // «О нас»: пункт про встречу и адаптацию
  { key: "ab626a7982ea", field: "sign", value: "Адаптация в Польше" },
  {
    key: "ab626a7982ea",
    field: "text",
    value:
      "Помогаем с заселением в общежитие и лично сопровождаем в университет для финальной подачи документов."
  },
  { key: "8ad22185373a", field: "sign", value: "Housing & Adaptation" },
  {
    key: "8ad22185373a",
    field: "text",
    value:
      "We help you check into your dormitory and guide you through the final university registration."
  },
  // «О нас», FAQ: «встретимся лично в Варшаве» / «meet you at the Warsaw airport»
  {
    key: "e446ea7eca19",
    field: "text",
    replace: [" А встретимся мы с вами уже лично — ", ""]
  },
  { key: "654f48a9a8b6", field: "text", value: "" },
  { key: "54e8b3c327eb", field: "text", value: "." },
  { key: "3f51bea05d6a", field: "text", value: "" },
  { key: "a344da21a632", field: "text", value: "" },
  { key: "64b153978aa8", field: "text", value: "" },
  { key: "af64e85d0a13", field: "text", value: "" },
  // Польские страницы: «Встреча по приезду»
  { key: "371b0ebac97f0", field: "text", value: "1. Помощь по приезду" },
  {
    key: "371b0ebac97f1",
    field: "text",
    value:
      " — помогаем с заселением, чтобы первые дни в Польше прошли без сложностей."
  },
  {
    key: "03abffc794261",
    field: "text",
    value:
      " — We help students settle into their accommodation and make their first days in Poland stress-free."
  },
  // Визовые статьи EN: убираем airport pickup из перечня услуг
  {
    key: "f7132db357a511",
    field: "text",
    value: "student accommodation and university registration"
  },
  {
    key: "b9d3214f871c0",
    field: "text",
    replace: [
      "such as airport pickup, university registration, and residence permit applications",
      "such as university registration and residence permit applications"
    ]
  },
  {
    key: "dcaf0d6e76e20",
    field: "text",
    replace: [
      "such as airport pickup, university registration, and residence permit applications",
      "such as university registration and residence permit applications"
    ]
  },
  {
    key: "1ada4c56ddcd0",
    field: "text",
    replace: [
      "such as airport pickup, university registration, and residence permit applications",
      "such as university registration and residence permit applications"
    ]
  }
];

const EDIT_KEYS = new Set(TEXT_EDITS.map(edit => edit.key));

const blockText = block =>
  (block.children || []).map(child => child.text || "").join("");

/**
 * Обход документа: пути для patch (элементы по _key), пункты со встречей
 * в аэропорту — на удаление, точечные правки — на запись.
 */
const collect = (doc, ops) => {
  const walk = (value, pathSoFar) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const itemPath = `${pathSoFar}[${item && item._key ? `_key=="${item._key}"` : index}]`;
        if (item && typeof item === "object" && !Array.isArray(item)) {
          // Пункт пакета / таблицы / списка со встречей в аэропорту
          const label = item.title || item.featureName;
          if (
            typeof label === "string" &&
            AIRPORT.test(label) &&
            item._type !== "block"
          ) {
            ops.unset.push(itemPath);
            return;
          }
          // Блок пакета VIP «Встреча в аэропорту/на вокзале»
          const first = item.contentBlock?.content?.[0];
          if (first && AIRPORT.test(blockText(first))) {
            ops.unset.push(itemPath);
            return;
          }
        }
        walk(item, itemPath);
      });
      return;
    }
    if (value && typeof value === "object") {
      if (EDIT_KEYS.has(value._key)) {
        for (const edit of TEXT_EDITS.filter(item => item.key === value._key)) {
          const current = value[edit.field];
          const next = edit.replace
            ? current?.replace(edit.replace[0], edit.replace[1])
            : edit.value;
          if (typeof current === "string" && next !== current) {
            ops.set[`${pathSoFar}.${edit.field}`] = next;
          }
        }
      }
      for (const [field, item] of Object.entries(value)) {
        if (field.startsWith("_")) continue;
        walk(item, pathSoFar ? `${pathSoFar}.${field}` : field);
      }
    }
  };
  walk(doc, "");
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
  if (!token()) throw new Error("Нет SANITY_API_WRITE_TOKEN в .env.local");

  const response = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/export/${DATASET}`,
    { headers: { Authorization: `Bearer ${token()}` } }
  );
  const docs = (await response.text())
    .trim()
    .split("\n")
    .map(line => JSON.parse(line))
    .filter(
      doc =>
        !doc._type?.startsWith("system.") &&
        !doc._type?.startsWith("sanity.") &&
        // встреча в аэропорту от самого вуза — не наша услуга
        !/malaysia\.(ucsi|apu)/.test(doc._id)
    );
  const byId = new Map(docs.map(doc => [doc._id, doc]));

  const mutations = [];
  const report = [];

  // 1. Черновики страниц цен — заново из опубликованной польской версии
  for (const [id, notice] of Object.entries(PRICE_PAGES)) {
    const published = byId.get(id);
    if (!published) throw new Error(`нет опубликованной страницы цен ${id}`);
    const { _rev, _updatedAt, _createdAt, ...rest } = published;
    const draft = {
      ...structuredClone(rest),
      _id: `drafts.${id}`,
      contentBlocks: [
        {
          _type: "textContent",
          _key: key(),
          marginBottom: "medium",
          content: markdownToPortableText(notice)
        },
        ...(published.contentBlocks || [])
      ]
    };
    byId.set(draft._id, draft);
    mutations.push({ createOrReplace: draft });
    report.push(
      `${draft._id}: черновик заново из польской версии + пометка про другие страны`
    );
  }

  // 2. Встреча в аэропорту и точечные правки — во всех документах
  for (const doc of byId.values()) {
    const ops = { unset: [], set: {} };
    collect(doc, ops);
    if (HOMEPAGE_PRICE_TITLE[doc._id]) {
      ops.set.priceTitle = HOMEPAGE_PRICE_TITLE[doc._id];
    }
    if (!ops.unset.length && !Object.keys(ops.set).length) continue;

    const patch = { id: doc._id };
    if (doc._rev) patch.ifRevisionID = doc._rev;
    if (ops.unset.length) patch.unset = ops.unset;
    if (Object.keys(ops.set).length) patch.set = ops.set;
    mutations.push({ patch });
    report.push(
      `${doc._id} [${doc._type}]: убрать ${ops.unset.length}, правок текста ${Object.keys(ops.set).length}`
    );
  }

  console.log(report.join("\n"));
  console.log(`\nМутаций: ${mutations.length}`);

  if (!APPLY) {
    console.log("\nСухой прогон. Для записи: --apply");
    return;
  }

  await api(`mutate/${DATASET}`, { mutations });
  console.log("Записано");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
