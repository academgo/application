"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FaRegComments,
  FaRegFileLines,
  FaGraduationCap,
  FaPassport,
  FaRegCircleCheck,
  FaPaperPlane,
  FaHouse
} from "react-icons/fa6";
import { WorkStep, WorkStepsBlock } from "@/types/homepage";
import styles from "./WorkSteps.module.scss";

type Props = {
  lang: string;
  block?: WorkStepsBlock | null;
};

// Запасной адрес кнопки, пока в админке не задан свой
const DEFAULT_TELEGRAM = "https://t.me/infoacademgo";

// Закреплённая раскладка включается только на широком экране и только если
// человек не просил систему убрать анимации
const PIN_MIN_WIDTH = "(min-width: 1024px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Во сколько раз блок проходится быстрее базовой скорости «один экран
// прокрутки на шаг». Делится не вся высота обёртки, а только её
// прокручиваемая часть: первый экран блок просто стоит закреплённым и пути
// анимации не добавляет, двигают её только оставшиеся (N-1) экранов. Если
// поделить всю высоту, ускорение выйдет больше заявленного.
const SCROLL_SPEED = 1.2;

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  chat: FaRegComments,
  document: FaRegFileLines,
  diploma: FaGraduationCap,
  passport: FaPassport,
  check: FaRegCircleCheck,
  plane: FaPaperPlane,
  home: FaHouse
};

// Какую долю своего шага карточка тратит на выезд снизу. Остаток шага она
// стоит на месте, пока кнопка слева дозаполняется: иначе карточка ползёт
// весь шаг и наезд соседних карточек не читается
const ARRIVAL_SHARE = 0.4;

const stepDigit = (step: WorkStep, index: number) =>
  step.number?.match(/\d+/)?.[0] || String(index + 1);

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * Как показывать действие шага:
 * - foot — старая полоса под карточкой со строкой-вопросом и кнопкой;
 *   осталась только в запасном дереве (телефон, выключенные анимации);
 * - inline — кнопка внутри тела карточки, само действие шага;
 * - plain — ни полосы, ни кнопки.
 */
type CardAction = "foot" | "inline" | "plain";

