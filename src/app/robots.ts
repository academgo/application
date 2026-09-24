import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Preview-деплои (ветки) закрываем от индексации целиком
  if (process.env.VERCEL_ENV === "preview") {
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
