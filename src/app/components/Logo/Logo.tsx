"use client";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import { Image as ImageType } from "@/types/header";

type LogoProps = {
  logo: ImageType;
  logoMobile: ImageType;
  logoMobileActive: ImageType;
  isMenuOpen: boolean;
};

const Logo: React.FC<LogoProps> = ({
  logo,
  logoMobile,
  logoMobileActive,
  isMenuOpen
}) => {
  return (
    <>
      <Image
        alt="Academgo Logo"
        src={urlFor(logo).url()}
        width={200}
        height={200}
        className="logoImage"
      />
      <Image
        alt="Academgo Logo"
        src={urlFor(isMenuOpen ? logoMobileActive : logoMobile).url()}
        width={40}
        height={40}
        className="logoImageMobile"
      />
    </>
  );
};

export default Logo;
