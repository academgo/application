/**
 * Квиз для страниц стран. Хранится одним документом на язык (тип Quiz в Sanity),
 * поэтому вопросы редактируются один раз и меняются сразу на всех страницах.
 * Вопрос о стране берёт варианты из раздела Country — новая страна попадает
 * в квиз сама.
 */

export const QUIZ_IDS = {
  ru: "academgo.quiz.ru",
  en: "academgo.quiz.en"
};

export const quizRef = lang => ({
  _type: "reference",
  _ref: QUIZ_IDS[lang],
  _weak: true
});

// Заголовок выводится крупным кеглем, поэтому он короткий
export const SURVEY_TITLE = {
  ru: "Подберём программу за 2 минуты",
  en: "Find your programme in 2 minutes"
};

const question = (key, questionTitle, options, extra = {}) => ({
  _key: key,
  _type: "quizQuestion",
  questionTitle,
  optionsSource: extra.optionsSource || "manual",
  ...(extra.extraOption ? { extraOption: extra.extraOption } : {}),
  options: (options || []).map((label, index) => ({
    _key: `${key}o${index}`,
    _type: "quizOption",
    label
  }))
});

export const QUIZ_DOCUMENTS = {
  ru: {
    _id: QUIZ_IDS.ru,
    _type: "quizDocument",
    title: "Квиз по странам, RU",
    language: "ru",
    quiz: {
      _type: "quizBlock",
      finalTitle:
        "Спасибо! Подберём программы под ваши ответы и пришлём список вузов с ценами.",
      formTitle: "Куда отправить подборку программ?",
      inputLabel: "Ваш номер WhatsApp",
      buttonText: "Получить подборку",
      questions: [
        question("qLevel", "Какая программа вас интересует?", [
          "Бакалавриат",
          "Магистратура",
          "Медицина (MD)",
          "Подготовительный год или языковой курс"
        ]),
        question("qCountry", "Куда хотите поехать?", [], {
          optionsSource: "countries",
          extraOption: "Ещё не выбрал(а) — нужен совет"
        }),
        question("qBudget", "Бюджет на обучение в год", [
          "до $5 000",
          "$5 000 – 10 000",
          "$10 000 – 20 000",
          "от $20 000"
        ]),
        question("qLanguage", "На каком языке готовы учиться?", [
          "Только на английском",
          "Готов(а) учить язык страны",
          "Пока не решил(а)"
        ]),
        question("qWhen", "Когда планируете поступать?", [
          "В ближайший набор",
          "Через год",
          "Пока изучаю варианты"
        ])
      ]
    }
  },
  en: {
    _id: QUIZ_IDS.en,
    _type: "quizDocument",
    title: "Country quiz, EN",
    language: "en",
    quiz: {
      _type: "quizBlock",
      finalTitle:
        "Thank you. We will match programmes to your answers and send a shortlist with prices.",
      formTitle: "Where should we send the shortlist?",
      inputLabel: "Your WhatsApp number",
      buttonText: "Get the shortlist",
      questions: [
        question("qLevel", "Which programme are you looking for?", [
          "Bachelor's",
          "Master's",
          "Medicine (MD/MBBS)",
          "Foundation or language course"
        ]),
        question("qCountry", "Where would you like to study?", [], {
          optionsSource: "countries",
          extraOption: "Not decided yet — I need advice"
        }),
        question("qBudget", "Your tuition budget per year", [
          "under $5,000",
          "$5,000 – 10,000",
          "$10,000 – 20,000",
          "over $20,000"
        ]),
        question("qLanguage", "Which language will you study in?", [
          "English only",
          "Ready to learn the local language",
          "Not decided yet"
        ]),
        question("qWhen", "When do you plan to apply?", [
          "For the next intake",
          "In a year",
          "Still exploring options"
        ])
      ]
    }
  }
};

export const QUIZ_TRANSLATION_METADATA = {
  _id: "academgo.tm.quiz",
  _type: "translation.metadata",
  schemaTypes: ["quizDocument"],
  translations: ["ru", "en"].map(lang => ({
    _key: lang,
    _type: "internationalizedArrayReferenceValue",
    value: { _type: "reference", _ref: QUIZ_IDS[lang], _weak: true }
  }))
};
