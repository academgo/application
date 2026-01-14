import React, { FC } from "react";
import styles from "./SlidePicture.module.scss";
import { Image as ImageProp } from "@/types/homepage";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import Link from "next/link";

type Props = {
  image: ImageProp;
  alt: string;
  title: string;
  url?: string;
};

const SlidePicture: FC<Props> = ({ image, alt, title, url }) => {
  return (
    <>
      {url ? (
        <Link href={url} className={styles.slidePicture}>
          <div className={styles.slideOverlay}>
            <p className={styles.title}>{title}</p>
          </div>
          <Image
            alt={alt}
            src={urlFor(image).url()}
            fill={true}
            className={styles.image}
          />
        </Link>
      ) : (
        <div className={styles.slidePicture}>
          <div className={styles.slideOverlay}>
            <p className={styles.title}>{title}</p>
          </div>
          <Image
            alt={alt}
            src={urlFor(image).url()}
            fill={true}
            className={styles.image}
          />
        </div>
      )}
    </>
  );
};

export default SlidePicture;
