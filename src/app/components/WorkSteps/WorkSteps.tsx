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

// Колода включается только на широком экране и только если человек не
// просил систему убрать анимации
const PIN_MIN_WIDTH = "(min-width: 1024px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Последняя карточка должна успеть побыть на экране: без этого она приезжает
// ровно в тот момент, когда закрепление отпускает, и прочитать её не успеваешь.
// Доля прокрутки, отданная под это ожидание, — один шаг из общего числа
const DWELL_SHARE = 1;

// Во сколько раз колода складывается быстрее базовой скорости «один экран
// прокрутки на карточку». Делится не вся высота обёртки, а только её
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

const stepDigit = (step: WorkStep, index: number) =>
  step.number?.match(/\d+/)?.[0] || String(index + 1);

/** Содержимое карточки — одно на оба дерева, колоду и запасной список */
const Card = ({
  step,
  index,
  total
}: {
  step: WorkStep;
  index: number;
  total: number;
}) => {
  const Icon = ICONS[step.icon || "document"] || FaRegFileLines;
  const href = step.buttonLink || DEFAULT_TELEGRAM;
  const hasFoot = Boolean(step.footnote || step.buttonText);

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
 * «Этапы работы». На широком экране — закреплённая колода: сцена прилипает к
 * экрану, карточки по очереди выезжают снизу и ложатся одна на другую, из-под
 * верхней видны кромки предыдущих. Ниже 1024 и при отключённых анимациях
 * показывается обычный список: оба дерева в разметке всегда, переключает их
 * CSS — так колода не зависит от замеров на сервере.
 */
const WorkSteps = ({ block }: Props) => {
  const steps = block?.steps || [];
  const total = steps.length;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!total) return;

    const wide = window.matchMedia(PIN_MIN_WIDTH);
    const calm = window.matchMedia(REDUCED_MOTION);
    let frame = 0;

    const tick = () => {
      const node = wrapRef.current;

      if (node && wide.matches && !calm.matches) {
        const rect = node.getBoundingClientRect();
        // Сколько контейнер уже прокручен мимо липкой сцены
        const travel = node.offsetHeight - window.innerHeight;
        const passed = travel > 0 ? -rect.top / travel : 0;
        // Карточки разбирают не весь путь, а всё кроме последней доли
        const usable = Math.max(1 - DWELL_SHARE / total, 0.01);
        const clamped = Math.min(Math.max(passed / usable, 0), 1);
        setProgress(clamped * Math.max(total - 1, 1));
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [total]);

  if (!total) return null;

  const current = Math.min(Math.round(progress), total - 1);

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

      {/* Колода */}
      <div
        ref={wrapRef}
        className={styles.pinWrap}
        style={{ height: `${100 + ((total - 1) * 100) / SCROLL_SPEED}vh` }}
      >
        <div className={styles.pinSticky}>
          {block?.heading && (
            <div className="container">
              {/* Вторая копия заголовка: в разметке всегда обе, видна ровно
                  одна — какая, решает CSS по ширине экрана */}
              <h2 className={styles.heading}>{block.heading}</h2>
            </div>
          )}

          <div className="container">
            <ol
              className={styles.progress}
              // Делений ровно столько, сколько шагов завели в админке
              style={{ "--steps": total } as React.CSSProperties}
            >
              {steps.map((step, index) => {
                // Деление заполняется ровно тем же ходом, что приезжает
                // карточка — шкала и колода идут в такт
                const fill = Math.min(Math.max(progress - (index - 1), 0), 1);

                return (
                  <li
                    key={step._key ?? index}
                    className={`${styles.progStep} ${fill > 0 ? styles.progOn : ""}`}
                    aria-current={index === current ? "step" : undefined}
                  >
                    <span className={styles.progNum}>
                      {stepDigit(step, index)}
                    </span>
                    <span className={styles.progName}>{step.title}</span>
                    <span className={styles.progBar}>
                      <span
                        className={styles.progFill}
                        style={{ width: `${fill * 100}%` }}
                      />
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="container">
            <div className={styles.stage}>
              {steps.map((step, index) => {
                // Карточка приезжает снизу ровно тогда, когда предыдущая встала
                const arrival = Math.min(
                  Math.max(progress - (index - 1), 0),
                  1
                );
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
                    <Card step={step} index={index} total={total} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSteps;
