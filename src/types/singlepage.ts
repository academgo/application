import {
  AccordionBlock,
  DoubleImagesBlock,
  Seo,
  TabsBlock,
  TextContent,
  DoubleTextBlock
} from "./blog";
import { Image } from "./homepage";

export type Coverblock = {
  coverImage: Image;
  coverImageAlt?: string;
  coverTitle: string;
  coverText?: string;
};

export type Singlepage = {
  _id: string;
  _type: string;
  title: string;
  // slug: string;
  seo: Seo;
  coverBlock: Coverblock;
  previewImage: Image;
  contentBlocks: Array<
    | TextContent
    | DoubleImagesBlock
    | AccordionBlock
    | TabsBlock
    | DoubleTextBlock
  >;
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
