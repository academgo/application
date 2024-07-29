import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/ru/success", "/en/success"]
      }
    ],
    sitemap: "https://academgo.com/sitemap.xml"
  };
}
