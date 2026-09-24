/**
 * Импорт готовых страниц из content/drafts в Sanity.
 *
 * По умолчанию — сухой прогон: пишет documents.ndjson и отчёт, ничего не
 * отправляя. С флагом --apply отправляет мутации в dataset (нужен токен).
 *
 *   node content/import/import-to-sanity.mjs                    # сухой прогон
 *   node content/import/import-to-sanity.mjs --only turkey      # одна страна
 *   node content/import/import-to-sanity.mjs --apply            # загрузка
 *   node content/import/import-to-sanity.mjs --apply --publish  # сразу опубликовать
 *
 * Токен: SANITY_API_WRITE_TOKEN в .env.local (права Editor).
 * Без --publish документы создаются черновиками (drafts.*): на живом сайте
 * они не видны, а на preview-деплое открываются.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseDraft } from "./parse-draft.mjs";
import { quizRef, SURVEY_TITLE } from "./quiz.mjs";
import { withCrossLinks } from "./cross-links.mjs";
import { withLeadMagnet } from "./lead-magnets.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const DRAFTS_DIR = path.join(ROOT, "content/drafts");
const OUT_DIR = path.join(__dirname, "out");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const PUBLISH = args.includes("--publish");
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;

/**
 * Данные для таблицы сравнения. Все значения взяты из сводок фактов и хабов
 * стран; там, где проверенной цифры нет, поле оставлено пустым — в таблице
 * выводится прочерк, а не догадка.
 */
