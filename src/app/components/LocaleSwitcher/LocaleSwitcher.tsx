"use client";

import { i18n } from "@/i18n.config";
import { Translation } from "@/types/post";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import { FiGlobe } from "react-icons/fi";
import styles from "./LocaleSwitcher.module.scss";

type Props = {
  translations?: Translation[];
};

/** Главная страница языка: en идёт без префикса */
const homeFor = (lang: string) => (lang === "en" ? "/" : `/${lang}`);

const LocaleSwitcher = ({ translations }: Props) => {
  const params = useParams();
  const defaultLang =
    i18n.languages.find(item => item.isDefault)?.id || i18n.languages[0]?.id;
  const currentLang = String(params.lang || defaultLang);

  /**
   * Куда ведёт переключатель. Сначала ищем перевод текущей страницы — тогда
   * человек остаётся на том же материале, только на другом языке. Если
   * перевода у страницы нет, ведём на главную того языка: раньше в этом
   * случае переключатель просто исчезал из шапки.
   */
  const target = useMemo(() => {
    const other = i18n.languages.find(item => item.id !== currentLang);
    if (!other) return null;

    const translated = translations?.find(
      item => item.language === other.id
    );

    return {
      language: other.id,
      path: translated?.path || homeFor(other.id)
    };
  }, [translations, currentLang]);

  if (!target) return null;

  return (
    <Link href={target.path} className={styles.localeSwitcherLink}>
      <FiGlobe className={styles.localeIcon} aria-hidden="true" />
      <span className={styles.localeCode}>{target.language}</span>
    </Link>
  );
};

export default LocaleSwitcher;
