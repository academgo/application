import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { getUniversitiesByLang } from "@/sanity/sanity.utils";
import styles from "./CountryUniversitiesBlock.module.scss";

export type CountryUniversitiesBlockType = {
  _key: string;
  _type: "countryUniversitiesBlock";
  title?: string;
  description?: string;
  countryCode?: string;
  excludeCurrentPage?: boolean;
  linkLabel?: string;
};

type Props = {
  block: CountryUniversitiesBlockType;
  lang: string;
  currentCountryCode?: string;
  currentPageId?: string;
};

/**
 * Инициалы для заглушки логотипа: «Istanbul Medipol University» → «IM»,
 * а односложное название вроде METU показываем первыми двумя буквами.
 */
const initials = (name: string) => {
  const words = name
    .replace(/[^A-Za-zА-Яа-яЁё0-9\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 1);

  if (!words.length) return "";

  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return words
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join("");
};

const CountryUniversitiesBlock: FC<Props> = async ({
  block,
  lang,
  currentCountryCode,
  currentPageId
}) => {
  // город и тип вуза заполняются в разделе University; пока их нет,
  // строка просто не выводится, а не показывает пустое место
  const cityLine = (university: {
    city?: string;
    type?: "public" | "private" | "branch";
  }) => {
    const type = university.type
      ? {
          public: lang === "en" ? "public" : "государственный",
          private: lang === "en" ? "private" : "частный",
          branch: lang === "en" ? "branch campus" : "филиал зарубежного вуза"
        }[university.type]
      : "";

    return [university.city, type].filter(Boolean).join(" · ");
  };

  const countryCode = block.countryCode || currentCountryCode;

  if (!countryCode) return null;

  const universities = await getUniversitiesByLang(lang, countryCode);

  const visibleUniversities = universities.filter(university => {
    if (block.excludeCurrentPage === false) return true;
    return !currentPageId || university.pageId !== currentPageId;
  });

  if (!visibleUniversities.length) return null;

  return (
    <section className={styles.universitiesBlock}>
      {block.title && <h2 className={styles.title}>{block.title}</h2>}
      {block.description && (
        <p className={styles.description}>{block.description}</p>
      )}
      <div className={styles.grid}>
        {visibleUniversities.map(university => (
          <article className={styles.card} key={university._id}>
            <div className={styles.cardHead}>
              {university.logoUrl ? (
                <Image
                  src={university.logoUrl}
                  alt={university.title}
                  width={56}
                  height={56}
                  className={styles.logo}
                />
              ) : (
                // логотипы вузов клиент загрузит позже: пока показываем инициалы
                <span className={styles.logoPlaceholder} aria-hidden="true">
                  {initials(university.title)}
                </span>
              )}
              <div>
                <h3 className={styles.name}>{university.title}</h3>
                {cityLine(university) && (
                  <p className={styles.city}>{cityLine(university)}</p>
                )}
              </div>
            </div>
            {university.highlight && (
              <p className={styles.highlight}>{university.highlight}</p>
            )}
            <dl className={styles.meta}>
              {university.tuitionFrom && (
                <div className={styles.metaRow}>
                  <dd>{university.tuitionFrom}</dd>
                </div>
              )}
              {university.programsLanguage && (
                <div className={styles.metaRow}>
                  <dd>{university.programsLanguage}</dd>
                </div>
              )}
            </dl>
            {university.href && (
              <Link href={university.href} className={styles.link}>
                {block.linkLabel || university.title}
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default CountryUniversitiesBlock;
