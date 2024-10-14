import {
  AccordionBlock,
  DoubleImagesBlock,
  Seo,
  TabsBlock,
  TextContent
} from "./blog";
import { Image } from "./homepage";

export type Subpage = {
  _id: string;
  _type: string;
  title: string;
  seo: Seo;
  contentBlocks: Array<
    TextContent | DoubleImagesBlock | AccordionBlock | TabsBlock
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
