/**
 * Заводит Польшу в справочнике стран: без этого документа её нет ни в меню,
 * ни в блоках «Другие страны», ни в таблице сравнения.
 *
 *   node content/import/poland-country.mjs            # сухой прогон
 *   node content/import/poland-country.mjs --apply    # загрузка черновиков
 *
 * Данные для сравнения взяты со страниц самого сайта: «Стоимость обучения
 * в Польше», «Обучение в Польше», «Студенческая виза».
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

const ref = id => ({ _type: "reference", _ref: id, _weak: true });

const HUB = {
  ru: "8f0845c4-a1c4-4458-a844-4036f885f17b", // Обучение в Польше
  en: "f2ce5741-8f90-42ea-a9ce-097d989e7fcb" // Study in Poland
};

const MENU = {
  ru: [
    { label: "Помощь в поступлении", id: "54607031-b726-46e2-95e8-484670e552f7" },
    { label: "ВУЗы Польши", id: "0239a061-1abf-44e5-a946-e47699c34f64" },
    {
      label: "Стоимость обучения",
      id: "7f0a1b2a-88cf-4c20-bab0-c159ec0659b9"
    },
    { label: "Студенческая виза", id: "4b5c83d9-0d80-4c51-b1a5-db642e833caa" },
    {
      label: "Медицинское образование",
      id: "a25feded-8910-4fa8-be10-de057ba9a44c"
    }
  ],
  en: [
    {
      label: "Assistance with Admission",
      id: "ea7b7ba6-9541-4198-a331-f5fc4a51f49b"
    },
    { label: "Universities in Poland", id: "0ab92845-4061-41f9-897d-6e9f31321859" },
    { label: "Cost of Studying", id: "98803de5-e4ab-4eb7-93a7-8702439e4e32" },
    { label: "Student Visa", id: "452e614e-e921-44c7-8570-665b4efeb3b7" },
    { label: "Medical Studies", id: "f056d799-9738-4efd-930c-c726208b7de8" }
  ]
};

const COMPARISON = {
  ru: {
    tuitionFrom: "от €1 500 в год в частных вузах; медицина от €12 000",
    livingCostFrom: "€500–600 в месяц",
    languageOfStudy: "польский и английский",
    visa: "студенческая виза D, затем карта побыту",
    workRights: "студентам дневного отделения разрешение на работу не нужно",
    degreeRecognition: "диплом вуза ЕС",
    medicineInEnglish: true
  },
  en: {
    tuitionFrom: "from €1,500 a year at private universities; medicine from €12,000",
    livingCostFrom: "€500–600 a month",
    languageOfStudy: "Polish and English",
    visa: "type D student visa, then a residence card",
    workRights: "full-time students need no work permit",
    degreeRecognition: "EU degree",
    medicineInEnglish: true
  }
};

const TITLE = { ru: "Польша", en: "Poland" };

const SHORT = {
  ru: "Направление, с которого мы начинали: диплом ЕС, обучение от €1 500 в год и работа без разрешения на дневном отделении.",
  en: "The destination we started with: an EU degree, tuition from €1,500 a year and no work permit needed for full-time students."
};

const documents = ["ru", "en"].map(lang => ({
  _id: `drafts.academgo.country.poland.${lang}`,
  _type: "country",
  title: TITLE[lang],
  code: "poland",
  // порядок 5 — Польша идёт первой, перед остальными странами
  order: 5,
  isFeatured: true,
  shortDescription: SHORT[lang],
  comparison: COMPARISON[lang],
  hubPage: ref(HUB[lang]),
  menuLinks: MENU[lang].map((item, index) => ({
    _key: `menu${index}`,
    label: item.label,
    page: ref(item.id)
  })),
  language: lang
}));

documents.push({
  _id: "academgo.tm.country.poland",
  _type: "translation.metadata",
  schemaTypes: ["country"],
  translations: ["ru", "en"].map(lang => ({
    _key: lang,
    _type: "internationalizedArrayReferenceValue",
    value: ref(`academgo.country.poland.${lang}`)
  }))
});

const main = async () => {
  if (!token()) {
    console.error("Нет токена: добавьте SANITY_API_TOKEN в .env.local");
    process.exit(1);
  }

  console.log(documents.map(item => `${item._type} ${item._id}`).join("\n"));

  if (!APPLY) {
    console.log("\nСухой прогон. Для загрузки добавьте --apply");
    return;
  }

  const response = await fetch(
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

  const result = await response.json();

  if (!response.ok) {
    console.error("Ошибка:", JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log("\nГотово.");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
