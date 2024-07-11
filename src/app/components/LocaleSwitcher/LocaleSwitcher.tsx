'use client';

import { i18n } from '@/i18n.config';
import { Translation } from '@/types/post';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import styles from './LocaleSwitcher.module.scss';

type Props = {
  translations?: Translation[];
};

const LocaleSwitcher = ({ translations }: Props) => {
  const params = useParams();
  const currentLang = params.lang;

  const availableTranslations = useMemo<Translation[]>(
    () =>
      i18n.languages.reduce<Translation[]>((acc, cur) => {
        if (cur.id !== currentLang) {
          const availableTranslation = translations?.find(
            (translation) => translation.language === cur.id,
          );
          if (availableTranslation) {
            acc.push(availableTranslation);
          }
        }
        return acc;
      }, []),
    [translations, currentLang],
  );

  return (
    <div className={styles.localeSwitcher}>
      {availableTranslations.map((version) => (
        <Link
          key={version.language}
          href={version.path}
          locale={version.language}
          className={styles.localeSwitcherLink}
        >
          {version.language}
        </Link>
      ))}
    </div>
  );
};

export default LocaleSwitcher;
