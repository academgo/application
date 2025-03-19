import { Metadata } from "next";
import Header from "../components/Header/Header";
import {
  getFormStandardDocumentByLang,
  getHomePageByLang
} from "@/sanity/sanity.utils";
import { i18n } from "@/i18n.config";
import { Translation } from "@/types/post";
import Hero from "../components/Hero/Hero";
import Conditions from "../components/Conditions/Conditions";
import VideosSection from "../components/VideosSection/VideosSection";
import Offer from "../components/Offer/Offer";
import Faculties from "../components/Faculties/Faculties";
import About from "../components/About/About";
import Principles from "../components/Principles/Principles";
import StepOne from "../components/StepOne/StepOne";
import StepTwo from "../components/StepTwo/StepTwo";
import StepThree from "../components/StepThree/StepThree";
import StepFour from "../components/StepFour/StepFour";
import ExtraBlock from "../components/ExtraBlock/ExtraBlock";
import Price from "../components/Price/Price";
import Footer from "../components/Footer/Footer";
import BlogPostsSection from "../components/BlogPostsSection/BlogPostsSection";
import Survey from "../components/Survey/Survey";
import ModalFull from "../components/ModalFull/ModalFull";
import { FormStandardDocument } from "@/types/formStandardDocument";
import Universities from "../components/Universities/Universities";
import AccordionContainer from "../components/AccordionContainer/AccordionContainer";

type Props = {
  params: { lang: string; slug: string };
};

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const homePage = await getHomePageByLang(params.lang);
  return {
    title: homePage?.seo?.title,
    description: homePage?.seo?.description
  };
}

export default async function Home({ params }: Props) {
  const homePage = await getHomePageByLang(params.lang);

  const formDocument: FormStandardDocument =
    await getFormStandardDocumentByLang(params.lang);

  // console.log("homePage", homePage);

  const homePageTranslationSlugs: { [key: string]: { current: string } }[] =
    homePage?._translations.map(item => {
      const newItem: { [key: string]: { current: string } } = {};

      for (const key in item.slug) {
        if (key !== "_type") {
          newItem[key] = { current: item.slug[key].current };
        }
      }
      return newItem;
    });

  const translations = i18n.languages.reduce<Translation[]>((acc, lang) => {
    const translationSlug = homePageTranslationSlugs
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
            path: `/${lang.id}`
          }
        ]
      : acc;
  }, []);

  return (
    <>
      <Header params={params} translations={translations} />
      <main>
        <Hero
          mainHeadingStart={homePage.mainHeadingStart}
          mainHeadingHighlight={homePage.mainHeadingHighlight}
          mainHeadingContinue={homePage.mainHeadingContinue}
          mainHeadingEnd={homePage.mainHeadingEnd}
          tooltip={homePage.tooltip}
          description={homePage.description}
          descriptionSmall={homePage.descriptionSmall}
          heroButtonText={homePage.heroButtonText}
          heroImage={homePage.heroImage}
          heroDescription={homePage.heroDescription}
          flags={homePage.flags}
          heroTitle={homePage.heroTitle}
        />
        <Conditions
          mainHeadingH1={homePage.mainHeadingH1}
          mainHeadingH1Highlight={homePage.mainHeadingH1Highlight}
          conditionsTitle={homePage.conditionsTitle}
          conditionFirst={homePage.conditionFirst}
          conditionSecond={homePage.conditionSecond}
          conditionThird={homePage.conditionThird}
          conditionFourth={homePage.conditionFourth}
        />
        <Universities data={homePage.universitiesBlock} />
        <VideosSection
          videosTitle={homePage.videosTitle}
          videos={homePage.videos}
        />
        <Offer
          offerTitle={homePage.offerTitle}
          offerTitleHighlight={homePage.offerTitleHighlight}
          offerListTitle={homePage.offerListTitle}
          offerList={homePage.offerList}
          giftText={homePage.giftText}
          offerDesctiption={homePage.offerDesctiption}
          offerFormTitle={homePage.offerFormTitle}
          offerForm={homePage.offerForm}
          offerButtonCustomText={homePage.offerButtonCustomText}
          offerAltText={homePage.offerAltText}
          offerContactLinks={homePage.offerContactLinks}
        />
        <Faculties
          facultiesTitle={homePage.facultiesTitle}
          faculties={homePage.faculties}
          lastSlideTitleHighlight={homePage.lastSlideTitleHighlight}
          lastSlideTitle={homePage.lastSlideTitle}
          lastSlideDescription={homePage.lastSlideDescription}
          form={homePage.lastSlideForm}
        />
        <Survey lang={params.lang} survey={homePage.survey} />
        <About
          aboutSummary={homePage.aboutSummary}
          aboutTitle={homePage.aboutTitle}
          aboutParagraphs={homePage.aboutParagraphs}
          sertificateLink={homePage.sertificateLink}
          aboutSocialsTitle={homePage.aboutSocialsTitle}
          aboutSocials={homePage.aboutSocials}
          aboutOffersTitle={homePage.aboutOffersTitle}
          aboutOffers={homePage.aboutOffers}
          ceos={homePage.ceos}
        />
        <Principles
          principlesTitle={homePage.principlesTitle}
          principles={homePage.principles}
          principlesTotal={homePage.principlesTotal}
          principlesFinal={homePage.principlesFinal}
        />
        <div id="admission">
          <StepOne stepOne={homePage.stepOne} />
          <StepTwo stepTwo={homePage.stepTwo} />
          <StepThree stepThree={homePage.stepThree} />
          <StepFour stepFour={homePage.stepFour} />
        </div>
        <ExtraBlock extraBlock={homePage.extraBlock} />
        <Price
          priceTitle={homePage.priceTitle}
          priceBlock={homePage.priceBlock}
        />
        <BlogPostsSection params={{ lang: params.lang }} />
        {/* <Consultation consultationBlock={homePage.consultationBlock} /> */}
        {homePage.faq && homePage.faq && (
          <div className="container">
            <AccordionContainer block={homePage.faq} />
          </div>
        )}
      </main>
      <Footer params={params} />
      <ModalFull lang={params.lang} formDocument={formDocument} />
    </>
  );
}
