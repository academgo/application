import { Form } from "./form";

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

export type Ceo = {
  _key: string;
  name: string;
  position: string;
  image: Image;
};

export type Principle = {
  key: string;
  textStart: string;
  textEnd: string;
  boldStartOrEnd: boolean;
};

export type PrinciplesTotal = {
  number: string;
  descriptionBold: string;
  description: string;
};

export type Homepage = {
  _type: "homepage";
  _id: string;
  _rev: string;
  title: string;
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
  conditionsTitle: string;
  conditionFirst: Condition;
  conditionSecond: Condition;
  conditionThird: Condition;
  conditionFourth: Condition;
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
  aboutSummary: string;
  aboutTitle: string;
  aboutParagraphs: List[];
  sertificateLink: Link;
  aboutSocialsTitle: string;
  aboutSocials: offerContactLink[];
  aboutOffersTitle: string;
  aboutOffers: offerContactLink[];
  ceos: Ceo[];
  principlesTitle: string;
  principles: Principle[];
  principlesTotal: PrinciplesTotal;
  principlesFinal: string;
  language: string;
  slug: {
    [lang: string]: {
      current: string;
    };
  };
  _translations: [
    {
      slug: {
        [lang: string]: {
          current: string;
        };
      };
    }
  ];
};
