import { University } from "@/types/homepage";
import styles from "./LogosCarousel.module.scss";
import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
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
        {universities.map(item =>
          item.link ? (
            <Link key={item.title} href={item.link} className={styles.flagLink}>
              <Image
                alt={item.title}
                src={urlFor(item.logo).url()}
                width={310}
                height={130}
                className={styles.flagIcon}
              />
            </Link>
          ) : (
            <div key={item.title} className={styles.flagLink}>
              <Image
                alt={item.title}
                src={urlFor(item.logo).url()}
                width={310}
                height={130}
                className={styles.flagIcon}
              />
            </div>
          )
        )}
      </Marquee>
    </div>
  );
};

export default LogosCarousel;
