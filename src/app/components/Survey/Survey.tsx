import React, { FC } from "react";
import styles from "./Survey.module.scss";
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

const Survey: FC<Props> = ({ lang, survey, quizBlock }) => {
  // console.log("survey", survey);
  return (
    <section className={styles.survey}>
      <div className="container">
        <p className={styles.title}>{survey.title}</p>
        <div className={styles.surveyWrapper}>
          <div className={styles.multiStepForm}>
            {/* <MultiStepForm
              lang={lang}
              finalTitle={survey.finalTitle}
              formTitle={survey.formTitle}
              inputLabel={survey.inputLabel}
              buttonText={survey.buttonText}
            /> */}
            {quizBlock && (
              <MultiStepFormBlock lang={lang} quizBlock={quizBlock} />
            )}
          </div>
          <div className={styles.sidebar}>
            {/* <div className={styles.sidebarWrapper}>
              <div className={styles.imageBlock}>
                <Image
                  alt={survey.title}
                  src={urlFor(survey.image).url()}
                  width={500}
                  height={500}
                  className={styles.contactIcon}
                />
              </div>
              <p className={styles.quote}>{survey.quote}</p>
              <p className={styles.description}>{survey.description}</p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Survey;
