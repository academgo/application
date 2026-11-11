/**
 * Правит тексты панели рядом с квизом в обеих локалях.
 *
 *   node content/import/quiz-sidebar-texts.mjs                     # сухой прогон
 *   node content/import/quiz-sidebar-texts.mjs --apply             # записать в черновики
 *   node content/import/quiz-sidebar-texts.mjs --apply --publish   # записать в живые документы
 *
 * Две правки:
 *   1. Пункт про ответ в WhatsApp на номер из анкеты. Номер в анкете больше не
 *      спрашивается — обещание стало неправдой. Меняем на ответ в Telegram.
 *   2. Строка «5 вопросов · около 2 минут» с написанным руками числом. Ставим
 *      подстановки {questions} и {minutes} — дальше строка считается сама по
 *      числу вопросов в квизе и врать при их изменении больше не будет.
 *
 * Пункт ищется по содержимому, а не по номеру: если его уже поправили руками,
 * скрипт честно скажет, что менять нечего, и ничего не тронет.
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

// ------------------------------------------------------------------ тексты

const TEXTS = {
  ru: {
    bullet: "Ответ в Telegram сразу после анкеты",
    meta: "{questions} · около {minutes} · бесплатно"
  },
  en: {
    bullet: "Sent straight to your Telegram after the quiz",
    meta: "{questions} · about {minutes} · free"
  }
};

/** Пункт про телефон: ищем по упоминанию мессенджера и номера */
const isPhonePromise = text =>
  /whatsapp|ватсап/i.test(text || "") && /номер|number/i.test(text || "");

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

  const query = encodeURIComponent(
    '*[_type == "quizDocument"]{_id, language, title, "bullets": sidebar.bullets, "meta": sidebar.meta}'
  );
  const { result: docs } = await api(`/data/query/${DATASET}?query=${query}`);

  // Черновик и опубликованный документ — одно и то же, берём по одному разу
  const seen = new Set();
  const unique = [];
  for (const doc of docs) {
    const id = liveId(doc._id);
    if (seen.has(id)) continue;
    seen.add(id);
    unique.push({ ...doc, _id: PUBLISH ? id : doc._id });
  }

  const mutations = [];
  const plan = [];

  for (const doc of unique) {
    const texts = TEXTS[doc.language];

    if (!texts) {
      console.warn(`Пропускаю ${doc._id}: язык «${doc.language}» не знаю`);
      continue;
    }

    const set = {};

    const bullets = doc.bullets || [];
    const index = bullets.findIndex(isPhonePromise);

    if (index >= 0) {
      const next = [...bullets];
      next[index] = texts.bullet;
      set["sidebar.bullets"] = next;
      plan.push(
        `${doc._id} (${doc.language}): пункт ${index + 1}\n      было: ${bullets[index]}\n      стало: ${texts.bullet}`
      );
    } else {
      plan.push(`${doc._id} (${doc.language}): пункта про номер нет, не трогаю`);
    }

    if (doc.meta !== texts.meta) {
      set["sidebar.meta"] = texts.meta;
      plan.push(
        `${doc._id} (${doc.language}): строка под заголовком\n      было: ${doc.meta || "—"}\n      стало: ${texts.meta}`
      );
    }

    if (Object.keys(set).length) {
      mutations.push({ patch: { id: doc._id, set } });
    }
  }

  console.log(plan.map(line => `  • ${line}`).join("\n") || "  нечего менять");

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
