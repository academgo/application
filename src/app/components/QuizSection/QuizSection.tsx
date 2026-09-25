import React, { FC } from "react";
import MultiStepFormBlock from "../MultiStepFormBlock/MultiStepFormBlock";
import QuizSidebar, { QuizSidebarType } from "../QuizSidebar/QuizSidebar";
import { QuizBlock } from "@/types/quizBlock";
import QuizLayout from "./QuizLayout";
import styles from "./QuizSection.module.scss";

type Props = {
  lang: string;
  title?: string;
  quizBlock: QuizBlock;
  countryOptions?: string[];
  sidebar: QuizSidebarType;
};

// Квиз на новых страницах: анкета на 65% ширины и панель рядом
const QuizSection: FC<Props> = ({
  lang,
  title,
  quizBlock,
  countryOptions,
  sidebar
}) => (
  <section className={styles.quizSection}>
    {title && <p className={styles.title}>{title}</p>}
    <QuizLayout
      quiz={
        <MultiStepFormBlock
          lang={lang}
          quizBlock={quizBlock}
          countryOptions={countryOptions}
        />
      }
      panel={<QuizSidebar sidebar={sidebar} />}
    />
  </section>
);

export default QuizSection;
