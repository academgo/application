/**
 * Переписывает три общие страницы под работу с десятью странами:
 * «О нас», «Стоимость услуг» и «Контакты» в обеих языковых версиях.
 *
 *   node content/import/common-pages.mjs            # сухой прогон
 *   node content/import/common-pages.mjs --apply    # загрузка черновиков
 *
 * Правки идут в черновики существующих страниц: живой сайт не меняется,
 * пока черновики не опубликуют. Существующие блоки (пакеты услуг, контакты,
 * отзывы, FAQ) сохраняются — добавляются и заменяются только тексты.
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

const PAGES = {
  about: {
    ru: "ed1a2aaf-2836-405b-aa68-4d791327656a",
    en: "4873ee21-9f2a-4704-9bba-2ab8a2ef1ce5"
  },
  prices: {
    ru: "7ea6b79a-c216-435b-a98e-924645a89518",
    en: "c8d2de2c-dfba-4a77-8278-02f7e88c7347"
  },
  contacts: {
    ru: "c1d92362-2478-4fc6-b82f-434fe9b3acb4",
    en: "0a719cd2-f12d-4547-b469-813916f825c4"
  }
};

const text = (markdown, marginBottom = "small") => ({
  _type: "textContent",
  _key: key(),
  marginBottom,
  content: markdownToPortableText(markdown)
});

const countries = (title, description) => ({
  _type: "countriesLinksBlock",
  _key: key(),
  title,
  description,
  excludeCurrent: false,
  showTuition: true
});

// ------------------------------------------------------------------ тексты

const CONTENT = {
  about: {
    ru: {
      seo: {
        metaTitle: "Об агентстве AcademGo: поступление в 10 стран",
        metaDescription:
          "AcademGo — образовательное агентство с офисом в Варшаве. Помогаем поступить в вузы Польши, Турции, ОАЭ, Малайзии, Италии, Испании, Венгрии, Грузии и на Кипр."
      },
      intro: `**AcademGo — образовательное агентство полного цикла с главным офисом в Варшаве.** Мы начинали с Польши и за годы работы довели поступление туда до отлаженного процесса. Сегодня мы работаем с десятью направлениями: к Польше добавились Турция, ОАЭ, Малайзия, Италия, Испания, Венгрия, Грузия, Северный и Южный Кипр.

Мы берём на себя бюрократию: подбор программы, документы, легализацию аттестата, визу и заселение. Родителям важно знать, что переезд ребёнка будет легальным и предсказуемым, — за это мы и отвечаем.

Первая консультация бесплатная: разбираем вашу ситуацию, оцениваем шансы и честно говорим, какая страна подходит под ваш бюджет и аттестат, а какая — нет.`,
      honestyTitle: `## О чём мы говорим прямо`,
      honesty: `Мы не продаём направление любой ценой. По каждой стране мы заранее проверяем то, о чём агентства обычно молчат.

Северный Кипр — самый доступный старт на английском, но республика признана только Турцией, и диплом не признаётся в Европе напрямую. Рабочий путь один: программа из справочника YÖK и легализация диплома через турецкие органы. Мы говорим об этом до первого платежа, а не после выпуска.

В Грузии аккредитация NCEQE признана WFME до ноября 2028 года, а для врачебной практики в стране нужен грузинский язык. В ОАЭ диплом выдаёт головной вуз Великобритании или Австралии — это плюс, и цена соответствующая. В Турции METU и в Италии Университет Болоньи официально не работают через агентства: туда абитуриент подаёт сам, а мы помогаем с подготовкой документов.

Все цены на сайте — из официальных прайсов вузов, с указанием года. Если проверенной цифры нет, мы пишем «уточним на консультации», а не придумываем.`,
      countriesTitle: "Куда мы помогаем поступить",
      countriesDescription:
        "Десять направлений: на странице каждого — цены вузов, сроки, требования и честный разбор, кому страна не подходит."
    },
    en: {
      seo: {
        metaTitle: "About AcademGo: Admission to Universities in 10 Countries",
        metaDescription:
          "AcademGo is an EU-registered education agency based in Warsaw. We help international students apply to universities in Poland, Türkiye, the UAE, Malaysia, Italy, Spain, Hungary, Georgia and Cyprus."
      },
      intro: `**AcademGo is a full-cycle education agency with its head office in Warsaw.** We started with Poland and turned admission there into a routine process. Today we work with ten destinations: alongside Poland there are Türkiye, the UAE, Malaysia, Italy, Spain, Hungary, Georgia, North Cyprus and Cyprus.

We take the paperwork off your hands: choosing the programme, documents, legalisation of the school certificate, the visa and moving in. What parents need to know is that the move will be legal and predictable — that is what we answer for.

The first consultation is free: we look at your case, assess your chances and say honestly which destination fits your budget and your grades — and which does not.`,
      honestyTitle: `## What we say out loud`,
      honesty: `We do not sell a destination at any cost. For every country we check in advance the things agencies usually keep quiet about.

North Cyprus is the most affordable English-taught start, but the republic is recognised only by Türkiye and the degree is not recognised in Europe directly. There is one working route: a YÖK-listed programme and legalisation of the degree through Turkish authorities. We say this before the first payment, not after graduation.

In Georgia, NCEQE accreditation is WFME-recognised until November 2028, and practising medicine there requires Georgian. In the UAE the degree is awarded by the UK or Australian home campus — a real advantage, and the price reflects it. In Türkiye METU and in Italy the University of Bologna do not work through agencies: applicants apply directly, and we help them prepare the documents.

Every price on this site comes from an official university price list, with the year stated. Where we have no verified figure, we write "we will confirm it during the consultation" instead of inventing one.`,
      countriesTitle: "Where we help you apply",
      countriesDescription:
        "Ten destinations: each country page carries university prices, deadlines, requirements and an honest note on who it does not suit."
    }
  },
  prices: {
    ru: {
      seo: {
        metaTitle: "Стоимость услуг AcademGo: пакеты и что в них входит",
        metaDescription:
          "Пакеты услуг AcademGo: поступление, виза, сопровождение и нострификация. Что входит в каждый пакет, как устроена оплата и как считается цена по другим странам."
      },
      intro: `**Цены на наши услуги одинаковые для всех десяти стран.** Поступаете вы в Польшу, Турцию, ОАЭ или на Кипр — пакет и его стоимость не меняются. Различается только процедура признания аттестата: где-то это Denklik, где-то омологация или NCEQE, и мы ведём ту, которая нужна вашей стране.

Договор заключаем до начала работы, оплата делится на два этапа: часть в начале и часть по факту выполненной работы. Выбрать пакет можно на бесплатной консультации — там же разберём вашу ситуацию и скажем, какой объём сопровождения вам действительно нужен.`,
      factorsTitle: `## Что меняется от страны к стране`,
      factors: `Меняется не цена, а состав процедур внутри той же работы:

- **Признание аттестата.** Denklik в Турции, омологация в Испании, CIMEA или Dichiarazione di valore в Италии, NCEQE в Грузии, нострификация в Польше.
- **Легализация документов.** В большинстве стран достаточно апостиля, в ОАЭ апостиль не принимают — идёт консульская легализация через четыре инстанции.
- **Кто подаёт на визу.** В Малайзии и на Южном Кипре заявку подаёт вуз, в Турции и Грузии — вы сами, и сопровождение устроено по-разному.
- **Порядок въезда.** Где-то нужна студенческая виза заранее, где-то въезд безвизовый, а ВНЖ оформляется уже на месте.`,
      packagesTitle: `## Выберите пакет`,
      packages: `Ниже — что входит в каждый пакет. Цена указана за полное сопровождение по выбранной стране, без скрытых доплат за «сложное» направление.`,
      processTitle: `## Что входит в работу по любой стране`,
      process: `- **Консультация и оценка шансов.** Разбираем аттестат, бюджет и язык, подбираем 3–4 программы в разных странах.
- **Подбор вуза и программы.** Проверяем требования, сроки набора и язык обучения по официальным источникам вуза.
- **Документы.** Собираем пакет, сопровождаем перевод, апостиль или консульскую легализацию, подаём заявки.
- **Признание аттестата.** Denklik в Турции, омологация в Испании, CIMEA или DOV в Италии, NCEQE в Грузии — процедура зависит от страны.
- **Виза или разрешение на въезд.** Готовим пакет, помогаем с записью, ведём дело до решения.
- **Заселение и статус.** Общежитие или квартира, оформление ВНЖ, первые шаги на месте.`,
      note: `Что в цену **не входит**: сборы вузов и государственные пошлины, апостиль и переводы, визовый сбор, страховка, депозит за обучение. Эти платежи вы делаете напрямую — мы называем их размер заранее, чтобы вы видели полный бюджет, а не только стоимость наших услуг.`,
      countriesTitle: "Направления",
      countriesDescription:
        "Стоимость обучения и жизни по каждой стране — на её странице."
    },
    en: {
      seo: {
        metaTitle: "AcademGo Service Prices: Packages and What They Include",
        metaDescription:
          "AcademGo service packages: admission, visa, support and nostrification. What each package includes, how payment works and how pricing is set for other destinations."
      },
      intro: `**Our fees are the same for all ten destinations.** Whether you apply to Poland, Türkiye, the UAE or Cyprus, the package and its price do not change. What differs is the recognition procedure for your school certificate — Denklik, homologación or NCEQE — and we handle whichever one your destination requires.

We sign a contract before the work begins, and payment is split into two stages: part at the start and part on completion. Choose a package during the free consultation, where we also go through your case and say how much support you actually need.`,
      factorsTitle: `## What changes from country to country`,
      factors: `Not the price — the procedures inside the same scope of work:

- **Recognition of your school certificate.** Denklik in Türkiye, homologación in Spain, CIMEA or Dichiarazione di valore in Italy, NCEQE in Georgia, nostrification in Poland.
- **Legalisation of documents.** An apostille is enough almost everywhere; the UAE does not accept one and requires consular legalisation through four authorities.
- **Who files the visa application.** In Malaysia and Cyprus the university does; in Türkiye and Georgia you do, and the support works differently.
- **How you enter.** Some destinations need a student visa in advance, others are visa-free with the residence permit filed on arrival.`,
      packagesTitle: `## Choose your package`,
      packages: `Here is what each package covers. The price is for full support in your chosen destination, with no surcharge for a "difficult" country.`,
      processTitle: `## What the work covers in any destination`,
      process: `- **Consultation and assessment.** We look at your grades, budget and language level and shortlist three or four programmes across destinations.
- **Choosing the university and programme.** We check requirements, intake dates and the language of instruction against the university's own sources.
- **Documents.** We assemble the pack, arrange translation, apostille or consular legalisation, and file the applications.
- **Recognition of your school certificate.** Denklik in Türkiye, homologación in Spain, CIMEA or DOV in Italy, NCEQE in Georgia — the procedure depends on the country.
- **Visa or entry permit.** We prepare the pack, help with the appointment and follow the case to the decision.
- **Arrival and status.** Accommodation, the residence permit, the first steps on the ground.`,
      note: `What the fee does **not** include: university and government fees, apostille and translations, the visa fee, insurance and the tuition deposit. You pay those directly — we tell you the amounts in advance so you see the full budget, not just our fee.`,
      countriesTitle: "Destinations",
      countriesDescription:
        "Tuition and living costs for each destination are on its own page."
    }
  },
  contacts: {
    ru: {
      seo: {
        metaTitle: "Контакты AcademGo: офис в Варшаве, WhatsApp и Telegram",
        metaDescription:
          "Связаться с AcademGo: офис на ul. Złota 7/28 в Варшаве, WhatsApp, Telegram и время работы. Бесплатная консультация по поступлению в вузы десяти стран."
      },
      intro: `Напишите нам в WhatsApp или Telegram — так быстрее всего. Можно прийти в офис в центре Варшавы: ul. Złota 7/28, в пяти минутах от Дворца культуры.

На консультации разбираем вашу ситуацию: аттестат, бюджет, язык и сроки. Подбираем 3–4 программы в разных странах и честно говорим, где шансы выше. Консультация бесплатная и ни к чему не обязывает.

Если пишете в мессенджер, сразу приложите аттестат с оценками и напишите, какие страны рассматриваете, — так мы ответим по делу с первого сообщения.`,
      countriesTitle: "По каким странам консультируем",
      countriesDescription:
        "Десять направлений. Если вы ещё не выбрали, начните со страницы сравнения — там цены, виза и признание диплома в одной таблице."
    },
    en: {
      seo: {
        metaTitle: "Contact AcademGo: Warsaw Office, WhatsApp and Telegram",
        metaDescription:
          "Contact AcademGo: office at ul. Złota 7/28 in Warsaw, WhatsApp, Telegram and opening hours. Free consultation on admission to universities in ten countries."
      },
      intro: `Message us on WhatsApp or Telegram — that is the fastest way. You are also welcome at the office in central Warsaw: ul. Złota 7/28, five minutes from the Palace of Culture.

In the consultation we go through your case: grades, budget, language and timing. We shortlist three or four programmes across destinations and say honestly where your chances are strongest. The consultation is free and commits you to nothing.

If you write to us on a messenger, attach your school certificate with grades and say which destinations you are considering — then our first reply is already about your case.`,
      countriesTitle: "Destinations we advise on",
      countriesDescription:
        "Ten destinations. If you have not chosen yet, start with the comparison page: prices, entry rules and degree recognition in one table."
    }
  }
};

// ------------------------------------------------------------- сбор страниц

const buildAbout = (doc, content) => {
  const blocks = [...doc.contentBlocks];

  // первый блок — вводный текст, переписываем его целиком
  blocks[0] = text(content.intro);

  const logosIndex = blocks.findIndex(block => block._type === "logosBlock");
  const insertAt = logosIndex === -1 ? 3 : logosIndex + 1;

  blocks.splice(
    insertAt,
    0,
    countries(content.countriesTitle, content.countriesDescription),
    text(`${content.honestyTitle}\n\n${content.honesty}`)
  );

  return blocks;
};

const buildPrices = (doc, content) => [
  text(content.intro),
  text(`${content.processTitle}\n\n${content.process}`),
  text(`${content.factorsTitle}\n\n${content.factors}`),
  countries(content.countriesTitle, content.countriesDescription),
  text(`${content.packagesTitle}\n\n${content.packages}`),
  // пакеты и таблица тарифов — общие для всех стран
  ...doc.contentBlocks,
  text(content.note, "large")
];

const buildContacts = (doc, content) => {
  const blocks = [...doc.contentBlocks];
  const contactsIndex = blocks.findIndex(
    block => block._type === "contactsBlock"
  );
  const insertAt = contactsIndex === -1 ? blocks.length : contactsIndex + 1;

  blocks.splice(
    insertAt,
    0,
    countries(content.countriesTitle, content.countriesDescription)
  );

  return [text(content.intro), ...blocks];
};

const BUILDERS = {
  about: buildAbout,
  prices: buildPrices,
  contacts: buildContacts
};

// ------------------------------------------------------------------- запуск

const main = async () => {
  if (!token()) {
    console.error("Нет токена: добавьте SANITY_API_TOKEN в .env.local");
    process.exit(1);
  }

  const ids = Object.values(PAGES).flatMap(page => Object.values(page));
  const query = `*[_id in ${JSON.stringify(ids)}]{...}`;

  const response = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(
      query
    )}`,
    { headers: { Authorization: `Bearer ${token()}` } }
  );

  const { result: docs } = await response.json();
  const documents = [];

  for (const [page, byLang] of Object.entries(PAGES)) {
    for (const [lang, id] of Object.entries(byLang)) {
      const doc = docs.find(item => item._id === id);

      if (!doc) {
        console.error(`Не найдена страница ${page} (${lang}): ${id}`);
        continue;
      }

      const content = CONTENT[page][lang];

      documents.push({
        ...doc,
        _id: `drafts.${id}`,
        seo: { ...doc.seo, ...content.seo },
        contentBlocks: BUILDERS[page](doc, content)
      });

      console.log(
        `${page} (${lang}): было ${doc.contentBlocks.length} блоков, стало ${
          documents[documents.length - 1].contentBlocks.length
        }`
      );
    }
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

  console.log("\nГотово: черновики обновлены.");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
