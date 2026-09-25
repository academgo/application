import React, { FC } from "react";
import MultiStepFormBlock from "../MultiStepFormBlock/MultiStepFormBlock";
import QuizSidebar, { QuizSidebarType } from "../QuizSidebar/QuizSidebar";
import { QuizBlock } from "@/types/quizBlock";
import styles from "./QuizSection.module.scss";

type Props = {
  lang: string;
  title?: string;
  quizBlock: QuizBlock;
  countryOptions?: string[];
  sidebar: QuizSidebarType;
};

// Квиз на новых страницах: анкета на половину ширины и панель рядом
const QuizSection: FC<Props> = ({
  lang,
  title,
  quizBlock,
  countryOptions,
  sidebar
}) => (
  <section className={styles.quizSection}>
    {title && <p className={styles.title}>{title}</p>}
    <div className={styles.layout}>
      <div className={styles.quiz}>
        <MultiStepFormBlock
          lang={lang}
          quizBlock={quizBlock}
          countryOptions={countryOptions}
        />
      </div>
      <QuizSidebar sidebar={sidebar} />
    </div>
  </section>
);

export default QuizSection;
