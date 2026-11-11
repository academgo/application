/**
 * Сверяет слайдер видеоотзывов с роликами из блока «4 шага» на главной
 * и добавляет недостающие.
 *
 *   node content/import/video-reviews-add-steps.mjs                     # сухой прогон
 *   node content/import/video-reviews-add-steps.mjs --apply             # записать в черновики
 *   node content/import/video-reviews-add-steps.mjs --apply --publish   # записать в живые документы
 *
 * Сравнение идёт по videoId, поэтому повторный запуск ничего не дублирует.
 * У роликов из шагов нет даты и заголовка в том виде, в каком их ждёт слайдер:
 * подпись берётся из поля text самого ролика, дата остаётся пустой — слайд
 * без даты её просто не показывает.
 *
 * Добавленные ролики попадают в конец списка. Порядок потом правится в
 * админке перетаскиванием.
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

const STEPS = ["stepOne", "stepTwo", "stepThree", "stepFour"];

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

  const stepFields = STEPS.map(name => `"${name}": ${name}.video`).join(", ");

  const homeQuery = encodeURIComponent(
    `*[_type == "homepage"]{_id, language, ${stepFields},
       "reviewsRef": videoReviewsDocument._ref}`
  );
  const { result: homepages } = await api(
    `/data/query/${DATASET}?query=${homeQuery}`
  );

  const reviewsQuery = encodeURIComponent(
    '*[_type == "videoReviewsDocument"]{_id, language, title, videos}'
  );
  const { result: reviewDocs } = await api(
    `/data/query/${DATASET}?query=${reviewsQuery}`
  );

  const mutations = [];
  const plan = [];

  // Черновик и опубликованный — одно и то же, берём по одному разу
  const seen = new Set();
  const docs = [];
  for (const doc of reviewDocs) {
    const id = liveId(doc._id);
    if (seen.has(id)) continue;
    seen.add(id);
    docs.push({ ...doc, _id: PUBLISH ? id : doc._id });
  }

  for (const doc of docs) {
    const home = homepages.find(item => item.language === doc.language);

    if (!home) {
      console.warn(`Нет главной для языка ${doc.language} — пропускаю`);
      continue;
    }

    const existing = new Set((doc.videos || []).map(video => video.videoId));
    const toAdd = [];

    for (const name of STEPS) {
      const video = home[name];

      if (!video?.videoId) {
        plan.push(`${doc.language}: у ${name} нет ролика`);
        continue;
      }

      if (existing.has(video.videoId)) {
        plan.push(`${doc.language}: ${video.videoId} уже в слайдере`);
        continue;
      }

      existing.add(video.videoId);
      toAdd.push({
        _key: crypto.randomBytes(6).toString("hex"),
        _type: "videoItem",
        videoId: video.videoId,
        posterImage: video.posterImage,
        title: video.text || "",
        date: ""
      });
      plan.push(
        `${doc.language}: ДОБАВИТЬ ${video.videoId} — ${video.text || "без подписи"}`
      );
    }

    if (toAdd.length) {
      mutations.push({
        patch: {
          id: doc._id,
          set: { videos: [...(doc.videos || []), ...toAdd] }
        }
      });
    }
  }

  console.log(plan.map(line => `  • ${line}`).join("\n") || "  нечего делать");

  if (!mutations.length) {
    console.log("\nВсе ролики из шагов уже есть в слайдере, менять нечего.");
    return;
  }

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
