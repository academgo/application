import groq from "groq";
import { client } from "@/sanity/sanity.client";

// /llms.txt (llmstxt.org): Markdown-карта сайта для AI-ассистентов и агентов.
// Собирается из тех же документов Sanity, что и страницы, поэтому не
// расходится с сайтом. Английские версии + указание на русские (/ru).
// Путь с точкой исключён из matcher в proxy.ts, маршрут отвечает напрямую.
export const revalidate = 86400;

const SITE_URL = "https://academgo.com";

// служебные страницы: в карте сайта их тоже нет
const EXCLUDED = new Set(["404", "success", "single-page"]);

type Page = {
  _type: "singlepage" | "subpage";
  slug?: string;
  parent?: string;
  pageType?: string;
  country?: string;
  title?: string;
  description?: string;
};

type Post = { slug?: string; title?: string; description?: string };

const clean = (value?: string) =>
  (value || "")
    .replace(/\s*\|\s*Aca?demGo\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();

const line = (path: string, title?: string, description?: string) => {
  const name = clean(title) || path;
  const about = clean(description);
  return `- [${name}](${SITE_URL}${path})${about ? `: ${about}` : ""}`;
};

const pathOf = (page: Page) =>
  page._type === "subpage" ? `/${page.parent}/${page.slug}` : `/${page.slug}`;

export async function GET() {
  const [home, pages, posts]: [
    { title?: string; description?: string } | null,
    Page[],
    Post[]
  ] = await Promise.all([
    client.fetch(
      groq`*[_type == "homepage" && language == "en"][0]{
        "title": seo.title,
        "description": seo.description
      }`
    ),
    client.fetch(
      groq`*[_type in ["singlepage", "subpage"] && language == "en" && defined(slug.en.current)]{
        _type,
        "slug": slug.en.current,
        "parent": parentPage->slug.en.current,
        pageType,
        "country": country->title,
        "title": coalesce(seo.metaTitle, title),
        "description": seo.metaDescription
      }`
    ),
    client.fetch(
      groq`*[_type == "blog" && language == "en" && defined(slug.en.current)] | order(_createdAt desc){
        "slug": slug.en.current,
        "title": coalesce(seo.metaTitle, title),
        "description": seo.metaDescription
      }`
    )
  ]);

  const live = pages
    .filter(page => page.slug && !EXCLUDED.has(page.slug))
    .filter(page => page._type === "singlepage" || page.parent)
    .sort((a, b) => pathOf(a).localeCompare(pathOf(b)));

  const hubs = live.filter(page => page.pageType === "country-hub");
  const byCountry = (country?: string, type?: string) =>
    live.filter(
      page =>
        page.country === country &&
        page.pageType === type &&
        page._type === "subpage"
    );
  const grouped = new Set(
    live.filter(page => page.pageType && page.country).map(pathOf)
  );
  const other = live.filter(page => !grouped.has(pathOf(page)));

  const body = [
    "# AcademGo",
    "",
    `> ${clean(home?.description) || "Admission support for international students at universities abroad."}`,
    "",
    "AcademGo is an education agency with an office in Warsaw. It helps applicants choose a country, university and programme, prepare and legalise documents, apply, get a student visa and settle in. The first consultation is free.",
    "",
    "The site is available in English (no prefix) and Russian (/ru). The pages below are the English versions; every page links to its Russian translation.",
    "",
    "## Main pages",
    "",
    line("/", home?.title || "Home", "countries, universities, services and prices"),
    line("/blog", "Blog", "guides and articles for applicants"),
    "",
    ...hubs.flatMap(hub => {
      const topics = byCountry(hub.country, "topic");
      const universities = byCountry(hub.country, "university-card");
      return [
        `## ${hub.country || clean(hub.title)}`,
        "",
        line(pathOf(hub), hub.title, hub.description),
        ...topics.map(page => line(pathOf(page), page.title, page.description)),
        ...(universities.length
          ? [
              "",
              "Universities:",
              "",
              ...universities.map(page => line(pathOf(page), page.title))
            ]
          : []),
        ""
      ];
    }),
    "## Other pages",
    "",
    ...other.map(page => line(pathOf(page), page.title, page.description)),
    "",
    "## Blog",
    "",
    ...posts
      .filter(post => post.slug)
      .map(post => line(`/blog/${post.slug}`, post.title, post.description)),
    ""
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" }
  });
}
