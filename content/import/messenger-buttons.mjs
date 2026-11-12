/**
 * Включает две кнопки — Telegram и WhatsApp — в плашке мессенджера:
 * и в отдельной секции, и на финальном экране квиза.
 *
 *   node content/import/messenger-buttons.mjs                     # сухой прогон
 *   node content/import/messenger-buttons.mjs --apply             # записать в черновики
 *   node content/import/messenger-buttons.mjs --apply --publish   # записать в живые документы
 *
 * Адрес WhatsApp взят с кнопки в шапке сайта: в контактах футера ватсапа нет,
 * поэтому подставить его оттуда было нельзя.
 *
 * Уже заполненные подписи и ссылки не трогаются — скрипт дописывает только
 * пустые поля, а режим кнопок переключает на «обе».
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

const WHATSAPP_LINK = "https://wa.me/message/5EJRNM3WEDXAC1";

const LABELS = {
  cta: {
    ru: "Получить результат в WhatsApp",
    en: "Get your result on WhatsApp"
  },
  quiz: {
    ru: "Написать в WhatsApp",
    en: "Message us on WhatsApp"
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

  const ctaQuery = encodeURIComponent(
    '*[_type == "ctaDocument"]{_id, language, title, mode, whatsappLabel, whatsappLink}'
  );
  const quizQuery = encodeURIComponent(
    `*[_type == "quizDocument"]{_id, language, title,
       "mode": quiz.finalMode, "label": quiz.whatsappLabel, "link": quiz.whatsappLink}`
  );

  const [{ result: ctas }, { result: quizzes }] = await Promise.all([
    api(`/data/query/${DATASET}?query=${ctaQuery}`),
    api(`/data/query/${DATASET}?query=${quizQuery}`)
  ]);

  const dedupe = list => {
    const seen = new Set();
    const out = [];
    for (const doc of list) {
      const id = liveId(doc._id);
      if (seen.has(id)) continue;
      seen.add(id);
      out.push({ ...doc, _id: PUBLISH ? id : doc._id });
    }
    return out;
  };

  const mutations = [];
  const plan = [];

  for (const doc of dedupe(ctas)) {
    const set = {};
    if (doc.mode !== "both") set.mode = "both";
    if (!doc.whatsappLabel) set.whatsappLabel = LABELS.cta[doc.language];
    if (!doc.whatsappLink) set.whatsappLink = WHATSAPP_LINK;

    if (Object.keys(set).length) {
      mutations.push({ patch: { id: doc._id, set } });
      plan.push(
        `${doc.title || doc._id} (${doc.language})\n` +
          Object.entries(set)
            .map(([k, v]) => `        ${k}: ${v}`)
            .join("\n")
      );
    } else {
      plan.push(`${doc.title || doc._id} (${doc.language}): уже настроено`);
    }
  }

  for (const doc of dedupe(quizzes)) {
    const set = {};
    if (doc.mode !== "both") set["quiz.finalMode"] = "both";
    if (!doc.label) set["quiz.whatsappLabel"] = LABELS.quiz[doc.language];
    if (!doc.link) set["quiz.whatsappLink"] = WHATSAPP_LINK;

    if (Object.keys(set).length) {
      mutations.push({ patch: { id: doc._id, set } });
      plan.push(
        `${doc.title || doc._id} (${doc.language}), финальный экран квиза\n` +
          Object.entries(set)
            .map(([k, v]) => `        ${k}: ${v}`)
            .join("\n")
      );
    } else {
      plan.push(`${doc.title || doc._id} (${doc.language}): уже настроено`);
    }
  }

  console.log(plan.map(line => `  • ${line}`).join("\n\n") || "  нечего делать");

  if (!mutations.length) return;

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
