/**
 * Английская страница About по образцу русской «О нас».
 *
 *   node content/import/about-align-en.mjs                      # сухой прогон
 *   node content/import/about-align-en.mjs --apply              # в черновики
 *   node content/import/about-align-en.mjs --apply --publish    # сразу в живые
 *
 * Страницы разошлись в трёх местах. За образец взята русская:
 *
 *   1. На английской нет заголовка перед цифрами — добавляем.
 *   2. Раздел «What we say out loud» на английской лежит сплошным текстом,
 *      а на русской это блок с пятью пронумерованными карточками.
 *      Пересобираем его так же; карточки переведены с русских.
 *   3. На английской есть блок «How We Work: 5 Steps» — он рассказывает
 *      ровно то же, что новый блок шагов, который стоит сразу под ним.
 *      Убираем, чтобы шаги не шли дважды подряд.
 *   4. На английской после отзывов стоит квиз, на русской его нет. Убираем.
 *
 * Прежние блоки сохраняются в content/import/out перед заменой.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(__dirname, "out");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");
const PUBLISH = process.argv.includes("--publish");

const liveId = id => id.replace(/^drafts\./, "");
const key = () => crypto.randomBytes(6).toString("hex");

/** Абзац или заголовок в формате Sanity */
const para = (text, style = "normal") => ({
  _key: key(),
  _type: "block",
  style,
  markDefs: [],
  children: [{ _key: key(), _type: "span", text, marks: [] }]
});

/** Заголовок перед блоком с цифрами — перевод русского */
const NUMBERS_HEADING =
  "AcademGo in numbers: why students trust us with their future";

/**
 * Раздел «О чём мы говорим прямо» по-английски. Карточки переведены
 * с русских один в один, формулировки по стране взяты из текста,
 * который уже стоял на английской странице
 */
const HONESTY = {
  title: "What we say out loud",
  intro:
    "We do not sell a destination at any cost. For every country we check in advance the things agencies usually keep quiet about.",
  bullets: [
    {
      number: "1",
      sign: "We will say no if the odds are low",
      text: "The visa is issued by a consul, not by an agency. If a refusal is almost certain for your passport in that country, we say so straight away and suggest one where the route is open. Talking you out of paying us is a normal part of the job."
    },
    {
      number: "2",
      sign: "We name the full amount up front",
      text: "Besides our fee there are university fees, the consular fee, insurance and sworn translations. We count them together with you at the first consultation, so that nothing comes as a surprise later."
    },
    {
      number: "3",
      sign: "North Cyprus: the degree is recognised only by Türkiye",
      text: "It is the most affordable English-taught start, but in Europe the degree is not recognised directly. There is one working route: a programme from the register of the Turkish authority YÖK and legalisation through Turkish bodies. We say this before the first payment, not after graduation."
    },
    {
      number: "4",
      sign: "Georgia: medicine is recognised, but with an expiry date",
      text: "Accreditation of Georgian universities is recognised by the international WFME until November 2028, and is renewed after that. Practising medicine in Georgia itself requires the Georgian language — you study in English, but you do not treat patients in it."
    },
    {
      number: "5",
      sign: "Sometimes you do not need us",
      text: "METU in Türkiye and the University of Bologna in Italy do not work through agencies: you apply yourself. We can help with the documents, but we will not pretend that you cannot get there without us."
    }
  ]
};

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

/** Весь текст блока одной строкой — чтобы искать по содержимому */
const blockText = block =>
  JSON.stringify(block)
    .replace(/[^\p{L}\p{N} ]+/gu, " ")
    .replace(/\s+/g, " ");

