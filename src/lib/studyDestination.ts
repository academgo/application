type Destination = { code: string; ru: string; en: string };

/**
 * Слаг хаба страны → страна обучения. Нужен, чтобы в письмо по заявке
 * попадало направление, с какой бы формы ни пришла заявка.
 */
const DESTINATIONS: Record<string, Destination> = {
  "obuchenie-v-polshe": { code: "poland", ru: "Польша", en: "Poland" },
  "study-in-poland": { code: "poland", ru: "Польша", en: "Poland" },
  "ucheba-v-turcii": { code: "turkey", ru: "Турция", en: "Turkey" },
  "study-in-turkey": { code: "turkey", ru: "Турция", en: "Turkey" },
  "ucheba-v-oae": { code: "uae", ru: "ОАЭ", en: "UAE" },
  "study-in-uae": { code: "uae", ru: "ОАЭ", en: "UAE" },
  "ucheba-v-malayzii": { code: "malaysia", ru: "Малайзия", en: "Malaysia" },
  "study-in-malaysia": { code: "malaysia", ru: "Малайзия", en: "Malaysia" },
  "ucheba-v-italii": { code: "italy", ru: "Италия", en: "Italy" },
  "study-in-italy": { code: "italy", ru: "Италия", en: "Italy" },
  "ucheba-v-ispanii": { code: "spain", ru: "Испания", en: "Spain" },
  "study-in-spain": { code: "spain", ru: "Испания", en: "Spain" },
  "ucheba-v-vengrii": { code: "hungary", ru: "Венгрия", en: "Hungary" },
  "study-in-hungary": { code: "hungary", ru: "Венгрия", en: "Hungary" },
  "ucheba-v-gruzii": { code: "georgia", ru: "Грузия", en: "Georgia" },
  "study-in-georgia": { code: "georgia", ru: "Грузия", en: "Georgia" },
  "ucheba-na-severnom-kipre": {
    code: "north-cyprus",
    ru: "Северный Кипр",
    en: "North Cyprus"
  },
  "study-in-north-cyprus": {
    code: "north-cyprus",
    ru: "Северный Кипр",
    en: "North Cyprus"
  },
  "ucheba-na-yuzhnom-kipre": {
    code: "south-cyprus",
    ru: "Южный Кипр",
    en: "Cyprus"
  },
  "study-in-cyprus": { code: "south-cyprus", ru: "Южный Кипр", en: "Cyprus" }
};

const detectDestination = (url?: string): Destination | undefined => {
  if (!url) return undefined;

  let pathname = url;

  try {
    pathname = new URL(url).pathname;
  } catch {
    // url может прийти как путь — тогда используем как есть
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0] === "ru" || segments[0] === "en" ? 1 : 0;
  const hubSlug = segments[first];

  if (!hubSlug) return undefined;

  return DESTINATIONS[hubSlug];
};

export const detectStudyDestination = (
  url?: string,
  lang?: string
): string | undefined => {
  const destination = detectDestination(url);
  if (!destination) return undefined;

  return lang === "en" ? destination.en : destination.ru;
};

/**
 * Код страны для аналитики — тот же, что шлёт StudyCountryTracker,
 * чтобы заявки и просмотры страниц сходились по одному значению.
 */
export const detectStudyDestinationCode = (url?: string): string | undefined =>
  detectDestination(url)?.code;

/** «Пока не решил(а)» в поле страны обучения */
export const UNDECIDED_STUDY_COUNTRY = "undecided";

/** Десять направлений для поля «Страна обучения» — без повторов RU/EN-слагов */
export const STUDY_COUNTRIES: Destination[] = Object.values(
  DESTINATIONS
).filter(
  (destination, index, all) =>
    all.findIndex(item => item.code === destination.code) === index
);

/**
 * Код страны по её названию — для ответа квиза «Куда хотите поехать?»:
 * варианты берутся из названий стран в Sanity и совпадают с этими
 */
export const studyCountryCodeByName = (name?: string): string | undefined => {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  return STUDY_COUNTRIES.find(
    item =>
      item.ru.toLowerCase() === normalized ||
      item.en.toLowerCase() === normalized
  )?.code;
};

/** Название страны обучения по коду из формы */
export const studyCountryName = (
  code?: string,
  lang?: string
): string | undefined => {
  if (!code) return undefined;
  if (code === UNDECIDED_STUDY_COUNTRY) {
    return lang === "en" ? "not decided yet" : "пока не решил(а)";
  }
  const destination = STUDY_COUNTRIES.find(item => item.code === code);
  if (!destination) return undefined;
  return lang === "en" ? destination.en : destination.ru;
};
