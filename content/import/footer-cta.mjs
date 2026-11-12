/**
 * Создаёт документы «Плашка в футере» (ru и en) и ставит их над футером
 * вместо блока с формой заявки.
 *
 *   node content/import/footer-cta.mjs                     # сухой прогон
 *   node content/import/footer-cta.mjs --apply             # записать в черновики
 *   node content/import/footer-cta.mjs --apply --publish   # записать в живые документы
 *
 * Старый блок с формой (consultationBlock) остаётся в документе футера нетронутым.
 * Пока ссылка на плашку не проставлена, показывается он; как только проставлена —
 * плашка. Чтобы вернуть форму, достаточно очистить ссылку в админке.
 *
 * Тексты взяты по смыслу прежнего блока — бесплатная консультация, подбор
 * университета, документы и виза, — но без обещания гайда по Польше: сайт
 * переупакован под десять стран, и обещание про одну из них тут не к месту.
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

const TELEGRAM = "https://t.me/infoacademgo";
const WHATSAPP = "https://wa.me/message/5EJRNM3WEDXAC1";

const DOCS = {
  ru: {
    id: "cta-footer-ru",
    title: "Плашка в футере, RU",
    eyebrow: "Бесплатная консультация",
    heading: "Остались вопросы? Напишите нам",
    description:
      "Подберём университет и специальность, расскажем про документы и визу. Отвечаем в мессенджере — без звонков и анкет.",
    mode: "both",
    telegramLabel: "Написать в Telegram",
    whatsappLabel: "Написать в WhatsApp",
    note: "Отвечаем в течение рабочего дня",
    showSocials: true
  },
  en: {
    id: "cta-footer-en",
    title: "Плашка в футере, EN",
    eyebrow: "Free consultation",
    heading: "Still have questions? Message us",
    description:
      "We will help you pick a university and a programme and walk you through the documents and the visa. We reply in your messenger — no calls, no forms.",
    mode: "both",
    telegramLabel: "Message us on Telegram",
    whatsappLabel: "Message us on WhatsApp",
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

  const query = encodeURIComponent(
    '*[_type == "footer"]{_id, language, "cta": ctaDocument._ref, "oldTitle": consultationBlock.title}'
  );
  const { result: footers } = await api(`/data/query/${DATASET}?query=${query}`);

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
        telegramLink: TELEGRAM,
        whatsappLabel: doc.whatsappLabel,
        whatsappLink: WHATSAPP,
        note: doc.note,
        showSocials: doc.showSocials
      }
    });

    plan.push(
      `создать ${docId}\n` +
        `        надзаголовок: ${doc.eyebrow}\n` +
        `        заголовок:    ${doc.heading}\n` +
        `        кнопки:       ${doc.telegramLabel} · ${doc.whatsappLabel}`
    );

    const targets = footers.filter(item => item.language === lang);

    if (!targets.length) {
      console.warn(`Не нашёл футер для языка ${lang} — ссылку не ставлю`);
      continue;
    }

    for (const footer of targets) {
      const id = PUBLISH ? liveId(footer._id) : footer._id;
      mutations.push({
        patch: {
          id,
          set: { ctaDocument: { _type: "reference", _ref: doc.id } }
        }
      });
      plan.push(
        `привязать к футеру ${id} (${lang})\n` +
          `        вместо блока «${footer.oldTitle || "без заголовка"}» — он остаётся в документе`
      );
    }
  }

  console.log(plan.map(line => `  • ${line}`).join("\n\n") || "  нечего делать");

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
