// NavWrapper.tsx

"use client";

import { useState } from "react";
import styles from "../Header/Header.module.scss";
import NavLinks from "../NavLinks/NavLinks";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { Header as HeaderType } from "@/types/header";
import { Country } from "@/types/country";

type Props = {
  navLinks: HeaderType["navLinks"];
  params: { lang: string };
  countries?: Country[];
};

const NavWrapper: React.FC<Props> = ({ navLinks, params, countries }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div
        className={`${styles.navWrapper} ${isMenuOpen ? styles.navWrapperOpen : ""}`}
      >
        <NavLinks
          navLinks={navLinks}
          params={params}
          closeMenu={closeMenu}
          countries={countries}
        />
      </div>
      <BurgerMenu isMenuOpen={isMenuOpen} onToggle={toggleMenu} />
    </>
  );
};

export default NavWrapper;
