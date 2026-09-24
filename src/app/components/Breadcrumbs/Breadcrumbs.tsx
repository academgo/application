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

  // Абсолютные адреса для schema.org: en — без языкового префикса
  const SITE_URL = "https://academgo.com";
  const langPrefix = lang === "en" ? "" : `/${lang}`;

  const trail: Array<{ name: string; url: string }> = [
    { name: homeTitle, url: `${SITE_URL}${langPrefix || "/"}` }
  ];

  if (subslug) {
    if (parentTitle && parentSlug) {
      trail.push({
        name: parentTitle,
        url: `${SITE_URL}${langPrefix}/${parentSlug}`
      });
    }
    trail.push({
      name: title,
      url: `${SITE_URL}${langPrefix}/${slug}/${subslug}`
    });
  } else {
    trail.push({ name: title, url: `${SITE_URL}${langPrefix}/${slug}` });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbs}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
