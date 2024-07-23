import React, { FC } from "react";
import styles from "./BlogPageContent.module.scss";
import { AccordionBlock } from "@/types/blog";
import { Accordion } from "@szhsin/react-accordion";
import AccordionContainer from "../AccordionContainer/AccordionContainer";

type Props = {
  faq: AccordionBlock;
  lang: string;
};

const BlogPageContent: FC<Props> = ({ faq, lang }) => {
  return (
    <section className={styles.blogPageContent}>
      <div className="container">
        <h1 className={styles.pageTitle}>
          {lang === "en"
            ? "FAQ"
            : "Отвечаем на частые вопросы абитуриентов и их родителей"}
        </h1>
        <AccordionContainer block={faq} />
      </div>
    </section>
  );
};

export default BlogPageContent;
