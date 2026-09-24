/**
 * Убирает привязку к Польше из пунктов пакетов услуг: состав работ одинаков
 * для всех стран, различается только процедура признания документов.
 * Цены и структура пакетов не меняются.
 *
 *   node content/import/prices-wording.mjs            # показать замены
 *   node content/import/prices-wording.mjs --apply    # применить в черновиках
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

const PAGES = {
  ru: "7ea6b79a-c216-435b-a98e-924645a89518",
  en: "c8d2de2c-dfba-4a77-8278-02f7e88c7347"
};

const REPLACEMENTS = [
  // русская версия
  ["Встреча в аэропорту в Польше", "Встреча в аэропорту по приезде"],
  ["Присяжный перевод на польский", "Присяжный перевод документов"],
  [
    "Консультация по ВУЗам и городам Польши",
    "Консультация по вузам и городам страны"
  ],
  [
    "Получение местной прописки и ID-номера в Польше",
    "Получение местной прописки и налогового номера"
  ],
  [
    "Помощь с нострификацией",
    "Помощь с признанием аттестата"
  ],
  [
    "Подача документов на нострификацию",
    "Подача документов на признание аттестата"
  ],
  [
    "Запись на государственный экзамен TELC ",
    "Запись на языковой экзамен, если он нужен"
  ],
  ["Нострификация", "Признание аттестата"],

  // английская версия
  ["Airport pickup in Poland", "Airport pickup on arrival"],
  [
    "Consultation on Polish universities and cities",
    "Consultation on universities and cities in your destination"
  ],
  [
    "Obtaining local registration and an ID number in Poland",
    "Obtaining local registration and a tax number"
  ],
  [
    "Assistance with nostrification",
    "Assistance with recognition of your school certificate"
  ],
  [
    "Consultation on the nostrification of documents",
    "Consultation on the recognition of your documents"
  ],
  [
    "Collection of a package of documents for nostrification",
    "Collection of the documents needed for recognition"
  ],
  [
    "Registration and submission of documents for nostrification",
    "Booking the appointment and filing the documents for recognition"
  ],
  ["Nostrification", "Certificate recognition"]
];

/**
 * В данных встречаются неразрывные пробелы, поэтому ищем по регулярному
 * выражению, где любой пробел совпадает и с обычным, и с неразрывным.
 */
const flexible = value =>
  new RegExp(
    value
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/[  ]+/g, "[ \\u00A0]+"),
    "g"
  );

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

const main = async () => {
  const ids = Object.values(PAGES).flatMap(id => [id, `drafts.${id}`]);
  const query = `*[_id in ${JSON.stringify(ids)}]{...}`;

  const response = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(
      query
    )}`,
    { headers: { Authorization: `Bearer ${token()}` } }
  );

  const { result: docs } = await response.json();

  // правим только черновики: живые страницы меняются при публикации
  const drafts = docs.filter(doc => doc._id.startsWith("drafts."));

  if (!drafts.length) {
    console.error(
      "Черновиков страниц цен нет. Сначала запустите content/import/common-pages.mjs --apply"
    );
    process.exit(1);
  }

  const documents = drafts.map(doc => {
    let json = JSON.stringify(doc.contentBlocks);

    REPLACEMENTS.forEach(([from, to]) => {
      const pattern = flexible(from);

      if (pattern.test(json)) {
        console.log(`${doc._id}: «${from.trim()}» → «${to}»`);
        json = json.replace(flexible(from), to);
      }
    });

    return { ...doc, contentBlocks: JSON.parse(json) };
  });

  if (!APPLY) {
    console.log("\nСухой прогон. Для применения добавьте --apply");
    return;
  }

  const mutateResponse = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`
      },
      body: JSON.stringify({
        mutations: documents.map(document => ({ createOrReplace: document }))
      })
    }
  );

  const result = await mutateResponse.json();

  if (!mutateResponse.ok) {
    console.error("Ошибка:", JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log("\nГотово.");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
