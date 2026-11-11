import React from "react";
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
import { WorkStepsBlock } from "@/types/homepage";
import styles from "./WorkSteps.module.scss";

type Props = {
  lang: string;
  block?: WorkStepsBlock | null;
};

// Запасной адрес кнопки, пока в админке не задан свой
const DEFAULT_TELEGRAM = "https://t.me/infoacademgo";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  chat: FaRegComments,
  document: FaRegFileLines,
  diploma: FaGraduationCap,
  passport: FaPassport,
  check: FaRegCircleCheck,
  plane: FaPaperPlane,
  home: FaHouse
};

/**
 * Компактные «Этапы работы». Бегущая строка-разделитель осталась от прежнего
 * блока: она задаёт ритм и отделяет шаги друг от друга. Вместо слотов под
 * видео — иконка, поэтому шаг занимает одну плотную строку, а не экран.
 */
const WorkSteps = ({ lang, block }: Props) => {
  const steps = block?.steps || [];

  if (!steps.length) return null;

  return (
    <section className={styles.workSteps} id="admission">
      <div className="container">
        {block?.heading && <h2 className={styles.heading}>{block.heading}</h2>}
      </div>

      <div className={styles.list}>
        {steps.map((step, index) => {
          const Icon = ICONS[step.icon || "document"] || FaRegFileLines;
          const href = step.buttonLink || DEFAULT_TELEGRAM;

          return (
            <div className={styles.item} key={step._key ?? index}>
              <StepCarousel number={step.number || ""} title={step.title || ""}>
                <div className={styles.ticker}>
                  <span className={styles.tickerNumber}>{step.number}</span>
                  <span className={styles.tickerDot} aria-hidden="true" />
                  <span className={styles.tickerTitle}>{step.title}</span>
                </div>
              </StepCarousel>

              <div className="container">
                <div className={styles.row}>
                  <div className={styles.iconWrap} aria-hidden="true">
                    <Icon className={styles.icon} />
                  </div>

                  <div className={styles.body}>
                    <h3 className={styles.title}>
                      <span className={styles.number}>{step.number}</span>
                      {step.title}
                    </h3>

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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WorkSteps;
