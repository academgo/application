import React, { FC } from "react";
import WorkSteps from "../WorkSteps/WorkSteps";
import { WorkStepsBlock } from "@/types/homepage";
import { getWorkStepsByLang } from "@/sanity/sanity.utils";

export type WorkStepsBlockType = WorkStepsBlock & {
  _key: string;
  _type: "workStepsBlock";
};

type Props = {
  block: WorkStepsBlockType;
  lang: string;
};

/**
 * Блок «Этапы работы» на обычных страницах. Тот же компонент, что на
 * главной, — вид и поведение одинаковые.
 *
 * Шаги можно не заполнять: тогда блок возьмёт их с главной страницы того
 * же языка. Так текст шагов правится в одном месте, а на страницах блок
 * просто добавляется в нужное место. Заголовок при этом свой, если его
 * задали в блоке.
 */
const WorkStepsBlockComponent: FC<Props> = async ({ block, lang }) => {
  const ownSteps = block.steps || [];
  const shared = ownSteps.length > 0 ? null : await getWorkStepsByLang(lang);

  const steps = ownSteps.length > 0 ? ownSteps : shared?.steps || [];
  if (steps.length === 0) return null;

  return (
    <WorkSteps
      lang={lang}
      nested
      block={{ heading: block.heading || shared?.heading, steps }}
    />
  );
};

export default WorkStepsBlockComponent;
