import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { urlFor } from "@/sanity/image";
import { ButtonModal } from "../ButtonModal/ButtonModal";
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
 * На телефонах полная плитка даёт простыню почти в полтора экрана, поэтому
 * список делится надвое: первые шесть стран остаются карточками, остальные
 * сворачиваются в компактные чипы с одним названием.
 */
const CARDS_ON_MOBILE = 6;

/**
 * Сколько стран всего попадает на телефон: шесть карточек плюс четыре чипа.
 * Больше, чем на десктопе: две последние страны живут только в мобильных
 * чипах и в статье «Сравнить страны», в десктопную плитку они не идут.
 */
const TOTAL_ON_MOBILE = 10;

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
    .slice(0, Math.max(limit, TOTAL_ON_MOBILE));

  if (visibleCountries.length === 0) {
    return null;
  }

  const label = tuitionLabel(lang);

  // Карточки — только те, что нужны десктопу. Чипы начинаются раньше, с
  // седьмой страны, и захватывают ещё две сверх десктопной плитки: страны
  // 7-8 показываются и карточкой, и чипом (лишнее прячется в CSS), а 9-10 —
  // только чипом, на широком экране их нет вовсе
  const gridCountries = visibleCountries.slice(0, limit);
  const tailCountries = visibleCountries.slice(CARDS_ON_MOBILE, TOTAL_ON_MOBILE);

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
            {gridCountries.map((country, cardIndex) => {
              // Фото карточки — обложка страницы-хаба страны
              const imageUrl = country.cardImage
                ? urlFor(country.cardImage).url()
                : country.cardImageUrl;

              // На карточке — короткая цена одной строкой. Длинная из блока
              // сравнения остаётся запасным вариантом, если короткой нет
              const tuition = country.comparison?.tuitionFrom;
              const cardPrice = country.homePrice || tuition;
              const hasFacts = Boolean(country.shortDescription || cardPrice);

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
                        {cardPrice && (
                          <span className={styles.factsTuition}>
                            <span className={styles.factsLabel}>{label}</span>
                            <span className={styles.factsValue}>
                              {cardPrice}
                            </span>
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

                  {/* На тач-экранах ховера нет — цену показываем сразу.
                      Без подписи «Обучение»: она занимала отдельную строку
                      и ничего не добавляла к самому ценнику */}
                  {cardPrice && (
                    <span className={styles.touchTuition}>{cardPrice}</span>
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
              {/* Не ссылка, а открытие того же всплывающего окна, что и на
                  первом экране: человек, который ещё не выбрал страну,
                  пишет нам в мессенджер прямо отсюда */}
              {block?.ctaLabel && (
                <ButtonModal className={styles.ctaButton}>
                  {block.ctaLabel}
                </ButtonModal>
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