const main = async () => {
  if (!token()) {
    console.error(
      "Не найден токен записи. Положи SANITY_API_WRITE_TOKEN в .env.local"
    );
    process.exit(1);
  }

  const { result: page } = await api(
    `/data/query/${DATASET}?query=${encodeURIComponent(
      '*[_type == "singlepage" && language == "en" && slug.en.current == "about-us"][0]{_id, title, contentBlocks}'
    )}`
  );

  if (!page) {
    console.log("Английская страница About не найдена");
    return;
  }

  const blocks = page.contentBlocks || [];
  console.log(`About (${liveId(page._id)}), блоков: ${blocks.length}`);

  fs.mkdirSync(OUT, { recursive: true });
  const backupFile = path.join(OUT, "about-en-backup.json");
  fs.writeFileSync(backupFile, JSON.stringify(blocks, null, 2), "utf8");
  console.log(`Прежний состав сохранён: ${backupFile}`);

  const next = [];
  let addedHeading = false;
  let replacedHonesty = false;
  let removedSteps = false;
  let removedSurvey = false;

  for (const block of blocks) {
    const text = blockText(block);

    // 1. заголовок перед цифрами
    if (block._type === "bulletsBlock" && !addedHeading) {
      next.push({
        _key: key(),
        _type: "textContent",
        content: [para(NUMBERS_HEADING, "h2")]
      });
      addedHeading = true;
      console.log(`  + заголовок перед цифрами: «${NUMBERS_HEADING}»`);
    }

    // 2. сплошной текст «What we say out loud» → блок с карточками
    if (
      block._type === "textContent" &&
      /What we say out loud/i.test(text) &&
      !replacedHonesty
    ) {
      next.push({
        _key: block._key,
        _type: "whiteBlock",
        title: HONESTY.title,
        text: [para(HONESTY.intro)],
        bullets: HONESTY.bullets.map(item => ({ _key: key(), ...item }))
      });
      replacedHonesty = true;
      console.log(
        `  ~ «What we say out loud»: сплошной текст → блок с ${HONESTY.bullets.length} карточками`
      );
      continue;
    }

    // 3. старый блок про пять шагов
    if (block._type === "whiteBlock" && /How We Work/i.test(text)) {
      removedSteps = true;
      console.log("  − блок «How We Work: 5 Steps» (дублирует блок шагов)");
      continue;
    }

    // 4. квиз
    if (block._type === "surveyBlock") {
      removedSurvey = true;
      console.log("  − квиз после отзывов (на русской его нет)");
      continue;
    }

    next.push(block);
  }

  const notes = [
    [addedHeading, "заголовок перед цифрами"],
    [replacedHonesty, "раздел «What we say out loud»"],
    [removedSteps, "блок «How We Work»"],
    [removedSurvey, "квиз"]
  ].filter(([done]) => !done);

  if (notes.length) {
    console.log(
      `\nНе найдено на странице: ${notes.map(([, name]) => name).join(", ")}`
    );
  }

  console.log(`\nСтанет блоков: ${next.length}`);

  if (!APPLY) {
    console.log("Сухой прогон. Чтобы записать — добавь --apply");
    return;
  }

  const target = PUBLISH ? liveId(page._id) : `drafts.${liveId(page._id)}`;

  if (!PUBLISH) {
    const { result: haveDraft } = await api(
      `/data/query/${DATASET}?query=${encodeURIComponent(
        "*[_id == $id][0]._id"
      )}&$id=${encodeURIComponent(JSON.stringify(target))}`
    );

    if (!haveDraft) {
      const { result: live } = await api(
        `/data/query/${DATASET}?query=${encodeURIComponent(
          "*[_id == $id][0]"
        )}&$id=${encodeURIComponent(JSON.stringify(liveId(page._id)))}`
      );

      console.log("Создаю черновик");
      await api(`/data/mutate/${DATASET}`, {
        method: "POST",
        body: JSON.stringify({
          mutations: [
            { createIfNotExists: { ...live, _id: target } }
          ]
        })
      });
    }
  }

  await api(`/data/mutate/${DATASET}`, {
    method: "POST",
    body: JSON.stringify({
      mutations: [{ patch: { id: target, set: { contentBlocks: next } } }]
    })
  });

  console.log(
    PUBLISH
      ? "\nГотово: записано в живые документы, изменения видны на сайте."
      : "\nГотово: записано в черновики. Опубликуй их в студии."
  );
};

main();
