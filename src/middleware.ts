import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/i18n.config";

const PRIMARY_HOST = "academgo.com";

/** Индексируется только основной домен — всё остальное тестовое */
const isIndexableHost = (host: string) =>
  host === PRIMARY_HOST || host === `www.${PRIMARY_HOST}`;

/**
 * Запрет в robots.txt закрывает обход, но не индексацию: по внешней ссылке
 * страница превью всё равно попадёт в выдачу. Заголовок это исключает.
 */
const withNoindex = (response: NextResponse, host: string) => {
  if (!isIndexableHost(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
};

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

  return withNoindex(handleI18nRouting(request), host);
}

export const config = {
  matcher: [
    // robots.txt и sitemap.xml обязаны отдаваться как есть: middleware
    // перехватывал их раньше rewrite, и поисковики получали HTML вместо файла
    "/((?!api|_next/static|admin|structure|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    "/(en|ru)/:path*"
  ]
};
