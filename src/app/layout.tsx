import { ReactNode } from "react";

// Сквозной корневой layout: <html> рисуют [lang]/layout.tsx, admin/layout.tsx
// и not-found.tsx. Без него 404 из страниц рендерилась пустой оболочкой
// <html id="__next_error__"> — Next ищет корневые layout и not-found.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
