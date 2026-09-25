/**
 * Мета-теги главной и страницы блога без привязки к Польше.
 *
 *   node content/import/listing-seo.mjs            # сухой прогон
 *   node content/import/listing-seo.mjs --apply    # запись в черновики
 *
 * Пишет только в черновики: preview-деплои их показывают, основной сайт — нет,
 * пока документы не опубликуют. У главной меняется только seo, остальные поля
 * черновика не трогаются. У блога черновика нет — он создаётся из
 * опубликованной версии.
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

// Главная хранит мета-теги в seo.{title,description}, блог — в
// metaTitle/metaDescription на верхнем уровне документа.
const PAGES = [
  {
    id: "31524895-0e8e-4e42-8ef0-614766aa1e00",
    label: "главная ru",
    set: {
      "seo.title": "Обучение за рубежом: поступление в вузы Европы, ОАЭ и Азии",
      "seo.description":
        "Помогаем поступить в университеты Польши, Италии, Испании, Венгрии, Турции, ОАЭ, Малайзии, Грузии и Кипра. Подбор вуза, документы, виза. Консультация бесплатно."
    }
  },
  {
    id: "387c8a6f-fe32-4c84-bb65-bfb143fa1044",
    label: "главная en",
    set: {
      "seo.title": "Study in Europe, Türkiye, the UAE & Asia — AcademGo",
      "seo.description":
        "Admission support for universities in Poland, Italy, Spain, Hungary, Türkiye, the UAE, Malaysia, Georgia and Cyprus. Documents, visa and support. Free consultation."
    }
  },
  {
    id: "8424a7a4-65de-4901-b37e-dec6b673a22e",
    label: "блог ru",
    set: {
      metaTitle: "Образование за рубежом: статьи и гайды для абитуриентов",
      metaDescription:
        "Разбираем поступление в вузы Европы, Турции, ОАЭ и Азии: требования, цены, стипендии, визы и студенческая жизнь. Обновляем статьи под новые правила."
    }
  },
  {
    id: "e901de0e-eb9e-4978-b698-4e576ef0f08e",
    label: "блог en",
    set: {
      metaTitle: "Study Abroad Guides for International Students",
      metaDescription:
        "Admission requirements, tuition fees, scholarships, visas and student life in Europe, Türkiye, the UAE and Asia — explained by AcademGo consultants."
    }
  }
];

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

  const ids = PAGES.flatMap(page => [page.id, `drafts.${page.id}`]);
  const params = new URLSearchParams({
    perspective: "raw",
    query: "*[_id in $ids]",
    $ids: JSON.stringify(ids)
  });
  const { result: found } = await api(`query/${DATASET}?${params}`);

  const mutations = [];

  for (const page of PAGES) {
    const draftId = `drafts.${page.id}`;
    const draft = found.find(doc => doc._id === draftId);
    const published = found.find(doc => doc._id === page.id);

    if (!draft && !published) {
      console.log(`${page.label}: документ ${page.id} не найден, пропускаю`);
      continue;
    }

    if (!draft) {
      const { _rev, _updatedAt, _createdAt, ...rest } = published;
      mutations.push({ createIfNotExists: { ...rest, _id: draftId } });
    }

    mutations.push({ patch: { id: draftId, set: page.set } });

    console.log(`${page.label}${draft ? "" : " (новый черновик)"}`);
    for (const [field, value] of Object.entries(page.set)) {
      console.log(`  ${field} (${value.length}): ${value}`);
    }
  }

  if (!APPLY) {
    console.log("\nСухой прогон. Для записи: --apply");
    return;
  }

  await api(`mutate/${DATASET}`, { mutations });
  console.log(`\nЗаписано мутаций: ${mutations.length}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
