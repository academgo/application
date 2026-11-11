import { AccordionBlock } from "./blog";
import { Form } from "./form";
import { QuizBlock } from "./quizBlock";
// import { Signup } from "./signup";
import { VideoShort } from "./videoShort";

export type Image = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
};

export type Flag = {
  _key: string;
  title: string;
  image: Image;
  link: string;
};

export type Condition = {
  _key: string;
  title: string;
  description: string;
  linkLabel?: string; // Сделали linkLabel необязательным
  linkDestination?: string; // Сделали linkDestination необязательным
  image?: Image;
};

export type Video = {
  _key: string;
  videoId: string;
  posterImage: Image;
  date: string;
  title: string;
};

export type offerListItem = {
  _key: string;
  offerListItem: string;
};

export type offerContactLink = {
  _key: string;
  title: string;
  icon: Image;
  link: string;
};

export type List = {
  _key: string;
  title: string;
};

export type Link = {
  _key: string;
  label: string;
  destination: string;
};

export type TextItems = {
  _key: string;
  title: string;
  description: string;
};

export type Substep = {
  _key: string;
  title: string;
  description: string;
  highlight: string;
};

export type Faculty = {
  _key: string;
  facultyName: string;
  facultyDescription: string;
  specialtiesTitle: string;
  specialties: List[];
  semesters: string;
  cost: string;
  universitiesTitle: string;
  universities: List[];
  linkLabel: string;
  linkDestination: string;
  hasBorder: boolean;
};

export type University = {
  _key: string;
  title: string;
  logo: Image;
  link: string;
};

export type Program = {
  programText: string;
  programTextBold: string;
};

export type Ceo = {
  _key: string;
  name: string;
  position: string;
  image: Image;
};

export type Principle = {
  _key: string;
  textStart: string;
  textEnd: string;
  boldStartOrEnd: boolean;
};

export type PrinciplesTotal = {
  number: string;
  descriptionBold: string;
  description: string;
};

export type UniversitiesBlock = {
  _key: string;
  title: string;
  universities: University[];
  programHighlight: string;
  programTitle: string;
  programs: Principle[];
};

export type Survey = {
  title: string;
  // image: Image;
  // quote: string;
  // description: string;
  // finalTitle: string;
  // formTitle: string;
  // inputLabel: string;
  // buttonText: string;
};

export type StepOne = {
  number: string;
  title: string;
  description: string;
  resultText: string;
  items: TextItems[];
  buttonText: string;
  video: VideoShort;
};

export type StepTwo = {
  number: string;
  title: string;
  littleText: string;
  description: List[];
  video: VideoShort;
};

export type StepThree = {
  number: string;
  title: string;
  substeps: Substep[];
  video: VideoShort;
};

export type StepFour = {
  number: string;
  title: string;
  littleText: List[];
  list: List[];
  image: Image;
  video?: VideoShort;
};

export type ExtraBlock = {
  title: string;
  items: List[];
  asideContent: List[];
  bgImage: Image;
};

export type PriceBlock = {
  _key: string;
  preTitle: string;
  title: string;
  itemsTitle: string;
  items: List[];
  cost: string;
  stageCost: string;
  buttonText: string;
  buttonLink: string;
  hasBorder: boolean;
  hasBg: boolean;
};

export type ContactLink = {
  _key: string;
  title: string;
  icon: Image;
  link: string;
};

export type Consultation = {
  title: string;
  titleHighlight: string;
  listTitle: string;
  list: List[];
  giftText: string;
  description: string;
  formTitle: string;
  form: Form;
  buttonCustomText: string;
  altText: string;
  contactLinks: ContactLink[];
};

export type Seo = {
  title: string;
  description: string;
};

export type CountriesBlock = {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  cardLinkLabel?: string;
  compareLabel?: string;
  compareLink?: string;
  /** сколько карточек выводить в плитке, по умолчанию 6 */
  maxCards?: number;
  allLabel?: string;
  allLink?: string;
};

export type Homepage = {
  countriesBlock?: CountriesBlock;
  quizDocumentBlock?: QuizBlock;
  ctaBlock?: MessengerCtaDocument;
  videoReviewsBlock?: VideoReviewsDocument;
  _type: "homepage";
  _id: string;
  _rev: string;
  title: string;
  seo: Seo;
  mainHeadingStart: string;
  mainHeadingHighlight: string;
  mainHeadingContinue: string;
  mainHeadingEnd: string;
  tooltip: string;
  description: string;
  descriptionSmall: string;
  heroButtonText: string;
  heroImage: Image;
  heroDescription: string;
  flags: Flag[];
  heroTitle: string;
  mainHeadingH1: string;
  mainHeadingH1Highlight: string;
  conditionsTitle: string;
  conditionFirst: Condition;
  conditionSecond: Condition;
  conditionThird: Condition;
  conditionFourth: Condition;
  universitiesBlock: UniversitiesBlock;
  videosTitle: string;
  videos: Video[];
  offerTitle: string;
  offerTitleHighlight: string;
  offerListTitle: string;
  offerList: offerListItem[];
  giftText: string;
  offerDesctiption: string;
  offerFormTitle: string;
  offerForm: Form;
  offerButtonCustomText: string;
  offerAltText: string;
  offerContactLinks: offerContactLink[];
  facultiesTitle: string;
  faculties: Faculty[];
  lastSlideTitleHighlight: string;
  lastSlideTitle: string;
  lastSlideDescription: string;
  lastSlideForm: Form;
  survey: Survey;
  quizBlock?: QuizBlock;
  aboutSummary: string;
  aboutTitle: string;
  aboutParagraphs: List[];
  aboutSocialsTitle: string;
  aboutSocials: offerContactLink[];
  aboutOffersTitle: string;
  aboutOffers: offerContactLink[];
  ceos: Ceo[];
  principlesTitle: string;
  principles: Principle[];
  principlesTotal: PrinciplesTotal;
  principlesFinal: string;
  workSteps?: WorkStepsBlock;
  stepOne: StepOne;
  stepTwo: StepTwo;
  stepThree: StepThree;
  stepFour: StepFour;
  extraBlock: ExtraBlock;
  priceTitle: string;
  priceBlock: PriceBlock[];
  faq: AccordionBlock;
  language: string;
  slug: {
    [lang: string]: {
      current: string;
    };
  };
  _translations: [
    {
      /** язык документа перевода */
      language?: string;
      slug: {
        [lang: string]: {
          current: string;
        };
      };
    }
  ];
};

/** Плашка в мессенджер — отдельный документ, один на язык */
export type MessengerCtaDocument = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  mode?: "telegram" | "whatsapp" | "both";
  telegramLabel?: string;
  telegramLink?: string;
  whatsappLabel?: string;
  whatsappLink?: string;
  note?: string;
  showSocials?: boolean;
};

/** Слайдер видеоотзывов — отдельный документ, один на язык */
export type VideoReviewsDocument = {
  heading?: string;
  videos?: Video[];
};

/** Компактные «Этапы работы» вместо четырёх блоков с видео */
export type WorkStep = {
  _key: string;
  number?: string;
  title?: string;
  icon?: string;
  text?: string;
  bullets?: string[];
  buttonText?: string;
  buttonLink?: string;
};

export type WorkStepsBlock = {
  heading?: string;
  steps?: WorkStep[];
};
