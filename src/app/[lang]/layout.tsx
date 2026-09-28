import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ModalProvider } from "../context/ModalContext";
import DeferredAnalytics from "../components/Analytics/DeferredAnalytics";
import OrganizationSchema from "../components/OrganizationSchema/OrganizationSchema";

// Без предзагрузки: иначе Lighthouse ставит файлы шрифта на критический путь
// и LCP растёт. Текст сначала рисуется запасным шрифтом с подогнанными
// метриками (сдвига нет) и сразу меняется на Inter.
const inter = Inter({ subsets: ["latin"], display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Academgo",
  description: "Academgo",
  metadataBase: new URL("https://academgo.com"),
  other: {
    // второй код был в удалённом корневом src/app/layout.tsx
    "google-site-verification": [
      "Z9rCf2v2CEJMbcFZTAsdruuNBmLVtz6GbrNLHkLEyHM",
      "y26kx-fqwQmu8vSsuIo8zW09MIp0pnOQNHnGFNggnmQ"
    ]
  }
};

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  return (
    <html lang={params.lang}>
      <body className={inter.className} suppressHydrationWarning>
        <OrganizationSchema lang={params.lang} />
        <ModalProvider>{children}</ModalProvider>
        <DeferredAnalytics />
      </body>
    </html>
  );
}
