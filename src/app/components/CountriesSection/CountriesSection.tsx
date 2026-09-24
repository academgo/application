import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Country } from "@/types/country";
import { CountriesBlock } from "@/types/homepage";
import styles from "./CountriesSection.module.scss";

type Props = {
  block?: CountriesBlock;
  countries: Country[];
};

const CountriesSection: FC<Props> = ({ block, countries }) => {
  const visibleCountries = countries.filter(
    country => country.isFeatured !== false && country.hubHref
  );

  if (visibleCountries.length === 0) {
    return null;
  }

  return (
    <section className={styles.countriesSection} id="countries">
      <div className="container">
        <div className={styles.head}>
          <div>
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
            {block?.description && (
              <p className={styles.description}>{block.description}</p>
            )}
          </div>
          {block?.compareLink && block?.compareLabel && (
            <Link href={block.compareLink} className={styles.compareLink}>
              {block.compareLabel}
            </Link>
          )}
        </div>

        <div className={styles.grid}>
          {visibleCountries.map(country => (
            <Link
              key={country._id}
              href={country.hubHref}
              className={styles.card}
            >
              <span className={styles.cardHead}>
                {country.flagUrl && (
                  <Image
                    src={country.flagUrl}
                    alt=""
                    width={36}
                    height={27}
                    className={styles.flag}
                  />
                )}
                <span className={styles.countryTitle}>{country.title}</span>
              </span>
              {country.shortDescription && (
                <span className={styles.cardText}>
                  {country.shortDescription}
                </span>
              )}
              {country.comparison?.tuitionFrom && (
                <span className={styles.tuition}>
                  {country.comparison.tuitionFrom}
                </span>
              )}
              {block?.cardLinkLabel && (
                <span className={styles.cardLink}>{block.cardLinkLabel}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountriesSection;
