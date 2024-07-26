import { Seo } from "./blog";
import { Image, offerContactLink } from "./homepage";

export type NotFoundPage = {
  _type: "notFoundPage";
  _id: string;
  _rev: string;
  title: string;
  seo: Seo;
  textStart: string;
  textend: string;
  description: string;
  buttonText: string;
  image: Image;
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
