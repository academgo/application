import { SurveyBlock } from "@/types/blog";
import { QuizBlock } from "@/types/quizBlock";
import { QuizSidebarType } from "../QuizSidebar/QuizSidebar";
import React, { FC } from "react";
import SurveyBlog from "../SurveyBlog/SurveyBlog";
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

  // С панелью квиз занимает всю ширину, без неё — не шире 950px, как раньше
  return (
    <div className={block.sidebar ? undefined : "survey-width"}>
      <SurveyBlog
        lang={lang}
        survey={block.survey}
        quizBlock={quizBlock}
        countryOptions={countryOptions}
        sidebar={block.sidebar || undefined}
      />
    </div>
  );
};

export default SurveyBlockComponent;
