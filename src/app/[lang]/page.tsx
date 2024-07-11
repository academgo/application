import Link from 'next/link';
import Header from '../components/Header/Header';
import { getHomePageByLang } from '../../sanity/sanity.utils';
import { i18n } from '@/i18n.config';
import { Translation } from '@/types/post';

type Props = {
  params: { lang: string; slug: string };
};

export default async function Home({ params }: Props) {
  
  const homePage = await getHomePageByLang(params.lang);

  const homePageTranslationSlugs: { [key: string]: { current: string } }[] =
    homePage?._translations.map((item) => {
      const newItem: { [key: string]: { current: string } } = {};

      for (const key in item.slug) {
        if (key !== '_type') {
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
        [],
      )
      .join(' ');

    return translationSlug
      ? [
          ...acc,
          {
            language: lang.id,
            path: `/${lang.id}`,
          },
        ]
      : acc;
    }, []);
  
  return (
    <>
      <Header params={params} translations={translations} />
      <main>
        <h1>
          {homePage?.title}
        </h1>
      </main>
    </>
  );

}