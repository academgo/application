type SlugValue = { current?: string } | undefined | null;
type LocalizedSlug = Record<string, SlugValue> | undefined | null;

export type TranslationEntry = {
  /** язык самого документа перевода */
  language?: string;
  slug?: LocalizedSlug;
  parentPage?: { slug?: LocalizedSlug } | null;
};

const withPrefix = (lang: string, path: string) =>
  lang === "en" ? `/${path}` : `/${lang}/${path}`;

/**
 * hreflang для страницы. В Sanity у каждого документа заполнен слаг только
 * своего языка, а связь языковых версий хранится в translation.metadata,
 * поэтому адреса собираем из _translations (текущая страница в них тоже есть).
 * EN — язык по умолчанию: идёт без префикса и отдаётся как x-default.
 */
export const buildLanguageAlternates = (
  translations?: TranslationEntry[] | null,
  /** префикс раздела, например "blog" для /blog/<slug> */
  prefix?: string
): Record<string, string> | undefined => {
  if (!translations?.length) return undefined;

  const languages: Record<string, string> = {};

  translations.forEach(translation => {
    // Берём слаг только того языка, на котором написан сам документ.
    // Если в документе по ошибке заполнен и слаг чужой локали, он даёт
    // несуществующий адрес вида /study-in-poland с русским слагом
    const slugEntries = Object.entries(translation?.slug || {}).filter(
      ([key, value]) =>
        key !== "_type" &&
        (value as SlugValue)?.current &&
        (!translation.language || key === translation.language)
    );

    slugEntries.forEach(([lang, value]) => {
      const current = (value as SlugValue)?.current as string;

      // подстраница: адрес собирается как /<родитель>/<страница>
      if (translation.parentPage) {
        const parent = translation.parentPage.slug?.[lang]?.current;
        if (!parent) return;
        languages[lang] = withPrefix(lang, `${parent}/${current}`);
        return;
      }

      languages[lang] = withPrefix(
        lang,
        prefix ? `${prefix}/${current}` : current
      );
    });
  });

  if (languages.en) {
    languages["x-default"] = languages.en;
  }

  return Object.keys(languages).length ? languages : undefined;
};

/** hreflang для главной страницы */
export const homeLanguageAlternates = (): Record<string, string> => ({
  en: "/",
  ru: "/ru",
  "x-default": "/"
});
