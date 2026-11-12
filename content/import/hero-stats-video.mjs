/**
 * Наполняет новый первый экран: цифры под кнопками и кнопку с видео в попапе.
 *
 *   node content/import/hero-stats-video.mjs                     # сухой прогон
 *   node content/import/hero-stats-video.mjs --apply             # записать в черновики
 *   node content/import/hero-stats-video.mjs --apply --publish   # записать в живые документы
 *
 * Поля, которые пишутся:
 *   heroStats — массив из четырёх пар «значение + подпись»;
 *   heroVideo — id ролика на YouTube, секунда старта и текст кнопки.
 *
 * Цифры взяты из того, что уже заявлено на самом сайте, ничего нового
 * не придумано:
 *   176        — счётчик в блоке «Принципы работы»: «176 ребят поступили
 *                в Польшу с нашей помощью». Это только Польша. Если есть
 *                общее число по всем десяти странам, замени и значение,
 *                и подпись.
 *   10         — блок «Условия»: «Мы работаем с десятью странами».
 *   8 лет      — единственная спорная строка. На сайте есть фраза
 *                «8 лет назад мы тоже были на месте абитуриентов», то есть
 *                это срок с момента их собственного поступления, а не
 *                возраст компании. Проверь и поправь, если расходится.
 *   от €160    — карточка Италии: «от €160 в год в госвузах».
 *
 * Прежние поля первого экрана не трогаются: description стал надзаголовком,
 * descriptionSmall — абзацем под заголовком, heroTitle и heroDescription
 * ушли подписью к бегущей строке со странами. Всё это читается из тех же
 * полей, что и раньше, менять их в админке не нужно.
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

// https://www.youtube.com/watch?v=eYt6LRvD0QA&t=183s
const VIDEO_ID = "eYt6LRvD0QA";
const VIDEO_START = 183;

const CONTENT = {
  ru: {
    stats: [
      { value: "176", label: "ребят поступили в Польшу" },
      { value: "10", label: "стран на выбор" },
      { value: "8 лет", label: "в поступлении за рубеж" },
      { value: "от €160", label: "в год обучения в Италии" }
    ],
    video: {
      buttonText: "Как мы работаем",
      title: "Как мы работаем — видео о поступлении"
    }
  },
  en: {
    stats: [
      { value: "176", label: "students enrolled in Poland" },
      { value: "10", label: "countries to choose from" },
      { value: "8 years", label: "of helping students apply abroad" },
      { value: "from €160", label: "a year to study in Italy" }
    ],
    video: {
      buttonText: "How we work",
      title: "How we work — a video about applying"
    }
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
    '*[_type == "homepage"]{_id, language, heroTitle, heroButtonText, "цифр сейчас": count(heroStats)}'
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
          heroStats: content.stats.map(stat => ({ _key: key(), ...stat })),
          heroVideo: {
            _type: "object",
            buttonText: content.video.buttonText,
            videoId: VIDEO_ID,
            startSeconds: VIDEO_START,
            title: content.video.title
          }
        }
      }
    });

    plan.push(
      `${id} (${home.language})\n` +
        `      цифр было: ${home["цифр сейчас"] || 0} → ${content.stats.length}\n` +
        content.stats
          .map(stat => `        ${stat.value} — ${stat.label}`)
          .join("\n") +
        `\n      кнопка видео: ${content.video.buttonText}\n` +
        `      ролик: ${VIDEO_ID}, старт с ${VIDEO_START} сек`
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
