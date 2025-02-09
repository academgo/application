import React, { FC } from "react";
import Link from "next/link";
import styles from "./RelatedArticles.module.scss";
import { RelatedArticle } from "@/types/blog";

// Создаем расширенный тип, который включает _type и parentPage (а не parent)
type ExtendedRelatedArticle = RelatedArticle & {
  _type: "blog" | "singlepage" | "subpage";
  parentPage?: {
    slug: {
      [lang: string]: {
        current: string;
      };
    };
  };
};

type Props = {
  relatedArticles: ExtendedRelatedArticle[];
  language: string;
};

const RelatedArticles: FC<Props> = ({ relatedArticles, language }) => {
  const formatDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return parsedDate.toLocaleDateString("en-GB").replace(/\//g, ".");
  };

  // Функция генерирует URL в зависимости от типа статьи
  const generateSlug = (article: ExtendedRelatedArticle, language: string) => {
    switch (article._type) {
      case "blog":
        return `/${language}/blog/${article.slug[language]?.current}`;
      case "singlepage":
        return `/${language}/${article.slug[language]?.current}`;
      case "subpage":
        // Для subpage используем поле parentPage
        if (
          article.parentPage &&
          article.parentPage.slug &&
          article.parentPage.slug[language]?.current
        ) {
          return `/${language}/${article.parentPage.slug[language].current}/${article.slug[language]?.current}`;
        }
        return "#";
      default:
        return "#";
    }
  };

  return (
    <div className={styles.relatedArticles}>
      <div className={styles.relatedArticlesList}>
        {relatedArticles.map(article => (
          <div key={article._id} className={styles.relatedArticle}>
            <p className={styles.date}>{formatDate(article.publishedAt)}</p>
            <Link
              href={generateSlug(article, language)}
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
