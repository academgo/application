import {
  getBlogPageByLang,
  getBlogPostsByLang,
  getHomePageByLang,
  getSinglePagesByLang,
  getSubPagesByLang
} from "@/sanity/sanity.utils";

const generateSlug = (slug: any, language: string) => {
  if (!slug || !slug[language]?.current) return "#";

  // Если язык "en", не добавляем /en/
  return language === "en"
    ? `/blog/${slug[language].current}`
    : `/${language}/blog/${slug[language].current}`;
};

// ✅ NEW: singlepage url
const generateSinglePageSlug = (slug: any, language: string) => {
  if (!slug || !slug[language]?.current) return "#";

  return language === "en"
    ? `/${slug[language].current}`
    : `/${language}/${slug[language].current}`;
};

// ✅ NEW: subpage url
const generateSubPageSlug = (
  parentSlug: any,
  subSlug: any,
  language: string
) => {
  const parent = parentSlug?.[language]?.current;
  const sub = subSlug?.[language]?.current;

  if (!parent || !sub) return "#";

  return language === "en"
    ? `/${parent}/${sub}`
    : `/${language}/${parent}/${sub}`;
};

async function generateSitemap() {
  const langs = ["en", "ru"];
  const websiteUrl = "https://academgo.com";

  const pages: any[] = [];

  for (const lang of langs) {
    const blogPosts = await getBlogPostsByLang(lang);
    const mainPage = await getHomePageByLang(lang);
    const blogPage = await getBlogPageByLang(lang);

    // ✅ NEW
    const singlePages = await getSinglePagesByLang(lang);
    const subPages = await getSubPagesByLang(lang);

    pages.push(
      {
        route: "/",
        url: lang === "en" ? `${websiteUrl}/` : `${websiteUrl}/${lang}`,
        changefreq: "weekly",
        priority: 1
      },
      {
        route: "/blog",
        url:
          lang === "en" ? `${websiteUrl}/blog` : `${websiteUrl}/${lang}/blog`,
        changefreq: "weekly",
        priority: 0.9
      },

      // blog posts
      ...blogPosts
        .map(post => generateSlug(post.slug, lang))
        .filter(
          route =>
            route !== "#" &&
            !route.includes("/ru/ru/") &&
            !route.startsWith("/en/")
        )
        .map(route => ({
          route,
          url: `${websiteUrl}${route}`,
          changefreq: "weekly",
          priority: 0.8
        })),

      // ✅ NEW: single pages
      ...singlePages
        .map(p => generateSinglePageSlug(p.slug, lang))
        .filter(
          route =>
            route !== "#" &&
            route !== "/404" &&
            route !== "/success" &&
            route !== "/ru/404" &&
            route !== "/ru/success"
        )
        .filter(
          route => !route.includes("/ru/ru/") && !route.startsWith("/en/")
        )
        .map(route => ({
          route,
          url: `${websiteUrl}${route}`,
          changefreq: "weekly",
          priority: 0.8
        })),

      // ✅ NEW: sub pages
      ...subPages
        .map(sp => generateSubPageSlug(sp.parentPage?.slug, sp.slug, lang))
        .filter(route => route !== "#")
        .filter(
          route => !route.includes("/ru/ru/") && !route.startsWith("/en/")
        )
        .map(route => ({
          route,
          url: `${websiteUrl}${route}`,
          changefreq: "weekly",
          priority: 0.7
        }))
    );
  }

  return pages;
}

export async function GET() {
  const pages = await generateSitemap();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(page => {
          return `
            <url>
              <loc>${page.url}</loc>
              <changefreq>${page.changefreq}</changefreq>
              <priority>${page.priority}</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
