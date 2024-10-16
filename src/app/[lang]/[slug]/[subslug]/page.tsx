import React from "react";
import dynamic from "next/dynamic";
import AccordionContainer from "@/app/components/AccordionContainer/AccordionContainer";
import DoubleImagesBlockComponent from "@/app/components/DoubleImagesBlockComponent/DoubleImagesBlockComponent";
import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/Header/Header";
import ModalFull from "@/app/components/ModalFull/ModalFull";
import PreviewMain from "@/app/components/PreviewMain/PreviewMain";
import TabsBlockComponent from "@/app/components/TabsBlockComponent/TabsBlockComponent";
import TextContentComponent from "@/app/components/TextContentComponent/TextContentComponent";
import { i18n } from "@/i18n.config";
import {
  getFormStandardDocumentByLang,
  getSingleSubPageBySlug,
  getNotFoundPageByLang
} from "@/sanity/sanity.utils";
import {
  AccordionBlock,
  DoubleImagesBlock,
  TabsBlock,
  TextContent,
  DoubleTextBlock,
  BulletsBlock,
  WhiteBlock,
  BenefitsBlock,
  LinksBlock
} from "@/types/blog";
import { FormStandardDocument } from "@/types/formStandardDocument";
import { Translation } from "@/types/post";
import { Metadata } from "next";
import NotFoundPageComponent from "@/app/components/NotFoundPageComponent/NotFoundPageComponent";
import SinglePageIntroBlock from "@/app/components/SinglePageIntroBlock/SinglePageIntroBlock";
import CoverBlock from "@/app/components/CoverBlock/CoverBlock";
import DoubleTextBlockComponent from "@/app/components/DoubleTextBlockComponent/DoubleTextBlockComponent";
import BulletsBlockComponent from "@/app/components/BulletsBlockComponent/BulletsBlockComponent";
import WhiteBlockComponent from "@/app/components/WhiteBlockComponent/WhiteBlockComponent";
import BenefitsBlockComponent from "@/app/components/BenefitsBlockComponent/BenefitsBlockComponent";
import LinksBlockComponent from "@/app/components/LinksBlockComponent/LinksBlockComponent";

const NotFound = dynamic(() => import("@/app/components/NotFound/NotFound"), {
  ssr: false
});

type Props = {
  params: { lang: string; slug: string; subslug: string };
};

type ContentBlock =
  | TextContent
  | DoubleImagesBlock
  | AccordionBlock
  | TabsBlock
  | DoubleTextBlock
  | BulletsBlock
  | WhiteBlock
  | BenefitsBlock
  | LinksBlock;

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, subslug } = params;
  const data = await getSingleSubPageBySlug(lang, subslug);

  return {
    title: data?.seo.metaTitle,
    description: data?.seo.metaDescription
  };
}

const Subpage = async ({ params }: Props) => {
  const { lang, slug, subslug } = params;

  // Получаем данные подстраницы
  const subPage = await getSingleSubPageBySlug(lang, subslug);

  // console.log("Cover block", subPage?.coverBlock);

  if (!subPage) {
    const notFoundPage = await getNotFoundPageByLang(lang);
    return (
      <>
        <Header params={params} translations={[]} />
        <NotFoundPageComponent notFoundPage={notFoundPage} lang={lang} />
        <Footer params={params} />
      </>
    );
  }

  // Проверка, что слаг родительской страницы в URL соответствует слагу родителя подстраницы
  if (subPage.parentPage.slug[lang]?.current !== slug) {
    const notFoundPage = await getNotFoundPageByLang(lang);
    return (
      <>
        <Header params={params} translations={[]} />
        <NotFoundPageComponent notFoundPage={notFoundPage} lang={lang} />
        <Footer params={params} />
      </>
    );
  }

  const formDocument: FormStandardDocument =
    await getFormStandardDocumentByLang(params.lang);

  const subPageTranslationSlugs: { [key: string]: { current: string } }[] =
    subPage?._translations.map(item => {
      const newItem: { [key: string]: { current: string } } = {};

      for (const key in item.slug) {
        if (key !== "_type") {
          newItem[key] = { current: item.slug[key].current };
        }
      }
      return newItem;
    });

  const translations = i18n.languages.reduce<Translation[]>((acc, lang) => {
    const translationSlug = subPageTranslationSlugs
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
            path: `/${lang.id}/${slug}/${translationSlug}`
          }
        ]
      : acc;
  }, []);

  const renderContentBlock = (block: ContentBlock) => {
    switch (block._type) {
      case "textContent":
        return (
          <TextContentComponent key={block._key} block={block as TextContent} />
        );
      case "accordionBlock":
        return (
          <AccordionContainer
            key={block._key}
            block={block as AccordionBlock}
          />
        );
      case "doubleImagesBlock":
        return (
          <DoubleImagesBlockComponent
            key={block._key}
            block={block as DoubleImagesBlock}
            title={subPage.title}
          />
        );
      case "doubleTextBlock":
        return (
          <DoubleTextBlockComponent
            key={block._key}
            block={block as DoubleTextBlock}
          />
        );
      case "bulletsBlock":
        return (
          <BulletsBlockComponent
            key={block._key}
            block={block as BulletsBlock}
          />
        );
      case "whiteBlock":
        return (
          <WhiteBlockComponent key={block._key} block={block as WhiteBlock} />
        );
      case "tabsBlock":
        return (
          <TabsBlockComponent key={block._key} block={block as TabsBlock} />
        );
      case "benefitsBlock":
        return (
          <BenefitsBlockComponent
            key={block._key}
            block={block as BenefitsBlock}
          />
        );
      case "linksBlock":
        return (
          <LinksBlockComponent key={block._key} block={block as LinksBlock} />
        );
      default:
        return <p key={block._key}>Unsupported block type</p>;
    }
  };

  return (
    <>
      <Header params={params} translations={translations} />
      <main>
        <div className="container">
          <CoverBlock coverBlock={subPage.coverBlock} />
          <SinglePageIntroBlock title={subPage.title} />
          {subPage.contentBlocks.map(block => renderContentBlock(block))}
        </div>
      </main>
      <Footer params={params} />
      <ModalFull lang={params.lang} formDocument={formDocument} />
    </>
  );
};

export default Subpage;
