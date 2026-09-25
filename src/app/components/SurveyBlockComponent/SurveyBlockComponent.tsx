import { SurveyBlock } from "@/types/blog";
import { QuizBlock } from "@/types/quizBlock";
import { QuizSidebarType } from "../QuizSidebar/QuizSidebar";
import React, { FC } from "react";
import SurveyBlog from "../SurveyBlog/SurveyBlog";
import QuizSection from "../QuizSection/QuizSection";
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

  // Общий квиз с панелью (новые страницы) — новый блок в две колонки;
  // квиз со своими вопросами (старые страницы, блог) — как раньше
  if (block.sidebar) {
    return (
      <QuizSection
        lang={lang}
        title={block.survey?.title}
        quizBlock={quizBlock}
        countryOptions={countryOptions}
        sidebar={block.sidebar}
      />
    );
  }

  return (
    <div className="survey-width">
      <SurveyBlog
        lang={lang}
        survey={block.survey}
        quizBlock={quizBlock}
        countryOptions={countryOptions}
      />
    </div>
  );
};

export default SurveyBlockComponent;
