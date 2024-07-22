import React, { FC } from "react";
import styles from "./BlogIntro.module.scss";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { Image as BlogMainImage } from "@/types/blog";
import { urlFor } from "@/sanity/sanity.client";
import { RichText } from "../RichText/RichText";

type Props = {
  title: string;
  categoryTitle: string;
  date: string;
  previewImage: BlogMainImage;
  firstContent: any;
};

const BlogIntro: FC<Props> = ({
  title,
  categoryTitle,
  date,
  previewImage,
  firstContent
}) => {
  const formatDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return parsedDate.toLocaleDateString("en-GB").replace(/\//g, ".");
  };
  // console.log("category", category);
  return (
    <section className={styles.blogIntro}>
      <div className={styles.blogIntroWrapper}>
        <div className={styles.blogIntroContent}>
          <h1 className={styles.blogHeading}>{title}</h1>
          <div className={styles.data}>
            <div className={styles.category}>{categoryTitle}</div>
            <div className={styles.date}>{formatDate(date)}</div>
          </div>
          <div className={styles.blogIntroText}>
            <PortableText value={firstContent.content} components={RichText} />
          </div>
        </div>
        <div className={styles.blogIntroImage}>
          {previewImage && (
            <Image src={urlFor(previewImage).url()} alt={title} fill={true} />
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogIntro;
