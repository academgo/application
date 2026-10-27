import { getCountriesByLang, getFooterByLang } from "@/sanity/sanity.utils";
import React from "react";
import styles from "./Footer.module.scss";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import NavLink from "../NavLink/NavLink";
import Consultation from "../Consultation/Consultation";
import FooterRating from "../FooterRating/FooterRating";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegramPlane,
  FaTiktok,
  FaVk,
  FaWhatsapp,
  FaYoutube
} from "react-icons/fa";

type Props = {
  params: { lang: string };
};

// Тексты футера редактируются в Sanity; это запасные значения,
// которые подставляются, пока поле не заполнено
const fallbackTexts = (lang: string) =>
  lang === "ru"
    ? {
        countries: "Страны",
        nav: "Навигация",
        contacts: "Контакты",
        tagline: "Международное образовательное агентство",
        partnersLabel: "Для партнеров, B2B и предложений:",
        address: "ul. Złota 7/28, 00-019 Warsaw, Poland",
        // перенос строки после «принимаем» сохраняется стилем white-space: pre-line
        contactNote: "Все заявки на поступление мы принимаем\nв Telegram.",
        developer: "Разработка сайта — bandziuk.com"
      }
    : {
        countries: "Countries",
        nav: "Navigation",
        contacts: "Contacts",
        tagline: "International education agency",
        partnersLabel: "For partners, B2B and proposals:",
        address: "ul. Złota 7/28, 00-019 Warsaw, Poland",
        contactNote: "We accept all admission requests\nvia Telegram.",
        developer: "Developed by bandziuk.com"
      };

// Однотонная иконка соцсети подбирается по адресу ссылки;
// для незнакомой сети остаётся картинка из Sanity
const socialIcons = [
  { match: ["instagram."], Icon: FaInstagram },
  { match: ["t.me", "telegram."], Icon: FaTelegramPlane },
  { match: ["tiktok."], Icon: FaTiktok },
  { match: ["youtube.", "youtu.be"], Icon: FaYoutube },
  { match: ["wa.me", "whatsapp."], Icon: FaWhatsapp },
  { match: ["facebook.", "fb.com", "fb.me"], Icon: FaFacebookF },
  { match: ["vk.com", "vk.ru"], Icon: FaVk },
  { match: ["linkedin."], Icon: FaLinkedinIn }
];

const getSocialIcon = (link: string) => {
  const href = (link || "").toLowerCase();
  return socialIcons.find(item => item.match.some(part => href.includes(part)))
    ?.Icon;
};

const Footer = async ({ params }: Props) => {
  const [data, countries] = await Promise.all([
    getFooterByLang(params.lang),
    getCountriesByLang(params.lang)
  ]);

  const texts = fallbackTexts(params.lang);
  const countryLinks = (countries || []).filter(country => country.hubHref);
  const navLinks = data.navLinks || [];
  const contactLinks = data.contactLinks || [];

  return (
    <>
      <Consultation consultationBlock={data.consultationBlock} />
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.wrapper}>
            <div className={styles.columns}>
              <div className={styles.brandColumn}>
                <Link className={styles.logoLink} href={params.lang === "en" ? "/" : `/${params.lang}`}>
                  <Image
                    alt="Academgo Logo"
                    src={urlFor(data.logo).url()}
                    width={200}
                    height={200}
                    className={styles.logoImage}
                  />
                </Link>
                <p className={styles.description}>
                  {data.description || texts.tagline}
                </p>
                <FooterRating lang={params.lang} />
                {contactLinks.length > 0 && (
                  <ul className={styles.socialItems}>
                    {contactLinks.map(link => {
                      const Icon = getSocialIcon(link.link);

                      return (
                        <li key={link._key}>
                          <Link
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.title}
                            className={styles.contactLink}
                          >
                            {Icon ? (
                              <Icon className={styles.contactIcon} />
                            ) : (
                              <Image
                                alt={link.title}
                                src={urlFor(link.icon).url()}
                                width={50}
                                height={50}
                                className={styles.contactIconImage}
                              />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {countryLinks.length > 0 && (
                <nav
                  className={styles.column}
                  aria-label={data.countriesTitle || texts.countries}
                >
                  <h2 className={styles.columnTitle}>
                    {data.countriesTitle || texts.countries}
                  </h2>
                  <ul className={styles.columnList}>
                    {countryLinks.map(country => (
                      <li key={country._id}>
                        <Link
                          href={country.hubHref}
                          className={styles.columnLink}
                        >
                          {country.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {navLinks.length > 0 && (
                <nav
                  className={styles.column}
                  aria-label={data.navTitle || texts.nav}
                >
                  <h2 className={styles.columnTitle}>
                    {data.navTitle || texts.nav}
                  </h2>
                  <ul className={styles.columnList}>
                    {navLinks.map(link => (
                      <li key={link.label}>
                        <NavLink href={link.link}>{link.label}</NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div className={`${styles.column} ${styles.contactsColumn}`}>
                <h2 className={styles.columnTitle}>
                  {data.contactsTitle || texts.contacts}
                </h2>
                <p className={styles.partnersLabel}>
                  {data.partnersLabel || texts.partnersLabel}
                </p>
                <Link
                  href={`mailto:${data.footerEmail}`}
                  className={styles.email}
                >
                  {data.footerEmail}
                </Link>
                <address className={styles.adress}>
                  {data.adress || texts.address}
                </address>
                <p className={styles.contactNote}>
                  {data.contactNote || texts.contactNote}
                </p>
                <a
                  href="https://www.bandziuk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.developer}
                >
                  {texts.developer}
                </a>
              </div>
            </div>

            <div className={styles.dataLinks}>
              <p className={styles.copyright}>{data.copyright}</p>
              <Link href={data.privacyLink.link} className={styles.privacy}>
                {data.privacyLink.label}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
