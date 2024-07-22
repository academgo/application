import React, { FC } from "react";
import styles from "./RelatedArticles.module.scss";
import { RelatedArticle } from "@/types/blog";
import Link from "next/link";

type Props = {
  relatedArticles: RelatedArticle[];
  language: string;
};

const RelatedArticles: FC<Props> = ({ relatedArticles, language }) => {
  const formatDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return parsedDate.toLocaleDateString("en-GB").replace(/\//g, ".");
  };

  const generateSlug = (slug: any, language: string) => {
    return slug && slug[language]?.current
      ? `/${language}/blog/${slug[language].current}`
      : "#";
  };

  return (
    <div className={styles.relatedArticles}>
      <div className={styles.relatedArticlesList}>
        {relatedArticles.map((article, index) => (
          <div key={index} className={styles.relatedArticle}>
            <p className={styles.date}>{formatDate(article.publishedAt)}</p>
            <Link
              href={generateSlug(article.slug, language)}
              className={styles.link}
            >
              {article.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
