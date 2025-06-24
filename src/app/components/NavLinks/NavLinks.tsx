"use client";
import Link from "next/link";
import { Header as HeaderType } from "@/types/header";
import styles from "../Header/Header.module.scss";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi"; // Иконка стрелки

type Props = {
  navLinks: HeaderType["navLinks"];
  params: { lang: string };
  closeMenu: () => void;
};

const NavLinks: React.FC<Props> = ({ navLinks, params, closeMenu }) => {
  const [activeSection, setActiveSection] = useState("");
  const [isHomePage, setIsHomePage] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false); // Отслеживаем ширину экрана

  const getNormalizedHref = (lang: string, link: string) => {
    // Удаляем ведущий слэш, если он есть
    const normalizedLink = link.startsWith("/") ? link.slice(1) : link;
    // Для английского языка (дефолтного) префикс не добавляем
    const languagePrefix = lang === "en" ? "" : `/`;
    // Собираем финальную ссылку
    return `${languagePrefix}/${normalizedLink}`;
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

  const toggleSubMenu = (index: number) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
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

  return (
    <nav className={styles.navLinks}>
      {navLinks.map((link, index) => (
        <div
          className={`${styles.navLinkWrapper} ${
            isMobile && openSubMenuIndex === index
              ? styles.activeNavLinkWrapper
              : ""
          }`}
          key={link.label}
          onMouseEnter={() => !isMobile && setOpenSubMenuIndex(index)}
          onMouseLeave={() => !isMobile && setOpenSubMenuIndex(null)}
        >
          <div
            className={`${styles.navLink} ${
              isMobile && openSubMenuIndex === index ? styles.activeNavLink : ""
            }`}
            onClick={
              isMobile && link.subLinks
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
            {isMobile && link.subLinks && (
              <FiChevronDown
                className={`${styles.chevron} ${
                  openSubMenuIndex === index ? styles.chevronOpen : ""
                }`}
              />
            )}
          </div>
          {/* Подменю */}
          <AnimatePresence>
            {link.subLinks &&
              link.subLinks.length > 0 &&
              openSubMenuIndex === index &&
              (isMobile ? (
                <motion.div
                  className={styles.subLinks}
                  initial={{ maxHeight: 0, overflow: "hidden" }}
                  animate={{ maxHeight: "35vh", overflow: "auto" }}
                  exit={{ maxHeight: 0, overflow: "hidden" }}
                  transition={{ duration: 0.5 }}
                >
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
                </motion.div>
              ) : (
                <div className={styles.subLinks}>
                  <div className={styles.subLinksWrapper}>
                    {link.subLinks.map(subLink => (
                      <Link
                        key={subLink.label}
                        href={`/${params.lang}/${subLink.link}`}
                        className={styles.subLink}
                        onClick={closeMenu}
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
};

export default NavLinks;
