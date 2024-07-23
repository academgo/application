// import {
//   getBlogPostsByLang,
//   getMainPageByLang,
//   getBlogPageByLang
// } from "@/libs/sanityQueries";

import {
  getBlogPageByLang,
  getBlogPostsByLang,
  getHomePageByLang
} from "@/sanity/sanity.utils";

const generateSlug = (slug: any, language: string) => {
  return slug && slug[language]?.current
    ? `/${language}/blog/${slug[language].current}`
    : "#";
};

async function generateSitemap() {
  const langs = ["en", "ru"]; // Получите список поддерживаемых языков из вашего i18n конфигурации или другого источника
  const websiteUrl = "https://academgo.com/sitemap.xml";

  const pages = [];

  for (const lang of langs) {
    const blogPosts = await getBlogPostsByLang(lang);
    const mainPage = await getHomePageByLang(lang);
    const blogPage = await getBlogPageByLang(lang);

    pages.push(
      {
        route: "/",
        url: `${websiteUrl}/${lang}`,
        changefreq: "weekly",
        priority: 1
      },
      {
        route: "/blog",
        url: `${websiteUrl}/${lang}/blog`,
        changefreq: "weekly",
        priority: 0.9
      },
      ...blogPosts.map(post => ({
        route: generateSlug(post.slug, lang),
        url: `${websiteUrl}${generateSlug(post.slug, lang)}`,
        changefreq: "weekly",
        priority: 0.8
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