const COUNTRIES = {
  turkey: {
    ru: "Турция",
    en: "Turkey",
    order: 10,
    comparison: {
      ru: {
        tuitionFrom: "от $500 в год в госвузах, от $4 000 в частных (2025/26)",
        livingCostFrom: "от $700 в месяц (Стамбул)",
        languageOfStudy: "английский и турецкий",
        visa: "для большинства стран СНГ безвиз, затем студенческий ВНЖ (икамет)",
        workRights: "только с разрешением на работу (çalışma izni)",
        degreeRecognition:
          "вузы с аккредитацией YÖK; признание диплома зависит от вашей страны",
        medicineInEnglish: true
      },
      en: {
        tuitionFrom:
          "from $500 a year at public, from $4,000 at private universities (2025/26)",
        livingCostFrom: "from $700 a month (Istanbul)",
        languageOfStudy: "English and Turkish",
        visa: "student visa, then a student residence permit (ikamet)",
        workRights: "only with a work permit (çalışma izni)",
        degreeRecognition:
          "YÖK-accredited universities; recognition depends on your home country",
        medicineInEnglish: true
      }
    }
  },
  uae: {
    ru: "ОАЭ",
    en: "UAE",
    order: 20,
    comparison: {
      ru: {
        tuitionFrom:
          "примерно 60 000–80 000 AED в год в филиалах (≈$16–22 тыс., 2026/27)",
        livingCostFrom: "от 5 500 AED в месяц (Дубай)",
        languageOfStudy: "английский",
        visa: "студенческая виза, спонсор — вуз",
        workRights: "ограниченно и только по разрешённым схемам",
        degreeRecognition: "диплом головного вуза Великобритании или Австралии"
      },
      en: {
        tuitionFrom:
          "about AED 60,000–80,000 a year at branch campuses (2026/27)",
        livingCostFrom: "from AED 5,500 a month (Dubai)",
        languageOfStudy: "English",
        visa: "student visa sponsored by the university",
        workRights: "limited, only through approved schemes",
        degreeRecognition: "degree awarded by the UK or Australian home campus"
      }
    }
  },
  malaysia: {
    ru: "Малайзия",
    en: "Malaysia",
    order: 30,
    comparison: {
      ru: {
        tuitionFrom: "примерно RM 35 000–45 000 в год в частных вузах (2026)",
        livingCostFrom: "от RM 2 000 в месяц (Куала-Лумпур)",
        languageOfStudy: "английский",
        visa: "Student Pass через EMGS, одобрение до въезда",
        workRights:
          "до 20 часов в неделю в каникулы, с разрешения иммиграции",
        degreeRecognition:
          "аккредитация MQA; признание в своей стране уточняйте отдельно",
        medicineInEnglish: true
      },
      en: {
        tuitionFrom:
          "about RM 35,000–45,000 a year at private universities (2026)",
        livingCostFrom: "from RM 2,000 a month (Kuala Lumpur)",
        languageOfStudy: "English",
        visa: "Student Pass through EMGS, approved before you travel",
        workRights: "up to 20 hours a week during breaks, with approval",
        degreeRecognition:
          "MQA accreditation; check recognition in your home country",
        medicineInEnglish: true
      }
    }
  },
  italy: {
    ru: "Италия",
    en: "Italy",
    order: 40,
    comparison: {
      ru: {
        tuitionFrom:
          "от €160 в год в госвузах (плата зависит от дохода, ISEE), 2026/27",
        livingCostFrom: "примерно €1 100–1 400 в месяц в Милане",
        languageOfStudy: "итальянский и английский",
        visa: "виза D через Universitaly, затем permesso di soggiorno",
        workRights: "до 20 часов в неделю и до 1 040 часов в год",
        degreeRecognition: "диплом вуза ЕС",
        medicineInEnglish: true
      },
      en: {
        tuitionFrom:
          "from €160 a year at public universities (income-based, ISEE), 2026/27",
        livingCostFrom: "about €1,100–1,400 a month in Milan",
        languageOfStudy: "Italian and English",
        visa: "type D visa via Universitaly, then a residence permit",
        workRights: "up to 20 hours a week and 1,040 hours a year",
        degreeRecognition: "EU degree",
        medicineInEnglish: true
      }
    }
  },
  spain: {
    ru: "Испания",
    en: "Spain",
    order: 50,
    comparison: {
      ru: {
        tuitionFrom:
          "примерно €1 200–8 200 в год в госвузах, частные дороже (2026/27)",
        livingCostFrom: "от €600 в месяц (минимум по IPREM — €7 200 на год)",
        languageOfStudy: "испанский, часть программ на английском",
        visa: "студенческая виза, затем карта TIE",
        workRights: "до 30 часов в неделю, отдельное разрешение не нужно",
        degreeRecognition: "диплом вуза ЕС",
        medicineInEnglish: false
      },
      en: {
        tuitionFrom:
          "about €1,200–8,200 a year at public universities; private cost more (2026/27)",
        livingCostFrom: "from €600 a month (IPREM minimum: €7,200 a year)",
        languageOfStudy: "Spanish; some programmes in English",
        visa: "student visa, then a TIE card",
        workRights: "up to 30 hours a week, no separate permit needed",
        degreeRecognition: "EU degree",
        medicineInEnglish: false
      }
    }
  },
  hungary: {
    ru: "Венгрия",
    en: "Hungary",
    order: 60,
    comparison: {
      ru: {
        tuitionFrom:
          "примерно €6 000–10 000 в год на английском (2025/26–2026/27)",
        livingCostFrom: "примерно €800–1 300 в месяц (Будапешт)",
        languageOfStudy: "английский; венгерский нужен для работы с пациентами",
        visa: "виза D, затем ВНЖ",
        workRights:
          "до 30 часов в неделю, на каникулах полный день до 90 дней в году",
        degreeRecognition: "диплом вуза ЕС",
        medicineInEnglish: true
      },
      en: {
        tuitionFrom:
          "about €6,000–10,000 a year in English (2025/26–2026/27)",
        livingCostFrom: "about €800–1,300 a month (Budapest)",
        languageOfStudy: "English; Hungarian is needed for clinical work",
        visa: "type D visa, then a residence permit",
        workRights:
          "up to 30 hours a week; full time during breaks, max 90 days a year",
        degreeRecognition: "EU degree",
        medicineInEnglish: true
      }
    }
  },
  georgia: {
    ru: "Грузия",
    en: "Georgia",
    order: 70,
    comparison: {
      ru: {
        tuitionFrom:
          "MD на английском: $5 900–6 500 в частных вузах, $8 000 в государственных (2026/27)",
        livingCostFrom: "около 1 730 GEL в месяц без аренды (Тбилиси, Numbeo)",
        languageOfStudy: "английский",
        visa: "въезд по безвизу для многих стран, затем учебный ВНЖ",
        degreeRecognition:
          "аккредитация NCEQE, признанная WFME до 11.2028; для врачебной практики нужен грузинский",
        medicineInEnglish: true
      },
      en: {
        tuitionFrom:
          "MD in English: $5,900–6,500 at private, $8,000 at public universities (2026/27)",
        livingCostFrom: "about GEL 1,730 a month without rent (Tbilisi, Numbeo)",
        languageOfStudy: "English",
        visa: "visa-free entry for many countries, then a student residence permit",
        degreeRecognition:
          "NCEQE accreditation, WFME-recognised until 11.2028; Georgian is required to practise",
        medicineInEnglish: true
      }
    }
  },
  "north-cyprus": {
    ru: "Северный Кипр",
    en: "North Cyprus",
    order: 80,
    comparison: {
      ru: {
        tuitionFrom:
          "$4 450–6 400 в год в госвузе EMU; €2 800–4 500 в частных вузах со скидкой (2026/27)",
        languageOfStudy: "английский",
        visa: "студенческий вид на жительство ТРСК",
        degreeRecognition:
          "ТРСК признана только Турцией: диплом не признаётся в Европе напрямую, путь — аккредитация YÖK и легализация через турецкие органы",
        medicineInEnglish: true
      },
      en: {
        tuitionFrom:
          "$4,450–6,400 a year at EMU (public); €2,800–4,500 at private universities after the standard discount (2026/27)",
        languageOfStudy: "English",
        visa: "TRNC student residence permit",
        degreeRecognition:
          "the TRNC is recognised only by Türkiye: degrees are not recognised in Europe directly — the working route is YÖK accreditation and legalisation through Turkish authorities",
        medicineInEnglish: true
      }
    }
  },
  "south-cyprus": {
    ru: "Южный Кипр",
    en: "Cyprus",
    order: 90,
    comparison: {
      ru: {
        tuitionFrom:
          "примерно €9 000–11 820 в год в частных вузах; медицина €23 000–24 000 (2026/27)",
        livingCostFrom:
          "аренда €600–1 000 плюс €600–900 в месяц прочих расходов (оценка вузов)",
        languageOfStudy: "английский",
        visa: "entry permit, заявку подаёт вуз",
        workRights:
          "до 20 часов в неделю в семестр и до 38 на каникулах, в разрешённых отраслях",
        degreeRecognition: "диплом вуза ЕС",
        medicineInEnglish: true
      },
      en: {
        tuitionFrom:
          "about €9,000–11,820 a year at private universities; medicine €23,000–24,000 (2026/27)",
        livingCostFrom:
          "rent €600–1,000 plus €600–900 a month for other costs (university estimates)",
        languageOfStudy: "English",
        visa: "entry permit applied for by the university",
        workRights:
          "up to 20 hours a week in term time and 38 during breaks, in permitted sectors",
        degreeRecognition: "EU degree",
        medicineInEnglish: true
      }
    }
  }
};

