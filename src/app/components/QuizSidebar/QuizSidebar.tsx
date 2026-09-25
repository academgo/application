import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/sanity.client";
import styles from "./QuizSidebar.module.scss";

export type QuizSidebarType = {
  title?: string;
  meta?: string;
  bullets?: string[];
  teamTitle?: string;
  team?: { _key: string; name?: string; position?: string; photo?: any }[];
  contactsText?: string;
  contactLinks?: { _key: string; title?: string; icon?: any; link?: string }[];
};

type Props = {
  sidebar: QuizSidebarType;
};

// Панель справа от квиза: зачем проходить, кто ответит, мессенджеры
const QuizSidebar: FC<Props> = ({ sidebar }) => (
  <aside className={styles.sidebar}>
    <div className={styles.card}>
      {sidebar.title && <p className={styles.title}>{sidebar.title}</p>}
      {sidebar.meta && <p className={styles.meta}>{sidebar.meta}</p>}

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

      {sidebar.team && sidebar.team.length > 0 && (
        <div className={styles.team}>
          {sidebar.teamTitle && (
            <p className={styles.teamTitle}>{sidebar.teamTitle}</p>
          )}
          <div className={styles.people}>
            {sidebar.team.map(person => (
              <div key={person._key} className={styles.person}>
                {person.photo && (
                  <div className={styles.photo}>
                    <Image
                      src={urlFor(person.photo)
                        .width(160)
                        .height(160)
                        .fit("crop")
                        .crop("top")
                        .url()}
                      alt={person.name || ""}
                      width={64}
                      height={64}
                    />
                  </div>
                )}
                <div>
                  <p className={styles.name}>{person.name}</p>
                  {person.position && (
                    <p className={styles.position}>{person.position}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                    width={48}
                    height={48}
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
