// components/FooterRating/FooterRating.tsx
import React, { FC } from "react";
import styles from "./FooterRating.module.scss";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

type Props = {
  lang: string;
};

const BEST_RATING = 5;
const RATING_VALUE = 4.9;
const RATING_COUNT = 35;

// ВАЖНО: проверь и при необходимости замени
const BRAND_NAME = "AcademGo";
const SITE_URL = "https://academgo.com";

function getLabel(lang: string) {
  const isRu = lang === "ru";
  return {
    text: isRu
      ? `${RATING_VALUE}/${BEST_RATING} - ${RATING_COUNT} отзывов`
      : `${RATING_VALUE}/${BEST_RATING} - ${RATING_COUNT} reviews`,
    aria: isRu
      ? `Рейтинг ${RATING_VALUE} из ${BEST_RATING} на основе ${RATING_COUNT} отзывов`
      : `Rating ${RATING_VALUE} out of ${BEST_RATING} based on ${RATING_COUNT} reviews`
  };
}

function buildStars(value: number) {
  const full = Math.floor(value);
  const rest = value - full;

  const half = rest >= 0.25 && rest < 0.75 ? 1 : 0;
  const extraFull = rest >= 0.75 ? 1 : 0;

  const fullCount = Math.min(full + extraFull, BEST_RATING);
  const halfCount = fullCount < BEST_RATING ? half : 0;
  const emptyCount = BEST_RATING - fullCount - halfCount;

  return { fullCount, halfCount, emptyCount };
}

const FooterRating: FC<Props> = ({ lang }) => {
  const { text, aria } = getLabel(lang);
  const { fullCount, halfCount, emptyCount } = buildStars(RATING_VALUE);

  // Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(RATING_VALUE),
      bestRating: String(BEST_RATING),
      ratingCount: String(RATING_COUNT)
    }
  };

  return (
    <div className={styles.footerRating} aria-label={aria}>
      <div className={styles.stars}>
        {Array.from({ length: fullCount }).map((_, i) => (
          <FaStar key={`full-${i}`} className={styles.star} />
        ))}
        {Array.from({ length: halfCount }).map((_, i) => (
          <FaStarHalfAlt key={`half-${i}`} className={styles.star} />
        ))}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <FaRegStar key={`empty-${i}`} className={styles.star} />
        ))}
      </div>

      <div className={styles.text}>{text}</div>

      {/* Schema.org AggregateRating */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
};

export default FooterRating;
