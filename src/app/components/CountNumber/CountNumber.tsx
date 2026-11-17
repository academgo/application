"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

type Props = {
  children: string | number;
};

const CountNumber: FC<Props> = ({ children }) => {
  const [count, setCount] = useState(0);
  const [hasCounted, setHasCounted] = useState(false);

  // Значение из админки может быть не только числом: «200+», «до 10».
  // Раньше тут стоял parseInt, и всё, кроме самих цифр, пропадало —
  // плюс, который редактор дописал в студии, на сайт не попадал.
  // Разбираем строку на три части и крутим счётчик только в средней.
  // Если цифры идут не одной группой («1 500»), счётчик не трогаем:
  // анимировать там нечего, а текст лучше показать как есть
  const raw = String(children ?? "");
  const parts = raw.match(/^(\D*)(\d+)(\D*)$/);
  const prefix = parts?.[1] ?? "";
  const suffix = parts?.[3] ?? "";
  const targetNumber = parts ? parseInt(parts[2], 10) : NaN;

  const ref = useRef<HTMLParagraphElement>(null);
  const isVisible = useIntersectionObserver(ref);

  useEffect(() => {
    if (!isVisible || hasCounted) return;

    let start = 0;
    const end = targetNumber;
    // Без числа (или с нечисловым значением) счётчик крутился бы бесконечно
    if (!Number.isFinite(end) || start === end) return;

    const incrementTime = Math.abs(Math.floor(1500 / (end as number))); // duration of animation (1.5 seconds)

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
        setHasCounted(true); // Устанавливаем флаг, что счет уже произошел
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetNumber, isVisible, hasCounted]);

  if (!Number.isFinite(targetNumber)) {
    return <p ref={ref}>{children}</p>;
  }

  return (
    <p ref={ref}>
      {prefix}
      {count}
      {suffix}
    </p>
  );
};

export default CountNumber;
