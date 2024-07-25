import React, { FC } from "react";
import styles from "./Survey.module.scss";
import { Survey as SurveyType } from "@/types/homepage";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import MultiStepForm from "../MultiStepForm/MultiStepForm";

type Props = {
  lang: string;
  survey: SurveyType;
};

const Survey: FC<Props> = ({ lang, survey }) => {
  // console.log("survey", survey);
  return (
    <section className={styles.survey}>
      <div className="container">
        <h2 className={styles.title}>{survey.title}</h2>
        <div className={styles.surveyWrapper}>
          <div className={styles.multiStepForm}>
            <MultiStepForm
              lang={lang}
              finalTitle={survey.finalTitle}
              formTitle={survey.formTitle}
              inputLabel={survey.inputLabel}
              buttonText={survey.buttonText}
            />
          </div>
          <div className={styles.sidebar}>
            <div className={styles.sidebarWrapper}>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Survey;
