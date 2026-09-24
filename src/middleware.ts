import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/i18n.config";

const PRIMARY_HOST = "academgo.com";

export default async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // На production-домене vercel.app уводим на основной домен,
  // а preview-деплои (ветки) оставляем доступными — на них смотрим новые страны
  const isPreviewDeployment = process.env.VERCEL_ENV === "preview";

  if (host.endsWith(".vercel.app") && !isPreviewDeployment) {
    const url = request.nextUrl.clone();
    url.hostname = PRIMARY_HOST;
    url.protocol = "https";
    return NextResponse.redirect(url, 301);
  }

  if (host === `www.${PRIMARY_HOST}`) {
    const url = request.nextUrl.clone();
    url.hostname = PRIMARY_HOST;
    url.protocol = "https";
    return NextResponse.redirect(url, 301);
  }

  const handleI18nRouting = createIntlMiddleware({
    locales,
    defaultLocale,
    localePrefix: "as-needed",
    localeDetection: false
  });

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    // robots.txt и sitemap.xml обязаны отдаваться как есть: middleware
    // перехватывал их раньше rewrite, и поисковики получали HTML вместо файла
    "/((?!api|_next/static|admin|structure|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    "/(en|ru)/:path*"
  ]
};
