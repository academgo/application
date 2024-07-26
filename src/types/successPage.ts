import { Seo } from "./blog";
import { Image, offerContactLink } from "./homepage";

export type SuccessPage = {
  _type: "successPage";
  _id: string;
  _rev: string;
  title: string;
  seo: Seo;
  successTextstart: string;
  successTextend: string;
  description: string;
  socialIcons: offerContactLink[];
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
