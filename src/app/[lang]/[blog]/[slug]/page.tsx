import { AccordionBlockComponent } from "@/app/components/AccordionBlockComponent/AccordionBlockComponent";
import BlogIntro from "@/app/components/BlogIntro/BlogIntro";
import BlogVideo from "@/app/components/BlogVideo/BlogVideo";
import DoubleImagesBlockComponent from "@/app/components/DoubleImagesBlockComponent/DoubleImagesBlockComponent";
import Header from "@/app/components/Header/Header";
import RelatedArticles from "@/app/components/RelatedArticles/RelatedArticles";
import TabsBlockComponent from "@/app/components/TabsBlockComponent/TabsBlockComponent";
import TextContentComponent from "@/app/components/TextContentComponent/TextContentComponent";
import { i18n } from "@/i18n.config";
import { getBlogPostByLang } from "@/sanity/sanity.utils";
import {
  AccordionBlock,
  DoubleImagesBlock,
  TabsBlock,
  TextContent
} from "@/types/blog";
import { Translation } from "@/types/post";
import { Metadata } from "next";
import React from "react";

type Props = {
  params: { lang: string; slug: string };
};

type ContentBlock =
  | TextContent
  | DoubleImagesBlock
  | AccordionBlock
  | TabsBlock;

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = params;
  const data = await getBlogPostByLang(lang, slug);

  return {
    title: data?.seo.metaTitle,
    description: data?.seo.metaDescription
  };
}

const PagePost = async ({ params }: Props) => {
  const { lang, slug } = params;
  const blog = await getBlogPostByLang(lang, slug);

  const blogPageTranslationSlugs: { [key: string]: { current: string } }[] =
    blog?._translations.map(item => {
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
            path: `/${lang.id}/blog/${translationSlug}`
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
          <AccordionBlockComponent
            key={block._key}
            block={block as AccordionBlock}
          />
        );
      case "doubleImagesBlock":
        return (
          <DoubleImagesBlockComponent
            key={block._key}
            block={block as DoubleImagesBlock}
            title={blog.title}
          />
        );
      case "tabsBlock":
        return (
          <TabsBlockComponent key={block._key} block={block as TabsBlock} />
        );
      default:
        return <p key={block._key}>Unsupported block type</p>;
    }
  };

  // console.log("relatedArticles", blog.relatedArticles);

  return (
    <>
      <Header params={params} translations={translations} />
      <main>
        <div className="container">
          <div className="post-grid">
            <div className="post-content">
              <BlogIntro
                title={blog.title}
                categoryTitle={blog.category.title}
                date={blog.publishedAt}
                previewImage={blog.previewImage}
                firstContent={blog.firstContent}
              />
              <article>
                {blog.contentBlocks.map(block => renderContentBlock(block))}
              </article>
            </div>
            <div className="post-content sidebar">
              <aside className="aside">
                {blog.videoBlock &&
                  blog.videoBlock.videoId &&
                  blog.videoBlock.posterImage && (
                    <BlogVideo
                      videoId={blog.videoBlock.videoId}
                      posterImage={blog.videoBlock.posterImage}
                      title={blog.title}
                    />
                  )}
              </aside>
              {blog.relatedArticles && blog.relatedArticles.length > 0 && (
                <RelatedArticles
                  language={lang}
                  relatedArticles={blog.relatedArticles}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PagePost;
