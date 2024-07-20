export type Image = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
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
  _type: string;
  question: string;
  answer: any;
};

export type TabsBlock = {
  _key: string;
  _type: string;
  tabTitle: string;
  tabImage: Image;
  tabContent: any;
};

export type Blog = {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  seo: Seo;
  publishedAt: string;
  firstContent: any;
  previewImage: Image;
  contentBlocks: Array<
    TextContent | DoubleImagesBlock | AccordionBlock | TabsBlock
  >;
  videoBlock: VideoBlock;
  relatedArticles: Array<Blog>;
  language: string;
};
