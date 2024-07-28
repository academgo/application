import React from "react";
import { Metadata } from "next";
import { i18n } from "@/i18n.config";
import SuccessPageComponent from "@/app/components/SuccessPageComponent/SuccessPageComponent";
import { Translation } from "@/types/post";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import { getNotFoundPageByLang } from "@/sanity/sanity.utils";
import NotFoundPageComponent from "@/app/components/NotFoundPageComponent/NotFoundPageComponent";

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

const SuccessPage = async ({ params }: Props) => {
  const { lang } = params;
  const notFoundPage = await getNotFoundPageByLang(lang);

  // console.log("successPage", successPage);

  const notFoundPageTranslationSlugs: {
    [key: string]: { current: string };
  }[] = notFoundPage?._translations.map(item => {
    const newItem: { [key: string]: { current: string } } = {};

    for (const key in item.slug) {
      if (key !== "_type") {
        newItem[key] = { current: item.slug[key].current };
      }
    }
    return newItem;
  });

  const translations = i18n.languages.reduce<Translation[]>((acc, lang) => {
    const translationSlug = notFoundPageTranslationSlugs
      ?.reduce(
        (acc: string[], slug: { [key: string]: { current: string } }) => {
          const current = slug[lang.id]?.current;
          if (current) {
            acc.push(current);
          }
          return acc;
        },
        []
      )
      .join(" ");

    return translationSlug
      ? [
          ...acc,
          {
            language: lang.id,
            path: `/${lang.id}/${translationSlug}`
          }
        ]
      : acc;
  }, []);

  if (!notFoundPage) return null;

  return (
    <>
      <Header params={params} translations={translations} />
      <NotFoundPageComponent notFoundPage={notFoundPage} lang={params.lang} />
      <Footer params={params} />
    </>
  );
};

export default SuccessPage;