const TOKEN_NAMES = ["SANITY_API_WRITE_TOKEN", "SANITY_API_TOKEN"];

const readToken = () => {
  const envPath = path.join(ROOT, ".env.local");

  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

    for (const name of TOKEN_NAMES) {
      const line = lines.find(item => item.startsWith(`${name}=`));
      if (line) return line.split("=").slice(1).join("=").trim();
    }
  }

  return TOKEN_NAMES.map(name => process.env[name]).find(Boolean);
};

const weakRef = id => ({ _type: "reference", _ref: id, _weak: true });

const docId = (parts, isDraft) =>
  `${isDraft ? "drafts." : ""}academgo.${parts.join(".")}`;

const slugFromUrl = url => {
  const segments = url.split("/").filter(Boolean);
  return segments[0] === "ru" ? segments.slice(1) : segments;
};

const menuLabel = metaTitle =>
  (metaTitle || "")
    .split(":")[0]
    .replace(/\s+20\d\d(\/\d\d)?$/, "")
    .trim();

const universityTitle = h1 => (h1 || "").split(/[:—(]/)[0].trim();

// ---------------------------------------------------------------- сбор страниц

const collectPages = () => {
  const countries = fs
    .readdirSync(DRAFTS_DIR)
    .filter(name => fs.statSync(path.join(DRAFTS_DIR, name)).isDirectory())
    .filter(name => !ONLY || name === ONLY);

  const pages = [];
  const warnings = [];

  for (const country of countries) {
    const countryDir = path.join(DRAFTS_DIR, country);

    for (const folder of fs.readdirSync(countryDir)) {
      const draftPath = path.join(countryDir, folder, "draft.md");
      if (!fs.existsSync(draftPath)) continue;

      const lang = /-(ru|en)$/.exec(folder)?.[1] || "ru";
      const parsed = parseDraft(draftPath, {
        quizRef: quizRef(lang),
        surveyTitle: SURVEY_TITLE[lang]
      });
      warnings.push(...parsed.warnings);

      const name = folder.replace(/-(ru|en)$/, "");

      pages.push({
        country,
        folder,
        name,
        lang: parsed.frontmatter.lang || lang,
        draftPath,
        ...parsed
      });
    }
  }

  return { pages, warnings };
};

// ------------------------------------------------------------ сбор документов

const buildDocuments = pages => {
  const documents = [];
  const isDraft = !PUBLISH;

  const pageId = page =>
    docId([page.country, page.name, page.lang], isDraft);
  const publishedPageId = page => docId([page.country, page.name, page.lang]);

  const hubOf = (country, lang) =>
    pages.find(
      page =>
        page.country === country &&
        page.lang === lang &&
        page.frontmatter.page_type === "country-hub"
    );

  for (const page of pages) {
    const { frontmatter } = page;
    const segments = slugFromUrl(frontmatter.url);
    const slug = segments[segments.length - 1];
    const isHub = frontmatter.page_type === "country-hub";
    const hub = hubOf(page.country, page.lang);

    const base = {
      _id: pageId(page),
      _type: isHub ? "singlepage" : "subpage",
      title: frontmatter.h1,
      // короткое название для хлебных крошек и меню
      shortTitle: isHub
        ? menuLabel(frontmatter.meta_title)
        : frontmatter.page_type === "university-card"
          ? universityTitle(frontmatter.h1)
          : menuLabel(frontmatter.meta_title),
      slug: {
        _type: "localizedSlug",
        [page.lang]: { _type: "slug", current: slug }
      },
      seo: {
        metaTitle: frontmatter.meta_title,
        metaDescription: frontmatter.meta_description
      },
      coverBlock: {
        coverTitle: frontmatter.h1,
        coverText: frontmatter.cover_text
      },
      contentBlocks: withCrossLinks({
        contentBlocks: withLeadMagnet({
          contentBlocks: page.contentBlocks,
          pageType: frontmatter.page_type,
          pageName: page.name,
          lang: page.lang
        }),
        pageType: frontmatter.page_type,
        countryCode: page.country,
        countryTitle: COUNTRIES[page.country]?.[page.lang] || page.country,
        lang: page.lang
      }),
      videoPlan: page.videoPlan,
      pageType: frontmatter.page_type,
      country: weakRef(docId(["country", page.country, page.lang])),
      language: page.lang,
      publishedAt: new Date().toISOString()
    };

    if (!isHub && hub) {
      base.parentPage = weakRef(publishedPageId(hub));
    }

    documents.push(base);
  }

  // страны + связи языковых версий
  const countryCodes = [...new Set(pages.map(page => page.country))];

  for (const code of countryCodes) {
    const config = COUNTRIES[code];
    if (!config) continue;

    for (const lang of ["ru", "en"]) {
      const hub = hubOf(code, lang);
      if (!hub) continue;

      const topics = pages
        .filter(
          page =>
            page.country === code &&
            page.lang === lang &&
            page.frontmatter.page_type === "topic"
        )
        .sort((a, b) => a.name.localeCompare(b.name));

      documents.push({
        _id: docId(["country", code, lang], !PUBLISH),
        _type: "country",
        title: config[lang],
        code,
        order: config.order,
        isFeatured: true,
        ...(config.comparison?.[lang]
          ? { comparison: config.comparison[lang] }
          : {}),
        hubPage: weakRef(publishedPageId(hub)),
        menuLinks: topics.map((topic, index) => ({
          _key: `menu${index}`,
          label: menuLabel(topic.frontmatter.meta_title),
          page: weakRef(publishedPageId(topic))
        })),
        language: lang
      });
    }

    // университеты
    for (const lang of ["ru", "en"]) {
      const cards = pages
        .filter(
          page =>
            page.country === code &&
            page.lang === lang &&
            page.frontmatter.page_type === "university-card"
        )
        .sort((a, b) => a.name.localeCompare(b.name));

      cards.forEach((card, index) => {
        documents.push({
          _id: docId(["university", code, card.name, lang], !PUBLISH),
          _type: "university",
          title: universityTitle(card.frontmatter.h1),
          country: weakRef(docId(["country", code, lang])),
          page: weakRef(publishedPageId(card)),
          order: (index + 1) * 10,
          language: lang
        });
      });
    }
  }

  // translation.metadata — связь ru/en версий
  const pairs = new Map();

  for (const page of pages) {
    const pairKey = `${page.country}.${page.name}`;
    if (!pairs.has(pairKey)) pairs.set(pairKey, {});
    pairs.get(pairKey)[page.lang] = page;
  }

  for (const [pairKey, pair] of pairs) {
    if (!pair.ru || !pair.en) continue;

    documents.push({
      _id: docId(["tm", pairKey]),
      _type: "translation.metadata",
      schemaTypes: [
        pair.ru.frontmatter.page_type === "country-hub"
          ? "singlepage"
          : "subpage"
      ],
      translations: ["ru", "en"].map(lang => ({
        _key: lang,
        _type: "internationalizedArrayReferenceValue",
        value: weakRef(publishedPageId(pair[lang]))
      }))
    });
  }

  for (const code of countryCodes) {
    if (!COUNTRIES[code]) continue;

    documents.push({
      _id: docId(["tm", "country", code]),
      _type: "translation.metadata",
      schemaTypes: ["country"],
      translations: ["ru", "en"].map(lang => ({
        _key: lang,
        _type: "internationalizedArrayReferenceValue",
        value: weakRef(docId(["country", code, lang]))
      }))
    });
  }

  return documents;
};

// ------------------------------------------------------------------- загрузка

const sendMutations = async documents => {
  const token = readToken();

  if (!token) {
    console.error(
      "Нет токена. Добавьте SANITY_API_WRITE_TOKEN в .env.local (права Editor)."
    );
    process.exit(1);
  }

  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const chunkSize = 20;

  for (let i = 0; i < documents.length; i += chunkSize) {
    const chunk = documents.slice(i, i + chunkSize);
    const mutations = chunk.map(document => ({ createOrReplace: document }));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ mutations })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Ошибка загрузки:", JSON.stringify(result, null, 2));
      process.exit(1);
    }

    console.log(
      `Загружено ${Math.min(i + chunkSize, documents.length)} из ${documents.length}`
    );
  }
};

