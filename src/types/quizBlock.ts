// types/quizBlock.ts
type SanityImage = {
  _type: string;
  asset: { _ref: string; _type: string };
  hotspot?: unknown;
  crop?: unknown;
};

export type QuizOption = {
  _key: string;
  label: string;
  /** необязательная картинка варианта */
  image?: SanityImage;
};

export type QuizQuestion = {
  _key: string;
  name: string; // stable field key for Formik
  questionTitle: string;
  options: QuizOption[];
  /** необязательная иллюстрация над вариантами */
  image?: SanityImage;
  imageAlt?: string;
  /** "countries" — варианты подставляются из списка стран обучения */
  optionsSource?: "manual" | "countries";
  /** последний вариант для списка стран: «Ещё не выбрал(а)» */
  extraOption?: string;
};

/** Какие кнопки показывает финальный экран */
export type QuizFinalMode = "telegram" | "whatsapp" | "both";

export type QuizSidePanelItem = {
  _key: string;
  title?: string;
  text?: string;
};

export type QuizSidePanelStat = {
  _key: string;
  value?: string;
  label?: string;
};

export type QuizBlock = {
  /** Панель справа от квиза: что человек получит, ответив на вопросы */
  sidePanelTitle?: string;
  sidePanelItems?: QuizSidePanelItem[];
  sidePanelStats?: QuizSidePanelStat[];
  sidePanelNote?: string;
  loadingTitle?: string;
  loadingSteps?: string[];
  finalEyebrow?: string;
  finalTitle?: string;
  finalDescription?: string;
  finalMode?: QuizFinalMode;
  telegramLabel?: string;
  telegramLink?: string;
  whatsappLabel?: string;
  whatsappLink?: string;
  finalNote?: string;
  sendAnswersByEmail?: boolean;
  showSocials?: boolean;
  questions: QuizQuestion[];
};
