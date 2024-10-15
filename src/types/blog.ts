export type Image = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
};

export type Bullet = {
  _key: string;
  _type: string;
  number: string;
  sign?: string;
  text: string;
};

export type Seo = {
  metaTitle: string;
  metaDescription: string;
};

export type UnknownBlock = {
  _key: string;
  _type: string;
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
  leftTextBlock: TextContent;
  rightTextBlock: TextContent;
  backgroundColor: string;
  border: string;
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
