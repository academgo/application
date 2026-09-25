import React, { FC } from "react";
import styles from "./BarChartBlock.module.scss";

export type BarChartBlockType = {
  _key: string;
  _type: "barChartBlock";
  title?: string;
  subtitle?: string;
  items?: {
    _key: string;
    label?: string;
    value?: number;
    valueMax?: number;
    valueLabel?: string;
    highlight?: boolean;
  }[];
  note?: string;
};

type Props = {
  block: BarChartBlockType;
};

// Самый длинный столбик занимает не всю дорожку: справа остаётся место
// под подпись значения, чтобы она не обрезалась и не налезала на край
const MAX_BAR_SHARE = 72;

const BarChartBlock: FC<Props> = ({ block }) => {
  const items = (block.items || []).filter(
    item => item.label && typeof item.value === "number"
  );
  if (!items.length) return null;

  const max = Math.max(...items.map(item => item.valueMax ?? item.value ?? 0));
  const share = (value: number) =>
    max > 0 ? (value / max) * MAX_BAR_SHARE : 0;

  return (
    <figure className={styles.chart}>
      {block.title && <h3 className={styles.title}>{block.title}</h3>}
      {block.subtitle && <p className={styles.subtitle}>{block.subtitle}</p>}

      <ul className={styles.rows}>
        {items.map(item => {
          const value = item.value as number;
          const rangeWidth =
            item.valueMax && item.valueMax > value
              ? share(item.valueMax) - share(value)
              : 0;

          return (
            <li
              key={item._key}
              className={`${styles.row} ${item.highlight ? styles.highlight : ""}`}
            >
              <span className={styles.label}>{item.label}</span>
              <span className={styles.track} title={item.valueLabel}>
                <span
                  className={styles.bar}
                  style={{ width: `${share(value)}%` }}
                />
                {rangeWidth > 0 && (
                  <span
                    className={styles.range}
                    style={{ width: `${rangeWidth}%` }}
                  />
                )}
                <span className={styles.value}>{item.valueLabel}</span>
              </span>
            </li>
          );
        })}
      </ul>

      {block.note && (
        <figcaption className={styles.note}>{block.note}</figcaption>
      )}
    </figure>
  );
};

export default BarChartBlock;
