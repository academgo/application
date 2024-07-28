"use client";

import { useEffect, useState } from "react";
import styles from "./BurgerMenu.module.scss";

type Props = {
  onToggle: () => void;
};

const BurgerMenu: React.FC<Props> = ({ onToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    onToggle();
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isMenuOpen]);

  return (
    <div className={styles.burgerMenu}>
      <div className={styles.burgerIcon} onClick={toggleMenu}>
        <div
          className={`${styles.bar} ${isMenuOpen ? styles.rotateBar1 : ""}`}
        />
        <div
          className={`${styles.bar} ${isMenuOpen ? styles.rotateBar2 : ""}`}
        />
      </div>
    </div>
  );
};

export default BurgerMenu;
