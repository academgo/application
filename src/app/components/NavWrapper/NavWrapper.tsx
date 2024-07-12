"use client";

import { useState } from "react";
import styles from "../Header/Header.module.scss";
import NavLinks from "../NavLinks/NavLinks";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { Header as HeaderType } from "@/types/header";

type Props = {
  navLinks: HeaderType["navLinks"];
  params: { lang: string };
};

const NavWrapper: React.FC<Props> = ({ navLinks, params }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div
        className={`${styles.navWrapper} ${isMenuOpen ? styles.navWrapperOpen : ""}`}
      >
        <NavLinks navLinks={navLinks} params={params} />
      </div>
      <BurgerMenu onToggle={toggleMenu} />
    </>
  );
};

export default NavWrapper;
