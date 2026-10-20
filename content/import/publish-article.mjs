/**
 * Публикация статьи блога в Sanity: русская и английская версии + связь переводов.
 *
 *   node content/import/publish-article.mjs                  # сухой прогон
 *   node content/import/publish-article.mjs --apply          # загрузить черновиками
 *   node content/import/publish-article.mjs --apply --publish # сразу опубликовать
 *
 * Источник — markdown в content/articles. Заголовки H2 попадают внутрь
 * Portable Text, потому что компонент статьи выводит только поле content.
 * ID документов детерминированные: повторный запуск перезаписывает те же
 * документы, дублей не появляется.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const ARTICLES = path.join(ROOT, "content/articles");

const API_VERSION = "2023-05-03";

// дата публикации обеих версий: 10 октября 2026, 09:00 по Варшаве
const PUBLISHED_AT = "2026-10-10T07:00:00.000Z";
const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const PUBLISH = args.includes("--publish");
const LIST_CATEGORIES = args.includes("--categories");
// Категория: --category=... для обеих локалей сразу либо --category-ru=... и
// --category-en=... по отдельности, если слаги в языках не совпадают.
// Значением может быть слаг или часть названия категории.
const argValue = prefix =>
  (args.find(a => a.startsWith(prefix)) || "").slice(prefix.length);

const CATEGORY = argValue("--category=");
const CATEGORY_BY_LANG = {
  ru: argValue("--category-ru=") || CATEGORY,
  en: argValue("--category-en=") || CATEGORY
};

// ------------------------------------------------------------------ доступы

const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const envValue = name =>
  (env.split(/\r?\n/).find(line => line.startsWith(`${name}=`)) || "")
    .slice(name.length + 1)
    .trim()
    .replace(/^["']|["']$/g, "");

const PROJECT_ID = envValue("NEXT_PUBLIC_SANITY_PROJECT_ID");
const DATASET = envValue("NEXT_PUBLIC_SANITY_DATASET") || "production";
const TOKEN = envValue("SANITY_API_WRITE_TOKEN") || envValue("SANITY_API_TOKEN");

// ------------------------------------------------------------------ контент

const ARTICLE = {
  base: "business-after-study",
  ru: {
    file: "business-after-study.ru.md",
    slug: "biznes-posle-ucheby-za-granicey",
    metaTitle: "Как открыть бизнес после учёбы за границей: Польша, Грузия, ОАЭ",
    metaDescription:
      "Какой статус даёт право на своё дело, как открыть JDG в Польше или ИП в Грузии, сколько стоит регистрация и что сделать, чтобы бизнес находили в интернете."
  },
  en: {
    file: "business-after-study.en.md",
    slug: "business-after-graduation-abroad",
    metaTitle:
      "Work for Yourself After Graduation Abroad: Permits, Business, Online Presence",
    metaDescription:
      "Which status lets graduates work for themselves, how residence permits compare in the UAE, Poland, Portugal and Greece, and how to be found in Google and in AI answers."
  }
};

const key = () => crypto.randomBytes(6).toString("hex");

const docId = (parts, isDraft) =>
  `${isDraft ? "drafts." : ""}academgo.${parts.join(".")}`;

// --------------------------------------------------- markdown → Portable Text

// Разбирает ссылки [текст](url) и собирает children с markDefs
const inline = text => {
  const children = [];
  const markDefs = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      children.push({
        _type: "span",
        _key: key(),
        text: text.slice(last, match.index),
        marks: []
      });
    }
    const markKey = key();
    markDefs.push({ _type: "link", _key: markKey, href: match[2] });
    children.push({
      _type: "span",
      _key: key(),
      text: match[1],
      marks: [markKey]
    });
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    children.push({
      _type: "span",
      _key: key(),
      text: text.slice(last),
      marks: []
    });
  }

  if (!children.length) {
    children.push({ _type: "span", _key: key(), text: "", marks: [] });
  }

  return { children, markDefs };
};

const block = (text, style, listItem) => {
  const { children, markDefs } = inline(text);
  const result = { _type: "block", _key: key(), style, children, markDefs };
  if (listItem) {
    result.listItem = listItem;
    result.level = 1;
  }
  return result;
};

const markdownToBlocks = markdown => {
  const lines = markdown.split(/\r?\n/);
  const intro = [];
  const body = [];
  let title = "";
  let seenH2 = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("# ")) {
      title = line.slice(2).trim();
      continue;
    }
    if (line.startsWith("## ")) {
      seenH2 = true;
      body.push(block(line.slice(3).trim(), "h2"));
      continue;
    }
    if (line.startsWith("- ")) {
      (seenH2 ? body : intro).push(block(line.slice(2).trim(), "normal", "bullet"));
      continue;
    }
    (seenH2 ? body : intro).push(block(line, "normal"));
  }

  return { title, intro, body };
};

// ----------------------------------------------------------------- категории

const fetchCategories = async () => {
  const query = encodeURIComponent(
    '*[_type == "category"]{_id, title, language, slug}'
  );
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`;
  const response = await fetch(url, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}
  });
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));
  return json.result || [];
};

// Ищем категорию нужного языка по слагу или по части названия
const pickCategory = (categories, lang, needle) => {
  const ofLang = categories.filter(item => item.language === lang);
  if (!ofLang.length) return null;
  if (!needle) return null;

  const lower = needle.toLowerCase();
  return (
    ofLang.find(item =>
      Object.values(item.slug || {}).some(
        value => value && value.current && value.current.toLowerCase() === lower
      )
    ) ||
    ofLang.find(item => (item.title || "").toLowerCase().includes(lower)) ||
    null
  );
};

// ------------------------------------------------------------ загрузка файла

const uploadImage = async file => {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}?filename=${encodeURIComponent(path.basename(file))}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "image/jpeg" },
    body: fs.readFileSync(file)
  });
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));
  return json.document._id;
};

// ------------------------------------------------------------------- сборка

const buildDocuments = (assetId, categoryByLang) => {
  const documents = [];
  // В документе заполняем слаг только своего языка: если заполнить оба,
  // переключатель языков склеивает их в один адрес и получается 404

  for (const lang of ["ru", "en"]) {
    const config = ARTICLE[lang];
    const markdown = fs.readFileSync(path.join(ARTICLES, config.file), "utf8");
    const { title, intro, body } = markdownToBlocks(markdown);

    documents.push({
      _id: docId(["blog", ARTICLE.base, lang], !PUBLISH),
      _type: "blog",
      language: lang,
      title,
      slug: { _type: "localizedSlug", [lang]: { _type: "slug", current: config.slug } },
      seo: {
        _type: "object",
        metaTitle: config.metaTitle,
        metaDescription: config.metaDescription
      },
      publishedAt: PUBLISHED_AT,
      category: categoryByLang[lang]
        ? { _type: "reference", _ref: categoryByLang[lang]._id }
        : undefined,
      previewImage: assetId
        ? { _type: "image", asset: { _type: "reference", _ref: assetId } }
        : undefined,
      firstContent: { _type: "textContent", content: intro },
      contentBlocks: [{ _type: "textContent", _key: key(), content: body }]
    });
  }

  documents.push({
    _id: docId(["tm", "blog", ARTICLE.base]),
    _type: "translation.metadata",
    schemaTypes: ["blog"],
    translations: ["ru", "en"].map(lang => ({
      _key: lang,
      _type: "internationalizedArrayReferenceValue",
      value: {
        _type: "reference",
        _ref: docId(["blog", ARTICLE.base, lang]),
        _weak: true
      }
    }))
  });

  return documents;
};

// ------------------------------------------------------------------- запуск

const run = async () => {
  if (!PROJECT_ID) throw new Error("Нет NEXT_PUBLIC_SANITY_PROJECT_ID в .env.local");

  // без сети (например, при сухом прогоне из песочницы) просто идём дальше
  const categories = TOKEN
    ? await fetchCategories().catch(error => {
        console.log(`категории не получены: ${error.message}`);
        return [];
      })
    : [];

  if (LIST_CATEGORIES) {
    for (const item of categories) {
      const slug = Object.entries(item.slug || {})
        .filter(([lang]) => lang !== "_type")
        .map(([lang, value]) => `${lang}: ${value?.current || "—"}`)
        .join(", ");
      console.log(`${item.language}\t${item.title}\t${slug}`);
    }
    if (!categories.length) console.log("категорий в наборе данных нет");
    return;
  }

  const categoryByLang = {
    ru: pickCategory(categories, "ru", CATEGORY_BY_LANG.ru),
    en: pickCategory(categories, "en", CATEGORY_BY_LANG.en)
  };

  for (const lang of ["ru", "en"]) {
    if (categoryByLang[lang]) {
      console.log(`категория ${lang}: ${categoryByLang[lang].title}`);
    } else {
      console.log(
        `категория ${lang}: не выбрана — запустите с --categories, чтобы увидеть список, и добавьте --category-${lang}=<слаг>`
      );
    }
  }

  let assetId = null;
  const cover = path.join(ARTICLES, "cover.jpg");

  if (APPLY && fs.existsSync(cover)) {
    if (!TOKEN) throw new Error("Нет токена Sanity в .env.local");
    assetId = await uploadImage(cover);
    console.log("обложка загружена:", assetId);
  }

  const documents = buildDocuments(assetId, categoryByLang);

  for (const document of documents) {
    const blocks =
      (document.firstContent?.content?.length || 0) +
      (document.contentBlocks?.[0]?.content?.length || 0);
    console.log(
      document._id,
      document._type === "blog"
        ? `${document.title} — блоков: ${blocks}`
        : "связь переводов"
    );
  }

  if (!APPLY) {
    console.log("\nсухой прогон. добавьте --apply, чтобы отправить в Sanity");
    return;
  }

  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mutations: documents.map(document => ({ createOrReplace: document }))
    })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json, null, 1));
  console.log(
    `\nготово: ${json.results?.length ?? 0} документов, режим — ${PUBLISH ? "опубликовано" : "черновики"}`
  );
};

run().catch(error => {
  console.error(error.message);
  process.exit(1);
});
