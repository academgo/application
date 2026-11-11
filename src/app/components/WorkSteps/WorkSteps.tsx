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
import StepCarousel from "../StepCarousel/StepCarousel";
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

const Ticker = ({ step }: { step: WorkStep }) => (
  <div className={styles.ticker}>
    <span className={styles.tickerNumber}>{step.number}</span>
    <span className={styles.tickerDot} aria-hidden="true" />
    <span className={styles.tickerTitle}>{step.title}</span>
  </div>
);

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
        const clamped = Math.min(Math.max(passed, 0), 1);
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
      <div className="container">
        {block?.heading && <h2 className={styles.heading}>{block.heading}</h2>}
      </div>

      {/* Запасное дерево: телефон и выключенные анимации */}
      <div className={styles.fallback}>
        {steps.map((step, index) => (
          <div className={styles.fallbackItem} key={step._key ?? index}>
            <StepCarousel number={step.number || ""} title={step.title || ""}>
              <Ticker step={step} />
            </StepCarousel>

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
        style={{ height: `${total * 100}vh` }}
      >
        <div className={styles.pinSticky}>
          <div className={styles.tickerStage}>
            {steps.map((step, index) => (
              <div
                key={step._key ?? index}
                className={`${styles.tickerSlot} ${index === current ? styles.tickerOn : ""}`}
                aria-hidden={index !== current}
              >
                <StepCarousel
                  number={step.number || ""}
                  title={step.title || ""}
                >
                  <Ticker step={step} />
                </StepCarousel>
              </div>
            ))}
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
                      transform: `translateY(${y}px) scale(${0.975 + 0.025 * arrival})`,
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
