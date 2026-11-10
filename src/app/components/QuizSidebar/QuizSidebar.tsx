import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import { pluralRu } from "@/lib/plural";
import styles from "./QuizSidebar.module.scss";

export type QuizSidebarType = {
  title?: string;
  meta?: string;
  bullets?: string[];
  contactsText?: string;
  contactLinks?: { _key: string; title?: string; icon?: any; link?: string }[];
};

type Props = {
  sidebar: QuizSidebarType;
  lang: string;
  /** Сколько вопросов в квизе — для подстановки в строку под заголовком */
  questionsCount?: number;
};

// Примерно столько уходит на один вопрос
const MINUTES_PER_QUESTION = 0.4;

/**
 * Подстановка в строку под заголовком, чтобы обещание не расходилось с квизом:
 * добавили или убрали вопрос — строка пересчиталась сама.
 * {count} — число, {questions} — «5 вопросов», {minutes} — для оборота «около …»
 */
const fillMeta = (meta: string, count: number, lang: string): string => {
  if (!count) return meta;

  const minutes = Math.max(1, Math.round(count * MINUTES_PER_QUESTION));

  const questions =
    lang === "en"
      ? `${count} question${count === 1 ? "" : "s"}`
      : `${count} ${pluralRu(count, ["вопрос", "вопроса", "вопросов"])}`;

  const minutesText =
    lang === "en"
      ? `${minutes} minute${minutes === 1 ? "" : "s"}`
      : `${minutes} ${pluralRu(minutes, ["минуты", "минут", "минут"])}`;

  return meta
    .replace(/\{questions\}/g, questions)
    .replace(/\{minutes\}/g, minutesText)
    .replace(/\{count\}/g, String(count));
};

// Панель рядом с квизом: что даст анкета и мессенджеры для тех, кто хочет сразу
const QuizSidebar: FC<Props> = ({ sidebar, lang, questionsCount }) => (
  <aside className={styles.sidebar}>
    <div className={styles.card}>
      <div>
        {sidebar.title && <p className={styles.title}>{sidebar.title}</p>}
        {sidebar.meta && (
          <p className={styles.meta}>
            {fillMeta(sidebar.meta, questionsCount || 0, lang)}
          </p>
        )}

        {sidebar.bullets && sidebar.bullets.length > 0 && (
          <ul className={styles.bullets}>
            {sidebar.bullets.map(bullet => (
              <li key={bullet}>
                <span className={styles.check} aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {sidebar.contactLinks && sidebar.contactLinks.length > 0 && (
        <div className={styles.contacts}>
          {sidebar.contactsText && (
            <p className={styles.contactsText}>{sidebar.contactsText}</p>
          )}
          <div className={styles.links}>
            {sidebar.contactLinks.map(link =>
              link.link && link.icon ? (
                <Link
                  key={link._key}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.title}
                >
                  <Image
                    src={urlFor(link.icon).url()}
                    alt={link.title || ""}
                    width={52}
                    height={52}
                    className={styles.icon}
                  />
                </Link>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  </aside>
);

export default QuizSidebar;
