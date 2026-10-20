"use client";
import Link from "next/link";
import Image from "next/image";
import { CountriesPromo, Header as HeaderType } from "@/types/header";
import { Country } from "@/types/country";
import styles from "../Header/Header.module.scss";
import { urlFor } from "@/sanity/image";
import { useEffect, useRef, useState } from "react";
import MobileCollapse from "./MobileCollapse";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiChevronDown,
  FiChevronRight
} from "react-icons/fi";

type Props = {
  navLinks: HeaderType["navLinks"];
  params: { lang: string };
  closeMenu: () => void;
  countries?: Country[];
  promo?: CountriesPromo;
};

// Подписи стран по умолчанию: показываются, пока поле Badge у страны
// в Sanity не заполнено. Заполненное поле всегда главнее
const defaultBadges: Record<string, { ru: string; en: string }> = {
  poland: { ru: "Топ выбор", en: "Top choice" },
  spain: { ru: "Переезд и ВНЖ", en: "Residence permit" },
  uae: { ru: "Кампусы вузов UK", en: "UK campuses" },
  malaysia: { ru: "Диплом UK и US", en: "UK & US degree" },
  italy: { ru: "Гранты и стипендии", en: "Grants" },
  turkey: { ru: "Стипендии", en: "Scholarships" },
  hungary: { ru: "Медицина", en: "Medicine" },
  georgia: { ru: "Медицина на английском", en: "Medicine in English" },
  "north-cyprus": { ru: "Без IELTS", en: "No IELTS" },
  "south-cyprus": { ru: "Диплом ЕС", en: "EU degree" }
};

const getBadge = (
  badge: string | undefined,
  code: string | undefined,
  lang: string
) => {
  if (badge) return badge;
  const preset = code ? defaultBadges[code] : undefined;
  if (!preset) return undefined;
  return lang === "ru" ? preset.ru : preset.en;
};

// Подписи интерфейса меню по языку документа
const menuTexts = (lang: string) =>
  lang === "ru"
    ? {
        chooseCountry: "Выберите страну",
        studyIn: "Обучение в стране",
        allPrograms: "Все программы"
      }
    : {
        chooseCountry: "Choose a country",
        studyIn: "Study in",
        allPrograms: "All programmes"
      };

