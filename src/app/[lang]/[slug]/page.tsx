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
  getSinglePageByLang,
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
  PackagesBlock,
  TableBlock,
  VideosBlock
} from "@/types/blog";
import { FormStandardDocument } from "@/types/formStandardDocument";
import { Translation } from "@/types/post";
import { Metadata } from "next";
import NotFoundPageComponent from "@/app/components/NotFoundPageComponent/NotFoundPageComponent";
import SinglePageIntroBlock from "@/app/components/SinglePageIntroBlock/SinglePageIntroBlock";
import DoubleTextBlockComponent from "@/app/components/DoubleTextBlockComponent/DoubleTextBlockComponent";
import WhiteBlockComponent from "@/app/components/WhiteBlockComponent/WhiteBlockComponent";
import BenefitsBlockComponent from "@/app/components/BenefitsBlockComponent/BenefitsBlockComponent";
import SliderBlockComponent from "@/app/components/SliderBlockComponent/SliderBlockComponent";
import LinksBlockComponent from "@/app/components/LinksBlockComponent/LinksBlockComponent";
import PackagePriceBlockComponent from "@/app/components/PackagePriceBlockComponent/PackagePriceBlockComponent";
import ExtraBlockComponent from "@/app/components/ExtraBlockComponent/ExtraBlockComponent";
import CompareBlockComponent from "@/app/components/CompareBlockComponent/CompareBlockComponent";
import ProcessBlockComponent from "@/app/components/ProcessBlockComponent/ProcessBlockComponent";
import PricesBlockComponent from "@/app/components/PricesBlockComponent/PricesBlockComponent";
import CoverBlock from "@/app/components/CoverBlock/CoverBlock";
import BulletsBlockComponent from "@/app/components/BulletsBlockComponent/BulletsBlockComponent";
import CascadeBlockComponent from "@/app/components/CascadeBlockComponent/CascadeBlockComponent";
import SliderPictureBlockComponent from "@/app/components/SliderPictureBlockComponent/SliderPictureBlockComponent";
import LogosBlockComponent from "@/app/components/LogosBlockComponent/LogosBlockComponent";
import ContactsBlockComponent from "@/app/components/ContactsBlockComponent/ContactsBlockComponent";
import SurveyBlockComponent from "@/app/components/SurveyBlockComponent/SurveyBlockComponent";
import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import OfferBlockComponent from "@/app/components/OfferBlockComponent/OfferBlockComponent";
import PricingTableComponent from "@/app/components/PricingTableComponent/PricingTableComponent";
import PackagesBlockComponent from "@/app/components/PackagesBlockComponent/PackagesBlockComponent";
import TableBlockComponent from "@/app/components/TableBlockComponent/TableBlockComponent";
import VideosSection from "@/app/components/VideosSection/VideosSection";

const NotFound = dynamic(() => import("@/app/components/NotFound/NotFound"), {
  ssr: false
});

type Props = {
  params: { lang: string; slug: string };
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
  | TableBlock
  | VideosBlock
  | PackagesBlock;

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = params;
  const data = await getSinglePageByLang(lang, slug);

  // default locale (en) без /en
  const langPrefix = lang === "en" ? "" : `/${lang}`;
  const canonicalPath = `${langPrefix}/${slug}`;

  return {
    title: data?.seo.metaTitle ?? undefined,
    description: data?.seo.metaDescription ?? undefined,
    alternates: {
      canonical: canonicalPath
    }
  };
}

const SinglePage = async ({ params }: Props) => {
  const { lang, slug } = params;
  const page = await getSinglePageByLang(lang, slug);

  if (!page) {
    const notFoundPage = await getNotFoundPageByLang(lang);
    return (
      <>
        <Header params={params} translations={[]} />
        <NotFoundPageComponent notFoundPage={notFoundPage} lang={lang} />
        <Footer params={params} />
      </>
    ); // Рендеринг компонента NotFound
  }

  const formDocument: FormStandardDocument =
    await getFormStandardDocumentByLang(params.lang);

  const singlePageTranslationSlugs: { [key: string]: { current: string } }[] =
    page?._translations.map(item => {
      const newItem: { [key: string]: { current: string } } = {};

      for (const key in item.slug) {
        if (key !== "_type") {
          newItem[key] = { current: item.slug[key].current };
        }
      }
      return newItem;
    });

  const translations = i18n.languages.reduce<Translation[]>((acc, lang) => {
    const translationSlug = singlePageTranslationSlugs
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
            title={page.title}
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
      case "videosBlock": {
        const b = block as any;

        const videosTitle = b.videosTitle ?? "";
        // b.videos — если у тебя wrapper-объект
        // b — если вдруг сам block является массивом (на всякий случай)
        const videos = (b.videos ?? b ?? []) as any;

        return (
          <VideosSection
            key={b._key ?? "videos"}
            videosTitle={videosTitle}
            videos={videos}
          />
        );
      }
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
      case "tableBlock":
        return (
          <div className="container-table">
            <TableBlockComponent key={block._key} block={block as TableBlock} />
          </div>
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
          <div className="survey-width">
            <SurveyBlockComponent
              lang={params.lang}
              key={block._key}
              block={block as SurveyBlock}
            />
          </div>
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

  const currentPostId = page._id;

  return (
    <>
      <Header params={params} translations={translations} />
      <main>
        {/* <PreviewMain previewImage={page.previewImage} title={page.title} /> */}
        <div className="container">
          <CoverBlock coverBlock={page.coverBlock} />
          <Breadcrumbs lang={lang} slug={slug} title={page.title} />
          {/* <SinglePageIntroBlock title={page.title} /> */}
          {/* breadcrumbs here */}
          {page.contentBlocks.map(block => renderContentBlock(block))}
        </div>
      </main>
      <Footer params={params} />
      <ModalFull lang={params.lang} formDocument={formDocument} />
    </>
  );
};

export default SinglePage;
