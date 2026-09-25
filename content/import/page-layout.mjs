/**
 * Вёрстка новых страниц после импорта: две белые плашки вместо «простыни»
 * текста и блок заявки ближе к началу страницы.
 *
 *   node content/import/page-layout.mjs                       # сухой прогон
 *   node content/import/page-layout.mjs --only academgo.uae.visa.ru
 *   node content/import/page-layout.mjs --apply
 *
 * Запускать после import-to-sanity.mjs и скриптов перелинковки: импорт
 * перезаписывает документы целиком. Повторный запуск безопасен — страницы,
 * где плашки или блок заявки уже есть, пропускаются.
 *
 * 1. doubleTextBlock. Берётся секция textContent вида «H2 + обычные абзацы»
 *    (без списков и подзаголовков) с самым длинным текстом. Заголовок
 *    остаётся в textContent, абзацы делятся на две белые плашки поровну
 *    по объёму — как на старых страницах о Польше.
 * 2. offerBlock. Встаёт перед секцией с H2 примерно на трети страницы:
 *    квиз уже стоит посередине, лид-магнит и CTA — в конце, так заявка
 *    появляется раньше, чем читатель дойдёт до квиза.
 *
 * Меняются только черновики (drafts.academgo.*): основной сайт не затронут.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");
const ONLY = (() => {
  const index = process.argv.indexOf("--only");
  return index > -1 ? process.argv[index + 1] : null;
})();

// Секция уходит в плашки, только если в ней достаточно текста на две колонки
const MIN_SECTION_CHARS = 300;
// Блок заявки — примерно на трети страницы и не ближе двух блоков к квизу
const OFFER_POSITION = 1 / 3;
const OFFER_GAP_TO_SURVEY = 2;

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

// ------------------------------------------------------------ блок заявки

// Иконки мессенджеров — те же, что в блоке заявки на главной
const CONTACT_LINKS = [
  {
    title: "Whatsapp",
    icon: "image-86a70c8efc3b3954a8c2e2bda57335cb079f7618-50x50-svg",
    link: "https://api.whatsapp.com/send/?phone=48505118058&text&type=phone_number&app_absent=0"
  },
  {
    title: "Telegram",
    icon: "image-455b827805d80da9f4b3799d1ea6c1c89c59f476-50x50-svg",
    link: "https://t.me/infoacademgo"
  }
];

const OFFER_TEXT = {
  ru: {
    title: "Разберём ваш случай",
    titleHighlight: "на бесплатной консультации",
    text: "Подберём страну, вуз и программу под ваши документы и бюджет, объясним сроки подачи и визу.",
    offerDescription: "Все консультации проводим сами",
    offerButtonCustomText: "Оставить заявку",
    offerAltText: "или напишите нам"
  },
  en: {
    title: "Let's review your case",
    titleHighlight: "in a free consultation",
    text: "We will match a country, university and programme to your documents and budget, and explain deadlines and the visa.",
    offerDescription: "We run every consultation ourselves",
    offerButtonCustomText: "Send a request",
    offerAltText: "or message us"
  }
};

const paragraph = text => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }]
});

const offerBlock = lang => {
  const text = OFFER_TEXT[lang];

  return {
    _type: "offerBlock",
    _key: key(),
    title: text.title,
    titleHighlight: text.titleHighlight,
    blockContent: {
      _type: "blockContentWithStyle",
      content: [paragraph(text.text)]
    },
    offerDescription: text.offerDescription,
    offerButtonCustomText: text.offerButtonCustomText,
    offerAltText: text.offerAltText,
    offerContactLinks: CONTACT_LINKS.map(item => ({
      _key: key(),
      title: item.title,
      link: item.link,
      icon: {
        _type: "image",
        asset: { _type: "reference", _ref: item.icon }
      }
    }))
  };
};

// ------------------------------------------------------------ плашки

const textLength = block =>
  (block.children || []).map(child => child.text || "").join("").length;

const isPlainParagraph = block =>
  block._type === "block" && block.style === "normal" && !block.listItem;

// «H2 + только обычные абзацы, не меньше двух». Без H2 подходит только
// вводный текст — запасной вариант для страниц, где секций с H2 такого вида нет.
const sectionParagraphs = block => {
  if (block._type !== "textContent") return null;

  const content = block.content || [];
  const hasHeading = content[0]?._type === "block" && content[0].style === "h2";
  const heading = hasHeading ? content[0] : null;
  const paragraphs = hasHeading ? content.slice(1) : content;

  if (paragraphs.length < 2 || !paragraphs.every(isPlainParagraph)) return null;

  const [left, right] = splitEvenly(paragraphs);
  const sum = items => items.reduce((acc, item) => acc + textLength(item), 0);
  const total = sum(paragraphs);
  if (total < MIN_SECTION_CHARS) return null;

  // Две плашки смотрятся, когда обе заполнены: оцениваем по меньшей колонке
  return { heading, left, right, score: Math.min(sum(left), sum(right)) };
};

// Делим абзацы на две колонки так, чтобы объём текста был как можно ближе
const splitEvenly = paragraphs => {
  const lengths = paragraphs.map(textLength);
  const total = lengths.reduce((sum, item) => sum + item, 0);

  let best = 1;
  let bestDiff = Infinity;
  let left = 0;

  for (let index = 1; index < paragraphs.length; index++) {
    left += lengths[index - 1];
    const diff = Math.abs(total - 2 * left);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = index;
    }
  }

  return [paragraphs.slice(0, best), paragraphs.slice(best)];
};

const whiteCard = content => ({
  type: "text",
  blockContent: {
    _type: "blockContentWithStyle",
    backgroundColor: "#FFFFFF",
    content
  }
});

const addDoubleText = blocks => {
  if (blocks.some(block => block._type === "doubleTextBlock")) return null;

  // Секции с H2 важнее вводного текста, дальше — по заполненности колонок
  const rank = section => (section.heading ? 1e6 : 0) + section.score;

  let best = null;
  blocks.forEach((block, index) => {
    const section = sectionParagraphs(block);
    if (section && (!best || rank(section) > rank(best))) {
      best = { ...section, index };
    }
  });

  if (!best) return null;

  const source = blocks[best.index];
  const { heading, left, right } = best;

  const cards = {
    _type: "doubleTextBlock",
    _key: key(),
    leftContent: whiteCard(left),
    rightContent: whiteCard(right),
    marginBottom: source.marginBottom || "small"
  };

  const next = [...blocks];
  next.splice(
    best.index,
    1,
    ...(heading
      ? [{ ...source, content: [heading], marginBottom: "small" }, cards]
      : [cards])
  );

  const title = heading
    ? `«${heading.children.map(child => child.text).join("")}»`
    : "вводный текст";

  return {
    blocks: next,
    note: `плашки: ${title} (${left.length}+${right.length} абз.)`
  };
};

// ------------------------------------------------------------ место заявки

const startsSection = block =>
  block._type === "textContent" && block.content?.[0]?.style === "h2";

const addOffer = (blocks, lang) => {
  if (blocks.some(block => block._type === "offerBlock")) return null;

  const surveyIndex = blocks.findIndex(block => block._type === "surveyBlock");
  const target = Math.round(blocks.length * OFFER_POSITION);
  const limit =
    surveyIndex > -1 ? surveyIndex - OFFER_GAP_TO_SURVEY : blocks.length - 1;

  // Вставляем перед началом секции: не разрываем текст с его таблицей/списком
  const candidates = blocks
    .map((block, index) => index)
    .filter(index => index >= 2 && index <= limit && startsSection(blocks[index]));

  if (!candidates.length) return null;

  const position = candidates.reduce((bestIndex, index) =>
    Math.abs(index - target) < Math.abs(bestIndex - target) ? index : bestIndex
  );

  const next = [...blocks];
  next.splice(position, 0, offerBlock(lang));

  return {
    blocks: next,
    note: `заявка: блок ${position + 1} из ${next.length}${surveyIndex > -1 ? `, квиз — ${surveyIndex + 2}` : ""}`
  };
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

  const filter = ONLY
    ? `_id == "drafts.${ONLY}"`
    : `_id in path("drafts.academgo.**") && _type in ["subpage", "singlepage"]`;
  const params = new URLSearchParams({
    perspective: "raw",
    query: `*[${filter}]{_id, _rev, language, contentBlocks}`
  });
  const { result: pages } = await api(`query/${DATASET}?${params}`);

  const mutations = [];
  const skipped = { doubleText: [], offer: [] };

  for (const page of pages) {
    let blocks = page.contentBlocks || [];
    const notes = [];

    const doubleText = addDoubleText(blocks);
    if (doubleText) {
      blocks = doubleText.blocks;
      notes.push(doubleText.note);
    } else if (!blocks.some(block => block._type === "doubleTextBlock")) {
      skipped.doubleText.push(page._id);
    }

    const offer = addOffer(blocks, page.language === "en" ? "en" : "ru");
    if (offer) {
      blocks = offer.blocks;
      notes.push(offer.note);
    } else if (!blocks.some(block => block._type === "offerBlock")) {
      skipped.offer.push(page._id);
    }

    if (!notes.length) continue;

    console.log(`${page._id}\n  ${notes.join("\n  ")}`);
    mutations.push({
      patch: { id: page._id, ifRevisionID: page._rev, set: { contentBlocks: blocks } }
    });
  }

  console.log(`\nСтраниц: ${pages.length}, меняется: ${mutations.length}`);
  if (skipped.doubleText.length) {
    console.log(`Без подходящей секции для плашек: ${skipped.doubleText.join(", ")}`);
  }
  if (skipped.offer.length) {
    console.log(`Не нашлось места для заявки: ${skipped.offer.join(", ")}`);
  }

  if (!APPLY) {
    console.log("\nСухой прогон. Для записи: --apply");
    return;
  }

  for (let index = 0; index < mutations.length; index += 50) {
    await api(`mutate/${DATASET}`, { mutations: mutations.slice(index, index + 50) });
  }
  console.log(`Записано: ${mutations.length}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
