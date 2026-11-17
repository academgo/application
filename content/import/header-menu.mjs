/**
 * Шапка: пункты меню и окно кнопки «Оценить шансы».
 *
 *   node content/import/header-menu.mjs                      # сухой прогон
 *   node content/import/header-menu.mjs --apply              # в черновики
 *   node content/import/header-menu.mjs --apply --publish    # сразу в живые
 *
 * Делает три вещи:
 *   1. Приводит меню к четырём пунктам на обоих языках. Выпадающее меню
 *      остаётся только у «Учёба за рубежом»: у остальных подпункты
 *      снимаются, и стрелка рядом с ними исчезает сама.
 *      «Цены» переводится со страницы цен обучения в Польше на страницу
 *      стоимости наших услуг.
 *   2. Заводит отдельную плашку для окна кнопки «Оценить шансы» и
 *      привязывает её к футеру. Текст у окна свой: кнопка обещает узнать
 *      шансы, и окно объясняет, что дальше будет бот.
 *   3. Убирает слово «анкет» из текстов плашек: бот как раз задаёт
 *      вопросы, и обещание «без анкет» ему противоречит.
 *
 * Прежние пункты меню сохраняются в content/import/out перед заменой.
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

/**
 * Меню. Первый пункт — с мега-меню стран, у остальных подпунктов нет.
 * Порядок пунктов такой же, как в макете клиента.
 */
const MENU = {
  ru: [
    { label: "Учёба за рубежом", link: "/ru/ucheba-za-rubezhom", countries: true },
    { label: "Цены", link: "/ru/stoimost-uslug" },
    { label: "О нас", link: "/ru/o-nas" },
    { label: "Блог", link: "/ru/blog" }
  ],
  en: [
    { label: "Study abroad", link: "/study-abroad", countries: true },
    { label: "Prices", link: "/service-prices" },
    { label: "About Us", link: "/about-us" },
    { label: "Blog", link: "/blog" }
  ]
};

/** Окно кнопки «Оценить шансы». Тексты из макета клиента */
const HEADER_CTA = {
  ru: {
    title: "Окно кнопки «Оценить шансы» (RU)",
    eyebrow: "Бесплатно · за пару минут",
    heading: "Узнайте свои шансы на поступление",
    description:
      "Сначала бот задаст несколько коротких вопросов: страна, бюджет, документы. Так менеджер сразу видит вашу ситуацию и отвечает по делу, а не шаблоном. Хотите сразу к человеку? В боте есть кнопка «Связаться с менеджером».",
    telegramLabel: "Продолжить в Telegram",
    whatsappLabel: "Продолжить в WhatsApp",
    note: "Менеджер отвечает в течение рабочего дня"
  },
  en: {
    title: "Header button popup (EN)",
    eyebrow: "Free · a couple of minutes",
    heading: "Find out your admission chances",
    description:
      "First the bot asks a few short questions: country, budget, documents. That way a manager sees your situation straight away and answers to the point instead of sending a template. Want a person right away? The bot has a «Talk to a manager» button.",
    telegramLabel: "Continue in Telegram",
    whatsappLabel: "Continue on WhatsApp",
    note: "A manager replies within one working day"
  }
};

/** Ссылки кнопок — из макета клиента */
const LINKS = {
  telegram: "https://t.me/infoacademgo",
  whatsapp: "https://wa.me/message/5EJRNM3WEDXAC1"
};

