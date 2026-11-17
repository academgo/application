import { University } from "@/types/homepage";
import styles from "./LogosCarousel.module.scss";
import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import Marquee from "react-fast-marquee";

type Props = {
  universities: University[];
};

const LogosCarousel: FC<Props> = ({ universities }) => {
  return (
    <div className={styles.flagsCarousel}>
      <Marquee
        loop={0}
        autoFill={true}
        gradient={false}
        speed={40}
        pauseOnHover={true}
      >
        {universities.map((item, index) => {
          // Ключ — _key элемента массива из админки. Раньше ключом было
          // название вуза, а оно необязательное: у логотипов без названия
          // ключ оказывался пустым, и React ругался на весь список.
          // Название же, если оно есть, идёт в alt — у картинки он
          // обязателен, пустая строка означает «картинка декоративная»
          const itemKey = item._key || item.title || `logo-${index}`;
          const alt = item.title || "";

          const logo = (
            <Image
              alt={alt}
              src={urlFor(item.logo).url()}
              width={310}
              height={130}
              className={styles.flagIcon}
            />
          );

          return item.link ? (
            <Link key={itemKey} href={item.link} className={styles.flagLink}>
              {logo}
            </Link>
          ) : (
            <div key={itemKey} className={styles.flagLink}>
              {logo}
            </div>
          );
        })}
      </Marquee>
    </div>
  );
};

export default LogosCarousel;
