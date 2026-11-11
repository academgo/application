/**
 * Наполняет блок «Этапы работы» на главной и правит копирайтинг под
 * международную аудиторию.
 *
 *   node content/import/work-steps.mjs                     # сухой прогон
 *   node content/import/work-steps.mjs --apply             # записать в черновики
 *   node content/import/work-steps.mjs --apply --publish   # записать в живые документы
 *
 * Что делает:
 *   1. Пишет workSteps: заголовок и четыре шага с короткими текстами.
 *   2. Меняет principlesFinal — заголовок над блоком. Был «мы на месте,
 *      в Польше», стало про контроль процесса от подбора вуза до ВНЖ.
 *
 * Старые поля stepOne…stepFour не трогаются: они остаются в базе и спрятаны
 * в админке. Если новый блок не подойдёт, старые данные на месте.
 *
 * Тексты сокращены относительно прежних: блок задуман как инструкция, которую
 * прочитывают за полминуты. Длинные формулировки вроде «В первую очередь, нам
 * нужно понять вашу ситуацию и разработать стратегию поступления» свёрнуты до
 * сути. Полные прежние тексты — в stepOne…stepFour, оттуда их можно вернуть.
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
    principlesFinal:
      "Вам ни за что не придется переживать — мы контролируем процесс от подбора вуза до получения ВНЖ",
    heading: "4 шага до вашего зачисления (всю бюрократию берем на себя)",
    steps: [
      {
        number: "шаг 1",
        title: "Бесплатная консультация",
        icon: "chat",
        text: "Разбираем вашу ситуацию и собираем стратегию поступления. Вы задаёте вопросы и принимаете решение без спешки.",
        bullets: [
          "Подборка университетов под ваш запрос и бюджет",
          "Понятный порядок поступления и сумма оплат",
          "Список документов, которые понадобятся"
        ],
        buttonText: "Начать первый шаг в Telegram",
        buttonLink: "https://t.me/infoacademgo"
      },
      {
        number: "шаг 2",
        title: "Договор и оплата",
        icon: "document",
        text: "Определились с университетом — высылаем договор и начинаем готовить документы.",
        bullets: [
          "Гарантируем поступление или возвращаем деньги",
          "Форс-мажор с вашими документами берём на себя"
        ]
      },
      {
        number: "шаг 3",
        title: "Поступление",
        icon: "diploma",
        text: "Подаём документы и доводим до зачисления.",
        bullets: [
          "Регистрируем в системе вуза и заполняем анкеты",
          "Отправляем пакет документов и следим за статусом",
          "Присылаем письмо-приглашение для студенческой визы"
        ]
      },
      {
        number: "шаг 4",
        title: "Виза и ВНЖ",
        icon: "passport",
        text: "Доводим до паспорта с визой на руках, а дальше помогаем получить студенческий ВНЖ.",
        bullets: [
          "Готовим пакет документов на визу",
          "Записываем на подачу в консульство страны назначения",
          "Остаёмся на связи до получения визы",
          "Помогаем подать на ВНЖ на месте"
        ]
      }
    ]
  },

  en: {
    principlesFinal:
      "You will have nothing to worry about — we run the process from choosing a university to your residence permit",
    heading:
      "4 steps to your admission (we handle all the paperwork)",
    steps: [
      {
        number: "step 1",
        title: "Free consultation",
        icon: "chat",
        text: "We go through your situation and build an admission plan. You ask questions and decide without being rushed.",
        bullets: [
          "A shortlist of universities for your goals and budget",
          "A clear admission order and what it costs",
          "The list of documents you will need"
        ],
        buttonText: "Take the first step in Telegram",
        buttonLink: "https://t.me/infoacademgo"
      },
      {
        number: "step 2",
        title: "Contract and payment",
        icon: "document",
        text: "Once the university is chosen, we send the contract and start preparing your documents.",
        bullets: [
          "Admission guaranteed or your money back",
          "Problems with your paperwork are ours to solve"
        ]
      },
      {
        number: "step 3",
        title: "Admission",
        icon: "diploma",
        text: "We submit everything and see it through to enrolment.",
        bullets: [
          "We register you with the university and fill in the forms",
          "We send the documents and track the status",
          "We send the invitation letter for your student visa"
        ]
      },
      {
        number: "step 4",
        title: "Visa and residence permit",
        icon: "passport",
        text: "We stay with you until the visa is in your passport, then help with the student residence permit.",
        bullets: [
          "We prepare the visa documents",
          "We book your appointment at the destination country consulate",
          "We stay in touch until the visa is issued",
          "We help you apply for the residence permit on arrival"
        ]
      }
    ]
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
    '*[_type == "homepage"]{_id, language, principlesFinal, "шагов": count(workSteps.steps)}'
  );
  const { result: homepages } = await api(
    `/data/query/${DATASET}?query=${query}`
  );

  const mutations = [];
  const plan = [];

  for (const home of homepages) {
    const content = CONTENT[home.language];

    if (!content) {
      console.warn(`Пропускаю ${home._id}: язык «${home.language}» не знаю`);
      continue;
    }

    const id = PUBLISH ? liveId(home._id) : home._id;

    mutations.push({
      patch: {
        id,
        set: {
          principlesFinal: content.principlesFinal,
          workSteps: {
            _type: "workStepsBlock",
            heading: content.heading,
            steps: content.steps.map(step => ({
              _key: key(),
              _type: "workStep",
              ...step
            }))
          }
        }
      }
    });

    plan.push(
      `${id} (${home.language})\n` +
        `      заголовок над блоком\n` +
        `        было:  ${home.principlesFinal}\n` +
        `        стало: ${content.principlesFinal}\n` +
        `      заголовок блока: ${content.heading}\n` +
        `      шагов сейчас: ${home["шагов"] || 0} → ${content.steps.length}\n` +
        content.steps
          .map(
            step =>
              `        ${step.number} · ${step.title} · иконка «${step.icon}»` +
              (step.buttonText ? `\n          кнопка: ${step.buttonText}` : "")
          )
          .join("\n")
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
