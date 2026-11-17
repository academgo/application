import { SurveyBlock } from "@/types/blog";
import { QuizBlock } from "@/types/quizBlock";
import { QuizSidebarType } from "../QuizSidebar/QuizSidebar";
import React, { FC } from "react";
import Survey from "../Survey/Survey";
// import SurveyBlog from "../SurveyBlog/SurveyBlog";
// Прежний квиз страниц с отдельной панелью «Персональная подборка вузов».
// Оставлен на случай возврата, см. комментарий ниже
// import QuizSection from "../QuizSection/QuizSection";
import { getCountryNamesByLang } from "@/sanity/sanity.utils";

type Props = {
  lang: string;
  block: SurveyBlock & { quiz?: QuizBlock; sidebar?: QuizSidebarType | null };
};

const SurveyBlockComponent: FC<Props> = async ({ block, lang }) => {
  // Общий квиз из раздела Quiz важнее собственных вопросов страницы
  const quizBlock = block.quiz || block.survey?.quizBlock;

  if (!quizBlock) return null;

  const needsCountries = quizBlock.questions?.some(
    question => question.optionsSource === "countries"
  );

  const countryOptions = needsCountries
    ? await getCountryNamesByLang(lang)
    : [];

  // Квиз на страницах — ровно тот же, что на главной: анкета и панель
  // справа из самого документа квиза. Раньше здесь стоял отдельный
  // QuizSection со своей панелью из документа «Боковая панель квиза», и
  // на сайте жили два разных квиза. Чтобы вернуть прежний вид, снимите
  // комментарий с импорта QuizSection выше и с блока ниже:
  //
  // if (block.sidebar) {
  //   return (
  //     <QuizSection
  //       lang={lang}
  //       title={block.survey?.title}
  //       quizBlock={quizBlock}
  //       countryOptions={countryOptions}
  //       sidebar={block.sidebar}
  //     />
  //   );
  // }
  return (
    <Survey
      lang={lang}
      survey={{ title: block.survey?.title || "" }}
      quizBlock={quizBlock}
      countryOptions={countryOptions}
      nested
    />
  );

  // Прежний вариант без панели — тоже оставлен на случай возврата:
  //
  // return (
  //   <div className="survey-width">
  //     <SurveyBlog
  //       lang={lang}
  //       survey={block.survey}
  //       quizBlock={quizBlock}
  //       countryOptions={countryOptions}
  //     />
  //   </div>
  // );
};

export default SurveyBlockComponent;
