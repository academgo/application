/**
 * Создаёт документы «Видеоотзывы» (ru и en) и ставит их на главную сразу после
 * плашки с кнопкой в мессенджер.
 *
 *   node content/import/video-reviews.mjs                     # сухой прогон
 *   node content/import/video-reviews.mjs --apply             # записать в черновики
 *   node content/import/video-reviews.mjs --apply --publish   # записать в живые документы
 *
 * Видео не придумываются, а переносятся как есть со страницы «О нас»
 * (/ru/o-nas и /about-us): берётся блок видео из её конструктора. Ссылки на
 * картинки-обложки копируются вместе с роликами, перезаливать ничего не надо.
 *
 * Если на странице несколько блоков видео, берётся первый. Если ни одного —
 * скрипт честно скажет и ничего не запишет.
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

const DOCS = {
  ru: {
    id: "video-reviews-ru",
    title: "Видеоотзывы, RU",
    heading: "Послушайте тех, кто уже получил визу и переехал",
    slug: "o-nas"
  },
  en: {
    id: "video-reviews-en",
    title: "Видеоотзывы, EN",
    heading: "Hear from those who already got their visa and moved",
    slug: "about-us"
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

  // Страницу «О нас» ищем по слагу нужного языка и забираем блоки видео
  const pagesQuery = encodeURIComponent(
    `*[_type == "singlepage"]{
       _id, language,
       "ruSlug": slug.ru.current,
       "enSlug": slug.en.current,
       "videoBlocks": contentBlocks[_type == "videosBlock"]{videosTitle, videos}
     }`
  );
  const { result: pages } = await api(
    `/data/query/${DATASET}?query=${pagesQuery}`
  );

  const homeQuery = encodeURIComponent(
    '*[_type == "homepage"]{_id, language}'
  );
  const { result: homepages } = await api(
    `/data/query/${DATASET}?query=${homeQuery}`
  );

  const mutations = [];
  const plan = [];

  for (const [lang, doc] of Object.entries(DOCS)) {
    const page = pages.find(
      item =>
        item.language === lang &&
        (lang === "ru" ? item.ruSlug : item.enSlug) === doc.slug
    );

    if (!page) {
      console.warn(`Не нашёл страницу «${doc.slug}» на языке ${lang}`);
      continue;
    }

    const videos = page.videoBlocks?.[0]?.videos || [];

    if (!videos.length) {
      console.warn(
        `На странице «${doc.slug}» (${lang}) нет блока видео — пропускаю`
      );
      continue;
    }

    const docId = PUBLISH ? doc.id : `drafts.${doc.id}`;

    mutations.push({
      createOrReplace: {
        _id: docId,
        _type: "videoReviewsDocument",
        language: lang,
        title: doc.title,
        heading: doc.heading,
        videos
      }
    });

    plan.push(
      `${docId}: ${videos.length} видео со страницы «${doc.slug}»\n` +
        videos
          .map(video => `        — ${video.title || video.videoId}`)
          .join("\n")
    );

    for (const home of homepages.filter(item => item.language === lang)) {
      const homeId = PUBLISH ? liveId(home._id) : home._id;
      mutations.push({
        patch: {
          id: homeId,
          set: {
            videoReviewsDocument: { _type: "reference", _ref: doc.id }
          }
        }
      });
      plan.push(`привязать к главной ${homeId} (${lang})`);
    }
  }

  console.log(plan.map(line => `  • ${line}`).join("\n") || "  нечего делать");

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
