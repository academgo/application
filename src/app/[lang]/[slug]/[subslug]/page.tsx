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
  LinksBlock,
  SliderBlock,
  CascadeBlock,
  PackagePriceBlock,
  ExtraBlock,
  CompareBlock,
  ProcessBlock,
  PricesBlock,
  SliderPicturesBlock,
  LogosBlock,
  ContactsBlock,
  SurveyBlock,
  OfferBlock,
  PricingTable,
  PackagesBlock
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
import SliderBlockComponent from "@/app/components/SliderBlockComponent/SliderBlockComponent";
import CascadeBlockComponent from "@/app/components/CascadeBlockComponent/CascadeBlockComponent";
import PackagePriceBlockComponent from "@/app/components/PackagePriceBlockComponent/PackagePriceBlockComponent";
import ExtraBlockComponent from "@/app/components/ExtraBlockComponent/ExtraBlockComponent";
import CompareBlockComponent from "@/app/components/CompareBlockComponent/CompareBlockComponent";
import ProcessBlockComponent from "@/app/components/ProcessBlockComponent/ProcessBlockComponent";
import PricesBlockComponent from "@/app/components/PricesBlockComponent/PricesBlockComponent";
import SliderPictureBlockComponent from "@/app/components/SliderPictureBlockComponent/SliderPictureBlockComponent";
import LogosBlockComponent from "@/app/components/LogosBlockComponent/LogosBlockComponent";
import ContactsBlockComponent from "@/app/components/ContactsBlockComponent/ContactsBlockComponent";
import SurveyBlockComponent from "@/app/components/SurveyBlockComponent/SurveyBlockComponent";
import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import OfferBlockComponent from "@/app/components/OfferBlockComponent/OfferBlockComponent";
import PricingTableComponent from "@/app/components/PricingTableComponent/PricingTableComponent";
import PackagesBlockComponent from "@/app/components/PackagesBlockComponent/PackagesBlockComponent";

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
  | LinksBlock
  | SliderBlock
  | CascadeBlock
  | PackagePriceBlock
  | ExtraBlock
  | CompareBlock
  | ProcessBlock
  | PricesBlock
  | SliderPicturesBlock
  | LogosBlock
  | ContactsBlock
  | SurveyBlock
  | OfferBlock
  | PricingTable
  | PackagesBlock;

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

  // console.log("Subpage data:", subPage);

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
  // console.log("formDocument", formDocument);

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
    // console.log("Block type", block._type);
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
      case "sliderBlock":
        return (
          <SliderBlockComponent key={block._key} block={block as SliderBlock} />
        );
      case "cascadeBlock":
        return (
          <CascadeBlockComponent
            key={block._key}
            block={block as CascadeBlock}
          />
        );
      case "packagePriceBlock":
        return (
          <PackagePriceBlockComponent
            key={block._key}
            block={block as PackagePriceBlock}
          />
        );
      case "extraBlock":
        return (
          <ExtraBlockComponent key={block._key} block={block as ExtraBlock} />
        );
      case "compareBlock":
        return (
          <CompareBlockComponent
            key={block._key}
            block={block as CompareBlock}
          />
        );
      case "processBlock":
        return (
          <ProcessBlockComponent
            key={block._key}
            block={block as ProcessBlock}
          />
        );
      case "pricingTable":
        return (
          <PricingTableComponent
            key={block._key}
            block={block as PricingTable}
          />
        );
      case "sliderPicturesBlock":
        return (
          <SliderPictureBlockComponent
            key={block._key}
            block={block as SliderPicturesBlock}
          />
        );
      case "logosBlock":
        return (
          <LogosBlockComponent key={block._key} block={block as LogosBlock} />
        );
      case "contactsBlock":
        return (
          <ContactsBlockComponent
            key={block._key}
            block={block as ContactsBlock}
          />
        );
      case "surveyBlock":
        return (
          <SurveyBlockComponent
            lang={params.lang}
            key={block._key}
            block={block as SurveyBlock}
          />
        );
      case "offerBlock":
        return (
          <OfferBlockComponent key={block._key} block={block as OfferBlock} />
        );
      case "packagesBlock":
        return (
          <PackagesBlockComponent
            key={block._key}
            block={block as PackagesBlock}
          />
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
          <Breadcrumbs
            lang={lang}
            slug={slug}
            subslug={subslug}
            title={subPage.title}
            parentTitle={subPage.parentPage.title}
            parentSlug={subPage.parentPage.slug[lang]?.current}
          />
          {/* <SinglePageIntroBlock title={subPage.title} /> */}
          {subPage.contentBlocks.map(block => renderContentBlock(block))}
        </div>
      </main>
      <Footer params={params} />
      <ModalFull lang={params.lang} formDocument={formDocument} />
    </>
  );
};

export default Subpage;
