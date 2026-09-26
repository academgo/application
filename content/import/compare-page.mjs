/**
 * Страница сравнения стран под общие запросы: «обучение за границей»,
 * «магистратура за рубежом» (EN: study abroad, masters abroad).
 *
 *   node content/import/compare-page.mjs            # сухой прогон
 *   node content/import/compare-page.mjs --apply    # запись в черновики
 *
 * Меняет мета-теги и H1, добавляет раздел о магистратуре за рубежом (перед
 * «О чём стоит знать заранее») и FAQ (перед блоком «Другие страны»).
 * Цифры — только с наших страниц магистратуры и из таблицы сравнения стран
 * на этой же странице. Повторный запуск заменяет раздел и FAQ, а не дублирует.
 *
 * «Обучение за рубежом» закрывает главная, поэтому здесь — «за границей»:
 * две страницы не конкурируют за один запрос.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { key, markdownToPortableText } from "./markdown-to-portable-text.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");

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

const PAGES = {
  "academgo.compare.ru": {
    seo: {
      metaTitle: "Обучение за границей: сравнение 10 стран по цене и визе",
      metaDescription:
        "Где дешевле учиться за границей и как поступить в магистратуру за рубежом: стоимость обучения и жизни, язык, виза, работа и признание диплома в 10 странах."
    },
    h1: "Обучение за границей: где дешевле учиться — сравнение 10 стран",
    beforeHeading: "О чём стоит знать заранее",
    mastersHeading: "Магистратура за рубежом: сколько стоит и где учиться",
    masters: `## Магистратура за рубежом: сколько стоит и где учиться

Магистратура за рубежом открыта выпускникам бакалавриата из стран СНГ, но цена считается по-разному: где-то платят за каждый кредит ECTS, где-то — сразу за всю программу. Вот три направления, которые мы разобрали подробно.

- **Испания.** В госвузах около 82–84 € за кредит ECTS для студентов не из ЕС — примерно 5 000 € за год из 60 кредитов. Для официальной магистратуры омологация диплома не нужна: вуз сам проверяет уровень вашего диплома. Подробно — [магистратура в Испании](/ru/ucheba-v-ispanii/magistratura-v-ispanii).
- **Малайзия.** Программы на английском в государственных и частных вузах, примерно RM 26 500–79 100 за весь курс по действующим прайсам. Подробно — [магистратура в Малайзии](/ru/ucheba-v-malayzii/magistratura-v-malayzii).
- **ОАЭ.** Кампусы британских и австралийских университетов в Дубае: очная программа длится 12–16 месяцев, цены — от 76 491 AED за MSc в Middlesex. Диплом выдаёт головной университет. Подробно — [магистратура и MBA в Дубае](/ru/ucheba-v-oae/magistratura-i-mba-v-dubae).

По остальным странам начните со страницы направления — ссылки на все десять стран ниже.`,
    faqTitle: "Частые вопросы об обучении за границей",
    faq: [
      [
        "В какой стране дешевле всего учиться за границей?",
        "По прайсам вузов самый низкий порог — в государственных вузах Италии: от €160 в год, но плата зависит от дохода семьи (ISEE). В госвузах Турции обучение стоит от $500 в год. Кроме цены обучения считайте расходы на жизнь: они сведены в таблице выше по всем десяти странам."
      ],
      [
        "Где можно учиться за границей на английском?",
        "Программы на английском есть во всех десяти странах из сравнения. В ОАЭ, Малайзии, Грузии и на обоих Кипрах основной язык обучения — английский. В Испании большая часть программ на испанском, на английском — только часть."
      ],
      [
        "Сколько стоит магистратура за рубежом?",
        "Зависит от страны и формата. В госвузах Испании — около 82–84 € за кредит ECTS, примерно 5 000 € за год. В Малайзии — примерно RM 26 500–79 100 за весь курс. В Дубае — от 76 491 AED за MSc в Middlesex."
      ],
      [
        "Признают ли диплом дома?",
        "Дипломы вузов Польши, Италии, Испании, Венгрии и Южного Кипра — это дипломы вузов ЕС. В ОАЭ диплом выдаёт головной вуз в Великобритании или Австралии. Северный Кипр признан только Турцией, поэтому его диплом не признаётся в Европе напрямую — путь идёт через аккредитацию YÖK и легализацию в Турции. Признание в вашей стране проверяйте до поступления."
      ],
      [
        "Можно ли работать во время учёбы за границей?",
        "Правила разные. В Испании студент может работать до 30 часов в неделю без отдельного разрешения, в Италии — до 20 часов в неделю, в Турции — только с разрешением на работу. Условия по каждой стране — в таблице сравнения."
      ],
      [
        "С чего начать выбор страны?",
        "С бюджета на год и документов, которые у вас уже есть. Пришлите аттестат и бюджет — на бесплатной консультации подберём 3–4 программы в разных странах и честно скажем, где ваши шансы выше."
      ]
    ]
  },
  "academgo.compare.en": {
    seo: {
      metaTitle: "Study Abroad: 10 Countries Compared by Cost and Visa",
      metaDescription:
        "The cheapest countries to study abroad and master's options: tuition, living costs, language, visas, work rights and degree recognition in 10 countries."
    },
    h1: "Study abroad: the best and cheapest countries compared",
    beforeHeading: "What to know before you choose",
    mastersHeading: "Master's degree abroad: costs and where to study",
    masters: `## Master's degree abroad: costs and where to study

A master's abroad is open to bachelor's graduates, but each country prices it differently: some charge per ECTS credit, others for the whole programme. Here are three destinations we cover in detail.

- **Spain.** At public universities, non-EU students pay about 82–84 € per ECTS credit for a standard master's — roughly 4,900–5,100 € for a one-year, 60-credit programme. More in [masters in Spain](/study-in-spain/masters-in-spain).
- **Malaysia.** English-taught programmes at public and private universities, from about RM 26,500 to RM 79,100 for the whole programme. More in [masters in Malaysia](/study-in-malaysia/masters-in-malaysia).
- **UAE.** UK and Australian branch campuses in Dubai: most master's degrees cost roughly 76,000–175,000 AED, and an MBA about 85,000–118,000 AED in tuition at current prices. The degree is awarded by the parent university. More in [masters and MBA in Dubai](/study-in-uae/masters-and-mba-in-dubai).

For the other countries, start with the destination page — links to all ten are below.`,
    faqTitle: "Studying abroad: frequently asked questions",
    faq: [
      [
        "What is the cheapest country to study abroad?",
        "By university price lists, the lowest starting point is at Italian public universities: from €160 a year, but the fee depends on family income (ISEE). Public universities in Türkiye start from $500 a year. Add living costs as well — the table above compares them for all ten countries."
      ],
      [
        "Where can I study abroad in English?",
        "All ten destinations in the comparison have English-taught programmes. In the UAE, Malaysia, Georgia and both parts of Cyprus, English is the main language of study. In Spain most programmes are in Spanish, with only some in English."
      ],
      [
        "How much does a master's abroad cost?",
        "It depends on the country and the format. At Spanish public universities, about 82–84 € per ECTS credit, roughly 4,900–5,100 € a year. In Malaysia, about RM 26,500–79,100 for the whole programme. In Dubai, most master's degrees cost roughly 76,000–175,000 AED."
      ],
      [
        "Will my degree be recognised back home?",
        "Degrees from Poland, Italy, Spain, Hungary and Cyprus are EU degrees. In the UAE, the degree is awarded by the UK or Australian home campus. North Cyprus is recognised only by Türkiye, so its degrees are not recognised in Europe directly — the working route is YÖK accreditation and legalisation through Turkish authorities. Check recognition in your country before you apply."
      ],
      [
        "Can I work while studying abroad?",
        "The rules differ. In Spain students can work up to 30 hours a week with no separate permit, in Italy up to 20 hours a week, and in Türkiye only with a work permit. The comparison table shows the rules for each country."
      ],
      [
        "How do I choose a country?",
        "Start with your yearly budget and the documents you already have. Send us your school certificate and budget — in a free consultation we will shortlist 3–4 programmes in different countries and tell you honestly where your chances are best."
      ]
    ]
  }
};

const headingOf = block =>
  block._type === "textContent" && block.content?.[0]?.style === "h2"
    ? (block.content[0].children || []).map(child => child.text).join("")
    : null;

const paragraphs = text => markdownToPortableText(text);

const buildBlocks = (blocks, page) => {
  // Прошлая версия раздела и FAQ уходит — повторный запуск их заменяет
  const clean = blocks.filter(
    block =>
      headingOf(block) !== page.mastersHeading &&
      !(block._type === "accordionBlock" && block.title === page.faqTitle)
  );

  const sectionIndex = clean.findIndex(
    block => headingOf(block) === page.beforeHeading
  );
  if (sectionIndex < 0) throw new Error(`нет секции «${page.beforeHeading}»`);

  const masters = {
    _type: "textContent",
    _key: key(),
    marginBottom: "medium",
    content: markdownToPortableText(page.masters)
  };

  const faq = {
    _type: "accordionBlock",
    _key: key(),
    title: page.faqTitle,
    items: page.faq.map(([question, answer]) => ({
      _key: key(),
      question,
      answer: paragraphs(answer)
    }))
  };

  const next = [...clean];
  next.splice(sectionIndex, 0, masters);

  // FAQ — перед «Другими странами», если блока нет — в конец
  const linksIndex = next.findIndex(
    block => block._type === "countriesLinksBlock"
  );
  next.splice(linksIndex < 0 ? next.length : linksIndex, 0, faq);

  return next;
};

const api = async (endpoint, body) => {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/${endpoint}`;
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));
  return json;
};

const main = async () => {
  if (!token()) throw new Error("Нет SANITY_API_WRITE_TOKEN в .env.local");

  const ids = Object.keys(PAGES).map(id => `drafts.${id}`);
  const params = new URLSearchParams({
    perspective: "raw",
    query: "*[_id in $ids]{_id, _rev, contentBlocks}",
    $ids: JSON.stringify(ids)
  });
  const { result: docs } = await api(`query/${DATASET}?${params}`);

  const mutations = [];
  for (const [id, page] of Object.entries(PAGES)) {
    const doc = docs.find(item => item._id === `drafts.${id}`);
    if (!doc) throw new Error(`черновик ${id} не найден`);

    const blocks = buildBlocks(doc.contentBlocks || [], page);
    mutations.push({
      patch: {
        id: doc._id,
        ifRevisionID: doc._rev,
        set: {
          "seo.metaTitle": page.seo.metaTitle,
          "seo.metaDescription": page.seo.metaDescription,
          "coverBlock.coverTitle": page.h1,
          contentBlocks: blocks
        }
      }
    });

    console.log(`${id}`);
    console.log(
      `  title (${page.seo.metaTitle.length}): ${page.seo.metaTitle}`
    );
    console.log(
      `  description (${page.seo.metaDescription.length}): ${page.seo.metaDescription}`
    );
    console.log(`  H1: ${page.h1}`);
    console.log(
      `  + раздел «${page.mastersHeading}», FAQ: ${page.faq.length} вопросов`
    );
    console.log(`  блоки: ${blocks.map(block => block._type).join(", ")}`);
  }

  if (!APPLY) {
    console.log("\nСухой прогон. Для записи: --apply");
    return;
  }

  await api(`mutate/${DATASET}`, { mutations });
  console.log(`\nЗаписано: ${mutations.length}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
