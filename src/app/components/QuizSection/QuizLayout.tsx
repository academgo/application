"use client";

import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import styles from "./QuizSection.module.scss";

type Props = {
  quiz: ReactNode;
  panel: ReactNode;
};

/**
 * Панель рядом с квизом держит высоту первого вопроса: шаги квиза разной
 * высоты, и без этого она прыгала бы на каждом «Далее». Высоту пересчитываем
 * только при изменении ширины окна — там меняется и сам первый вопрос.
 */
const QuizLayout: FC<Props> = ({ quiz, panel }) => {
  const quizRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      if (quizRef.current) setPanelHeight(quizRef.current.offsetHeight);
    };

    measure();

    // Пересчёт — только после паузы и если ширина реально изменилась:
    // браузер шлёт и мгновенные resize (1px → 1440px), на них не реагируем
    let width = window.innerWidth;
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (Math.abs(window.innerWidth - width) < 50) return;
        width = window.innerWidth;
        measure();
      }, 250);
    };

    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={styles.layout}>
      <div ref={quizRef} className={styles.quiz}>
        {quiz}
      </div>
      <div
        className={styles.panel}
        style={panelHeight ? { minHeight: panelHeight } : undefined}
      >
        {panel}
      </div>
    </div>
  );
};

export default QuizLayout;
