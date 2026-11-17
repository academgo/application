/**
 * Блок «Этапы работы» на страницах «О нас» и About.
 *
 *   node content/import/about-work-steps.mjs                      # сухой прогон
 *   node content/import/about-work-steps.mjs --apply              # в черновики
 *   node content/import/about-work-steps.mjs --apply --publish    # сразу в живые
 *
 * Вставляет блок между «О чём мы говорим прямо» (whiteBlock) и отзывами
 * (videosBlock), на обоих языках.
 *
 * Шаги в блок не записываются намеренно: пустой блок берёт их с главной
 * страницы того же языка. Текст шагов остаётся в одном месте — поправили
 * на главной, поменялось везде. Если на какой-то странице понадобятся
 * свои шаги, их можно заполнить прямо в блоке, и он перестанет смотреть
 * на главную.
 *
 * Повторный запуск безопасен: если блок на странице уже есть, она
 * пропускается.
 */

import crypto from "node:crypto";
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
const key = () => crypto.randomBytes(6).toString("hex");

/** Страницы: язык → слаг */
const PAGES = { ru: "o-nas", en: "about-us" };

/** Перед блоком какого типа вставляем */
const BEFORE_TYPE = "videosBlock";

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

const main = async () => {
  if (!token()) {
    console.error(
      "Не найден токен записи. Положи SANITY_API_WRITE_TOKEN в .env.local"
    );
    process.exit(1);
  }

  const target = id => (PUBLISH ? id : `drafts.${id}`);
  const mutations = [];

  for (const [lang, slug] of Object.entries(PAGES)) {
    const query = encodeURIComponent(
      `*[_type == "singlepage" && language == "${lang}" && slug.${lang}.current == $slug][0]{
        _id,
        title,
        "blocks": contentBlocks[]{_key, _type}
      }`
    );
    const params = encodeURIComponent(JSON.stringify(slug));
    const { result: page } = await api(
      `/data/query/${DATASET}?query=${query}&$slug=${params}`
    );

    if (!page) {
      console.log(`\n${lang}: страница /${slug} не найдена`);
      continue;
    }

    const blocks = page.blocks || [];
    console.log(`\n${lang}: ${page.title} (${liveId(page._id)})`);
    console.log(`  блоков: ${blocks.length}`);

    if (blocks.some(block => block._type === "workStepsBlock")) {
      console.log("  блок «Этапы работы» уже есть — пропускаю");
      continue;
    }

    const anchor = blocks.find(block => block._type === BEFORE_TYPE);

    if (!anchor) {
      console.log(
        `  не найден блок ${BEFORE_TYPE}, перед которым вставлять — пропускаю`
      );
      continue;
    }

    const at = blocks.indexOf(anchor);
    console.log(
      `  вставляю после «${blocks[at - 1]?._type || "начала"}» и перед «${BEFORE_TYPE}» (позиция ${at + 1} из ${blocks.length + 1})`
    );

    mutations.push({
      patch: {
        id: target(liveId(page._id)),
        insert: {
          before: `contentBlocks[_key=="${anchor._key}"]`,
          items: [{ _key: key(), _type: "workStepsBlock" }]
        }
      }
    });
  }

  console.log(`\nМутаций: ${mutations.length}`);

  if (!mutations.length) return;

  if (!APPLY) {
    console.log("Сухой прогон. Чтобы записать — добавь --apply");
    return;
  }

  // Патч не создаёт документ: если черновика нет, сначала клонируем живой
  if (!PUBLISH) {
    const draftIds = [...new Set(mutations.map(m => m.patch.id))];
    const existing = encodeURIComponent("*[_id in $ids]._id");
    const existingParams = encodeURIComponent(JSON.stringify(draftIds));
    const { result: haveDraft } = await api(
      `/data/query/${DATASET}?query=${existing}&$ids=${existingParams}`
    );

    const needClone = draftIds.filter(id => !(haveDraft || []).includes(id));

    if (needClone.length) {
      const liveQuery = encodeURIComponent("*[_id in $ids]");
      const liveParams = encodeURIComponent(
        JSON.stringify(needClone.map(liveId))
      );
      const { result: live } = await api(
        `/data/query/${DATASET}?query=${liveQuery}&$ids=${liveParams}`
      );

      const clones = (live || []).map(doc => ({
        createIfNotExists: { ...doc, _id: `drafts.${doc._id}` }
      }));

      if (clones.length) {
        console.log(`Создаю черновики: ${clones.length}`);
        await api(`/data/mutate/${DATASET}`, {
          method: "POST",
          body: JSON.stringify({ mutations: clones })
        });
      }
    }
  }

  await api(`/data/mutate/${DATASET}`, {
    method: "POST",
    body: JSON.stringify({ mutations })
  });

  console.log(
    PUBLISH
      ? "\nГотово: записано в живые документы, изменения видны на сайте."
      : "\nГотово: записано в черновики. Опубликуй их в студии."
  );
};

main();
