// page.tsx
import React from "react";
import { Metadata } from "next";
import {
  getBlogPageByLang,
  getBlogPostsByLangWithPagination,
  getFormStandardDocumentByLang
} from "@/sanity/sanity.utils";
import { Translation } from "@/types/post";
import Header from "@/app/components/Header/Header";
import BlogPostsAll from "@/app/components/BlogPostsAll/BlogPostsAll";
import BlogPageContent from "@/app/components/BlogPageContent/BlogPageContent";
import Footer from "@/app/components/Footer/Footer";
import { FormStandardDocument } from "@/types/formStandardDocument";
import ModalFullLazy from "@/app/components/ModalFull/ModalFullLazy";

type Props = {
  params: Promise<{ lang: string }>;
};

// Dynamic metadata for SEO
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await getBlogPageByLang(params.lang);

  // default locale (en) без /en
  const langPrefix = params.lang === "en" ? "" : `/${params.lang}`;

  // У тебя реальный URL листинга: /blog (или /ru/blog)
  const canonicalPath = `${langPrefix}/blog`;

  return {
    title: data?.metaTitle ?? "Academgo Blog",
    description: data?.metaDescription ?? undefined,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: "/blog",
        ru: "/ru/blog",
        "x-default": "/blog"
      }
    }
  };
}

const PageBlog = async (props: Props) => {
  const params = await props.params;
  const { lang } = params;
  const initialPosts = await getBlogPostsByLangWithPagination(lang, 12, 0);
  const blogPage = await getBlogPageByLang(lang);

  const formDocument: FormStandardDocument =
    await getFormStandardDocumentByLang(params.lang);

  // адрес листинга фиксированный, слаги документа тут не участвуют
  const translations: Translation[] = [
    { language: "en", path: "/blog" },
    { language: "ru", path: "/ru/blog" }
  ];

  return (
    <>
      <Header params={params} translations={translations} />
      <main>
        <BlogPostsAll blogPosts={initialPosts} lang={params.lang} />
        <BlogPageContent faq={blogPage.faq} lang={params.lang} />
      </main>
      <Footer params={params} />
      <ModalFullLazy lang={params.lang} formDocument={formDocument} />
    </>
  );
};

export default PageBlog;
