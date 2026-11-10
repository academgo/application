import React from "react";
import styles from "./SurveyBlog.module.scss";
import { Survey as SurveyType } from "@/types/homepage";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import MultiStepForm from "../MultiStepForm/MultiStepForm";
import MultiStepFormBlock from "../MultiStepFormBlock/MultiStepFormBlock";
import { QuizBlock } from "@/types/quizBlock";
import QuizSocials, { getQuizMessengers } from "../QuizSocials/QuizSocials";

type Props = {
  lang: string;
  survey?: SurveyType;
  quizBlock?: QuizBlock;
  countryOptions?: string[];
};

const SurveyBlog = async ({
  lang,
  survey,
  quizBlock,
  countryOptions
}: Props) => {
  // Ссылки мессенджеров для финального экрана квиза берём из контактов футера
  const messengers = quizBlock ? await getQuizMessengers(lang) : undefined;

  return (
    <section className={styles.survey}>
      {survey?.title && <p className={styles.title}>{survey.title}</p>}
      <div className={styles.surveyWrapper}>
        <div className={styles.multiStepForm}>
          {quizBlock && (
            <MultiStepFormBlock
              lang={lang}
              quizBlock={quizBlock}
              countryOptions={countryOptions}
              messengers={messengers}
              socials={<QuizSocials lang={lang} />}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default SurveyBlog;
