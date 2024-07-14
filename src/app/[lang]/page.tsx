import Link from "next/link";
import Header from "../components/Header/Header";
import { getHomePageByLang } from "../../sanity/sanity.utils";
import { i18n } from "@/i18n.config";
import { Translation } from "@/types/post";
import Hero from "../components/Hero/Hero";
import Conditions from "../components/Conditions/Conditions";
import VideosSection from "../components/VideosSection/VideosSection";

type Props = {
  params: { lang: string; slug: string };
};

export default async function Home({ params }: Props) {
  const homePage = await getHomePageByLang(params.lang);

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
          conditionsTitle={homePage.conditionsTitle}
          conditionFirst={homePage.conditionFirst}
          conditionSecond={homePage.conditionSecond}
          conditionThird={homePage.conditionThird}
          conditionFourth={homePage.conditionFourth}
        />
        <VideosSection
          videosTitle={homePage.videosTitle}
          videos={homePage.videos}
        />
      </main>
    </>
  );
}
