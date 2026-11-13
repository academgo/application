import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { urlFor } from "@/sanity/image";
import { Country } from "@/types/country";
import { CountriesBlock } from "@/types/homepage";
import styles from "./CountriesSection.module.scss";

type Props = {
  block?: CountriesBlock;
  countries: Country[];
  lang: string;
};

const DEFAULT_CARDS = 8;

/**
 * На телефонах восемь полных карточек дают простыню почти в полтора экрана.
 * Поэтому первые четыре остаются карточками, остальные сворачиваются в
 * компактные чипы с одним названием. На планшетах и десктопе всё как было.
 */
const CARDS_ON_MOBILE = 4;

/**
 * Подпись к стоимости на ховере. В CMS не выносим: служебное слово, а не контент.
 * Без предлога: значения в comparison.tuitionFrom уже начинаются с «от» или
 * «примерно» и представляют собой фразу, а не короткий ценник.
 */
const tuitionLabel = (lang: string) =>
  lang === "ru" ? "Обучение" : "Tuition";

const CountriesSection: FC<Props> = ({ block, countries, lang }) => {
  const limit = block?.maxCards || DEFAULT_CARDS;

  // Порядок в плитке задаётся полем homeOrder, чтобы не зависеть от порядка
  // в мега-меню. Страны без homeOrder идут следом, в порядке поля order
  // (запрос уже отсортирован по нему).
  const visibleCountries = countries
    .filter(country => country.isFeatured !== false && country.hubHref)
    .map((country, index) => ({ country, index }))
    .sort((a, b) => {
      const aOrder = a.country.homeOrder;
      const bOrder = b.country.homeOrder;
      if (aOrder && bOrder) return aOrder - bOrder;
      if (aOrder) return -1;
      if (bOrder) return 1;
      return a.index - b.index;
    })
    .map(item => item.country)
    .slice(0, limit);

  if (visibleCountries.length === 0) {
    return null;
  }

  const label = tuitionLabel(lang);

  // Хвост показывается дважды: карточками для широких экранов и чипами для
  // телефонов. Лишнее прячется в CSS, поэтому разметка одна на оба случая
  const tailCountries = visibleCountries.slice(CARDS_ON_MOBILE);
  const isExternal = (href?: string) => Boolean(href && /^https?:/.test(href));

  return (
    <section className={styles.countriesSection} id="countries">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.headMain}>
              {block?.eyebrow && (
                <p className={styles.eyebrow}>{block.eyebrow}</p>
              )}
              {(block?.title || block?.titleHighlight) && (
                <h2 className={styles.title}>
                  {block?.title}{" "}
                  {block?.titleHighlight && (
                    <span className={styles.highlight}>
                      {block.titleHighlight}
                    </span>
                  )}
                </h2>
              )}
            </div>
            {block?.description && (
              <p className={styles.description}>{block.description}</p>
            )}
          </div>

          <div className={styles.grid}>
            {visibleCountries.map((country, cardIndex) => {
              // Фото карточки — обложка страницы-хаба страны
              const imageUrl = country.cardImage
                ? urlFor(country.cardImage).url()
                : country.cardImageUrl;

              const tuition = country.comparison?.tuitionFrom;
              const hasFacts = Boolean(country.shortDescription || tuition);

              return (
                <Link
                  key={country._id}
                  href={country.hubHref}
                  className={`${styles.card} ${
                    cardIndex >= CARDS_ON_MOBILE ? styles.cardTail : ""
                  }`}
                >
                  <span className={styles.media}>
                    {imageUrl ? (
                      <Image
                        alt={country.cardImageAlt || country.title}
                        src={imageUrl}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        className={styles.image}
                      />
                    ) : (
                      <span className={styles.imageFallback} aria-hidden="true" />
                    )}

                    {country.homeBadge && (
                      <span className={styles.badge}>{country.homeBadge}</span>
                    )}

                    {hasFacts && (
                      <span className={styles.facts}>
                        {country.shortDescription && (
                          <span className={styles.factsText}>
                            {country.shortDescription}
                          </span>
                        )}
                        {tuition && (
                          <span className={styles.factsTuition}>
                            <span className={styles.factsLabel}>{label}</span>
                            <span className={styles.factsValue}>{tuition}</span>
                          </span>
                        )}
                      </span>
                    )}
                  </span>

                  <span className={styles.cardBottom}>
                    <span className={styles.countryTitle}>{country.title}</span>
                    {block?.cardLinkLabel && (
                      <span className={styles.cardLink}>
                        {block.cardLinkLabel}
                        <FiArrowRight aria-hidden="true" />
                      </span>
                    )}
                  </span>

                  {/* На тач-экранах ховера нет — цену показываем сразу */}
                  {tuition && (
                    <span className={styles.touchTuition}>
                      <span className={styles.touchLabel}>{label}</span>
                      {tuition}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {tailCountries.length > 0 && (
            <ul className={styles.chips}>
              {tailCountries.map(country => (
                <li key={country._id}>
                  <Link href={country.hubHref} className={styles.chip}>
                    {country.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {(block?.ctaLabel || block?.allLabel) && (
            <div className={styles.actions}>
              {block?.ctaLabel && block?.ctaLink && (
                <Link
                  href={block.ctaLink}
                  className={styles.ctaButton}
                  {...(isExternal(block.ctaLink)
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {block.ctaLabel}
                </Link>
              )}

              {block?.allLabel && block?.allLink && (
                <Link href={block.allLink} className={styles.allLink}>
                  {block.allLabel}
                  <FiArrowRight aria-hidden="true" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CountriesSection;
