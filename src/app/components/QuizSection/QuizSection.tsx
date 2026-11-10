import React from "react";
import MultiStepFormBlock from "../MultiStepFormBlock/MultiStepFormBlock";
import QuizSidebar, { QuizSidebarType } from "../QuizSidebar/QuizSidebar";
import { QuizBlock } from "@/types/quizBlock";
import QuizLayout from "./QuizLayout";
import QuizSocials, { getQuizMessengers } from "../QuizSocials/QuizSocials";
import styles from "./QuizSection.module.scss";

type Props = {
  lang: string;
  title?: string;
  quizBlock: QuizBlock;
  countryOptions?: string[];
  sidebar: QuizSidebarType;
};

// Квиз на новых страницах: анкета на 65% ширины и панель рядом
const QuizSection = async ({
  lang,
  title,
  quizBlock,
  countryOptions,
  sidebar
}: Props) => {
  // Ссылки мессенджеров для финального экрана квиза берём из контактов футера
  const messengers = await getQuizMessengers(lang);

  return (
    <section className={styles.quizSection}>
      {title && <p className={styles.title}>{title}</p>}
      <QuizLayout
        quiz={
          <MultiStepFormBlock
            lang={lang}
            quizBlock={quizBlock}
            countryOptions={countryOptions}
            messengers={messengers}
            socials={<QuizSocials lang={lang} />}
          />
        }
        panel={
          <QuizSidebar
            sidebar={sidebar}
            lang={lang}
            questionsCount={quizBlock?.questions?.length}
          />
        }
      />
    </section>
  );
};

export default QuizSection;
