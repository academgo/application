import React from "react";
import styles from "./BlogPostsSection.module.scss";
import { getNinePostsByLang } from "@/sanity/sanity.utils";
import SliderMain from "../SliderMain/SliderMain";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import BlogButtonWrapper from "../BlogButtonWrapper/BlogButtonWrapper";
import LinkPrimary from "../LinkPrimary/LinkPrimary";

type Props = {
  params: { lang: string };
};

const BlogPostsSection = async ({ params }: Props) => {
  const blogPosts = await getNinePostsByLang(params.lang);

  const formatDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return parsedDate.toLocaleDateString("en-GB").replace(/\//g, ".");
  };

  const generateSlug = (slug: any, language: string) => {
    return slug && slug[language]?.current
      ? `/${language}/blog/${slug[language].current}`
      : "#";
  };

  if (!blogPosts) {
    return (
      <div>Ошибка: Не удалось загрузить данные для языка {params.lang}</div>
    );
  }

  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section className={styles.blogPosts}>
      <div className="container">
        <h2 className={styles.title}>
          {params.lang === "ru"
            ? "Щедро делимся актуальной информацией в блоге"
            : "We generously share up-to-date information in the blog"}
        </h2>
        <SliderMain
          className={styles.blogPostsSlider}
          uniqueId="blog-posts-slider"
        >
          {blogPosts.map(post => (
            <Link
              href={generateSlug(post.slug, params.lang)}
              key={post._id}
              className={styles.article}
            >
              <div className={styles.imageBlock}>
                <Image
                  alt={post.title}
                  src={urlFor(post.previewImage).url()}
                  fill={true}
                  className={styles.image}
                />
              </div>
              <div className={styles.overlay}></div>
              <div className={styles.content}>
                <div className={styles.contentWrapper}>
                  <div className={styles.contentTop}>
                    <p className={styles.articleCategory}>
                      {post.category.title}
                    </p>
                  </div>
                  <div className={styles.contentBottom}>
                    <p className={styles.articleDate}>
                      {formatDate(post.publishedAt)}
                    </p>
                    <h3 className={styles.articleTitle}>{post.title}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </SliderMain>
        <BlogButtonWrapper>
          <LinkPrimary href={`/${params.lang}/blog`}>
            {params.lang === "en" ? "Go to blog" : "Перейти в блог"}
          </LinkPrimary>
        </BlogButtonWrapper>
      </div>
    </section>
  );
};

export default BlogPostsSection;
