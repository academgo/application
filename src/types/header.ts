export type Image = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
};

type navLink = {
  _key: string;
  label: string;
  link: string;
};

type contactLink = {
  _key: string;
  icon: Image;
  link: string;
};

export type Header = {
  _type: "header";
  _id: string;
  _rev: string;
  logo: Image;
  logoMobile: Image;
  logoMobileActive: Image;
  description: string;
  navLinks: navLink[];
  contactLinks: contactLink[];
  workingHours: string;
  phoneNumber: string;
  languageIcon: Image;
  languageLink: string;
};