// ----------------------------------------------------------------------- main

const main = async () => {
  const { pages, warnings } = collectPages();

  if (!pages.length) {
    console.error("Не найдено ни одной страницы в content/drafts");
    process.exit(1);
  }

  const documents = buildDocuments(pages);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, "documents.ndjson"),
    documents.map(document => JSON.stringify(document)).join("\n") + "\n"
  );

  const byType = documents.reduce((acc, document) => {
    acc[document._type] = (acc[document._type] || 0) + 1;
    return acc;
  }, {});

  console.log(`Страниц разобрано: ${pages.length}`);
  console.log("Документов:", byType);
  console.log(
    `Режим: ${PUBLISH ? "публикация" : "черновики (drafts.*)"}${
      APPLY ? ", загрузка в Sanity" : ", сухой прогон"
    }`
  );

  if (warnings.length) {
    console.log("\nПредупреждения:");
    warnings.slice(0, 40).forEach(warning => console.log(" -", warning));
    if (warnings.length > 40) {
      console.log(` … ещё ${warnings.length - 40}`);
    }
  }

  if (APPLY) {
    await sendMutations(documents);
    console.log("Готово.");
  } else {
    console.log(`\nNDJSON: ${path.join(OUT_DIR, "documents.ndjson")}`);
  }
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
