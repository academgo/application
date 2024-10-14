import { Image as ImageType } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./CoverBlock.module.scss";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import { Coverblock as CoverBlockType } from "@/types/singlepage";

type Props = {
  coverBlock: CoverBlockType;
};

const CoverBlock: FC<Props> = ({ coverBlock }) => {
  // console.log("Cover block", coverBlock);
  const { coverImage, coverImageAlt, coverTitle, coverText } = coverBlock;
  return (
    <section className={styles.coverBlock}>
      <div className={styles.overlay}></div>
      <Image
        alt={coverImageAlt || coverTitle}
        src={urlFor(coverImage).url()}
        fill={true}
        className={styles.image}
      />
      <div className={styles.textBlock}>
        <h1 className={styles.title}>{coverTitle}</h1>
        {coverText && <p className={styles.text}>{coverText}</p>}
      </div>
    </section>
  );
};

export default CoverBlock;
