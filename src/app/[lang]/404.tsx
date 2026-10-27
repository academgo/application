import React from "react";
import { Metadata } from "next";
import SuccessPageComponent from "@/app/components/SuccessPageComponent/SuccessPageComponent";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import { getNotFoundPageByLang } from "@/sanity/sanity.utils";
import NotFoundPageComponent from "@/app/components/NotFoundPageComponent/NotFoundPageComponent";
import { buildLanguageVersions } from "@/lib/hreflang";

type Props = {
  params: { lang: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getNotFoundPageByLang(params.lang);

  return {
    title: data?.seo.metaTitle,
    description: data?.seo.metaDescription
  };
}

const NotFoundPage = async ({ params }: Props) => {
  const { lang } = params;
  const notFoundPage = await getNotFoundPageByLang(lang);

  // console.log("successPage", successPage);

  const translations = buildLanguageVersions(notFoundPage?._translations);

  if (!notFoundPage) return null;

  return (
    <>
      <Header params={params} translations={translations} />
      <NotFoundPageComponent notFoundPage={notFoundPage} lang={params.lang} />
      <Footer params={params} />
    </>
  );
};

export default NotFoundPage;
