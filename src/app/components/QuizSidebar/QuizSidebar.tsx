import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/sanity.client";
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
};

// Панель рядом с квизом: что даст анкета и мессенджеры для тех, кто хочет сразу
const QuizSidebar: FC<Props> = ({ sidebar }) => (
  <aside className={styles.sidebar}>
    <div className={styles.card}>
      <div>
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
