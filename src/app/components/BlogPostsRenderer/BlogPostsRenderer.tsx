"use client";
import React, { FC, Suspense, useState } from "react";
import styles from "./BlogPostsRenderer.module.scss";
import { Blog } from "@/types/blog";
import Link from "next/link";
import { urlFor } from "@/sanity/sanity.client";
import Image from "next/image";
import Loading from "@/app/[lang]/loading";

type Props = {
  blogPosts: Blog[];
  lang: string;
};

const BlogPostsRenderer: FC<Props> = ({ blogPosts, lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return parsedDate.toLocaleDateString("en-GB").replace(/\//g, ".");
  };

  const generateSlug = (slug: any, language: string) => {
    return slug && slug[language]?.current
      ? `/${language}/blog/${slug[language].current}`
      : "#";
  };

  const categories = Array.from(
    new Set(blogPosts.map(post => post.category.title))
  );

  const filteredPosts = selectedCategory
    ? blogPosts.filter(post => post.category.title === selectedCategory)
    : blogPosts;

  return (
    <div className={styles.blogPostsRenderer}>
      <div className={styles.tabsBlock}>
        <div className="container-content">
          <div className={styles.tabs}>
            <button
              className={`${!selectedCategory ? styles.active : ""} ${styles.tab}`}
              onClick={() => setSelectedCategory(null)}
            >
              {lang === "ru" ? "Все" : "All"}
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`
                  ${selectedCategory === category ? styles.active : ""}
                  ${styles.tab}
                  `}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.articlesBlock}>
        <div className="container">
          <Suspense fallback={<Loading />}>
            <div className={styles.articles}>
              {filteredPosts.map(post => (
                <Link
                  href={generateSlug(post.slug, lang)}
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
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default BlogPostsRenderer;
