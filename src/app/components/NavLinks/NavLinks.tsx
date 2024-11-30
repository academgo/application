"use client";
import Link from "next/link";
import { Header as HeaderType } from "@/types/header";
import styles from "../Header/Header.module.scss";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  navLinks: HeaderType["navLinks"];
  params: { lang: string };
  closeMenu: () => void;
};

const NavLinks: React.FC<Props> = ({ navLinks, params, closeMenu }) => {
  const [activeSection, setActiveSection] = useState("");
  const [isHomePage, setIsHomePage] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    setIsHomePage(window.location.pathname === `/${params.lang}`);

    const handleScroll = () => {
      let closestSectionId = "";
      let smallestDistance = Infinity;
      navLinks.forEach(navLink => {
        const sectionElement = document.getElementById(navLink.link);
        if (sectionElement) {
          const distance = Math.abs(sectionElement.getBoundingClientRect().top);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestSectionId = navLink.link;
          }
        }
      });

      setActiveSection(closestSectionId);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navLinks, params.lang]);

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
          {link.link.startsWith("/") ? (
            <Link
              href={`/${params.lang}/${link.link}`}
              className={`${styles.navLink} ${
                isMobile && openSubMenuIndex === index
                  ? styles.activeNavLink
                  : ""
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
              {link.label}
            </Link>
          ) : (
            <a
              onClick={e => {
                e.preventDefault();
                scrollToSection(link.link);
                closeMenu();
              }}
              className={`${styles.navLink} ${
                isMobile && openSubMenuIndex === index
                  ? styles.activeNavLink
                  : ""
              }`}
            >
              {link.label}
            </a>
          )}
          {/* Подменю */}
          <AnimatePresence>
            {link.subLinks &&
              link.subLinks.length > 0 &&
              openSubMenuIndex === index && (
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
                        href={`/${params.lang}/${subLink.link}`}
                        className={styles.subLink}
                        onClick={closeMenu}
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
};

export default NavLinks;
