/**
 * Плитка стран вместо блока «Куда мы помогаем поступить» на страницах
 * «О нас» и About.
 *
 *   node content/import/about-countries-block.mjs                      # сухой прогон
 *   node content/import/about-countries-block.mjs --apply              # в черновики
 *   node content/import/about-countries-block.mjs --apply --publish    # сразу в живые
 *
 * Старый блок countriesLinksBlock заменяется новым countriesBlock на том
 * же месте. Поля нового блока намеренно оставляются пустыми: тогда он
 * берёт тексты с главной страницы того же языка, и плитка получается один
 * в один как там. Если на странице понадобится свой заголовок или своё
 * число карточек, их можно вписать прямо в блок.
 *
 * Перед заменой содержимое старого блока сохраняется в
 * content/import/out — чтобы можно было вернуть, если передумаете.
 *
 * Повторный запуск безопасен: если плитка на странице уже есть,
 * страница пропускается.
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

/** Страницы: язык → слаг */
const PAGES = { ru: "o-nas", en: "about-us" };

/** Какой блок заменяем и на какой */
const OLD_TYPE = "countriesLinksBlock";
const NEW_TYPE = "countriesBlock";

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
  const backup = {};

  for (const [lang, slug] of Object.entries(PAGES)) {
    const query = encodeURIComponent(
      `*[_type == "singlepage" && language == "${lang}" && slug.${lang}.current == $slug][0]{
        _id,
        title,
        contentBlocks
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

    const blocks = page.contentBlocks || [];
    console.log(`\n${lang}: ${page.title} (${liveId(page._id)})`);

    if (blocks.some(block => block._type === NEW_TYPE)) {
      console.log("  плитка стран уже стоит — пропускаю");
      continue;
    }

    const old = blocks.find(block => block._type === OLD_TYPE);

    if (!old) {
      console.log(`  блок ${OLD_TYPE} не найден — пропускаю`);
      continue;
    }

    const at = blocks.indexOf(old);
    backup[`${lang}-${slug}`] = old;

    console.log(
      `  заменяю ${OLD_TYPE} на ${NEW_TYPE} на позиции ${at + 1} из ${blocks.length}`
    );
    console.log(`  заголовок старого блока: «${old.title || "—"}»`);

    mutations.push({
      patch: {
        id: target(liveId(page._id)),
        insert: {
          replace: `contentBlocks[_key=="${old._key}"]`,
          items: [{ _key: key(), _type: NEW_TYPE }]
        }
      }
    });
  }

  if (Object.keys(backup).length) {
    fs.mkdirSync(OUT, { recursive: true });
    const file = path.join(OUT, "about-countries-links-backup.json");
    fs.writeFileSync(file, JSON.stringify(backup, null, 2), "utf8");
    console.log(`\nСтарые блоки сохранены: ${file}`);
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
