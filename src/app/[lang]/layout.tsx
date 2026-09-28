import "@/app/globals.css";
import type { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { ModalProvider } from "../context/ModalContext";
import { Suspense } from "react";
import { FacebookPixelEvents } from "../components/pixel-events";
import Head from "next/head";
import OrganizationSchema from "../components/OrganizationSchema/OrganizationSchema";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Academgo",
  description: "Academgo",
  metadataBase: new URL("https://academgo.com"),
  other: {
    "google-site-verification": "Z9rCf2v2CEJMbcFZTAsdruuNBmLVtz6GbrNLHkLEyHM"
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
      {/* <Head>
        <meta
          name="google-site-verification"
          content="y26kx-fqwQmu8vSsuIo8zW09MIp0pnOQNHnGFNggnmQ"
        />
      </Head> */}
      <body className={inter.className}>
        <OrganizationSchema lang={params.lang} />
        <ModalProvider>{children}</ModalProvider>
        <GoogleAnalytics gaId="G-XTMLVRC9RR" />
        <GoogleTagManager gtmId="GTM-NMJPFJ6N" />
        <Suspense fallback={null}>
          <FacebookPixelEvents />
        </Suspense>
      </body>
    </html>
  );
}
