/**
 * Переоптимизация главной под работу с десятью странами.
 *
 *   node content/import/homepage.mjs            # сухой прогон
 *   node content/import/homepage.mjs --apply    # загрузка черновиков
 *
 * Правки идут в черновик главной: живой сайт не меняется, пока черновик
 * не опубликуют. Меняются тексты первого экрана, условия, блок стран, FAQ
 * и SEO; блоки с отзывами, вузами, ценами и формами остаются как есть.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { markdownToPortableText } from "./markdown-to-portable-text.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");

const IDS = {
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

// -------------------------------------------------------------------- тексты

const CONTENT = {
  ru: {
    // «учёба за границей» — 370 запросов в месяц по KZ, UZ, KG, AZ,
    // «образование за рубежом» — 180, «обучение за рубежом» — 120
    // (DataForSEO, 24.09.2026). «Поступление за рубеж» даёт всего 50.
    seo: {
      title: "Обучение за рубежом: поступление в вузы Европы, ОАЭ и Азии",
      description:
        "Помогаем поступить в университеты Польши, Италии, Испании, Венгрии, Турции, ОАЭ, Малайзии, Грузии и Кипра. Подбор вуза, документы, виза. Консультация бесплатно."
    },
    hero: {
      mainHeadingStart: "Помогаем вам",
      mainHeadingHighlight: "правильно",
      mainHeadingContinue: "выбрать страну",
      mainHeadingEnd: "и поступить в университет.",
      heroDescription:
        "Кликните на флаг своей страны, чтобы узнать нюансы поступления именно для вас",
      mainHeadingH1: "Учёба за границей:",
      mainHeadingH1Highlight: "помощь в поступлении"
    },
    conditionsTitle:
      "Мы работаем с десятью странами и подбираем ту, где именно у вас шансы выше",
    conditionThird: {
      title: "Можно работать во время учёбы",
      description:
        "Правила отличаются от страны к стране: где-то разрешение не нужно, где-то есть лимит часов"
    },
    conditionFourth: {
      title: "Стоимость обучения от €160 до €24 000 в год",
      description: "Разброс большой — подбираем под ваш бюджет",
      linkLabel: "Сравнить страны по ценам и признанию диплома",
      linkDestination: "https://academgo.com/ru/ucheba-za-rubezhom"
    },
    countriesBlock: {
      title: "Десять стран,",
      titleHighlight: "одно агентство",
      description:
        "Польша остаётся нашим основным направлением: там процесс отлажен до мелочей. Рядом — ещё девять стран, от бюджетной Турции и Грузии до кампусов британских вузов в Дубае. На странице каждой — цены вузов с годом прайса, сроки и честно о признании диплома.",
      cardLinkLabel: "Подробнее",
      compareLabel: "Сравнить страны",
      compareLink: "/ru/ucheba-za-rubezhom"
    },
    faq: [
      {
        question: "Как выбрать страну для учёбы?",
        answer: `Отталкивайтесь от четырёх вещей: бюджет на год, язык программ, признание диплома там, где планируете работать, и ваши шансы на поступление с текущим аттестатом. Разброс по деньгам большой: от €160 в год в государственных вузах Италии до €24 000 на медицине на Кипре. Мы сравниваем ваш список программ по этим параметрам и говорим, где шансы выше. Все страны в одной таблице — на странице «Учёба за рубежом».`
      },
      {
        question: "Где дешевле всего учиться за границей?",
        answer: `Самый доступный старт на английском — Северный Кипр и Турция: бакалавриат в государственном вузе ТРСК стоит $4 450–6 400 в год, в турецких госвузах цены начинаются примерно от $500 в год. В Италии плата в государственных вузах зависит от дохода семьи и может начинаться от €160 в год, но там нужен итальянский или высокий балл на английской программе. Важно считать не только обучение: в Дубае жизнь обойдётся от 5 500 AED в месяц, а в Тбилиси — около 1 730 GEL.`
      },
      {
        question: "Признают ли диплом дома?",
        answer: `Зависит от страны. Дипломы вузов ЕС — Польши, Италии, Испании, Венгрии, Южного Кипра — признаются широко. В ОАЭ в филиалах диплом выдаёт головной вуз Великобритании или Австралии. А вот Северный Кипр признан только Турцией: диплом не признаётся в Европе напрямую, рабочий путь один — программа из справочника YÖK и легализация через турецкие органы. Мы говорим об этом до первого платежа, а не после выпуска.`
      }
    ]
  },
  en: {
    // "study abroad consultant" — 28 540 запросов в месяц суммарно
    // (12 100 в Индии), "education consultant" — 22 200, "overseas education
    // consultant" — 4 400 (DataForSEO, 24.09.2026). "study abroad programs"
    // (193k) не берём: это в основном американский интент «семестр за рубежом».
    seo: {
      title: "Study in Europe, Türkiye, the UAE & Asia — AcademGo",
      description:
        "Admission support for universities in Poland, Italy, Spain, Hungary, Türkiye, the UAE, Malaysia, Georgia and Cyprus. Documents, visa and support. Free consultation."
    },
    hero: {
      mainHeadingStart: "We help you",
      mainHeadingHighlight: "choose",
      mainHeadingContinue: "the right country",
      mainHeadingEnd: "and get into university.",
      heroDescription:
        "Click your country's flag to see what admission looks like for you",
      mainHeadingH1: "Study abroad consultants",
      mainHeadingH1Highlight: "for ten destinations"
    },
    conditionsTitle:
      "We work with ten destinations and pick the one where your chances are strongest",
    conditionThird: {
      title: "You can work while studying",
      description:
        "Rules differ by country: some need no permit, others cap your weekly hours"
    },
    conditionFourth: {
      title: "Tuition from €160 to €24,000 a year",
      description: "The range is wide — we match it to your budget",
      linkLabel: "Compare destinations by cost and degree recognition",
      linkDestination: "https://academgo.com/study-abroad"
    },
    countriesBlock: {
      title: "Ten destinations,",
      titleHighlight: "one agency",
      description:
        "Poland remains our main destination — the process there is worked out to the smallest detail. Alongside it are nine more, from affordable Türkiye and Georgia to UK branch campuses in Dubai. Each country page carries university prices with the year, deadlines and an honest take on degree recognition.",
      cardLinkLabel: "Learn more",
      compareLabel: "Compare destinations",
      compareLink: "/study-abroad"
    },
    faq: [
      {
        question: "How do I choose a country to study in?",
        answer: `Start from four things: your budget for the year, the language of instruction, whether the degree is recognised where you plan to work, and your chances with the grades you have. The spread is wide: from €160 a year at Italian public universities to €24,000 for medicine in Cyprus. We compare your shortlist on these points and tell you where your chances are strongest. All destinations sit in one table on the Study abroad page.`
      },
      {
        question: "Where is studying abroad cheapest?",
        answer: `The most affordable English-taught start is North Cyprus and Türkiye: a bachelor's at the public university in the TRNC costs $4,450–6,400 a year, and Turkish public universities start at around $500 a year. In Italy public tuition depends on family income and can start at €160 a year, but you need Italian or a strong profile for an English-taught programme. Count living costs too: Dubai runs from AED 5,500 a month, Tbilisi around GEL 1,730.`
      },
      {
        question: "Will my degree be recognised at home?",
        answer: `It depends on the destination. Degrees from EU universities — Poland, Italy, Spain, Hungary, Cyprus — are widely recognised. In the UAE, branch campuses award the degree of the UK or Australian home university. North Cyprus, however, is recognised only by Türkiye: the degree is not recognised in Europe directly, and the one working route is a YÖK-listed programme with legalisation through Turkish authorities. We say this before the first payment, not after graduation.`
      }
    ]
  }
};

// --------------------------------------------------------------- сбор страниц

const buildHomepage = (doc, content) => {
  // скрипт можно запускать повторно: вопросы, которые он уже добавил,
  // не дублируются, а обновляются
  const added = content.faq.map(item => item.question);

  const faqItems = [
    ...content.faq.map(item => ({
      _key: key(),
      question: item.question,
      answer: markdownToPortableText(item.answer)
    })),
    ...(doc.faq?.items || []).filter(item => !added.includes(item.question))
  ];

  return {
    ...doc,
    _id: doc._id.startsWith("drafts.") ? doc._id : `drafts.${doc._id}`,
    seo: { ...doc.seo, ...content.seo },
    ...content.hero,
    conditionsTitle: content.conditionsTitle,
    conditionThird: { ...doc.conditionThird, ...content.conditionThird },
    conditionFourth: { ...doc.conditionFourth, ...content.conditionFourth },
    countriesBlock: { ...doc.countriesBlock, ...content.countriesBlock },
    faq: { ...doc.faq, items: faqItems }
  };
};

// ------------------------------------------------------------------- запуск

const main = async () => {
  if (!token()) {
    console.error("Нет токена: добавьте SANITY_API_TOKEN в .env.local");
    process.exit(1);
  }

  // берём и черновик, и опубликованную версию: если черновик уже есть
  // (там стоит ссылка на общий квиз и блок стран), правим именно его
  const ids = Object.values(IDS).flatMap(id => [id, `drafts.${id}`]);
  const query = `*[_id in ${JSON.stringify(ids)}]{...}`;

  const response = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(
      query
    )}`,
    { headers: { Authorization: `Bearer ${token()}` } }
  );

  const { result: docs } = await response.json();
  const documents = [];

  for (const [lang, id] of Object.entries(IDS)) {
    const doc =
      docs.find(item => item._id === `drafts.${id}`) ||
      docs.find(item => item._id === id);

    if (!doc) {
      console.error(`Не найдена главная (${lang}): ${id}`);
      continue;
    }

    const draft = buildHomepage(doc, CONTENT[lang]);
    documents.push(draft);

    console.log(
      `главная (${lang}): заголовок «${draft.mainHeadingStart} ${draft.mainHeadingHighlight} ${draft.mainHeadingContinue} ${draft.mainHeadingEnd}», вопросов в FAQ ${draft.faq.items.length}`
    );
  }

  if (!APPLY) {
    console.log("\nСухой прогон. Для загрузки добавьте --apply");
    return;
  }

  const mutateResponse = await fetch(
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

  const result = await mutateResponse.json();

  if (!mutateResponse.ok) {
    console.error("Ошибка:", JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log("\nГотово: черновики главной обновлены.");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
