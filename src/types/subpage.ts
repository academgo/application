import {
  AccordionBlock,
  DoubleImagesBlock,
  Seo,
  TabsBlock,
  TextContent,
  DoubleTextBlock,
  SliderBlock
} from "./blog";
import { Image } from "./homepage";

type Coverblock = {
  coverImage: Image;
  coverImageAlt?: string;
  coverTitle: string;
  coverText?: string;
};

export type Subpage = {
  _id: string;
  _type: string;
  title: string;
  seo: Seo;
  coverBlock: Coverblock;
  contentBlocks: Array<
    | TextContent
    | DoubleImagesBlock
    | AccordionBlock
    | TabsBlock
    | DoubleTextBlock
    | SliderBlock
  >;
  language: string;
  slug: {
    [lang: string]: {
      current: string;
    };
  };
  parentPage: {
    _id: string;
    title: string;
    slug: {
      [lang: string]: {
        current: string;
      };
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
