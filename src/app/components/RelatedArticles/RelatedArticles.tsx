import React, { FC } from "react";
import Link from "next/link";
import styles from "./RelatedArticles.module.scss";
import { localePath } from "@/lib/href";
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

  // Адрес статьи. Пустая строка, если на этом языке её нет —
  // такие карточки не выводим, иначе в href попадает слово undefined
  const generateSlug = (article: ExtendedRelatedArticle, language: string) => {
    const self = article.slug?.[language]?.current;
    if (!self) return "";

    switch (article._type) {
      case "blog":
        return localePath(language, `blog/${self}`);
      case "singlepage":
        return localePath(language, self);
      case "subpage": {
        const parent = article.parentPage?.slug?.[language]?.current;
        return parent ? localePath(language, `${parent}/${self}`) : "";
      }
      default:
        return "";
    }
  };

  const articles = relatedArticles
    .map(article => ({ article, href: generateSlug(article, language) }))
    .filter(item => item.href);

  if (articles.length === 0) return null;

  return (
    <div className={styles.relatedArticles}>
      <div className={styles.relatedArticlesList}>
        {articles.map(({ article, href }) => (
          <div key={article._id} className={styles.relatedArticle}>
            <p className={styles.date}>{formatDate(article.publishedAt)}</p>
            <Link
              href={href}
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
