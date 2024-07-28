"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./NavLink.module.scss";

type Props = {
  href: string;
  children: React.ReactNode;
};

const NavLink = ({ href, children }: Props) => {
  const [activeSection, setActiveSection] = useState("");
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    // Проверяем, находимся ли мы на главной странице
    setIsHomePage(window.location.pathname === "/");

    const handleScroll = () => {
      let closestSectionId = "";
      let smallestDistance = Infinity;
      const sectionElements = document.querySelectorAll("[data-section-id]");

      sectionElements.forEach(sectionElement => {
        const distance = Math.abs(sectionElement.getBoundingClientRect().top);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestSectionId =
            sectionElement.getAttribute("data-section-id") || "";
        }
      });

      setActiveSection(closestSectionId);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      // Перенаправление на главную страницу, если элемент не найден и не на главной странице
      window.location.href = `/#${sectionId}`;
    }
  };

  const isInternalLink = href.startsWith("/");

  return (
    <>
      {isInternalLink ? (
        <Link
          href={href}
          className={`${styles.navLink} ${activeSection === href ? styles.active : ""}`}
        >
          {children}
        </Link>
      ) : (
        <a
          onClick={e => {
            e.preventDefault();
            scrollToSection(href);
          }}
          className={styles.navLink}
        >
          {children}
        </a>
      )}
    </>
  );
};

export default NavLink;
