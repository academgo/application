"use client";
import Link from "next/link";
import { Header as HeaderType } from "@/types/header";
import styles from "./NavLinks.module.scss";
import { useEffect, useState } from "react";

type Props = {
  navLinks: HeaderType["navLinks"];
  params: { lang: string };
  isMenuOpen: boolean;
};

const NavLinks: React.FC<Props> = ({ navLinks, params, isMenuOpen }) => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
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

    // Подписки
    window.addEventListener("scroll", handleScroll);

    // Отписки
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      const offset = sectionElement.offsetTop;
      window.scrollTo({
        top: offset,
        behavior: "smooth"
      });
    }
  };

  if (!navLinks) {
    return null;
  }

  return (
    <nav className={styles.navLinks}>
      {navLinks.map(link => (
        <div key={link.label}>
          {link.link.startsWith("/") ? (
            <Link
              href={`/${params.lang}/${link.link}`}
              className={styles.navLink}
            >
              {link.label}
            </Link>
          ) : (
            <a
              onClick={e => {
                e.preventDefault();
                scrollToSection(link.link);
              }}
              className={styles.navLink}
            >
              {link.label}
            </a>
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavLinks;
