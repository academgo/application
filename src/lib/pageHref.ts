type SlugValue = { current?: string } | undefined | null;
type LocalizedSlug = Record<string, SlugValue> | undefined | null;

type LinkablePage =
  | {
      _type?: string;
      slug?: LocalizedSlug;
      parentPage?: { slug?: LocalizedSlug } | null;
    }
  | undefined
  | null;

export const slugFor = (slug: LocalizedSlug, lang: string): string =>
  slug?.[lang]?.current ?? "";

/**
 * Собирает путь страницы из локализованных слагов Sanity.
 * EN — язык по умолчанию и идёт без префикса: /study-in-turkey/tuition
 * Остальные языки с префиксом: /ru/ucheba-v-turcii/stoimost
 */
export const pageHref = (lang: string, page: LinkablePage): string => {
  const self = slugFor(page?.slug, lang);
  if (!self) return "";

  const parent = slugFor(page?.parentPage?.slug, lang);
  const path = parent ? `${parent}/${self}` : self;

  return lang === "en" ? `/${path}` : `/${lang}/${path}`;
};
