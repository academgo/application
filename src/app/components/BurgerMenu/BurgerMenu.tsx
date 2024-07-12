"use client";

import { useState, useEffect } from "react";
import NavLinks from "../NavLinks/NavLinks";
import styles from "./BurgerMenu.module.scss";
import { Header as HeaderType } from "@/types/header";

type Props = {
  navLinks: HeaderType["navLinks"];
  params: { lang: string };
};

const BurgerMenu: React.FC<Props> = ({ navLinks, params }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 980);
    };

    handleResize(); // Проверка при загрузке компонента
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.burgerMenu}>
      {isMobile ? (
        <>
          <button
            className={styles.burger}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
          <div
            className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}
          >
            <NavLinks
              navLinks={navLinks}
              params={params}
              isMenuOpen={isMenuOpen}
            />
          </div>
        </>
      ) : (
        <NavLinks navLinks={navLinks} params={params} isMenuOpen={isMenuOpen} />
      )}
    </div>
  );
};

export default BurgerMenu;
