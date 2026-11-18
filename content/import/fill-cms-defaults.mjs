/**
 * Переносим в админку тексты, которые сейчас подставляются из кода.
 *
 *   node content/import/fill-cms-defaults.mjs                   # сухой прогон
 *   node content/import/fill-cms-defaults.mjs --apply           # в черновики
 *   node content/import/fill-cms-defaults.mjs --apply --publish # сразу в живые
 *
 * Часть полей в студии стояла пустой, а на сайте текст был: компоненты
 * подставляли значения по умолчанию. Клиент открывал документ, видел
 * пустое поле и не понимал, где правится то, что он видит на странице.
 * Скрипт записывает ровно те тексты, которые сейчас на сайте:
 *
 *   шапка          — текст оранжевой кнопки, карточка в мега-меню стран
 *                    (ссылка и иконка — из контакта Telegram той же шапки)
 *   главная        — подпись кнопки с видео на первом экране
 *   квиз           — заголовок боковой панели
 *   сравнение стран— подписи ответов «да» и «нет»
 *   лид-магнит     — подпись поля e-mail
 *
 * Заполненные поля не трогаем: если там уже что-то написано, остаётся оно.
 * Прежние значения сохраняются в content/import/out перед записью.
 *
 * Заменяет прежний header-promo-fill.mjs: тот делал то же самое, но только
 * для шапки. Повторный запуск безопасен — заполненное пропускается.
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
const lang = doc => (doc.language === "ru" ? "ru" : "en");
const blank = value => typeof value !== "string" || !value.trim();

/** Тексты по языкам — ровно те, что сейчас выводит код */
const TEXTS = {
  headerCta: { ru: "Оценить шансы", en: "Check chances" },
  promo: {
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
  },
  heroVideoButton: { ru: "Как мы работаем", en: "How we work" },
  quizSidePanel: { ru: "Что придёт в ответ", en: "What you will get" },
  compareYes: { ru: "да", en: "yes" },
  compareNo: { ru: "нет", en: "no" },
  emailLabel: { ru: "E-mail", en: "E-mail" }
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

/**
 * Обходим документ и собираем пути до блоков, у которых есть умолчания
 * в коде. Элементы массивов адресуем по _key: позиция может измениться,
 * ключ — нет.
 */
const walk = (node, basePath, found, parent) => {
  if (Array.isArray(node)) {
    for (const item of node) {
      if (!item || typeof item !== "object") continue;
      const key = item._key;
      walk(item, key ? `${basePath}[_key=="${key}"]` : basePath, found, parent);
    }
    return;
  }

  if (!node || typeof node !== "object") return;

  if (node._type) {
    found[node._type] = found[node._type] || [];
    found[node._type].push({ path: basePath, node, parent });
  }

  for (const [field, value] of Object.entries(node)) {
    if (field.startsWith("_")) continue;
    if (value && typeof value === "object") {
      walk(value, basePath ? `${basePath}.${field}` : field, found, node);
    }
  }
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
  let filled = 0;

  const types = ["header", "homepage", "quizDocument", "singlepage", "subpage"];
  const { result: rawDocs } = await api(
    `/data/query/${DATASET}?query=${encodeURIComponent(
      `*[_type in ${JSON.stringify(types)}]`
    )}`
  );

  for (const doc of dedupe(rawDocs)) {
    const L = lang(doc);
    const set = {};
    const log = [];

    const fill = (fieldPath, current, value, human) => {
      if (!blank(current)) return;
      set[fieldPath] = value;
      log.push(`    ${human}: пусто → «${value}»`);
      filled += 1;
    };

    // --------------------------------------------------------- шапка
    if (doc._type === "header") {
      fill("ctaLabel", doc.ctaLabel, TEXTS.headerCta[L], "кнопка в шапке");

      const promoText = TEXTS.promo[L];
      const current = doc.countriesPromo || {};
      const telegram = (doc.contactLinks || []).find(link =>
        /t\.me|telegram/i.test(link.link || "")
      );
      const promo = { ...current, _type: current._type || "object" };
      let promoChanged = false;

      for (const [field, value] of Object.entries(promoText)) {
        if (!blank(current[field])) continue;
        promo[field] = value;
        promoChanged = true;
        log.push(`    карточка в меню стран, ${field}: пусто → «${value}»`);
        filled += 1;
      }

      if (blank(current.link) && telegram?.link) {
        promo.link = telegram.link;
        promoChanged = true;
        log.push(`    карточка в меню стран, ссылка: пусто → ${telegram.link}`);
        filled += 1;
      }

      if (!current.icon?.asset?._ref && telegram?.icon?.asset?._ref) {
        promo.icon = {
          _type: "image",
          asset: { _type: "reference", _ref: telegram.icon.asset._ref }
        };
        promoChanged = true;
        log.push("    карточка в меню стран, иконка: пусто → из контакта Telegram");
        filled += 1;
      }

      if (promoChanged) set.countriesPromo = promo;
    }

    // ------------------------------------------------------- главная
    if (doc._type === "homepage" && doc.heroVideo) {
      fill(
        "heroVideo.buttonText",
        doc.heroVideo.buttonText,
        TEXTS.heroVideoButton[L],
        "кнопка с видео на первом экране"
      );
    }

    // -------------------------------- вложенные блоки на страницах
    const found = {};
    walk(doc, "", found);

    for (const { path: at, node, parent } of found.quizBlock || []) {
      if (!at) continue;
      // Собственные вопросы страницы не читаются, пока рядом выбран общий
      // квиз: заполнять там что-либо бессмысленно, правки туда не попадут
      if (parent?.quizDocument) continue;
      fill(
        `${at}.sidePanelTitle`,
        node.sidePanelTitle,
        TEXTS.quizSidePanel[L],
        "квиз, заголовок боковой панели"
      );
    }

    for (const { path: at, node } of found.countriesCompareBlock || []) {
      if (!at) continue;
      const labels = node.labels || {};
      fill(`${at}.labels.yes`, labels.yes, TEXTS.compareYes[L], "сравнение, «да»");
      fill(`${at}.labels.no`, labels.no, TEXTS.compareNo[L], "сравнение, «нет»");
    }

    for (const { path: at, node } of found.leadMagnetBlock || []) {
      if (!at) continue;
      fill(
        `${at}.emailLabel`,
        node.emailLabel,
        TEXTS.emailLabel[L],
        "лид-магнит, подпись поля e-mail"
      );
    }

    if (!Object.keys(set).length) continue;

    backup[doc._id] = Object.fromEntries(
      Object.keys(set).map(field => [field, "было пусто"])
    );

    console.log(`\n${doc._type} (${L}) ${doc._id}`);
    for (const line of log) console.log(line);

    mutations.push({ patch: { id: target(doc._id), set } });
  }

  if (Object.keys(backup).length) {
    fs.mkdirSync(OUT, { recursive: true });
    const file = path.join(OUT, "fill-cms-defaults-backup.json");
    fs.writeFileSync(file, JSON.stringify(backup, null, 2), "utf8");
    console.log(`\nСписок затронутых полей сохранён: ${file}`);
  }

  console.log(`\nДокументов к правке: ${mutations.length}, полей: ${filled}`);

  if (!mutations.length) {
    console.log("Пустых полей с умолчаниями не осталось.");
    return;
  }

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
