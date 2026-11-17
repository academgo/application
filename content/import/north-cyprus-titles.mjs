/**
 * H1 и <title> на трёх страницах Северного Кипра.
 *
 *   node content/import/north-cyprus-titles.mjs                      # сухой прогон
 *   node content/import/north-cyprus-titles.mjs --apply              # в черновики
 *   node content/import/north-cyprus-titles.mjs --apply --publish    # сразу в живые
 *
 * Адреса страниц не меняются — правятся только заголовок на странице
 * (coverBlock.coverTitle, это и есть H1) и заголовок вкладки (seo.metaTitle).
 *
 * Зачем. В прежних заголовках страна называлась двумя разными именами в
 * одной строке: «Стоимость обучения на Кипре: цены вузов Северного Кипра».
 * Читатель не понимает, про Кипр это или про Северный Кипр, а для поиска
 * это два разных направления с разными ценами и разным признанием диплома.
 * Теперь во всех трёх H1 страна называется один раз и полностью.
 *
 * <title> — по тем же словам, что H1, но короче: длинный заголовок
 * в выдаче обрезается. Все три укладываются в 54 знака.
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

const LANG = "ru";

/** Ключ — последний кусок адреса страницы */
const PAGES = {
  "stoimost-obucheniya": {
    h1: "Стоимость обучения на Северном Кипре: цены вузов и расходы студента",
    title: "Стоимость обучения на Северном Кипре: цены вузов"
  },
  "viza-i-vnzh": {
    h1: "Студенческий ВНЖ на Северном Кипре: въезд через Турцию и оформление",
    title: "Студенческий ВНЖ на Северном Кипре: въезд и оформление"
  },
  "priznanie-diploma": {
    h1: "Признаётся ли диплом Северного Кипра: что будет после выпуска",
    title: "Признаётся ли диплом Северного Кипра после выпуска"
  }
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

const main = async () => {
  if (!token()) {
    console.error(
      "Не найден токен записи. Положи SANITY_API_WRITE_TOKEN в .env.local"
    );
    process.exit(1);
  }

  const slugs = encodeURIComponent(JSON.stringify(Object.keys(PAGES)));
  const query = encodeURIComponent(
    `*[_type == "subpage" && language == "${LANG}" && slug.${LANG}.current in $slugs]{
      _id,
      language,
      "slug": slug.${LANG}.current,
      "parent": parentPage->slug.${LANG}.current,
      "currentH1": coverBlock.coverTitle,
      "currentTitle": seo.metaTitle
    }`
  );
  const { result: found } = await api(
    `/data/query/${DATASET}?query=${query}&$slugs=${slugs}`
  );

  // Запрос отдаёт и черновики, и опубликованные версии одного документа
  const pages = [];
  const seen = new Set();
  for (const page of found || []) {
    const id = liveId(page._id);
    if (seen.has(id)) continue;
    seen.add(id);
    pages.push({ ...page, _id: id });
  }

  const target = id => (PUBLISH ? id : `drafts.${id}`);
  const mutations = [];

  for (const page of pages) {
    const texts = PAGES[page.slug];
    if (!texts) continue;

    // Страхуемся от однофамильцев: тот же slug мог встретиться под другим
    // родителем. Нас интересуют только страницы Северного Кипра
    if (page.parent && page.parent !== "ucheba-na-severnom-kipre") {
      console.log(
        `  пропуск: /${page.parent}/${page.slug} — не Северный Кипр`
      );
      continue;
    }

    mutations.push({
      patch: {
        id: target(page._id),
        setIfMissing: { seo: {}, coverBlock: {} },
        set: {
          "coverBlock.coverTitle": texts.h1,
          "seo.metaTitle": texts.title
        }
      }
    });

    console.log(`\n/${page.slug}`);
    console.log(`  H1 было:  ${page.currentH1 || "—"}`);
    console.log(`  H1 стало: ${texts.h1}`);
    console.log(`  title было:  ${page.currentTitle || "—"}`);
    console.log(
      `  title стало: ${texts.title} (${texts.title.length} знаков)`
    );
  }

  const missing = Object.keys(PAGES).filter(
    slug => !pages.some(page => page.slug === slug)
  );
  if (missing.length) {
    console.log(`\nНе найдены страницы: ${missing.join(", ")}`);
  }

  console.log(`\nМутаций: ${mutations.length}`);

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
