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
  /**
   * Блок уже стоит внутри .container — свой не добавляем. На страницах из
   * конструктора все блоки обёрнуты контейнером, и второй давал бы
   * двойной отступ: квиз вставал бы уже соседних блоков
   */
  nested?: boolean;
};

const Survey = async ({
  lang,
  survey,
  quizBlock,
  countryOptions,
  nested
}: Props) => {
  // Ссылки мессенджеров для финального экрана квиза берём из контактов футера
  const messengers = quizBlock ? await getQuizMessengers(lang) : undefined;

  // Панель справа показываем, только если её заполнили в админке: без
  // заголовка и пунктов квиз остаётся по центру, как было раньше
  const sidePanelItems = quizBlock?.sidePanelItems ?? [];
  const sidePanelStats = quizBlock?.sidePanelStats ?? [];
  // Заголовок панели: из админки, иначе по языку страницы. Раньше запасной
  // текст был только русским и на английских страницах выводился как есть
  const sidePanelTitle =
    quizBlock?.sidePanelTitle ||
    (lang === "ru" ? "Что придёт в ответ" : "What you will get");
  const hasSidePanel = sidePanelItems.length > 0;

  const body = (
    <>
      {survey.title && <p className={styles.title}>{survey.title}</p>}
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
                  {sidePanelTitle}
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

                {sidePanelStats.length > 0 ? (
                  <dl className={styles.sideStats}>
                    {sidePanelStats.map(stat => (
                      <div key={stat._key} className={styles.sideStat}>
                        <dt className={styles.sideStatValue}>{stat.value}</dt>
                        <dd className={styles.sideStatLabel}>{stat.label}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  quizBlock!.sidePanelNote && (
                    <p className={styles.sideNote}>
                      {quizBlock!.sidePanelNote}
                    </p>
                  )
                )}
              </div>
            </aside>
          )}
        </div>
    </>
  );

  return (
    <section className={nested ? styles.nestedSection : undefined}>
      {nested ? body : <div className="container">{body}</div>}
    </section>
  );
};

export default Survey;
