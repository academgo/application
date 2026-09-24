import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_FILE = path.join(__dirname, "lead-magnet-assets.json");

const key = () => crypto.randomBytes(6).toString("hex");

const assets = fs.existsSync(ASSETS_FILE)
  ? JSON.parse(fs.readFileSync(ASSETS_FILE, "utf8"))
  : {};

/**
 * Тексты блоков скачивания. Сами PDF собираются из content/lead-magnets
 * и загружаются в Sanity скриптом upload-lead-magnets.mjs.
 */
const MAGNETS = {
  motivation: {
    ru: {
      title: "Мотивационное письмо: шаблон и разбор по абзацам",
      description:
        "Готовый каркас письма на английском с объяснением, что должно быть в каждом абзаце, и список ошибок, из-за которых письмо не работает.",
      bullets: [
        "Где письмо действительно спрашивают, а где оно не нужно",
        "Шаблон на пять абзацев с примерами формулировок",
        "Как усилить письмо конкретикой и цифрами",
        "Семь ошибок и чек-лист перед отправкой"
      ],
      magnetName: "Мотивационное письмо: шаблон (PDF)",
      formTitle: "Куда отправить шаблон?",
      buttonText: "Скачать шаблон"
    },
    en: {
      title: "Motivation letter: template and a paragraph-by-paragraph guide",
      description:
        "A ready skeleton in English with a note on what each paragraph has to do, plus the mistakes that make a letter useless.",
      bullets: [
        "Where a letter is really required and where it is not",
        "A five-paragraph template with example wording",
        "How to strengthen it with specifics and numbers",
        "Seven mistakes and a checklist before you send"
      ],
      magnetName: "Motivation letter template (PDF)",
      formTitle: "Where should we send the template?",
      buttonText: "Download the template"
    }
  },
  ielts: {
    ru: {
      title: "IELTS: какой балл нужен и где можно без него",
      description:
        "Проверенные пороги вузов девяти стран, альтернативы сертификату и случаи, когда экзамен вообще не нужен.",
      bullets: [
        "Таблица порогов по 20 вузам: бакалавриат, магистратура, медицина",
        "Где принимают внутренний экзамен вуза вместо IELTS",
        "TOEFL, PTE, Duolingo, MUET: что засчитывают",
        "Пять ошибок, из-за которых экзамен приходится пересдавать"
      ],
      magnetName: "IELTS: пороги вузов (PDF)",
      formTitle: "Куда отправить гид?",
      buttonText: "Скачать гид"
    },
    en: {
      title: "IELTS: the score you need and where you can skip it",
      description:
        "Checked thresholds at universities across nine destinations, accepted alternatives, and the cases where no certificate is needed.",
      bullets: [
        "A table of thresholds at 20 universities: bachelor's, master's, medicine",
        "Where the university's own English exam replaces IELTS",
        "TOEFL, PTE, Duolingo, MUET: what counts",
        "Five mistakes that force a retake"
      ],
      magnetName: "IELTS thresholds guide (PDF)",
      formTitle: "Where should we send the guide?",
      buttonText: "Download the guide"
    }
  },
  comparison: {
    ru: {
      title: "9 стран в одной таблице — скачайте сравнение",
      description:
        "Стоимость обучения и жизни, язык программ, виза, работа и признание диплома по девяти направлениям. Цены официальные, с указанием года прайса.",
      bullets: [
        "Обучение и жизнь: от $500 в год в Турции до €24 000 на медицине Кипра",
        "Виза, статус и право на работу по каждой стране",
        "Честно о признании диплома, включая Северный Кипр и Грузию",
        "Где медицину преподают на английском"
      ],
      magnetName: "Сравнение 9 стран (PDF)",
      formTitle: "Куда отправить файл?",
      buttonText: "Скачать сравнение"
    },
    en: {
      title: "Nine destinations in one table",
      description:
        "Tuition and living costs, language of study, entry rules, work rights and degree recognition across nine destinations. Official prices with the year stated.",
      bullets: [
        "Tuition and living costs, from $500 a year in Türkiye to €24,000 for medicine in Cyprus",
        "Entry, status and work rights for each destination",
        "An honest take on degree recognition, including North Cyprus and Georgia",
        "Where medicine is taught in English"
      ],
      magnetName: "Nine destinations compared (PDF)",
      formTitle: "Where should we send the file?",
      buttonText: "Download the comparison"
    }
  },
  documents: {
    ru: {
      title: "Документы и легализация аттестата: чек-лист по 9 странам",
      description:
        "Где хватит апостиля, где нужна консульская легализация и какое отдельное признание аттестата требует каждая страна. С порядком шагов и сроками.",
      bullets: [
        "Базовый пакет документов, который нужен везде",
        "Апостиль или консульская легализация — таблица по странам",
        "Denklik, омологация, CIMEA, NCEQE: что это и сколько занимает",
        "Три ошибки, из-за которых поступление срывается на год"
      ],
      magnetName: "Документы и легализация (PDF)",
      formTitle: "Куда отправить чек-лист?",
      buttonText: "Скачать чек-лист"
    },
    en: {
      title: "Documents and legalisation: a checklist for nine destinations",
      description:
        "Where an apostille is enough, where consular legalisation is required, and what separate recognition step each destination asks for — with the order of steps and timings.",
      bullets: [
        "The basic document pack needed everywhere",
        "Apostille or consular legalisation — a table by destination",
        "Denklik, homologación, CIMEA, NCEQE: what they are and how long they take",
        "Three mistakes that cost applicants a year"
      ],
      magnetName: "Documents and legalisation (PDF)",
      formTitle: "Where should we send the checklist?",
      buttonText: "Download the checklist"
    }
  },
  questions: {
    ru: {
      title: "14 вопросов вузу до оплаты депозита",
      description:
        "Депозит почти всегда невозвратный. Эти вопросы задают письмом до платежа — и сохраняют ответ вуза в переписке.",
      bullets: [
        "Что спросить о программе, аккредитации и дипломе",
        "Что не входит в стоимость обучения и когда возвращают депозит",
        "Кто подаёт документы на визу — вы или вуз",
        "Пять красных флагов, после которых платить не стоит"
      ],
      magnetName: "14 вопросов вузу (PDF)",
      formTitle: "Куда отправить список вопросов?",
      buttonText: "Скачать список"
    },
    en: {
      title: "14 questions to ask before you pay the deposit",
      description:
        "Deposits are almost never refundable. Ask these by email before paying — and keep the university's answer on record.",
      bullets: [
        "What to ask about the programme, accreditation and the degree",
        "What tuition does not include and when a deposit is refunded",
        "Who files the visa application — you or the university",
        "Five red flags that mean you should not pay"
      ],
      magnetName: "14 questions before the deposit (PDF)",
      formTitle: "Where should we send the list?",
      buttonText: "Download the list"
    }
  }
};

