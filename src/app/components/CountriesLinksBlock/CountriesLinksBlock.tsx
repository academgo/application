import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCountriesByLang } from "@/sanity/sanity.utils";
import styles from "./CountriesLinksBlock.module.scss";

export type CountriesLinksBlockType = {
  _key: string;
  _type: "countriesLinksBlock";
  title?: string;
  description?: string;
  excludeCurrent?: boolean;
  showTuition?: boolean;
};

type Props = {
  block: CountriesLinksBlockType;
  lang: string;
  currentCountryCode?: string;
};

const CountriesLinksBlock: FC<Props> = async ({
  block,
  lang,
  currentCountryCode
}) => {
  const countries = await getCountriesByLang(lang);

  const visibleCountries = countries.filter(country => {
    if (!country.hubHref) return false;
    if (block.excludeCurrent === false) return true;
    return country.code !== currentCountryCode;
  });

  if (!visibleCountries.length) return null;

  return (
    <section className={styles.countriesLinks}>
      {block.title && <h2 className={styles.title}>{block.title}</h2>}
      {block.description && (
        <p className={styles.description}>{block.description}</p>
      )}
      <div className={styles.grid}>
        {visibleCountries.map(country => (
          <Link
            key={country._id}
            href={country.hubHref}
            className={styles.item}
          >
            <span className={styles.head}>
              {country.flagUrl && (
                <Image
                  src={country.flagUrl}
                  alt=""
                  width={28}
                  height={21}
                  className={styles.flag}
                />
              )}
              <span className={styles.name}>{country.title}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </span>
            {block.showTuition !== false &&
              country.comparison?.tuitionFrom && (
                <span className={styles.tuition}>
                  {country.comparison.tuitionFrom}
                </span>
              )}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CountriesLinksBlock;
