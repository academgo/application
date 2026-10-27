/**
 * Приведение ссылок к путям внутри сайта.
 *
 * В CMS адреса записаны по-разному: «academgo.com/ru/o-nas», «/about-us»,
 * «study-in-poland/...», «ru/studencheskaya-viza/...». Без нормализации
 * относительный путь склеивается с текущим адресом и даёт /ru/ru/...,
 * а путь без префикса на русской странице уводит на английский адрес.
 */

const EXTERNAL = /^(mailto:|tel:)/i;
const OTHER_DOMAIN = /^(https?:)?\/\/(?!(www\.)?academgo\.com)/i;

export const normalizeInternalHref = (lang: string, link?: string): string => {
  if (!link) return "/";

  const trimmed = link.trim();

  // внешние ссылки, почта, телефоны и якоря оставляем как есть
  if (EXTERNAL.test(trimmed) || OTHER_DOMAIN.test(trimmed)) return trimmed;
  if (trimmed.startsWith("#")) return trimmed;

  let path = trimmed
    .replace(/^https?:\/\//i, "")
    .replace(/^\/\//, "")
    .replace(/^www\./i, "")
    .replace(/^academgo\.com/i, "");

  if (!path.startsWith("/")) path = `/${path}`;

  // английский — язык по умолчанию и идёт без префикса
  if (path === "/en") path = "/";
  if (path.startsWith("/en/")) path = path.slice(3);

  if (lang !== "en" && path !== `/${lang}` && !path.startsWith(`/${lang}/`)) {
    path = `/${lang}${path}`;
  }

  return path;
};

/** Путь с префиксом локали: /blog/slug для en, /ru/blog/slug для остальных */
export const localePath = (lang: string, path: string): string => {
  const clean = path.replace(/^\/+/, "");
  return lang === "en" ? `/${clean}` : `/${lang}/${clean}`;
};

/** Адрес статьи блога. Пустая строка, если слага на этом языке нет. */
export const blogHref = (
  slug: Record<string, { current?: string } | undefined | null> | undefined | null,
  lang: string
): string => {
  const current = slug?.[lang]?.current;
  return current ? localePath(lang, `blog/${current}`) : "";
};
