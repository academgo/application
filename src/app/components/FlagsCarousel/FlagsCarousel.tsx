import { Flag } from "@/types/homepage";
import styles from "./FlagsCarousel.module.scss";
import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import Marquee from "react-fast-marquee";

type Props = {
  flags: Flag[];
};

const FlagsCarousel: FC<Props> = ({ flags }) => {
  return (
    <div className={styles.flagsCarousel}>
      {/* autoFill повторяет набор до ширины контейнера: восьми стран не хватает,
          и без него на стыке копий остаётся пустое место */}
      <Marquee loop={0} gradient={false} speed={40} pauseOnHover={true} autoFill>
        {flags.map(flag => {
          // Название страны стоит рядом текстом, поэтому у картинки пустой alt:
          // скринридер иначе прочитает страну дважды.
          const content = (
            <>
              <span className={styles.flagImage}>
                <Image
                  alt=""
                  aria-hidden="true"
                  src={urlFor(flag.image).url()}
                  width={125}
                  height={90}
                  className={styles.flagIcon}
                />
              </span>
              <span className={styles.flagTitle}>{flag.title}</span>
            </>
          );

          return flag.link ? (
            <Link key={flag._key || flag.title} href={flag.link} className={styles.flagChip}>
              {content}
            </Link>
          ) : (
            <div key={flag._key || flag.title} className={styles.flagChip}>
              {content}
            </div>
          );
        })}
      </Marquee>
    </div>
  );
};

export default FlagsCarousel;
