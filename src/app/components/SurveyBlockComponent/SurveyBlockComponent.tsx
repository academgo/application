import { SurveyBlock } from "@/types/blog";
import React, { FC } from "react";
import Survey from "../Survey/Survey";

type Props = {
  lang: string;
  block: SurveyBlock;
};

const SurveyBlockComponent: FC<Props> = ({ block, lang }) => {
  return (
    <div>
      <Survey
        lang={lang}
        survey={block.survey}
        quizBlock={block.survey.quizBlock}
      />
    </div>
  );
};

export default SurveyBlockComponent;
