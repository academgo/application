/**
 * Создаёт то, чего нет в content/drafts:
 *  - страницу сравнения стран (RU/EN) с блоками «Сравнение стран» и «Другие страны»;
 *  - черновик шапки с пунктом меню, который раскрывает список стран;
 *  - черновик главной с текстами блока стран.
 *
 * Черновики шапки и главной не влияют на живой сайт: он читает
 * опубликованные версии. Запуск:
 *
 *   node content/import/create-extra-pages.mjs            # сухой прогон
 *   node content/import/create-extra-pages.mjs --apply    # загрузка
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { markdownToPortableText } from "./markdown-to-portable-text.mjs";
import {
  QUIZ_DOCUMENTS,
  QUIZ_TRANSLATION_METADATA,
  QUIZ_IDS
} from "./quiz.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");

const HEADER_IDS = {
  ru: "9cb19371-1f95-45fd-bbda-cb443f2b0e8a",
  en: "f9b34e02-e547-4181-9f54-c5984eb3aaf2"
};

const HOMEPAGE_IDS = {
  ru: "31524895-0e8e-4e42-8ef0-614766aa1e00",
  en: "387c8a6f-fe32-4c84-bb65-bfb143fa1044"
};

const key = () => crypto.randomBytes(6).toString("hex");

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

const fetchSanity = async query => {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(
    query
  )}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token()}` }
  });
  const result = await response.json();

  if (!response.ok) throw new Error(JSON.stringify(result));

  return result.result;
};

// ------------------------------------------------------- страница сравнения

const COMPARISON = {
  ru: {
    id: "academgo.compare.ru",
    slug: "ucheba-za-rubezhom",
    title: "Где дешевле учиться за границей: сравнение 10 стран",
    menuLabel: "Учёба за рубежом",
    metaTitle: "В какой стране лучше учиться: сравнение 10 направлений",
    metaDescription:
      "Где дешевле учиться за границей и в какой стране лучше учиться: стоимость обучения и жизни, язык программ, виза, работа и признание диплома по десяти направлениям.",
    coverText:
      "Цены вузов, стоимость жизни, виза, работа и признание диплома — в одной таблице, с годом прайса.",
    intro: `## С чего начать выбор страны

Выбор направления почти всегда упирается в четыре вопроса: сколько стоит обучение, сколько нужно на жизнь, на каком языке идут программы и что будет с дипломом дома. Таблица ниже отвечает на них по каждой стране, где работает AcademGo.

Цены — официальные прайсы вузов с указанием года. Прайсы на 2027/28 вузы публикуют ближе к набору, поэтому смотрите на диапазоны, а не на точную цифру.`,
    compare: {
      title: "Сравнение десяти стран обучения",
      description:
        "Данные по каждой стране — из проверенных источников: сайтов вузов, министерств и миграционных служб.",
      linkLabel: "Подробнее",
      note: "Стоимость обучения указана с годом прайса. Точную сумму для вашей программы уточним на бесплатной консультации.",
      labels: {
        country: "Страна",
        tuitionFrom: "Обучение",
        livingCostFrom: "Жизнь",
        languageOfStudy: "Язык обучения",
        visa: "Въезд и статус",
        workRights: "Работа во время учёбы",
        degreeRecognition: "Признание диплома",
        medicineInEnglish: "Медицина на английском",
        yes: "да",
        no: "нет"
      }
    },
    honesty: `## О чём стоит знать заранее

Не каждая страна подходит каждому абитуриенту, и это видно уже по таблице.

Северный Кипр — самый доступный старт на английском, но Турецкая Республика Северного Кипра признана только Турцией: диплом не признаётся в Европе напрямую. Рабочий путь один — программа из справочника YÖK и легализация диплома через турецкие органы. Мы говорим об этом до первого платежа, а не после выпуска.

В Грузии аккредитация NCEQE признана WFME до ноября 2028 года, а для врачебной практики в стране нужен грузинский язык. В Испании медицину на английском наши вузы-партнёры не ведут. В ОАЭ диплом выдаёт головной вуз Великобритании или Австралии — это плюс, но и цена соответствующая.`,
    links: {
      title: "Страны обучения",
      description: "Выберите направление — на странице страны есть цены, сроки и требования вузов."
    },
    cta: `Не знаете, с какой страны начать? Пришлите аттестат и бюджет на год — подберём 3–4 программы в разных странах и честно скажем, где ваши шансы выше. Первая консультация бесплатная, офис AcademGo — Варшава, ul. Złota 7/28.`
  },
  en: {
    id: "academgo.compare.en",
    slug: "study-abroad",
    title: "Best countries to study abroad: 10 destinations compared",
    menuLabel: "Study abroad",
    metaTitle: "Best Countries to Study Abroad: 10 Compared by Cost",
    metaDescription:
      "The best and cheapest countries to study abroad, compared: tuition and living costs, language of study, entry rules, work rights and degree recognition across ten destinations.",
    coverText:
      "Tuition, living costs, entry rules, work rights and degree recognition — in one table, with the price year stated.",
    intro: `## Where to start

Choosing a destination usually comes down to four questions: what tuition costs, how much you need to live on, what language the programmes are taught in, and what happens to the degree back home. The table below answers them for every destination AcademGo works with.

Prices come from official university price lists, with the year stated. Universities publish 2027/28 prices closer to intake, so read the ranges rather than a single figure.`,
    compare: {
      title: "Ten destinations compared",
      description:
        "Every figure comes from a checked source: university websites, ministries and immigration services.",
      linkLabel: "Learn more",
      note: "Tuition is shown with the year of the price list. We will confirm the exact figure for your programme during the free consultation.",
      labels: {
        country: "Destination",
        tuitionFrom: "Tuition",
        livingCostFrom: "Living",
        languageOfStudy: "Language of study",
        visa: "Entry and status",
        workRights: "Work while studying",
        degreeRecognition: "Degree recognition",
        medicineInEnglish: "Medicine in English",
        yes: "yes",
        no: "no"
      }
    },
    honesty: `## What to know before you choose

Not every destination suits every applicant, and the table already shows why.

North Cyprus is the most affordable English-taught start, but the Turkish Republic of Northern Cyprus is recognised only by Türkiye: the degree is not recognised in Europe directly. There is one working route — a YÖK-listed programme and legalisation of the degree through Turkish authorities. We say this before the first payment, not after graduation.

In Georgia, NCEQE accreditation is WFME-recognised until November 2028, and practising medicine there requires Georgian. In Spain our partner universities do not teach medicine in English. In the UAE the degree is awarded by the UK or Australian home campus — a real advantage, and the price reflects it.`,
    links: {
      title: "Study destinations",
      description: "Pick a destination — each country page has prices, deadlines and university requirements."
    },
    cta: `Not sure where to start? Send us your school certificate and your budget for the year. We will shortlist three or four programmes across destinations and tell you honestly where your chances are strongest. The first consultation is free; the AcademGo office is in Warsaw, ul. Złota 7/28.`
  }
};

const comparisonPage = lang => {
  const content = COMPARISON[lang];

  return {
    _id: `drafts.${content.id}`,
    _type: "singlepage",
    title: content.title,
    slug: {
      _type: "localizedSlug",
      [lang]: { _type: "slug", current: content.slug }
    },
    seo: {
      metaTitle: content.metaTitle,
      metaDescription: content.metaDescription
    },
    coverBlock: {
      coverTitle: content.title,
      coverText: content.coverText
    },
    pageType: "other",
    language: lang,
    publishedAt: new Date().toISOString(),
    contentBlocks: [
      {
        _type: "textContent",
        _key: key(),
        content: markdownToPortableText(content.intro)
      },
      {
        _type: "countriesCompareBlock",
        _key: key(),
        title: content.compare.title,
        description: content.compare.description,
        columns: [
          "tuitionFrom",
          "livingCostFrom",
          "languageOfStudy",
          "visa",
          "workRights",
          "degreeRecognition"
        ],
        labels: content.compare.labels,
        linkLabel: content.compare.linkLabel,
        note: content.compare.note
      },
      {
        _type: "textContent",
        _key: key(),
        content: markdownToPortableText(content.honesty)
      },
      {
        _type: "countriesLinksBlock",
        _key: key(),
        title: content.links.title,
        description: content.links.description,
        excludeCurrent: false,
        showTuition: true
      },
      {
        _type: "textContent",
        _key: key(),
        marginBottom: "large",
        content: markdownToPortableText(content.cta)
      }
    ]
  };
};

const comparisonTranslationMetadata = () => ({
  _id: "academgo.tm.compare",
  _type: "translation.metadata",
  schemaTypes: ["singlepage"],
  translations: ["ru", "en"].map(lang => ({
    _key: lang,
    _type: "internationalizedArrayReferenceValue",
    value: {
      _type: "reference",
      _ref: COMPARISON[lang].id,
      _weak: true
    }
  }))
});

// ------------------------------------------------- черновики шапки и главной

const headerDraft = (lang, header) => {
  const link =
    lang === "en"
      ? `/${COMPARISON.en.slug}`
      : `academgo.com/ru/${COMPARISON.ru.slug}`;

  const navLinks = (header.navLinks || []).filter(
    item => !item.showCountries
  );

  // пункт со странами ставим вторым: после «О нас» и перед Польшей
  const withCountries = [
    ...navLinks.slice(0, 1),
    {
      _key: "countriesMenu",
      label: COMPARISON[lang].menuLabel,
      link,
      showCountries: true
    },
    ...navLinks.slice(1)
  ];

  return {
    ...header,
    _id: header._id.startsWith("drafts.") ? header._id : `drafts.${header._id}`,
    navLinks: withCountries
  };
};

const HOMEPAGE_BLOCK = {
  ru: {
    title: "Учимся не только в",
    titleHighlight: "Польше",
    description:
      "AcademGo работает с девятью направлениями: от бюджетной Турции и Грузии до кампусов британских вузов в Дубае. На каждой странице — цены вузов с годом прайса, сроки и честно о признании диплома.",
    cardLinkLabel: "Подробнее",
    compareLabel: "Сравнить страны",
    compareLink: `/ru/${COMPARISON.ru.slug}`
  },
  en: {
    title: "More than",
    titleHighlight: "Poland",
    description:
      "AcademGo works with ten destinations, from affordable Türkiye and Georgia to UK branch campuses in Dubai. Each country page carries official university prices with the year, deadlines and an honest take on degree recognition.",
    cardLinkLabel: "Learn more",
    compareLabel: "Compare destinations",
    compareLink: `/${COMPARISON.en.slug}`
  }
};

const homepageDraft = (lang, homepage) => ({
  ...homepage,
  _id: homepage._id.startsWith("drafts.")
    ? homepage._id
    : `drafts.${homepage._id}`,
  // тексты блока стран правятся в homepage.mjs — здесь только начальные,
  // если блока ещё нет
  countriesBlock: homepage.countriesBlock || HOMEPAGE_BLOCK[lang],
  // главная берёт тот же общий квиз, что и страницы стран
  quizDocument: { _type: "reference", _ref: QUIZ_IDS[lang], _weak: true }
});

// ------------------------------------------------------------------- запуск

const main = async () => {
  if (!token()) {
    console.error("Нет токена: добавьте SANITY_API_TOKEN в .env.local");
    process.exit(1);
  }

  const documents = [
    QUIZ_DOCUMENTS.ru,
    QUIZ_DOCUMENTS.en,
    QUIZ_TRANSLATION_METADATA,
    comparisonPage("ru"),
    comparisonPage("en"),
    comparisonTranslationMetadata()
  ];

  for (const lang of ["ru", "en"]) {
    // если черновик уже есть, правим его: иначе затрём изменения,
    // сделанные другими скриптами (первый экран главной, FAQ, SEO)
    const [header] = await fetchSanity(
      `*[_id in ["drafts.${HEADER_IDS[lang]}", "${HEADER_IDS[lang]}"]] | order(_id desc) [0...1]{...}`
    );
    const [homepage] = await fetchSanity(
      `*[_id in ["drafts.${HOMEPAGE_IDS[lang]}", "${HOMEPAGE_IDS[lang]}"]] | order(_id desc) [0...1]{...}`
    );

    if (!header || !homepage) {
      throw new Error(`Не найдены документы шапки или главной для ${lang}`);
    }

    documents.push(headerDraft(lang, header), homepageDraft(lang, homepage));
  }

  console.log(
    "Документы:",
    documents.map(document => `${document._type} ${document._id}`).join("\n           ")
  );

  if (!APPLY) {
    console.log("\nСухой прогон. Для загрузки добавьте --apply");
    return;
  }

  const response = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`
      },
      body: JSON.stringify({
        mutations: documents.map(document => ({ createOrReplace: document }))
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Ошибка загрузки:", JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log("Готово.");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
