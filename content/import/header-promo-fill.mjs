/**
 * Шапка: переносим тексты из кода в админку.
 *
 *   node content/import/header-promo-fill.mjs                   # сухой прогон
 *   node content/import/header-promo-fill.mjs --apply           # в черновики
 *   node content/import/header-promo-fill.mjs --apply --publish # сразу в живые
 *
 * Текст оранжевой кнопки и карточка в мега-меню стран до сих пор брались
 * из значений по умолчанию внутри компонента: поля в студии стояли пустыми,
 * и клиент не понимал, где это править. Скрипт записывает ровно те тексты,
 * которые сейчас на сайте, в поля ctaLabel и countriesPromo обоих языков.
 * Ссылку и иконку карточки берём из контакта Telegram в той же шапке —
 * раньше они подставлялись оттуда же, но тоже молча.
 *
 * Заполненные поля не трогаем: если клиент что-то уже написал, остаётся его.
 * Прежние значения сохраняются в content/import/out перед записью.
 */

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

/** Текст оранжевой кнопки справа в шапке */
const CTA_LABEL = {
  ru: "Оценить шансы",
  en: "Check chances"
};

/** Карточка справа в мега-меню стран */
const PROMO = {
  ru: {
    label: "Telegram-бот",
    title: "Быстрый подбор вуза",
    text: "Перейдите в наш Telegram-бот. Ответьте на 3 вопроса, и мы пришлём варианты поступления под ваш бюджет.",
    buttonText: "Перейти в Telegram"
  },
  en: {
    label: "Telegram bot",
    title: "Quick university match",
    text: "Open our Telegram bot. Answer 3 questions and we will send admission options for your budget.",
    buttonText: "Open Telegram"
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

const dedupe = docs => {
  const out = [];
  const seen = new Set();
  for (const doc of docs || []) {
    const id = liveId(doc._id);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ ...doc, _id: id });
  }
  return out;
};

const blank = value => typeof value !== "string" || !value.trim();

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

  const { result: rawHeaders } = await api(
    `/data/query/${DATASET}?query=${encodeURIComponent(
      '*[_type == "header"]{_id, language, ctaLabel, countriesPromo, contactLinks[]{title, link, icon}}'
    )}`
  );

  for (const header of dedupe(rawHeaders)) {
    const promoText = PROMO[header.language];
    const ctaLabel = CTA_LABEL[header.language];

    if (!promoText) {
      console.log(`\nшапка (${header.language}): язык не описан — пропускаю`);
      continue;
    }

    backup[`header-${header.language}`] = {
      ctaLabel: header.ctaLabel || null,
      countriesPromo: header.countriesPromo || null
    };

    const set = {};
    const log = [];

    // Текст кнопки
    if (blank(header.ctaLabel)) {
      set.ctaLabel = ctaLabel;
      log.push(`  Кнопка в шапке: пусто → «${ctaLabel}»`);
    } else {
      log.push(`  Кнопка в шапке: уже заполнена («${header.ctaLabel}») — не трогаю`);
    }

    // Карточка в мега-меню
    const current = header.countriesPromo || {};
    const telegram = (header.contactLinks || []).find(link =>
      /t\.me|telegram/i.test(link.link || "")
    );

    const promo = { ...current, _type: current._type || "object" };
    const promoLog = [];

    for (const [field, value] of Object.entries(promoText)) {
      if (blank(current[field])) {
        promo[field] = value;
        promoLog.push(`    ${field}: пусто → «${value}»`);
      } else {
        promoLog.push(`    ${field}: уже заполнено — не трогаю`);
      }
    }

    if (blank(current.link)) {
      if (telegram?.link) {
        promo.link = telegram.link;
        promoLog.push(`    link: пусто → ${telegram.link} (из контакта Telegram)`);
      } else {
        promoLog.push("    link: пусто, и контакта Telegram в шапке нет — оставляю");
      }
    } else {
      promoLog.push(`    link: уже заполнена (${current.link}) — не трогаю`);
    }

    if (!current.icon?.asset?._ref) {
      if (telegram?.icon?.asset?._ref) {
        promo.icon = {
          _type: "image",
          asset: { _type: "reference", _ref: telegram.icon.asset._ref }
        };
        promoLog.push("    icon: пусто → иконка из контакта Telegram");
      } else {
        promoLog.push("    icon: пусто, и у контакта Telegram иконки нет — оставляю");
      }
    } else {
      promoLog.push("    icon: уже стоит — не трогаю");
    }

    const changed =
      JSON.stringify(promo) !== JSON.stringify({ ...current, _type: current._type || "object" });

    if (changed) set.countriesPromo = promo;

    console.log(`\nшапка (${header.language}) ${header._id}`);
    for (const line of log) console.log(line);
    console.log("  Карточка в меню стран:");
    for (const line of promoLog) console.log(line);

    if (!Object.keys(set).length) {
      console.log("  Всё уже заполнено — менять нечего");
      continue;
    }

    mutations.push({ patch: { id: target(header._id), set } });
  }

  if (Object.keys(backup).length) {
    fs.mkdirSync(OUT, { recursive: true });
    const file = path.join(OUT, "header-promo-backup.json");
    fs.writeFileSync(file, JSON.stringify(backup, null, 2), "utf8");
    console.log(`\nПрежние значения сохранены: ${file}`);
  }

  console.log(`\nМутаций: ${mutations.length}`);

  if (!mutations.length) return;

  if (!APPLY) {
    console.log("Сухой прогон. Чтобы записать — добавь --apply");
    return;
  }

  // Патч не создаёт документ: если черновика нет, сначала клонируем живой
  if (!PUBLISH) {
    const draftIds = [
      ...new Set(mutations.filter(m => m.patch).map(m => m.patch.id))
    ];
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
