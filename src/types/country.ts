import { Image } from "./header";

export type CountryComparison = {
  tuitionFrom?: string;
  livingCostFrom?: string;
  languageOfStudy?: string;
  visa?: string;
  workRights?: string;
  degreeRecognition?: string;
  medicineInEnglish?: boolean;
};

export type CountryMenuLink = {
  _key: string;
  label: string;
  description?: string;
  href: string;
};

export type Country = {
  _id: string;
  title: string;
  code: string;
  flag?: Image;
  flagUrl?: string;
  order?: number;
  isFeatured?: boolean;
  badge?: string;
  /** плашка поверх фото в блоке «Направления» на главной */
  homeBadge?: string;
  /** порядок в плитке на главной, независимый от порядка в меню */
  homeOrder?: number;
  /** короткая цена на карточке главной; длинная живёт в comparison */
  homePrice?: string;
  shortDescription?: string;
  comparison?: CountryComparison;
  /** обложка страницы-хаба: используется как фото карточки на главной */
  cardImage?: Image;
  cardImageUrl?: string;
  cardImageAlt?: string;
  hubHref: string;
  menuLinks: CountryMenuLink[];
};

export type University = {
  _id: string;
  title: string;
  titleLocal?: string;
  city?: string;
  type?: "public" | "private" | "branch";
  logo?: Image;
  logoUrl?: string;
  tuitionFrom?: string;
  programsLanguage?: string;
  highlight?: string;
  order?: number;
  countryCode?: string;
  countryTitle?: string;
  pageId?: string;
  href: string;
};
