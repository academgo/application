"use client";
import Link from "next/link";
import Image from "next/image";
import { Header as HeaderType } from "@/types/header";
import { Country } from "@/types/country";
import styles from "../Header/Header.module.scss";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi"; // Иконка стрелки

type Props = {
  navLinks: HeaderType["navLinks"];
  params: { lang: string };
  closeMenu: () => void;
  countries?: Country[];
};

const NavLinks: React.FC<Props> = ({
  navLinks,
  params,
  closeMenu,
  countries = []
}) => {
  const [activeSection, setActiveSection] = useState("");
  const [isHomePage, setIsHomePage] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const [openCountryId, setOpenCountryId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false); // Отслеживаем ширину экрана

  /**
   * Ссылки в меню записаны по-разному: «academgo.com/ru/o-nas», «/about-us»,
   * «study-in-poland/...». Приводим их к пути внутри сайта, иначе переход
   * уводит на живой домен — и на превью или локально это даёт 404.
   */
  const getNormalizedHref = (lang: string, link: string) => {
    if (!link) return "/";

    const trimmed = link.trim();

    // внешние ссылки, почта и телефоны оставляем как есть
    if (
      /^(mailto:|tel:)/i.test(trimmed) ||
      /^(https?:)?\/\/(?!(www\.)?academgo\.com)/i.test(trimmed)
    ) {
      return trimmed;
    }

    let path = trimmed
      .replace(/^https?:\/\//i, "")
      .replace(/^\/\//, "")
      .replace(/^www\./i, "")
      .replace(/^academgo\.com/i, "");

    if (!path.startsWith("/")) path = `/${path}`;

    // английский — язык по умолчанию и идёт без префикса
    if (lang !== "en" && path !== `/${lang}` && !path.startsWith(`/${lang}/`)) {
      path = `/${lang}${path}`;
    }

    return path;
  };

  useEffect(() => {
    setIsHomePage(window.location.pathname === `/${params.lang}`);

    // Определяем, мобильное ли устройство
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Устанавливаем состояние при загрузке
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [params.lang]);

  // Подменю закрываем с небольшой задержкой: иначе курсор не успевает
  // пересечь зазор между пунктом меню и выпадающей панелью
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openSubMenu = (index: number) => {
    cancelClose();
    setOpenSubMenuIndex(index);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpenSubMenuIndex(null);
      setOpenCountryId(null);
    }, 200);
  };

  useEffect(() => cancelClose, []);

  const toggleSubMenu = (index: number) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
    setOpenCountryId(null);
  };

  const toggleCountry = (countryId: string) => {
    setOpenCountryId(openCountryId === countryId ? null : countryId);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      const offset =
        sectionElement.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: offset,
        behavior: "smooth"
      });
    } else if (!isHomePage) {
      window.location.href = `/${params.lang}/#${sectionId}`;
    }
  };

  if (!navLinks) {
    return null;
  }

  // Мега-меню стран: колонка на страну, внутри — хаб и его страницы
  const renderCountriesMenu = () => (
    <div className={styles.countriesMenuWrapper}>
      {countries.map(country => (
        <div className={styles.countryColumn} key={country._id}>
          <div className={styles.countryHeading}>
            {/* Без хаба на текущем языке ссылку не строим — иначе href="" */}
            {country.hubHref ? (
              <Link
                href={country.hubHref}
                className={styles.countryTitle}
                onClick={closeMenu}
              >
                {country.flagUrl && (
                  <Image
                    src={country.flagUrl}
                    alt=""
                    width={24}
                    height={18}
                    className={styles.countryFlag}
                  />
                )}
                {country.title}
              </Link>
            ) : (
              <span className={styles.countryTitle}>
                {country.flagUrl && (
                  <Image
                    src={country.flagUrl}
                    alt=""
                    width={24}
                    height={18}
                    className={styles.countryFlag}
                  />
                )}
                {country.title}
              </span>
            )}
            {isMobile && country.menuLinks.length > 0 && (
              <button
                type="button"
                aria-label={country.title}
                aria-expanded={openCountryId === country._id}
                className={styles.countryToggle}
                onClick={() => toggleCountry(country._id)}
              >
                <FiChevronDown
                  className={`${styles.chevron} ${
                    openCountryId === country._id ? styles.chevronOpen : ""
                  }`}
                />
              </button>
            )}
          </div>
          {country.menuLinks.length > 0 &&
            (!isMobile || openCountryId === country._id) && (
              <div className={styles.countryLinks}>
                {country.menuLinks.map(item => (
                  <Link
                    key={item._key}
                    href={item.href}
                    className={styles.subLink}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
        </div>
      ))}
    </div>
  );

  return (
    <nav className={styles.navLinks}>
      {navLinks.map((link, index) => {
        const showCountries = Boolean(link.showCountries && countries.length);
        const hasSubMenu =
          showCountries || Boolean(link.subLinks && link.subLinks.length > 0);

        return (
          <div
            className={`${styles.navLinkWrapper} ${
              showCountries ? styles.navLinkWrapperWide : ""
            } ${
              isMobile && openSubMenuIndex === index
                ? styles.activeNavLinkWrapper
                : ""
            }`}
            key={link.label}
            onMouseEnter={() => !isMobile && openSubMenu(index)}
            onMouseLeave={() => !isMobile && scheduleClose()}
            onFocus={() => !isMobile && hasSubMenu && openSubMenu(index)}
            onBlur={event => {
              if (isMobile) return;
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                scheduleClose();
              }
            }}
          >
            <div
              className={`${styles.navLink} ${
                isMobile && openSubMenuIndex === index
                  ? styles.activeNavLink
                  : ""
              }`}
              onClick={
                isMobile && hasSubMenu
                  ? e => {
                      e.preventDefault();
                      toggleSubMenu(index);
                    }
                  : closeMenu
              }
            >
              <Link
                href={getNormalizedHref(params.lang, link.link)}
                className={styles.navLinkText}
              >
                {link.label}
              </Link>
              {isMobile && hasSubMenu && (
                <FiChevronDown
                  className={`${styles.chevron} ${
                    openSubMenuIndex === index ? styles.chevronOpen : ""
                  }`}
                />
              )}
            </div>
            {/* Подменю */}
            <AnimatePresence>
              {hasSubMenu &&
                openSubMenuIndex === index &&
                (isMobile ? (
                  <motion.div
                    className={`${styles.subLinks} ${
                      showCountries ? styles.countriesMenu : ""
                    }`}
                    initial={{ maxHeight: 0, overflow: "hidden" }}
                    animate={{ maxHeight: "50vh", overflow: "auto" }}
                    exit={{ maxHeight: 0, overflow: "hidden" }}
                    transition={{ duration: 0.5 }}
                  >
                    {showCountries ? (
                      renderCountriesMenu()
                    ) : (
                      <div className={styles.subLinksWrapper}>
                        {link.subLinks.map(subLink => (
                          <Link
                            key={subLink.label}
                            href={getNormalizedHref(params.lang, subLink.link)}
                            className={styles.subLink}
                            onClick={closeMenu}
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div
                    className={`${styles.subLinks} ${
                      showCountries ? styles.countriesMenu : ""
                    } ${
                      // у правых пунктов меню выпадающий список прижимаем
                      // к правому краю, иначе он уезжает за экран
                      !showCountries && index >= navLinks.length - 2
                        ? styles.subLinksRight
                        : ""
                    }`}
                  >
                    {showCountries ? (
                      renderCountriesMenu()
                    ) : (
                      <div className={styles.subLinksWrapper}>
                        {link.subLinks.map(
                          (subLink: { label: any; link: any }) => (
                            <Link
                              key={subLink.label}
                              href={getNormalizedHref(
                                params.lang,
                                subLink.link
                              )}
                              className={styles.subLink}
                              onClick={closeMenu}
                            >
                              {subLink.label}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
};

export default NavLinks;
