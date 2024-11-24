import React from "react";
import Link from "next/link";
import styles from "./Breadcrumbs.module.scss";

type BreadcrumbsProps = {
  lang: string;
  slug: string;
  subslug?: string;
  title: string;
  parentTitle?: string;
  parentSlug?: string;
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  lang,
  slug,
  subslug,
  title,
  parentTitle,
  parentSlug
}) => {
  const basePath = `/${lang}`;

  // Заголовок для главной страницы на основе языка
  const homeTitle =
    lang === "en" ? "Home" : lang === "ru" ? "Главная" : "Default";

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbs}>
      <ol className={styles.breadcrumb}>
        {/* Ссылка на главную страницу */}
        <li className={styles.breadcrumbItem}>
          <Link href={basePath}>{homeTitle}</Link>
        </li>

        {/* Для родительской страницы */}
        {!subslug && (
          <li
            className={`${styles.breadcrumbItem} ${styles.breadcrumbItemActive}`}
            aria-current="page"
          >
            {title}
          </li>
        )}

        {/* Для подстраницы */}
        {subslug && (
          <>
            <li className={styles.breadcrumbItem}>
              <Link href={`${basePath}/${parentSlug}`}>{parentTitle}</Link>
            </li>
            <li
              className={`${styles.breadcrumbItem} ${styles.breadcrumbItemActive}`}
              aria-current="page"
            >
              {title}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
