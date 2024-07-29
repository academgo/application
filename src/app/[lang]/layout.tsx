import "@/app/globals.css";
import type { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { ModalProvider } from "../context/ModalContext";
import { Suspense } from "react";
import { FacebookPixelEvents } from "../components/pixel-events";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Academgo",
  description: "Academgo"
};

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <ModalProvider>{children}</ModalProvider>
        <GoogleAnalytics gaId="G-XTMLVRC9RR" />
        <GoogleTagManager gtmId="G-XTMLVRC9RR" />
        <Suspense fallback={null}>
          <FacebookPixelEvents />
        </Suspense>
      </body>
    </html>
  );
}
