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

export type Footer = {
  _type: "footer";
  _id: string;
  _rev: string;
  logo: Image;
  description: string;
  workingHours: string;
  phoneNumber: string;
  footerEmail: string;
  adress: string;
  navLinks: NavLink[];
  contactLinksTitle: string;
  contactLinks: ContactLink[];
  buttonText: string;
  copyright: string;
  privacyLink: NavLink;
};
