import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import NotFoundPageComponent from "./components/NotFoundPageComponent/NotFoundPageComponent";
import { getNotFoundPageByLang } from "@/sanity/sanity.utils";
import { defaultLocale, locales } from "@/i18n.config";

const inter = Inter({ subsets: ["latin"], display: "swap", preload: false });

export const metadata: Metadata = {
  title: "404 — Academgo"
};

/**
 * Страница 404 со статусом 404 (раньше несуществующие адреса отдавали 200 —
 * «мягкая» 404 для поисковиков).
 *
 * notFound() из страниц Next рендерит корневым app/not-found.tsx внутри
 * сквозного app/layout.tsx, поэтому документ <html> рисуется здесь целиком.
 * params сюда не приходят, язык берём из заголовка, который proxy next-intl
 * ставит на каждый запрос.
 *
 * Без шапки и подвала: Next встраивает эту страницу в данные КАЖДОЙ страницы
 * сайта, а шапка с меню весит ~37 КБ. Вернуться помогает кнопка на главную.
 */
export default async function NotFound() {
  const headerLang = (await headers()).get("x-next-intl-locale") || "";
  const lang = locales.includes(headerLang) ? headerLang : defaultLocale;
  const notFoundPage = await getNotFoundPageByLang(lang);

  return (
    <html lang={lang}>
      <body className={inter.className} suppressHydrationWarning>
        <main>
          <NotFoundPageComponent notFoundPage={notFoundPage} lang={lang} />
        </main>
      </body>
    </html>
  );
}
