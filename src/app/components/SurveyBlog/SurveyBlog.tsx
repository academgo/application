import React, { FC } from "react";
import styles from "./SurveyBlog.module.scss";
import { Survey as SurveyType } from "@/types/homepage";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import MultiStepForm from "../MultiStepForm/MultiStepForm";
import MultiStepFormBlock from "../MultiStepFormBlock/MultiStepFormBlock";
import { QuizBlock } from "@/types/quizBlock";

type Props = {
  lang: string;
  survey: SurveyType;
  quizBlock?: QuizBlock;
};

const SurveyBlog: FC<Props> = ({ lang, survey, quizBlock }) => {
  // console.log("survey", survey);
  return (
    <section className={styles.survey}>
      <p className={styles.title}>{survey.title}</p>
      <div className={styles.surveyWrapper}>
        <div className={styles.multiStepForm}>
          {quizBlock && (
            <MultiStepFormBlock lang={lang} quizBlock={quizBlock} />
          )}
        </div>
      </div>
    </section>
  );
};

export default SurveyBlog;
