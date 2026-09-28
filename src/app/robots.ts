import { MetadataRoute } from "next";
import { headers } from "next/headers";

const PRIMARY_HOST = "academgo.com";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") || "";

  // Всё, что не основной домен, — превью и тестовые домены: закрываем целиком.
  // Обход запрещаем здесь, а саму индексацию — заголовком X-Robots-Tag
  // из proxy: одного robots.txt для этого недостаточно.
  if (host !== PRIMARY_HOST && host !== `www.${PRIMARY_HOST}`) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }]
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/single-page",
          "/ru/success",
          "/en/success",
          "*?gtm",
          "*?utm",
          "*?gclid",
          "*?from",
          "*?gbraid",
          "*?fbclid",
          "*?matchtype="
        ]
      }
    ],
    sitemap: "https://academgo.com/sitemap.xml",
    host: "https://academgo.com"
  };
}
