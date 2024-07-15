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
