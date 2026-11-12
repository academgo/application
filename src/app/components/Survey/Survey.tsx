import React from "react";
import styles from "./Survey.module.scss";
import { Survey as SurveyType } from "@/types/homepage";
import MultiStepForm from "../MultiStepForm/MultiStepForm";
import MultiStepFormBlock from "../MultiStepFormBlock/MultiStepFormBlock";
import { QuizBlock } from "@/types/quizBlock";
import QuizSocials, { getQuizMessengers } from "../QuizSocials/QuizSocials";
import { FaTelegram } from "react-icons/fa6";

type Props = {
  lang: string;
  survey: SurveyType;
  quizBlock?: QuizBlock;
  countryOptions?: string[];
};

const Survey = async ({ lang, survey, quizBlock, countryOptions }: Props) => {
  // Ссылки мессенджеров для финального экрана квиза берём из контактов футера
  const messengers = quizBlock ? await getQuizMessengers(lang) : undefined;

  // Панель справа показываем, только если её заполнили в админке: без
  // заголовка и пунктов квиз остаётся по центру, как было раньше
  const sidePanelItems = quizBlock?.sidePanelItems ?? [];
  const hasSidePanel = Boolean(
    quizBlock?.sidePanelTitle && sidePanelItems.length
  );

  return (
    <section className={styles.survey}>
      <div className="container">
        <p className={styles.title}>{survey.title}</p>
        <div
          className={`${styles.surveyWrapper} ${
            hasSidePanel ? styles.withSidePanel : ""
          }`}
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
                messengers={messengers}
                socials={<QuizSocials lang={lang} />}
              />
            )}
          </div>
          {hasSidePanel && (
            <aside className={styles.sidebar}>
              <div className={styles.sideCard}>
                <p className={styles.sideTitle}>
                  <span className={styles.sideIcon} aria-hidden="true">
                    <FaTelegram />
                  </span>
                  {quizBlock!.sidePanelTitle}
                </p>

                <ol className={styles.sideList}>
                  {sidePanelItems.map((item, index) => (
                    <li key={item._key} className={styles.sideItem}>
                      <span className={styles.sideNum} aria-hidden="true">
                        {index + 1}
                      </span>
                      <span className={styles.sideItemBody}>
                        <span className={styles.sideItemTitle}>
                          {item.title}
                        </span>
                        {item.text && (
                          <span className={styles.sideItemText}>
                            {item.text}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>

                {quizBlock!.sidePanelNote && (
                  <p className={styles.sideNote}>{quizBlock!.sidePanelNote}</p>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
};

export default Survey;
