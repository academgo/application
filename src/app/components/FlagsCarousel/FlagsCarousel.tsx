import { Flag } from "@/types/homepage";
import styles from "./FlagsCarousel.module.scss";
import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  flags: Flag[];
};

const FlagsCarousel: FC<Props> = ({ flags }) => {
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.carouselPrimary}>
        {flags.map(flag => (
          <Link key={flag.title} href={flag.link} className={styles.flagLink}>
            <Image
              alt={flag.title}
              src={urlFor(flag.image).url()}
              width={125}
              height={90}
              className={styles.flagIcon}
            />
          </Link>
        ))}
      </div>
      <div className={`${styles.carouselPrimary} ${styles.carouselSecondary}`}>
        {flags.map(flag => (
          <Link key={flag.title} href={flag.link} className={styles.flagLink}>
            <Image
              alt={flag.title}
              src={urlFor(flag.image).url()}
              width={125}
              height={90}
              className={styles.flagIcon}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FlagsCarousel;
