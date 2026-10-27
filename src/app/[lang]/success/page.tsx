import React from "react";
import { Metadata } from "next";
import { getSuccessPageByLang } from "@/sanity/sanity.utils";
import SuccessPageComponent from "@/app/components/SuccessPageComponent/SuccessPageComponent";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import { buildLanguageVersions } from "@/lib/hreflang";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await getSuccessPageByLang(params.lang);

  return {
    title: data?.seo.metaTitle,
    description: data?.seo.metaDescription
  };
}

const SuccessPage = async (props: Props) => {
  const params = await props.params;
  const { lang } = params;
  const successPage = await getSuccessPageByLang(lang);

  // console.log("successPage", successPage);

  const translations = buildLanguageVersions(successPage?._translations);

  return (
    <>
      <Header params={params} translations={translations} />
      <SuccessPageComponent successPage={successPage} lang={lang} />
      <Footer params={params} />
    </>
  );
};

export default SuccessPage;
