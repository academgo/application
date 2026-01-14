import { Form } from "./form";
import { Link, List, offerContactLink, University } from "./homepage";

export type Image = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
};

export type ImageAlt = {
  _key: string;
  _type: "image";
  alt?: string; // Добавлено поле alt для текстового описания изображения
  asset: {
    _ref: string;
    _type: "reference";
  };
};

export type PlanFeature = {
  _key: string;
  featureName: string;
  availability: "available" | "unavailable";
};

export type PricingPlan = {
  _key: string;
  planPretitle: string;
  planName: string;
  planPrice: string;
  detailsLink: Link;
  features: PlanFeature[];
  buttonText: string;
  isHighlighted?: boolean; // Добавлено свойство
};

export type PricingTable = {
  _key: string;
  _type: "pricingTable";
  title: string;
  description: string;
  plans: PricingPlan[];
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

export type SlidePicture = {
  _key: string;
  image: Image;
  alt: string;
  title: string;
  url?: string;
};

export type SocialIcon = {
  _key: string;
  title: string;
  icon: Image;
  link: string;
};

export type Logo = {
  _key: string;
  image: Image;
  alt: string;
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

export type SurveyBlock = {
  _key: string;
  _type: string;
  survey: {
    title: string;
    image: Image;
    quote: string;
    description: string;
    finalTitle: string;
    formTitle: string;
    inputLabel: string;
    buttonText: string;
  };
};

export type OfferBlock = {
  _key: string;
  _type: string;
  title: string;
  titleHighlight: string;
  blockContent: BlockContentWithStyle;
  giftText: string;
  offerDescription: string;
  offerFormTitle: string;
  offerForm: Form;
  offerButtonCustomText: string;
  offerAltText: string;
  offerContactLinks: offerContactLink[];
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
  marginBottom?: "small" | "medium" | "large";
};

export type SliderBlock = {
  _key: string;
  _type: string;
  slides: Slide[];
  slidesPerView: string;
};

export type SliderPicturesBlock = {
  _key: string;
  _type: string;
  title: string;
  slides: SlidePicture[];
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
  title?: string;
  items: Array<{
    _key: string;
    question: string;
    answer: any; // Убедитесь, что поле называется 'answer', если оно содержит данные
  }>;
};

export type ContentChoice = {
  type: "text" | "image";
  blockContent?: BlockContentWithStyle;
  image?: ImageAlt;
};

export type DoubleTextBlock = {
  _key: string;
  _type: string;
  doubleTextBlockTitle?: string;
  leftContent: ContentChoice;
  rightContent: ContentChoice;
  marginBottom?: "small" | "medium" | "large";
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

export type Part = {
  partTitle: string;
  items: SliderList[];
};

export type PackageItemSingle = {
  _key: string;
  _type: string;
  trueOrFalse: boolean;
};

export type PackageItem = {
  _key: string;
  _type: string;
  title: string;
  items: PackageItemSingle[];
};

export type Package = {
  _key: string;
  _type: string;
  packageTitle: string;
  packagePrice: string;
  packageDescription: string;
  packageLink: Link;
  packageItems: PackageItem[];
  packageButtonLabel: string;
  isPopular: boolean;
  isHighlighted: boolean;
};

export type PricesBlock = {
  _key: string;
  _type: string;
  title: string;
  titleHighLight: string;
  parts: Part[];
  packages: Package[];
};

export type LogosBlock = {
  _key: string;
  _type: string;
  title: string;
  logos: University[];
};

export type ContactType = {
  _key: string;
  _type: string;
  title: string;
  type: "link" | "string";
  linkLabel?: string;
  linkDestination?: string;
  text?: string;
};

export type ContactsBlock = {
  _key: string;
  _type: string;
  title: string;
  contactsContent: ContactType[];
  socialDescription: string;
  socialIcons: SocialIcon[];
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
  _type: "blog" | "singlepage" | "subpage"; // добавлено поле _type
  title: string;
  category: Category;
  slug: {
    [lang: string]: {
      current: string;
    };
  };
  publishedAt: string;
  previewImage: Image;
  // Для subpage добавляем родительскую страницу (опционально)
  parentPage?: {
    slug: {
      [lang: string]: {
        current: string;
      };
    };
  };
};

export interface PriceItem {
  _key: string;
  _type?: string;
  title: string;
}

export interface PriceBlockItem {
  _key?: string;
  _type?: string;
  preTitle: string;
  title: string;
  itemsTitle: string;
  items: PriceItem[];
  cost: string;
  stageCost: string;
  buttonText: string;
  buttonLink: string;
  hasBorder: boolean;
  hasBg: boolean;
}

export interface PackagesBlock {
  _key?: string;
  _type?: "packagesBlock";
  title: string;
  priceBlock: PriceBlockItem[];
}

// export type RelatedArticle = {
//   _id: string;
//   title: string;
//   category: Category;
//   slug: {
//     [lang: string]: {
//       current: string;
//     };
//   };
//   publishedAt: string;
//   previewImage: Image;
// };

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
