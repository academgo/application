import {
  getBlogPostsForSitemap,
  getPagesForSitemap
} from "@/sanity/sanity.utils";

const WEBSITE_URL = "https://academgo.com";
const LANGS = ["en", "ru"] as const;

// страницы, которых не должно быть в карте сайта
const EXCLUDED = new Set([
  "/404",
  "/success",
  "/single-page",
  "/ru/404",
  "/ru/success",
  "/ru/single-page"
]);

type SitemapEntry = {
  slug: any;
  _updatedAt: string;
  parentPage?: { slug: any } | null;
  _translations?: Array<{ slug: any; parentPage?: { slug: any } | null }>;
};

type SitemapPage = {
  url: string;
  lastmod?: string;
  changefreq: string;
  priority: number;
  alternates: Array<{ hreflang: string; url: string }>;
};

const withLangPrefix = (lang: string, path: string) =>
  lang === "en" ? `/${path}` : `/${lang}/${path}`;

/** Путь страницы на конкретном языке: у подстраниц он включает слаг родителя */
const pathFor = (
  entry: { slug: any; parentPage?: { slug: any } | null },
  lang: string,
  prefix?: string
) => {
  const own = entry?.slug?.[lang]?.current;
  if (!own) return null;

  if (entry.parentPage) {
    const parent = entry.parentPage.slug?.[lang]?.current;
    if (!parent) return null;
    return withLangPrefix(lang, `${parent}/${own}`);
  }

  return withLangPrefix(lang, prefix ? `${prefix}/${own}` : own);
};

/** hreflang-альтернативы: собираются из языковых версий документа */
const alternatesFor = (entry: SitemapEntry, prefix?: string) => {
  const alternates: Array<{ hreflang: string; url: string }> = [];

  (entry._translations || []).forEach(translation => {
    LANGS.forEach(lang => {
      if (!translation?.slug?.[lang]?.current) return;

      const path = pathFor(translation, lang, prefix);
      if (!path || EXCLUDED.has(path)) return;

      alternates.push({ hreflang: lang, url: `${WEBSITE_URL}${path}` });
    });
  });

  const english = alternates.find(item => item.hreflang === "en");
  if (english) {
    alternates.push({ hreflang: "x-default", url: english.url });
  }

  return alternates;
};

const buildPages = (
  entries: SitemapEntry[],
  lang: string,
  priority: number,
  prefix?: string
): SitemapPage[] =>
  entries.reduce<SitemapPage[]>((acc, entry) => {
    const path = pathFor(entry, lang, prefix);

    if (!path || EXCLUDED.has(path) || path.includes("/ru/ru/")) return acc;

    acc.push({
      url: `${WEBSITE_URL}${path}`,
      lastmod: entry._updatedAt,
      changefreq: "weekly",
      priority,
      alternates: alternatesFor(entry, prefix)
    });

    return acc;
  }, []);

async function generateSitemap(): Promise<SitemapPage[]> {
  const pages: SitemapPage[] = [];

  const homeAlternates = [
    { hreflang: "en", url: `${WEBSITE_URL}/` },
    { hreflang: "ru", url: `${WEBSITE_URL}/ru` },
    { hreflang: "x-default", url: `${WEBSITE_URL}/` }
  ];

  for (const lang of LANGS) {
    const [singlePages, subPages, blogPosts] = await Promise.all([
      getPagesForSitemap("singlepage", lang),
      getPagesForSitemap("subpage", lang),
      getBlogPostsForSitemap(lang)
    ]);

    pages.push(
      {
        url: lang === "en" ? `${WEBSITE_URL}/` : `${WEBSITE_URL}/${lang}`,
        changefreq: "weekly",
        priority: 1,
        alternates: homeAlternates
      },
      {
        url:
          lang === "en" ? `${WEBSITE_URL}/blog` : `${WEBSITE_URL}/${lang}/blog`,
        changefreq: "weekly",
        priority: 0.9,
        alternates: [
          { hreflang: "en", url: `${WEBSITE_URL}/blog` },
          { hreflang: "ru", url: `${WEBSITE_URL}/ru/blog` },
          { hreflang: "x-default", url: `${WEBSITE_URL}/blog` }
        ]
      },
      ...buildPages(singlePages, lang, 0.8),
      ...buildPages(subPages, lang, 0.7),
      ...buildPages(blogPosts, lang, 0.6, "blog")
    );
  }

  return pages;
}

export async function GET() {
  const pages = await generateSitemap();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(page => {
    const alternates = page.alternates
      .map(
        alternate =>
          `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.url}"/>`
      )
      .join("\n");

    return `  <url>
    <loc>${page.url}</loc>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${alternates ? `\n${alternates}` : ""}
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
