import { SurveyBlock } from "@/types/blog";
import React, { FC } from "react";
import SurveyBlog from "../SurveyBlog/SurveyBlog";

type Props = {
  lang: string;
  block: SurveyBlock;
};

const SurveyBlockComponent: FC<Props> = ({ block, lang }) => {
  return (
    <div>
      <SurveyBlog
        lang={lang}
        survey={block.survey}
        quizBlock={block.survey.quizBlock}
      />
    </div>
  );
};

export default SurveyBlockComponent;
