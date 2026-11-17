/**
 * Колонка «Страны» в футере: свой порядок и ссылка «Сравнить страны»,
 * плюс новый текст заметки в колонке «Контакты».
 *
 *   node content/import/footer-countries.mjs                      # сухой прогон
 *   node content/import/footer-countries.mjs --apply              # в черновики
 *   node content/import/footer-countries.mjs --apply --publish    # сразу в живые
 *
 * Зачем. Раньше футер брал страны из тех же документов и в том же порядке,
 * что мега-меню в шапке (поле Order). Поменять порядок в футере через
 * админку было нельзя: любая правка немедленно переставляла шапку.
 * Теперь у футера есть собственный список — он и заполняется здесь.
 *
 * Дальше порядок правится в студии перетаскиванием, в документе футера,
 * рядом с меню «Навигация». Если список очистить, вернётся прежнее
 * поведение: все страны в порядке мега-меню.
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

/** Порядок колонки. Коды стран — как в документах Country */
const ORDER = [
  "spain",
  "poland",
  "georgia",
  "uae",
  "south-cyprus",
  "turkey",
  "malaysia",
  "italy",
  "hungary",
  "north-cyprus"
];

/** Последним пунктом — не страна, а ссылка на страницу сравнения */
const EXTRA = {
  ru: { label: "Сравнить страны", link: "/ru/ucheba-za-rubezhom" },
  en: { label: "Compare countries", link: "/study-abroad" }
};

/** Заметка под адресом в колонке «Контакты» */
const CONTACT_NOTE = {
  ru: "Заявки на поступление принимаем в Telegram и WhatsApp",
  en: "We accept admission requests via Telegram and WhatsApp"
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

  const codes = encodeURIComponent(JSON.stringify(ORDER));
  const countryQuery = encodeURIComponent(
    '*[_type == "country" && code in $codes]{_id, code, title, language}'
  );
  const { result: rawCountries } = await api(
    `/data/query/${DATASET}?query=${countryQuery}&$codes=${codes}`
  );
  const countries = dedupe(rawCountries);

  const footerQuery = encodeURIComponent(
    '*[_type == "footer"]{_id, language, contactNote, "items": count(countryLinks)}'
  );
  const { result: rawFooters } = await api(
    `/data/query/${DATASET}?query=${footerQuery}`
  );
  const footers = dedupe(rawFooters);

  const target = id => (PUBLISH ? id : `drafts.${id}`);
  const mutations = [];

  for (const footer of footers) {
    const lang = footer.language;
    const extra = EXTRA[lang];
    const note = CONTACT_NOTE[lang];

    if (!extra || !note) {
      console.log(`  пропуск футера: язык ${lang} не описан в скрипте`);
      continue;
    }

    const links = [];
    const missing = [];

    for (const code of ORDER) {
      const country = countries.find(
        item => item.code === code && item.language === lang
      );

      if (!country) {
        missing.push(code);
        continue;
      }

      links.push({
        _key: key(),
        _type: "footerCountryLink",
        country: { _type: "reference", _ref: country._id }
      });
    }

    links.push({ _key: key(), _type: "footerCountryLink", ...extra });

    mutations.push({
      patch: {
        id: target(footer._id),
        set: { countryLinks: links, contactNote: note }
      }
    });

    console.log(`\nфутер (${lang}) ${footer._id}`);
    console.log(
      `  было в списке: ${footer.items || 0} пунктов → станет: ${links.length}`
    );
    console.log(
      `  порядок: ${ORDER.map(
        code =>
          countries.find(item => item.code === code && item.language === lang)
            ?.title || code
      ).join(", ")}, ${extra.label}`
    );
    console.log(`  заметка: «${footer.contactNote || "(пусто)"}» → «${note}»`);

    if (missing.length) {
      console.log(`  не найдены страны: ${missing.join(", ")}`);
    }
  }

  if (!footers.length) {
    console.log("Документов футера не найдено");
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