/** Фразы, которые убираем из текстов плашек */
const DROP_PHRASES = [
  [" и анкет", ""],
  [" and forms", ""],
  [", без анкет", ""],
  [" без анкет", ""]
];

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
    const mark = `${id}|${doc.language}`;
    if (seen.has(mark)) continue;
    seen.add(mark);
    out.push({ ...doc, _id: id });
  }
  return out;
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

  // ---------------------------------------------------------- меню
  const { result: rawHeaders } = await api(
    `/data/query/${DATASET}?query=${encodeURIComponent(
      '*[_type == "header"]{_id, language, navLinks}'
    )}`
  );

  for (const header of dedupe(rawHeaders)) {
    const plan = MENU[header.language];

    if (!plan) {
      console.log(`\nшапка (${header.language}): язык не описан — пропускаю`);
      continue;
    }

    const old = header.navLinks || [];
    backup[`header-${header.language}`] = old;

    const navLinks = plan.map(item => {
      // Пункт с мега-меню сохраняем как есть, меняем только адрес:
      // в нём могут быть настройки, которых нет в этом скрипте
      const existing = old.find(link => link.label === item.label);

      return {
        _key: existing?._key || key(),
        _type: existing?._type || "object",
        label: item.label,
        link: item.link,
        showCountries: Boolean(item.countries),
        // Подпункты оставляем только у пункта с мега-меню — у остальных
        // именно из-за них рисовалась стрелка
        subLinks: item.countries ? existing?.subLinks || [] : []
      };
    });

    console.log(`\nшапка (${header.language}) ${header._id}`);
    console.log(`  было пунктов: ${old.length} → станет: ${navLinks.length}`);
    for (const item of navLinks) {
      const was = old.find(link => link.label === item.label);
      console.log(
        `    ${item.label}: ${was ? was.link : "новый пункт"} → ${item.link}` +
          `${item.showCountries ? " (с мега-меню)" : ""}` +
          `${was && was.subLinks?.length && !item.showCountries ? `, снято подпунктов: ${was.subLinks.length}` : ""}`
      );
    }
    const dropped = old.filter(
      link => !plan.some(item => item.label === link.label)
    );
    if (dropped.length) {
      console.log(
        `  убираются из меню: ${dropped.map(link => link.label).join(", ")}`
      );
    }

    mutations.push({
      patch: { id: target(header._id), set: { navLinks } }
    });
  }

  // ------------------------------------------- окно кнопки в шапке
  const { result: rawFooters } = await api(
    `/data/query/${DATASET}?query=${encodeURIComponent(
      '*[_type == "footer"]{_id, language, "hasHeaderCta": defined(headerCtaDocument)}'
    )}`
  );

  for (const footer of dedupe(rawFooters)) {
    const texts = HEADER_CTA[footer.language];
    if (!texts) continue;

    const ctaId = `cta-header-chances-${footer.language}`;

    mutations.push({
      createOrReplace: {
        _id: PUBLISH ? ctaId : `drafts.${ctaId}`,
        _type: "ctaDocument",
        language: footer.language,
        mode: "both",
        showSocials: false,
        telegramLink: LINKS.telegram,
        whatsappLink: LINKS.whatsapp,
        ...texts
      }
    });

    mutations.push({
      patch: {
        id: target(footer._id),
        set: {
          headerCtaDocument: { _type: "reference", _ref: ctaId }
        }
      }
    });

    console.log(
      `\nфутер (${footer.language}): окно кнопки ${footer.hasHeaderCta ? "переписывается" : "создаётся"} — ${ctaId}`
    );
  }

  // --------------------------------------------- «без анкет» долой
  const { result: ctas } = await api(
    `/data/query/${DATASET}?query=${encodeURIComponent(
      '*[_type == "ctaDocument"]{_id, language, description, note}'
    )}`
  );

  for (const cta of dedupe(ctas)) {
    const set = {};

    for (const field of ["description", "note"]) {
      const value = cta[field];
      if (typeof value !== "string") continue;

      let next = value;
      for (const [from, to] of DROP_PHRASES) next = next.split(from).join(to);

      if (next !== value) set[field] = next;
    }

    if (!Object.keys(set).length) continue;

    console.log(`\nплашка ${cta._id} (${cta.language})`);
    for (const [field, value] of Object.entries(set)) {
      console.log(`  ${field}: «${cta[field]}»`);
      console.log(`         → «${value}»`);
    }

    mutations.push({ patch: { id: target(cta._id), set } });
  }

  if (Object.keys(backup).length) {
    fs.mkdirSync(OUT, { recursive: true });
    const file = path.join(OUT, "header-menu-backup.json");
    fs.writeFileSync(file, JSON.stringify(backup, null, 2), "utf8");
    console.log(`\nПрежние пункты меню сохранены: ${file}`);
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
