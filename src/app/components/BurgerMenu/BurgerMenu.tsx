"use client";

import { useState } from "react";
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
