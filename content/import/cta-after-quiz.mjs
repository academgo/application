/**
 * Создаёт документы «Плашка в мессенджер» (ru и en) и ставит их на главную
 * сразу после квиза.
 *
 *   node content/import/cta-after-quiz.mjs                     # сухой прогон
 *   node content/import/cta-after-quiz.mjs --apply             # записать в черновики
 *   node content/import/cta-after-quiz.mjs --apply --publish   # записать в живые документы
 *
 * Главная ищется по типу и языку, а не по захардкоженному id.
 *
 * Языковые версии документов между собой скрипт не связывает: сайту это не
 * нужно, он берёт плашку по ссылке с главной своего языка. Связать их в
 * админке можно потом, кнопкой переключения языка в самом документе.
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

/** Черновик и опубликованный документ отличаются префиксом drafts. */
const liveId = id => id.replace(/^drafts\./, "");

// ------------------------------------------------------------------ тексты

const DOCS = {
  ru: {
    id: "cta-after-quiz-ru",
    title: "Плашка после квиза, RU",
    eyebrow: "Остался один шаг",
    heading: "Ваша персональная подборка готова",
    description:
      "Пришлём список вузов под ваш бюджет и бесплатный гайд по студенческой визе. Заберите результат в Telegram.",
    mode: "telegram",
    telegramLabel: "Получить результат в Telegram",
    telegramLink: "https://t.me/infoacademgo",
    note: "Отвечаем в течение рабочего дня",
    showSocials: true
  },
  en: {
    id: "cta-after-quiz-en",
    title: "Плашка после квиза, EN",
    eyebrow: "One step left",
    heading: "Your personal shortlist is ready",
    description:
      "We will send the universities that fit your budget and a free student visa guide. Pick up your result in Telegram.",
    mode: "telegram",
    telegramLabel: "Get your result in Telegram",
    telegramLink: "https://t.me/infoacademgo",
    note: "We reply within one business day",
    showSocials: true
  }
};

// ------------------------------------------------------------------ доступ

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

// -------------------------------------------------------------------- ход

const main = async () => {
  if (!token()) {
    console.error(
      "Не найден токен записи. Положи SANITY_API_WRITE_TOKEN в .env.local"
    );
    process.exit(1);
  }

  const homeQuery = encodeURIComponent(
    '*[_type == "homepage"]{_id, language, "cta": ctaDocument._ref}'
  );
  const { result: homepages } = await api(
    `/data/query/${DATASET}?query=${homeQuery}`
  );

  const mutations = [];
  const plan = [];

  for (const [lang, doc] of Object.entries(DOCS)) {
    const docId = PUBLISH ? doc.id : `drafts.${doc.id}`;

    mutations.push({
      createOrReplace: {
        _id: docId,
        _type: "ctaDocument",
        language: lang,
        title: doc.title,
        eyebrow: doc.eyebrow,
        heading: doc.heading,
        description: doc.description,
        mode: doc.mode,
        telegramLabel: doc.telegramLabel,
        telegramLink: doc.telegramLink,
        note: doc.note,
        showSocials: doc.showSocials
      }
    });
    plan.push(`создать документ ${docId} — ${doc.title}`);

    // На главную ставим ссылку на живой документ: ссылаться на черновик нельзя
    const targets = homepages.filter(item => item.language === lang);

    if (!targets.length) {
      console.warn(`Не нашёл главную для языка ${lang} — ссылку не ставлю`);
      continue;
    }

    for (const home of targets) {
      const homeId = PUBLISH ? liveId(home._id) : home._id;
      mutations.push({
        patch: {
          id: homeId,
          set: {
            ctaDocument: {
              _type: "reference",
              _ref: doc.id
            }
          }
        }
      });
      plan.push(`привязать к главной ${homeId} (${lang})`);
    }
  }

  console.log(plan.map(line => `  • ${line}`).join("\n"));

  if (!APPLY) {
    console.log(
      "\nСухой прогон, ничего не записано. Добавь --apply, чтобы записать."
    );
    return;
  }

  await api(`/data/mutate/${DATASET}`, {
    method: "POST",
    body: JSON.stringify({ mutations })
  });

  console.log(
    PUBLISH
      ? "\nГотово, записано в живые документы."
      : "\nГотово, записано в черновики — опубликуй их в админке."
  );
};

main();
