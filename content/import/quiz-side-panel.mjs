/**
 * Панель справа от квиза: «Что придёт в ответ».
 *
 *   node content/import/quiz-side-panel.mjs                     # сухой прогон
 *   node content/import/quiz-side-panel.mjs --apply             # записать в черновики
 *   node content/import/quiz-side-panel.mjs --apply --publish   # записать в живые документы
 *
 * Пишет quiz.sidePanelTitle, quiz.sidePanelItems и quiz.sidePanelNote в
 * документах quizDocument. Пока заголовок или пункты пустые, панель не
 * выводится и квиз стоит по центру, как раньше.
 *
 * Тексты не новые: они собраны из того, что уже обещает финальный экран
 * квиза («Пришлём список вузов под ваш бюджет и бесплатный гайд по
 * студенческой визе», «Отвечаем в течение рабочего дня») и блок «Этапы
 * работы» («Понятный порядок поступления и сумма оплат»). Смысл панели в
 * том, чтобы человек увидел это до первого вопроса, а не после пятого.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");
const PUBLISH = process.argv.includes("--publish");

const liveId = id => id.replace(/^drafts\./, "");
const key = () => crypto.randomBytes(6).toString("hex");

// ------------------------------------------------------------------ тексты

const CONTENT = {
  ru: {
    title: "Что придёт в ответ",
    items: [
      {
        title: "Подборка университетов",
        text: "под вашу программу и бюджет"
      },
      {
        title: "Порядок поступления",
        text: "сроки, документы и суммы оплат"
      },
      {
        title: "Гайд по студенческой визе",
        text: "что собирать и в каком порядке"
      }
    ],
    note: "Отвечаем в течение рабочего дня"
  },
  en: {
    title: "What you get back",
    items: [
      {
        title: "A shortlist of universities",
        text: "matched to your programme and budget"
      },
      {
        title: "The application timeline",
        text: "deadlines, documents and what it costs"
      },
      {
        title: "A student visa guide",
        text: "what to prepare and in what order"
      }
    ],
    note: "We reply within one working day"
  }
};

// ------------------------------------------------------------------ Sanity

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

  const query = encodeURIComponent(
    '*[_type == "quizDocument"]{_id, language, title, "панельБыла": quiz.sidePanelTitle}'
  );
  const { result: docs } = await api(`/data/query/${DATASET}?query=${query}`);

  const mutations = [];
  const plan = [];

  for (const doc of docs) {
    const content = CONTENT[doc.language];

    if (!content) {
      console.warn(`Пропускаю ${doc._id}: язык «${doc.language}» не знаю`);
      continue;
    }

    const id = PUBLISH ? liveId(doc._id) : doc._id;

    mutations.push({
      patch: {
        id,
        set: {
          "quiz.sidePanelTitle": content.title,
          "quiz.sidePanelItems": content.items.map(item => ({
            _key: key(),
            ...item
          })),
          "quiz.sidePanelNote": content.note
        }
      }
    });

    plan.push(
      `${id} (${doc.language})\n` +
        `      было: ${doc["панельБыла"] || "— панели не было"}\n` +
        `      стало: ${content.title}\n` +
        content.items
          .map((item, i) => `        ${i + 1}. ${item.title} — ${item.text}`)
          .join("\n") +
        `\n      подпись: ${content.note}`
    );
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
