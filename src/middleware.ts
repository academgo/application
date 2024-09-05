import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/i18n.config";

export default async function middleware(request: NextRequest) {
  const handleI18nRouting = createIntlMiddleware({
    locales,
    defaultLocale,
    localePrefix: "as-needed"
  });

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|admin|structure|robots|sitemap|_next/image|favicon.ico).*)",
    "/(en|ru)/:path*"
  ]
};