const COMMON = {
  ru: {
    nameLabel: "Имя",
    emailLabel: "E-mail",
    policyText: "Согласен на обработку персональных данных",
    successText: "Готово — файл открывается в новой вкладке.",
    errorText: "Что-то пошло не так. Попробуйте ещё раз."
  },
  en: {
    nameLabel: "Name",
    emailLabel: "E-mail",
    policyText: "I agree to the processing of my personal data",
    successText: "Done — the file is opening in a new tab.",
    errorText: "Something went wrong. Please try again."
  }
};

/** Какой материал уместнее на каком типе страницы */
const BY_PAGE_TYPE = {
  "country-hub": "comparison",
  "university-card": "questions",
  topic: "documents"
};

/**
 * Тематические страницы получают материал по своей теме: поступление и
 * магистратура — письмо, программы на английском — гид по IELTS,
 * остальное — чек-лист документов.
 */
const BY_TOPIC = {
  admission: "motivation",
  masters: "motivation",
  "masters-mba": "motivation",
  stipendium: "motivation",
  burslari: "motivation",
  dsu: "motivation",
  medicine: "ielts",
  universities: "ielts"
};

export const leadMagnetBlock = (magnet, lang) => {
  const content = MAGNETS[magnet]?.[lang];
  const assetId = assets[`${magnet}-${lang}`];

  if (!content || !assetId) return null;

  return {
    _type: "leadMagnetBlock",
    _key: key(),
    ...content,
    ...COMMON[lang],
    file: {
      _type: "file",
      asset: { _type: "reference", _ref: assetId }
    }
  };
};

/**
 * Ставит блок скачивания перед завершающим призывом к действию.
 * Тип материала зависит от типа страницы, чтобы один и тот же PDF
 * не повторялся на соседних страницах.
 */
export const withLeadMagnet = ({
  contentBlocks,
  pageType,
  pageName,
  lang,
  magnet
}) => {
  const name =
    magnet ||
    (pageType === "topic" && BY_TOPIC[pageName]) ||
    BY_PAGE_TYPE[pageType];
  if (!name) return contentBlocks;

  const block = leadMagnetBlock(name, lang);
  if (!block) return contentBlocks;

  const ctaIndex = contentBlocks.findIndex(
    item => item._type === "textContent" && item.marginBottom === "large"
  );

  if (ctaIndex === -1) return [...contentBlocks, block];

  return [
    ...contentBlocks.slice(0, ctaIndex),
    block,
    ...contentBlocks.slice(ctaIndex)
  ];
};