/** Содержимое карточки — одно на оба дерева, закреплённое и запасное */
const Card = ({
  step,
  index,
  total,
  action = "foot"
}: {
  step: WorkStep;
  index: number;
  total: number;
  action?: CardAction;
}) => {
  const Icon = ICONS[step.icon || "document"] || FaRegFileLines;
  const href = step.buttonLink || DEFAULT_TELEGRAM;
  const hasFoot =
    action === "foot" && Boolean(step.footnote || step.buttonText);
  const hasInline = action === "inline" && Boolean(step.buttonText);

  return (
    <>
      <div className={styles.cardMain}>
        <div className={styles.plate} aria-hidden="true">
          <span className={styles.plateNumber}>{stepDigit(step, index)}</span>
          <span className={styles.plateIcon}>
            <Icon />
          </span>
          <span className={styles.plateCaption}>из {total}</span>
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{step.title}</h3>

          {step.text && <p className={styles.text}>{step.text}</p>}

          {step.bullets && step.bullets.length > 0 && (
            <ul className={styles.bullets}>
              {step.bullets.map(bullet => (
                <li key={bullet}>
                  <span className={styles.check} aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {hasInline && (
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.button} ${styles.action}`}
            >
              {step.buttonText}
            </Link>
          )}
        </div>
      </div>

      {hasFoot && (
        <div className={styles.foot}>
          {step.footnote && (
            <span className={styles.footnote}>{step.footnote}</span>
          )}
          {step.buttonText && (
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.button}
            >
              {step.buttonText}
            </Link>
          )}
        </div>
      )}
    </>
  );
};

/**
 * «Этапы работы». На широком экране — закреплённая сцена в две колонки:
 * слева заголовок и кнопки шагов, справа карточка активного шага. Кнопка
 * активного шага заливается слева направо по мере прохождения этого шага,
 * клик по любой кнопке проматывает к её шагу. Ниже 1024 и при отключённых
 * анимациях показывается обычный список: оба дерева в разметке всегда,
 * переключает их CSS — так сцена не зависит от замеров на сервере.
 */
const WorkSteps = ({ block }: Props) => {
  const steps = block?.steps || [];
  const total = steps.length;

  const wrapRef = useRef<HTMLDivElement>(null);
  // Непрерывное положение по шагам: 0 — начало первого шага, total — конец
  // последнего. Каждому шагу достаётся ровно одна единица, поэтому у
  // последнего остаётся свой кусок прокрутки и он успевает побыть на экране
  // до того, как закрепление отпустит
  const [flow, setFlow] = useState(0);

  useEffect(() => {
    if (!total) return;

    const wide = window.matchMedia(PIN_MIN_WIDTH);
    const calm = window.matchMedia(REDUCED_MOTION);
    let frame = 0;

    const tick = () => {
      const node = wrapRef.current;

      if (node && wide.matches && !calm.matches) {
        const rect = node.getBoundingClientRect();
        // Сколько контейнер уже прокручен мимо закреплённой сцены
        const travel = node.offsetHeight - window.innerHeight;
        const passed = travel > 0 ? clamp01(-rect.top / travel) : 0;
        setFlow(passed * total);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [total]);

  if (!total) return null;

  const current = Math.min(Math.floor(flow), total - 1);

  // Обратный ход того же пересчёта, что ведёт сцену: шаг index начинается на
  // доле index/total пройденного пути. Поэтому клик приводит ровно в начало
  // шага — с пустой заливкой кнопки, а не в середину.
  // Лишний пиксель сверху — не запас «на глазок»: начало шага это и есть
  // граница, на которой Math.floor переключает активный шаг, а браузер
  // прокручивает только на целые пиксели и округляет цель вниз. Без сдвига
  // клик садится на полпикселя раньше границы и активным остаётся предыдущий
  // шаг с полной заливкой — проверено, так вели себя шаги 3 и 4
  const jumpTo = (index: number) => {
    const node = wrapRef.current;
    if (!node) return;

    const top = node.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(node.offsetHeight - window.innerHeight, 0);

    window.scrollTo({ top: Math.ceil(top + (index / total) * travel) + 1 });
  };

  return (
    <section className={styles.workSteps} id="admission">
      {/* Запасное дерево: телефон и выключенные анимации */}
      <div className={styles.fallback}>
        {block?.heading && (
          <div className="container">
            <h2 className={styles.heading}>{block.heading}</h2>
          </div>
        )}

        {steps.map((step, index) => (
          <div className={styles.fallbackItem} key={step._key ?? index}>
            <div className="container">
              <div className={styles.card}>
                <Card step={step} index={index} total={total} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Заголовок стоит над закреплённой сценой и уезжает вместе с
          прокруткой. Вторая копия заголовка: в разметке всегда обе, видна
          ровно одна — какая, решает CSS по ширине экрана */}
      {block?.heading && (
        <div className={styles.pinHeading}>
          <div className="container">
            <h2 className={styles.heading}>{block.heading}</h2>
          </div>
        </div>
      )}

      {/* Закреплённая сцена */}
      <div
        ref={wrapRef}
        className={styles.pinWrap}
        style={{ height: `${100 + ((total - 1) * 100) / SCROLL_SPEED}vh` }}
      >
        <div className={styles.pinSticky}>
          <div className="container">
            <div className={styles.split}>
              <div className={styles.rail}>
                <ol className={styles.railList}>
                  {steps.map((step, index) => {
                    // Заливка — доля пройденного внутри самого шага, та же
                    // величина, что решает, какая карточка показана. У
                    // пройденных шагов она остаётся полной: кнопки читаются
                    // как накопленный маршрут, а не как бегущий огонёк
                    const fill = clamp01(flow - index);
                    const state =
                      index === current
                        ? "active"
                        : index < current
                          ? "past"
                          : "next";

                    return (
                      <li key={step._key ?? index}>
                        <button
                          type="button"
                          className={styles.railButton}
                          data-state={state}
                          aria-current={index === current ? "step" : undefined}
                          onClick={() => jumpTo(index)}
                        >
                          <span
                            className={styles.railFill}
                            style={{
                              width: `${fill * 100}%`,
                              opacity: fill > 0 ? 1 : 0
                            }}
                            aria-hidden="true"
                          />
                          <span className={styles.railNum}>
                            {stepDigit(step, index)}
                          </span>
                          <span className={styles.railName}>{step.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Колода: карточки выезжают снизу и ложатся одна на другую,
                  из-под верхней видны кромки предыдущих */}
              <div className={styles.stage}>
                {steps.map((step, index) => {
                  // Первая карточка лежит на месте с самого начала: ехать ей
                  // неоткуда, до неё шагов нет
                  const arrival =
                    index === 0 ? 1 : clamp01((flow - index) / ARRIVAL_SHARE);
                  const rest = index * 18;
                  const y = (1 - arrival) * 560 + arrival * rest;

                  return (
                    <div
                      key={step._key ?? index}
                      className={`${styles.card} ${styles.deckCard}`}
                      style={{
                        // Карточка не только выезжает, но и раскрывается:
                        // приходит уже, чем сцена, и расширяется к месту
                        transform: `translateY(${y}px) scale(${0.88 + 0.12 * arrival})`,
                        zIndex: index + 1,
                        opacity: arrival > 0 ? 1 : 0
                      }}
                    >
                      <Card
                        step={step}
                        index={index}
                        total={total}
                        // Кнопка — только у первого шага (начать) и у
                        // последнего (финальное действие). У остальных поля в
                        // админке остаются, просто не выводятся
                        action={
                          index === 0 || index === total - 1
                            ? "inline"
                            : "plain"
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSteps;
