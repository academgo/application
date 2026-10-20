// NavWrapper.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import styles from "../Header/Header.module.scss";
import NavLinks from "../NavLinks/NavLinks";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { CountriesPromo, Header as HeaderType } from "@/types/header";
import { Country } from "@/types/country";

type Props = {
  navLinks: HeaderType["navLinks"];
  params: { lang: string };
  countries?: Country[];
  promo?: CountriesPromo;
  contactLinks?: HeaderType["contactLinks"];
  mobileCta?: { title: string; text: string };
};

const NavWrapper: React.FC<Props> = ({
  navLinks,
  params,
  countries,
  promo,
  contactLinks = [],
  mobileCta
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Кнопки нижней плашки собираем из контактов: Telegram и WhatsApp
  const findMessenger = (pattern: RegExp) =>
    contactLinks.find(link => pattern.test((link.link || "").toLowerCase()));

  const messengers = [
    { kind: "telegram" as const, link: findMessenger(/t\.me|telegram/) },
    { kind: "whatsapp" as const, link: findMessenger(/wa\.me|whatsapp/) }
  ].filter(item => Boolean(item.link));

  return (
    <>
      <div
        className={`${styles.navWrapper} ${isMenuOpen ? styles.navWrapperOpen : ""}`}
      >
        <NavLinks
          navLinks={navLinks}
          params={params}
          closeMenu={closeMenu}
          countries={countries}
          promo={promo}
        />

        {mobileCta && (
          <div className={styles.mobileCta}>
            <div>
              <p className={styles.mobileCtaTitle}>{mobileCta.title}</p>
              <p className={styles.mobileCtaText}>{mobileCta.text}</p>
            </div>
            <div className={styles.mobileCtaButtons}>
              {messengers.map(item => {
                const Icon =
                  item.kind === "telegram" ? FaTelegramPlane : FaWhatsapp;

                return (
                  <Link
                    key={item.kind}
                    href={item.link!.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.mobileCtaButton} ${
                      item.kind === "telegram"
                        ? styles.mobileCtaTelegram
                        : styles.mobileCtaWhatsapp
                    }`}
                    onClick={closeMenu}
                  >
                    <Icon className={styles.mobileCtaIcon} aria-hidden="true" />
                    {item.kind === "telegram" ? "Telegram" : "WhatsApp"}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <BurgerMenu isMenuOpen={isMenuOpen} onToggle={toggleMenu} />
    </>
  );
};

export default NavWrapper;
