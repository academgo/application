import React, { FC } from "react";
import styles from "./Survey.module.scss";
import { Survey as SurveyType } from "@/types/homepage";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import MultiStepForm from "../MultiStepForm/MultiStepForm";
import MultiStepFormBlock from "../MultiStepFormBlock/MultiStepFormBlock";
import { QuizBlock } from "@/types/quizBlock";
import QuizSidebar, { QuizSidebarType } from "../QuizSidebar/QuizSidebar";

type Props = {
  lang: string;
  survey: SurveyType;
  quizBlock?: QuizBlock;
  countryOptions?: string[];
  sidebar?: QuizSidebarType;
};

const Survey: FC<Props> = ({
  lang,
  survey,
  quizBlock,
  countryOptions,
  sidebar
}) => {
  // console.log("survey", survey);
  return (
    <section className={styles.survey}>
      <div className="container">
        <p className={styles.title}>{survey.title}</p>
        <div
          className={`${styles.surveyWrapper} ${sidebar ? styles.withSidebar : ""}`}
        >
          <div className={styles.multiStepForm}>
            {/* <MultiStepForm
              lang={lang}
              finalTitle={survey.finalTitle}
              formTitle={survey.formTitle}
              inputLabel={survey.inputLabel}
              buttonText={survey.buttonText}
            /> */}
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
      </div>
    </section>
  );
};

export default Survey;
