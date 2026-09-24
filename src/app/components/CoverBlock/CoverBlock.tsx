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
  if (!coverBlock) return null;

  const { coverImage, coverImageAlt, coverTitle, coverText } = coverBlock;

  // Обложка может быть ещё не загружена — тогда показываем блок без картинки,
  // иначе urlFor падает и ломает рендер всей страницы
  const coverImageUrl = coverImage ? urlFor(coverImage).url() : null;

  return (
    <section
      className={`${styles.coverBlock} ${
        coverImageUrl ? "" : styles.coverBlockPlain
      }`}
    >
      {coverImageUrl && (
        <>
          <div className={styles.overlay}></div>
          <Image
            alt={coverImageAlt || coverTitle}
            src={coverImageUrl}
            fill={true}
            className={styles.image}
          />
        </>
      )}
      <div className={styles.textBlock}>
        {/* длинные заголовки капсом занимают пол-экрана — им уменьшаем кегль */}
        <h1
          className={`${styles.title} ${
            (coverTitle || "").length > 55 ? styles.titleLong : ""
          }`}
        >
          {coverTitle}
        </h1>
        {coverText && <p className={styles.text}>{coverText}</p>}
      </div>
    </section>
  );
};

export default CoverBlock;