const NavLinks: React.FC<Props> = ({
  navLinks,
  params,
  closeMenu,
  countries = [],
  promo
}) => {
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const [openCountryId, setOpenCountryId] = useState<string | null>(null);
  const [activeCountryId, setActiveCountryId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const texts = menuTexts(params.lang);

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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [params.lang]);

  // Первая страна в списке открыта в правой панели по умолчанию
  useEffect(() => {
    if (!activeCountryId && countries.length) {
      setActiveCountryId(countries[0]._id);
    }
  }, [countries, activeCountryId]);

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

  // Esc закрывает открытую панель
  useEffect(() => {
    if (openSubMenuIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenSubMenuIndex(null);
        setOpenCountryId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSubMenuIndex]);

  const toggleSubMenu = (index: number) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
    setOpenCountryId(null);
  };

  const toggleCountry = (countryId: string) => {
    setOpenCountryId(openCountryId === countryId ? null : countryId);
  };

  if (!navLinks) {
    return null;
  }

  const activeCountry =
    countries.find(country => country._id === activeCountryId) || countries[0];

  const hasPromo = Boolean(promo?.title);

  // Десктоп: слева список стран, справа ссылки выбранной страны
  const renderCountriesMenuDesktop = () => (
    <div className={styles.megaMenu}>
      <div className={styles.megaMenuAside}>
        <p className={styles.megaMenuAsideTitle}>{texts.chooseCountry}</p>
        <ul className={styles.countryTabs} role="tablist" aria-orientation="vertical">
          {countries.map(country => {
            const isActive = country._id === activeCountry?._id;
            const badge = getBadge(country.badge, country.code, params.lang);

            return (
              <li key={country._id}>
                <button
                  type="button"
                  role="tab"
                  id={`country-tab-${country._id}`}
                  aria-selected={isActive}
                  aria-controls="country-panel"
                  onMouseEnter={() => setActiveCountryId(country._id)}
                  onFocus={() => setActiveCountryId(country._id)}
                  onClick={() => setActiveCountryId(country._id)}
                  className={`${styles.countryTab} ${
                    isActive ? styles.countryTabActive : ""
                  }`}
                >
                  <span className={styles.countryFlagBox}>
                    {country.flagUrl && (
                      <Image
                        src={country.flagUrl}
                        alt=""
                        width={24}
                        height={18}
                        className={styles.countryFlagImage}
                      />
                    )}
                  </span>
                  <span className={styles.countryTabName}>{country.title}</span>
                  {badge && (
                    <span className={styles.countryBadge}>{badge}</span>
                  )}
                  <FiChevronRight
                    className={styles.countryTabChevron}
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {activeCountry && (
        <div
          className={`${styles.megaMenuPanel} ${
            hasPromo ? styles.megaMenuPanelWithPromo : ""
          }`}
          id="country-panel"
          role="tabpanel"
          aria-labelledby={`country-tab-${activeCountry._id}`}
        >
          <div className={styles.megaMenuContent}>
            <div className={styles.megaMenuHeading}>
              <div>
                <h3 className={styles.megaMenuTitle}>
                  {texts.studyIn}: {activeCountry.title}
                </h3>
                {activeCountry.shortDescription && (
                  <p className={styles.megaMenuTagline}>
                    {activeCountry.shortDescription}
                  </p>
                )}
              </div>
              {activeCountry.hubHref && (
                <Link
                  href={activeCountry.hubHref}
                  className={styles.megaMenuAll}
                  onClick={closeMenu}
                >
                  {texts.allPrograms}
                  <FiArrowRight aria-hidden="true" />
                </Link>
              )}
            </div>

            {activeCountry.menuLinks.length > 0 && (
              <ul className={styles.menuCards}>
                {activeCountry.menuLinks.map(item => (
                  <li key={item._key}>
                    <Link
                      href={item.href}
                      className={styles.menuCard}
                      onClick={closeMenu}
                    >
                      <span>
                        <span className={styles.menuCardLabel}>
                          {item.label}
                        </span>
                        {item.description && (
                          <span className={styles.menuCardDescription}>
                            {item.description}
                          </span>
                        )}
                      </span>
                      <FiArrowUpRight
                        className={styles.menuCardIcon}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {hasPromo && (
            <aside className={styles.menuPromo}>
              <div>
                {promo?.label && (
                  <span className={styles.menuPromoLabel}>
                    {promo.icon && (
                      <Image
                        src={urlFor(promo.icon).url()}
                        alt=""
                        width={16}
                        height={16}
                        className={styles.menuPromoIcon}
                      />
                    )}
                    {promo.label}
                  </span>
                )}
                <p className={styles.menuPromoTitle}>{promo?.title}</p>
                {promo?.text && (
                  <p className={styles.menuPromoText}>{promo.text}</p>
                )}
              </div>
              {promo?.link && promo?.buttonText && (
                <Link
                  href={promo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.menuPromoButton}
                  onClick={closeMenu}
                >
                  {promo.buttonText}
                </Link>
              )}
            </aside>
          )}
        </div>
      )}
    </div>
  );

  // Мобильный: страны гармошкой, внутри — ссылки с пояснениями
  const renderCountriesMenuMobile = () => (
    <div className={styles.countriesMobile}>
      {countries.map(country => (
        <div className={styles.countryMobileItem} key={country._id}>
          <div className={styles.countryMobileHeading}>
            {country.hubHref ? (
              <Link
                href={country.hubHref}
                className={styles.countryMobileTitle}
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
              <span className={styles.countryMobileTitle}>
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
            {country.menuLinks.length > 0 && (
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
          {country.menuLinks.length > 0 && (
            <MobileCollapse
              open={openCountryId === country._id}
              className={styles.countryMobileLinks}
            >
              <div className={styles.menuCardsMobile}>
                {country.menuLinks.map(item => (
                  <Link
                    key={item._key}
                    href={item.href}
                    className={styles.menuCard}
                    onClick={closeMenu}
                  >
                    <span>
                      <span className={styles.menuCardLabel}>{item.label}</span>
                      {item.description && (
                        <span className={styles.menuCardDescription}>
                          {item.description}
                        </span>
                      )}
                    </span>
                    <FiArrowUpRight
                      className={styles.menuCardIcon}
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </MobileCollapse>
          )}
        </div>
      ))}
    </div>
  );

  // Обычное выпадающее меню: карточки со ссылкой и пояснением
  const renderSubLinks = (link: HeaderType["navLinks"][number]) => (
    <div className={styles.menuCardsMobile}>
      {link.subLinks.map(subLink => (
        <Link
          key={subLink.label}
          href={getNormalizedHref(params.lang, subLink.link)}
          className={styles.menuCard}
          onClick={closeMenu}
        >
          <span>
            <span className={styles.menuCardLabel}>{subLink.label}</span>
            {subLink.description && (
              <span className={styles.menuCardDescription}>
                {subLink.description}
              </span>
            )}
          </span>
          <FiArrowUpRight className={styles.menuCardIcon} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );

  return (
    <nav className={styles.navLinks}>
      {navLinks.map((link, index) => {
        const showCountries = Boolean(link.showCountries && countries.length);
        const hasSubMenu =
          showCountries || Boolean(link.subLinks && link.subLinks.length > 0);
        const isOpen = openSubMenuIndex === index;

        return (
          <div
            className={`${styles.navLinkWrapper} ${
              showCountries ? styles.navLinkWrapperWide : ""
            } ${isMobile && isOpen ? styles.activeNavLinkWrapper : ""}`}
            key={link.label}
            onMouseEnter={() => !isMobile && hasSubMenu && openSubMenu(index)}
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
                isOpen ? styles.activeNavLink : ""
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
              {hasSubMenu && (
                <FiChevronDown
                  className={`${styles.chevron} ${
                    isOpen ? styles.chevronOpen : ""
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>

            {hasSubMenu &&
              (isMobile ? (
                <MobileCollapse
                  open={isOpen}
                  className={`${styles.subLinks} ${
                    showCountries ? styles.countriesMenu : ""
                  }`}
                >
                  {showCountries
                    ? renderCountriesMenuMobile()
                    : renderSubLinks(link)}
                </MobileCollapse>
              ) : (
                isOpen && (
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
                    {showCountries
                      ? renderCountriesMenuDesktop()
                      : renderSubLinks(link)}
                  </div>
                )
              ))}
          </div>
        );
      })}
    </nav>
  );
};

export default NavLinks;
