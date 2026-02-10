import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/i18n.config";

const PRIMARY_HOST = "academgo.com";

export default async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host.endsWith(".vercel.app")) {
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
    "/((?!api|_next/static|admin|structure|_next/image|favicon.ico).*)",
    "/(en|ru)/:path*"
  ]
};
