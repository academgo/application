import { Consultation, MessengerCtaDocument } from "./homepage";

type Image = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
};

type NavLink = {
  _key: string;
  label: string;
  link: string;
};

type FooterLink = {
  _key: string;
  label: string;
  link: string;
};

type ContactLink = {
  _key: string;
  title: string;
  icon: Image;
  link: string;
};

/** Пункт колонки «Страны» в футере: либо страна, либо произвольная ссылка */
export type FooterCountryLink = {
  _key: string;
  label?: string;
  link?: string;
  country?: {
    _id: string;
    title: string;
    hubPage?: {
      _type?: string;
      slug?: Record<string, { current?: string } | undefined>;
      parentPage?: {
        slug?: Record<string, { current?: string } | undefined>;
      } | null;
    } | null;
  } | null;
};

export type Footer = {
  _type: "footer";
  _id: string;
  _rev: string;
  consultationBlock: Consultation;
  ctaBlock?: MessengerCtaDocument;
  logo: Image;
  description: string;
  workingHours: string;
  phoneNumber: string;
  footerEmail: string;
  adress: string;
  navLinks: NavLink[];
  countriesTitle?: string;
  /** Колонка «Страны»: свой порядок футера, независимый от мега-меню */
  countryLinks?: FooterCountryLink[];
  navTitle?: string;
  contactsTitle?: string;
  partnersLabel?: string;
  contactNote?: string;
  contactLinksTitle: string;
  contactLinks: ContactLink[];
  buttonText: string;
  copyright: string;
  privacyLink: NavLink;
};
