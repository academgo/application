/**
 * Наполнение блока «Направления» на главной.
 *
 *   node content/import/home-countries.mjs             # сухой прогон, ничего не пишет
 *   node content/import/home-countries.mjs --apply     # записать в черновики
 *   node content/import/home-countries.mjs --apply --publish   # записать сразу в живые документы
 *
 * Пишет две группы данных:
 *   1. Тексты блока на главной: надзаголовок, заголовок, описание, подпись
 *      кнопки в карточке, число карточек и кнопка «Все страны». Обе локали.
 *   2. У каждой из шести стран — плашку поверх фото (homeBadge) и порядок
 *      в плитке (homeOrder). Порядок на главной намеренно отделён от поля
 *      order, которое управляет мега-меню в шапке.
 *
 * Страны правятся точечными patch-мутациями, а не createOrReplace: остальные
 * поля страны трогать нельзя.
 *
 * ВНИМАНИЕ по формулировкам. Плашки взяты дословно из примера клиента.
 * Две из них — обещания, а не факты:
 *   • Венгрия, «Бесплатное обучение» — Stipendium Hungaricum это конкурсная
 *     стипендия, а не бесплатное обучение для всех. Безопаснее:
 *     «Гранты Stipendium Hungaricum».
 *   • Италия, «100% покрытие грантами» — региональные гранты DSU покрывают
 *     обучение и проживание только тем, кто проходит по доходу. Безопаснее:
 *     «Гранты DSU на обучение и жильё».
 * Решение за клиентом: чтобы поменять, достаточно отредактировать BADGES ниже.
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

const HOMEPAGE_IDS = {
  ru: "31524895-0e8e-4e42-8ef0-614766aa1e00",
  en: "387c8a6f-fe32-4c84-bb65-bfb143fa1044"
};

// ------------------------------------------------------------------ тексты

const BLOCK = {
  ru: {
    eyebrow: "Направления",
    title: "Выберите страну мечты",
    description:
      "6 направлений с лучшим соотношением цены, качества диплома и перспектив после выпуска.",
    cardLinkLabel: "Узнать шансы",
    maxCards: 6,
    allLabel: "Все страны",
    allLink: "/ru/ucheba-za-rubezhom"
  },
  en: {
    eyebrow: "Destinations",
    title: "Choose your dream country",
    description:
      "6 destinations with the best balance of cost, degree value and prospects after graduation.",
    cardLinkLabel: "Check your chances",
    maxCards: 6,
    allLabel: "All destinations",
    allLink: "/study-abroad"
  }
};

/** Плашка поверх фото и порядок в плитке. Ключ — код страны */
const BADGES = {
  spain: {
    homeOrder: 1,
    ru: "ВНЖ и право на работу",
    en: "Residence permit and work rights"
  },
  poland: {
    homeOrder: 2,
    ru: "Топ выбор студентов",
    en: "Students' top choice"
  },
  uae: {
    homeOrder: 3,
    ru: "Британский диплом и карьера",
    en: "British degree, global career"
  },
  malaysia: {
    homeOrder: 4,
    ru: "Дипломы UK/US доступно",
    en: "UK/US degrees available"
  },
  italy: {
    homeOrder: 5,
    ru: "100% покрытие грантами",
    en: "Grants cover 100%"
  },
  hungary: {
    homeOrder: 6,
    ru: "Бесплатное обучение",
    en: "Tuition-free options"
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
    '*[_type == "country" && code in $codes]{_id, code, title, language}'
  );
  const params = encodeURIComponent(JSON.stringify(Object.keys(BADGES)));
  const { result: found } = await api(
    `/data/query/${DATASET}?query=${query}&$codes=${params}`
  );

  // Запрос возвращает и черновики, и опубликованные версии одной страны —
  // приводим к живому id и убираем дубли
  const liveId = id => id.replace(/^drafts\./, "");
  const countries = [];
  const seen = new Set();
  for (const country of found) {
    const id = liveId(country._id);
    const key = `${id}|${country.language}`;
    if (seen.has(key)) continue;
    seen.add(key);
    countries.push({ ...country, _id: id });
  }

  const target = id => (PUBLISH ? id : `drafts.${id}`);
  const mutations = [];

  // --- тексты блока на главной ---
  for (const [lang, texts] of Object.entries(BLOCK)) {
    const set = {};
    for (const [field, value] of Object.entries(texts)) {
      set[`countriesBlock.${field}`] = value;
    }

    mutations.push({
      patch: {
        id: target(HOMEPAGE_IDS[lang]),
        set,
        // старый заголовок был «Десять стран, одно агентство» с выделением
        unset: ["countriesBlock.titleHighlight"]
      }
    });
    console.log(`главная (${lang}): ${texts.title}`);
  }

  // --- плашки и порядок у стран ---
  console.log("");
  for (const country of countries) {
    const config = BADGES[country.code];
    if (!config) continue;

    const badge = config[country.language];
    if (!badge) {
      console.log(
        `  пропуск: ${country.code} / ${country.language} — нет текста плашки`
      );
      continue;
    }

    mutations.push({
      patch: {
        id: target(country._id),
        set: { homeBadge: badge, homeOrder: config.homeOrder }
      }
    });

    console.log(
      `  ${config.homeOrder}. ${country.title} (${country.language}): «${badge}»`
    );
  }

  const missing = Object.keys(BADGES).filter(
    code => !countries.some(country => country.code === code)
  );
  if (missing.length) {
    console.log(`\nНе найдены страны с кодами: ${missing.join(", ")}`);
  }

  console.log(`\nМутаций: ${mutations.length}`);

  if (!APPLY) {
    console.log("Сухой прогон. Чтобы записать — добавь --apply");
    return;
  }

  // Патч не создаёт документ: если черновика ещё нет, сначала клонируем
  // в него опубликованную версию
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
      : "\nГотово: записано в черновики. Опубликуй их в студии, чтобы увидеть на сайте."
  );
};

main();
