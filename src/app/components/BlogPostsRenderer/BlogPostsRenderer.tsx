"use client";
import React, { FC, useState } from "react";
import styles from "./BlogPostsRenderer.module.scss";
import { Blog } from "@/types/blog";
import Link from "next/link";
import { urlFor } from "@/sanity/sanity.client";
import Image from "next/image";
import axios from "axios";
import ButtonPrimary from "../ButtonPrimary/ButtonPrimary";
import Loading from "@/app/[lang]/loading";

type Props = {
  blogPosts: Blog[];
  lang: string;
};

const BlogPostsRenderer: FC<Props> = ({ blogPosts, lang }) => {
  const [posts, setPosts] = useState<Blog[]>(blogPosts);
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return parsedDate.toLocaleDateString("en-GB").replace(/\//g, ".");
  };

  const generateSlug = (slug: any, language: string) => {
    return slug && slug[language]?.current
      ? `/${language}/blog/${slug[language].current}`
      : "#";
  };

  const loadMorePosts = async () => {
    setLoading(true);
    const limit = 9;
    const offset = posts.length;

    try {
      const response = await axios.get(
        `/api/getMorePosts?lang=${lang}&limit=${limit}&offset=${offset}`
      );
      const newPosts = response.data.posts;
      const total = response.data.total;

      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setTotalPosts(total);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(
    new Set(posts.map(post => post.category.title))
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category.title === selectedCategory)
    : posts;

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
                className={`${selectedCategory === category ? styles.active : ""} ${styles.tab}`}
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
          <div className={styles.loadingBlock}>
            <div className={styles.loaderWrapper}>
              {loading && (
                <div className={styles.loader}>
                  <div className={styles.bar1}></div>
                  <div className={styles.bar2}></div>
                  <div className={styles.bar3}></div>
                  <div className={styles.bar4}></div>
                  <div className={styles.bar5}></div>
                  <div className={styles.bar6}></div>
                  <div className={styles.bar7}></div>
                  <div className={styles.bar8}></div>
                  <div className={styles.bar9}></div>
                  <div className={styles.bar10}></div>
                  <div className={styles.bar11}></div>
                  <div className={styles.bar12}></div>
                </div>
              )}
            </div>
            {!loading && (totalPosts === null || posts.length < totalPosts) ? (
              <ButtonPrimary
                onClick={loadMorePosts}
                disabled={loading}
                className={styles.loadMoreButton}
              >
                {lang === "ru" ? "Загрузить еще 9 статей" : "Load more 9 posts"}
              </ButtonPrimary>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostsRenderer;
