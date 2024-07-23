import React from "react";
import { Metadata } from "next";
import { i18n } from "@/i18n.config";
import { getBlogPageByLang, getBlogPostsByLang } from "@/sanity/sanity.utils";
import { Translation } from "@/types/post";
import Header from "@/app/components/Header/Header";
import BlogPostsAll from "@/app/components/BlogPostsAll/BlogPostsAll";
import BlogPageContent from "@/app/components/BlogPageContent/BlogPageContent";

type Props = {
  params: { lang: string };
};

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getBlogPageByLang(params.lang);

  return {
    title: data?.metaTitle,
    description: data?.metaDescription
  };
}

const PageBlog = async ({ params }: Props) => {
  const { lang } = params;
  const blogPosts = await getBlogPostsByLang(lang);
  const blogPage = await getBlogPageByLang(lang);

  // console.log("blogPage", blogPage);

  const blogPageTranslationSlugs: { [key: string]: { current: string } }[] =
    blogPage?._translations.map(item => {
      const newItem: { [key: string]: { current: string } } = {};

      for (const key in item.slug) {
        if (key !== "_type") {
          newItem[key] = { current: item.slug[key].current };
        }
      }
      return newItem;
    });

  const translations = i18n.languages.reduce<Translation[]>((acc, lang) => {
    const translationSlug = blogPageTranslationSlugs
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

  // console.log("translations", translations);

  // console.log(blogPosts);
  return (
    <>
      <Header params={params} translations={translations} />
      <main>
        <BlogPostsAll blogPosts={blogPosts} lang={params.lang} />
        <BlogPageContent faq={blogPage.faq} lang={params.lang} />
      </main>
    </>
  );
};

export default PageBlog;
