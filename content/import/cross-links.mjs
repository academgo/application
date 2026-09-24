import crypto from "node:crypto";

const key = () => crypto.randomBytes(6).toString("hex");

/**
 * Родительный падеж названия страны для заголовков вида
 * «Университеты Турции». Для EN падежей нет — берётся название как есть.
 */
export const COUNTRY_GENITIVE = {
  turkey: "Турции",
  uae: "ОАЭ",
  malaysia: "Малайзии",
  italy: "Италии",
  spain: "Испании",
  hungary: "Венгрии",
  georgia: "Грузии",
  "north-cyprus": "Северного Кипра",
  "south-cyprus": "Южного Кипра"
};

const TEXTS = {
  ru: {
    universitiesTitle: genitive => `Университеты ${genitive}`,
    universitiesDescription:
      "Вузы, с которыми мы работаем: на странице каждого — цены, требования к аттестату и порядок подачи.",
    similarTitle: genitive => `Другие университеты ${genitive}`,
    similarDescription:
      "Сравните условия: стоимость, язык программ и требования к поступающим отличаются.",
    universityLinkLabel: "Подробнее о вузе",
    otherCountriesTitle: "Другие страны обучения",
    otherCountriesDescription:
      "Тот же бюджет в другой стране может дать другой результат — посмотрите остальные направления."
  },
  en: {
    universitiesTitle: name => `Universities in ${name}`,
    universitiesDescription:
      "The universities we work with: each page has fees, entry requirements and the application steps.",
    similarTitle: name => `Other universities in ${name}`,
    similarDescription:
      "Compare the terms: fees, language of instruction and entry requirements differ.",
    universityLinkLabel: "About the university",
    otherCountriesTitle: "Other study destinations",
    otherCountriesDescription:
      "The same budget buys a different outcome elsewhere — see the other destinations."
  }
};

const countryName = (code, lang, countryTitle) =>
  lang === "en" ? countryTitle : COUNTRY_GENITIVE[code] || countryTitle;

const universitiesBlock = (code, lang, countryTitle, isCard) => {
  const texts = TEXTS[lang];
  const name = countryName(code, lang, countryTitle);

  return {
    _type: "countryUniversitiesBlock",
    _key: key(),
    title: isCard ? texts.similarTitle(name) : texts.universitiesTitle(name),
    description: isCard
      ? texts.similarDescription
      : texts.universitiesDescription,
    excludeCurrentPage: true,
    linkLabel: texts.universityLinkLabel
  };
};

const otherCountriesBlock = lang => {
  const texts = TEXTS[lang];

  return {
    _type: "countriesLinksBlock",
    _key: key(),
    title: texts.otherCountriesTitle,
    description: texts.otherCountriesDescription,
    excludeCurrent: true,
    showTuition: true
  };
};

/**
 * Добавляет блоки перелинковки в конец страницы, перед завершающим призывом
 * к действию: хабу — вузы страны и другие страны, карточке вуза — похожие
 * вузы, тематической странице — другие страны.
 */
export const withCrossLinks = ({
  contentBlocks,
  pageType,
  countryCode,
  countryTitle,
  lang
}) => {
  const extra = [];

  if (pageType === "country-hub") {
    extra.push(
      universitiesBlock(countryCode, lang, countryTitle, false),
      otherCountriesBlock(lang)
    );
  }

  if (pageType === "university-card") {
    extra.push(universitiesBlock(countryCode, lang, countryTitle, true));
  }

  if (pageType === "topic") {
    extra.push(otherCountriesBlock(lang));
  }

  if (!extra.length) return contentBlocks;

  // призыв к действию оставляем последним блоком страницы
  const ctaIndex = contentBlocks.findIndex(
    block => block._type === "textContent" && block.marginBottom === "large"
  );

  if (ctaIndex === -1) return [...contentBlocks, ...extra];

  return [
    ...contentBlocks.slice(0, ctaIndex),
    ...extra,
    ...contentBlocks.slice(ctaIndex)
  ];
};
