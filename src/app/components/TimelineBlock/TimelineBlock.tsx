import React, { FC } from "react";
import styles from "./TimelineBlock.module.scss";

export type TimelineBlockType = {
  _key: string;
  _type: "timelineBlock";
  title?: string;
  subtitle?: string;
  items?: {
    _key: string;
    period?: string;
    title?: string;
    text?: string;
  }[];
  note?: string;
};

type Props = {
  block: TimelineBlockType;
};

const TimelineBlock: FC<Props> = ({ block }) => {
  const items = (block.items || []).filter(item => item.title);
  if (!items.length) return null;

  return (
    <section className={styles.timeline}>
      {block.title && <h3 className={styles.title}>{block.title}</h3>}
      {block.subtitle && <p className={styles.subtitle}>{block.subtitle}</p>}

      <ol
        className={styles.stages}
        style={{ "--stages": items.length } as React.CSSProperties}
      >
        {items.map(item => (
          <li key={item._key} className={styles.stage}>
            <span className={styles.dot} aria-hidden="true" />
            {item.period && <p className={styles.period}>{item.period}</p>}
            <p className={styles.stageTitle}>{item.title}</p>
            {item.text && <p className={styles.text}>{item.text}</p>}
          </li>
        ))}
      </ol>

      {block.note && <p className={styles.note}>{block.note}</p>}
    </section>
  );
};

export default TimelineBlock;
