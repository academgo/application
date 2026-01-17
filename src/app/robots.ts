import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
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
