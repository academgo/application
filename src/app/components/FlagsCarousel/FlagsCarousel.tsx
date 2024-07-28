import { Flag } from "@/types/homepage";
import styles from "./FlagsCarousel.module.scss";
import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import Marquee from "react-fast-marquee";

type Props = {
  flags: Flag[];
};

const FlagsCarousel: FC<Props> = ({ flags }) => {
  return (
    <div className={styles.flagsCarousel}>
      <Marquee loop={0} gradient={false} speed={40} pauseOnHover={true}>
        {flags.map(flag =>
          flag.link ? (
            <Link key={flag.title} href={flag.link} className={styles.flagLink}>
              <Image
                alt={flag.title}
                src={urlFor(flag.image).url()}
                width={125}
                height={90}
                className={styles.flagIcon}
              />
            </Link>
          ) : (
            <div key={flag.title} className={styles.flagLink}>
              <Image
                alt={flag.title}
                src={urlFor(flag.image).url()}
                width={125}
                height={90}
                className={styles.flagIcon}
              />
            </div>
          )
        )}
      </Marquee>
    </div>
  );
};

export default FlagsCarousel;
