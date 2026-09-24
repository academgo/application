import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCountriesByLang } from "@/sanity/sanity.utils";
import { Country, CountryComparison } from "@/types/country";
import styles from "./CountriesCompareBlock.module.scss";

export type CountriesCompareBlockType = {
  _key: string;
  _type: "countriesCompareBlock";
  title?: string;
  description?: string;
  columns?: Array<keyof CountryComparison>;
  labels?: Partial<Record<keyof CountryComparison | "country" | "yes" | "no", string>>;
  linkLabel?: string;
  note?: string;
};

type Props = {
  block: CountriesCompareBlockType;
  lang: string;
};

const DEFAULT_COLUMNS: Array<keyof CountryComparison> = [
  "tuitionFrom",
  "livingCostFrom",
  "languageOfStudy",
  "visa",
  "workRights",
  "degreeRecognition"
];

/**
 * Подписи колонок на случай, когда в блоке их не заполнили:
 * без них в шапку таблицы попадали имена полей.
 */
const DEFAULT_LABELS: Record<
  "ru" | "en",
  Record<keyof CountryComparison | "country", string>
> = {
  ru: {
    country: "Страна",
    tuitionFrom: "Обучение, от",
    livingCostFrom: "Проживание, от",
    languageOfStudy: "Язык обучения",
    visa: "Виза",
    workRights: "Работа во время учёбы",
    degreeRecognition: "Признание диплома",
    medicineInEnglish: "Медицина на английском"
  },
  en: {
    country: "Country",
    tuitionFrom: "Tuition from",
    livingCostFrom: "Living costs from",
    languageOfStudy: "Language of study",
    visa: "Visa",
    workRights: "Work while studying",
    degreeRecognition: "Degree recognition",
    medicineInEnglish: "Medicine in English"
  }
};

const CountriesCompareBlock: FC<Props> = async ({ block, lang }) => {
  const countries = await getCountriesByLang(lang);

  if (!countries.length) return null;

  const columns =
    block.columns && block.columns.length ? block.columns : DEFAULT_COLUMNS;
  const labels = block.labels || {};
  const defaultLabels = DEFAULT_LABELS[lang === "en" ? "en" : "ru"];

  const columnLabel = (column: keyof CountryComparison | "country") =>
    labels[column] || defaultLabels[column];

  const cellValue = (country: Country, column: keyof CountryComparison) => {
    const value = country.comparison?.[column];

    if (column === "medicineInEnglish") {
      // Незаполненное поле — это нет данных, а не отрицательный ответ
      if (typeof value !== "boolean") return "—";
      return value ? labels.yes || "да" : labels.no || "нет";
    }

    return (value as string) || "—";
  };

  return (
    <section className={styles.compareBlock}>
      {block.title && <h2 className={styles.title}>{block.title}</h2>}
      {block.description && (
        <p className={styles.description}>{block.description}</p>
      )}

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{columnLabel("country")}</th>
              {columns.map(column => (
                <th scope="col" key={column}>
                  {columnLabel(column)}
                </th>
              ))}
              {block.linkLabel && <th scope="col" />}
            </tr>
          </thead>
          <tbody>
            {countries.map(country => (
              <tr key={country._id}>
                <th scope="row" className={styles.countryCell}>
                  {country.flagUrl && (
                    <Image
                      src={country.flagUrl}
                      alt=""
                      width={28}
                      height={21}
                      className={styles.flag}
                    />
                  )}
                  {country.hubHref ? (
                    <Link href={country.hubHref}>{country.title}</Link>
                  ) : (
                    country.title
                  )}
                </th>
                {columns.map(column => (
                  <td key={column} data-label={columnLabel(column)}>
                    {cellValue(country, column)}
                  </td>
                ))}
                {block.linkLabel && (
                  <td>
                    {country.hubHref && (
                      <Link href={country.hubHref} className={styles.link}>
                        {block.linkLabel}
                      </Link>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {block.note && <p className={styles.note}>{block.note}</p>}
    </section>
  );
};

export default CountriesCompareBlock;
