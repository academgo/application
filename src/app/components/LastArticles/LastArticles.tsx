import React, { FC } from "react";
import styles from "./LastArticles.module.scss";
import { getFourPostsByLang } from "@/sanity/sanity.utils";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import Link from "next/link";

type Props = {
  params: {
    lang: string;
    id: string;
  };
};

const LastArticles = async ({ params }: Props) => {
  const blogPosts = await getFourPostsByLang(params.lang, params.id);

  const formatDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return parsedDate.toLocaleDateString("en-GB").replace(/\//g, ".");
  };

  const generateSlug = (slug: any, language: string) => {
    return slug && slug[language]?.current
      ? `/${language}/blog/${slug[language].current}`
      : "#";
  };

  console.log("blogPosts", blogPosts);

  return (
    <div className={styles.lastArticles}>
      <h2 className={styles.title}>
        {params.lang === "en"
          ? "Last articles"
          : "Вам также может быть актуально"}
      </h2>
      <div className={styles.articles}>
        {blogPosts.map(post => (
          <Link
            href={generateSlug(post.slug, params.lang)}
            key={post._id}
            className={styles.article}
          >
            <div className={styles.imageBlock}>
              <Image
                alt={post.title}
                src={urlFor(post.previewImage).url()}
                fill={true}
                className={styles.image}
              />
            </div>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
              <div className={styles.contentWrapper}>
                <div className={styles.contentTop}>
                  <p className={styles.articleCategory}>
                    {post.category.title}
                  </p>
                </div>
                <div className={styles.contentBottom}>
                  <p className={styles.articleDate}>
                    {formatDate(post.publishedAt)}
                  </p>
                  <h3 className={styles.articleTitle}>{post.title}</h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LastArticles;
