import "@/app/globals.css";
import type { Metadata } from "next";

import { Inter } from "next/font/google";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { ModalProvider } from "../context/ModalContext";
import ModalFull from "../components/ModalFull/ModalFull";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Academgo",
  description: "Academgo",
  icons: {
    icon: "/favicon.svg"
  }
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
        {/* <Header params={params} /> */}
        {/* <main>{children}</main> */}
        <ModalProvider>{children}</ModalProvider>
        {/* <Footer params={params} /> */}
      </body>
    </html>
  );
}
