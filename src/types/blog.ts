import { Link } from "./homepage";

export type Image = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
};

export type SliderList = {
  _key: string;
  title: string;
};

export type Bullet = {
  _key: string;
  _type: string;
  number: string;
  sign?: string;
  text: string;
};

export type Slide = {
  _key: string;
  image?: Image;
  title: string;
  description: string;
  subTitle: string;
  sliderList: SliderList[];
  semesters: string;
  cost: string;
  universitiesTitle?: string;
  universities?: SliderList[];
  linkLabel: string;
  linkDestination: string;
  hasBorder: boolean;
};

export type BenefitBullet = {
  _key: string;
  _type: string;
  bulletIcon: Image;
  bulletTitle: string;
  bulletText: string;
};

export type Seo = {
  metaTitle: string;
  metaDescription: string;
};

export type UnknownBlock = {
  _key: string;
  _type: string;
};

export type BlockContentWithStyle = {
  _key: string;
  _type: string;
  content: any;
  backgroundColor: string;
  isBorder: boolean;
};

export type ContentCascadeBlock = {
  _key: string;
  _type: string;
  contentBlock: BlockContentWithStyle;
};

export type ProcessItem = {
  _key: string;
  number: string;
  content: BlockContentWithStyle;
};

export type VideoBlock = {
  _key: string;
  videoId: string;
  posterImage: Image;
};

export type TextContent = {
  _key: string;
  _type: string;
  content: any;
};

export type SliderBlock = {
  _key: string;
  _type: string;
  slides: Slide[];
  slidesPerView: string;
};

export type LinksBlock = {
  _key: string;
  _type: string;
  title: string;
  links: Link[];
};

export type DoubleImagesBlock = {
  _key: string;
  _type: string;
  leftImage: Image;
  rightImage: Image;
};

export type AccordionBlock = {
  _key: string;
  _type: "accordionBlock";
  items: Array<{
    _key: string;
    question: string;
    answer: any; // Убедитесь, что поле называется 'answer', если оно содержит данные
  }>;
};

export type DoubleTextBlock = {
  _key: string;
  _type: string;
  doubleTextBlockTitle: string;
  leftTextBlock: BlockContentWithStyle;
  rightTextBlock: BlockContentWithStyle;
  backgroundColor: string;
  border: string;
};

export type CascadeBlock = {
  _key: string;
  _type: string;
  title: string;
  contentCascadeBlocks: ContentCascadeBlock[];
};

export type BulletsBlock = {
  _key: string;
  _type: string;
  bullets: Bullet[];
};

export type WhiteBlock = {
  _key: string;
  _type: string;
  title: string;
  text: any;
  bullets: Bullet[];
};

export type BenefitsBlock = {
  _key: string;
  _type: string;
  titleHighLight: string;
  title: string;
  description: string;
  benefitsBullets: BenefitBullet[];
};

export type ProcessBlock = {
  _key: string;
  _type: string;
  title: string;
  description: string;
  items: ProcessItem[];
};

export type CompareBlock = {
  _key: string;
  _type: string;
  title: string;
  description: string;
  link: Link;
  image: Image;
};

export type PackagePriceBlock = {
  _key: string;
  _type: string;
  leftSide: BlockContentWithStyle;
  rightSide: {
    pretitle: string;
    title: string;
    listTitle: string;
    list: SliderList[];
    price: string;
    priceDescription: string;
    buttonLabel: string;
  };
};

export type ExtraBlock = {
  _key: string;
  _type: string;
  title: string;
  description: string;
  items: SliderList[];
  bgImage: Image;
};

export type TabsBlock = {
  _key: string;
  _type: string;
  tabTitle: string;
  tabImage: Image;
  tabContent: any;
};

export type Category = {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  language: string;
};

export type RelatedArticle = {
  _id: string;
  title: string;
  category: Category;
  slug: {
    [lang: string]: {
      current: string;
    };
  };
  publishedAt: string;
  previewImage: Image;
};

export type Blog = {
  _id: string;
  _type: string;
  title: string;
  // slug: string;
  seo: Seo;
  category: Category;
  publishedAt: string;
  firstContent: any;
  previewImage: Image;
  contentBlocks: Array<
    | TextContent
    | DoubleImagesBlock
    | AccordionBlock
    | TabsBlock
    | DoubleTextBlock
  >;
  videoBlock: VideoBlock;
  relatedArticles: RelatedArticle[];
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
