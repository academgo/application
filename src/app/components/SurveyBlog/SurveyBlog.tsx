import React, { FC } from "react";
import styles from "./SurveyBlog.module.scss";
import { Survey as SurveyType } from "@/types/homepage";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import MultiStepForm from "../MultiStepForm/MultiStepForm";
import MultiStepFormBlock from "../MultiStepFormBlock/MultiStepFormBlock";
import { QuizBlock } from "@/types/quizBlock";
import QuizSidebar, { QuizSidebarType } from "../QuizSidebar/QuizSidebar";

type Props = {
  lang: string;
  survey?: SurveyType;
  quizBlock?: QuizBlock;
  countryOptions?: string[];
  sidebar?: QuizSidebarType;
};

const SurveyBlog: FC<Props> = ({
  lang,
  survey,
  quizBlock,
  countryOptions,
  sidebar
}) => {
  // console.log("survey", survey);
  return (
    <section className={styles.survey}>
      {survey?.title && <p className={styles.title}>{survey.title}</p>}
      <div
        className={`${styles.surveyWrapper} ${sidebar ? styles.withSidebar : ""}`}
      >
        <div className={styles.multiStepForm}>
          {quizBlock && (
            <MultiStepFormBlock
              lang={lang}
              quizBlock={quizBlock}
              countryOptions={countryOptions}
            />
          )}
        </div>
        {sidebar && <QuizSidebar sidebar={sidebar} />}
      </div>
    </section>
  );
};

export default SurveyBlog;
