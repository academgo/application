import React, { FC } from "react";
import Link from "next/link";
import { COUNTRY_SHAPES, projectPoint } from "./countryShapes";
import styles from "./CountryMapBlock.module.scss";

export type CountryMapBlockType = {
  _key: string;
  _type: "countryMapBlock";
  title?: string;
  subtitle?: string;
  country?: string;
  points?: {
    _key: string;
    city?: string;
    lat?: number;
    lon?: number;
    universities?: { _key: string; name?: string; href?: string }[];
  }[];
  note?: string;
};

type Props = {
  block: CountryMapBlockType;
};

type Box = { x: number; y: number; w: number; h: number };

type Anchor = "start" | "end" | "middle";

// Ширина подписи на глаз: 17px полужирным — около 9,6px на символ
const CHAR_WIDTH = 9.6;
const LABEL_HEIGHT = 22;
const POINT_RADIUS = 10;

const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

/**
 * Подпись города ставим справа, слева, сверху или снизу от точки — первый
 * вариант, который не задевает другие точки, уже поставленные подписи и край
 * карты. Если свободного места нет, берём вариант с наименьшим наложением.
 */
const placeLabels = <T extends { text: string; x: number; y: number }>(
  width: number,
  height: number,
  items: T[]
) => {
  const pointBoxes: Box[] = items.map(({ x, y }) => ({
    x: x - POINT_RADIUS,
    y: y - POINT_RADIUS,
    w: POINT_RADIUS * 2,
    h: POINT_RADIUS * 2
  }));
  const taken: Box[] = [];

  return items.map((item, index) => {
    const { x, y, text } = item;
    const w = text.length * CHAR_WIDTH + 6;
    const candidates: { box: Box; x: number; y: number; anchor: Anchor }[] = [
      {
        box: { x: x + 12, y: y - 12, w, h: LABEL_HEIGHT },
        x: x + 14,
        y: y + 5,
        anchor: "start"
      },
      {
        box: { x: x - 12 - w, y: y - 12, w, h: LABEL_HEIGHT },
        x: x - 14,
        y: y + 5,
        anchor: "end"
      },
      {
        box: { x: x - w / 2, y: y - 34, w, h: LABEL_HEIGHT },
        x,
        y: y - 17,
        anchor: "middle"
      },
      {
        box: { x: x - w / 2, y: y + 12, w, h: LABEL_HEIGHT },
        x,
        y: y + 29,
        anchor: "middle"
      }
    ];
    // У правого края карты сначала пробуем подпись слева
    if (x > width * 0.68) candidates.unshift(candidates.splice(1, 1)[0]);

    const cost = ({ box }: { box: Box }) => {
      const outside =
        box.x < 0 ||
        box.y < 0 ||
        box.x + box.w > width ||
        box.y + box.h > height
          ? 1e6
          : 0;
      const labels = taken.reduce((sum, other) => sum + overlap(box, other), 0);
      const dots = pointBoxes.reduce(
        (sum, other, otherIndex) =>
          otherIndex === index ? sum : sum + overlap(box, other),
        0
      );
      return outside + labels + dots;
    };

    const best =
      candidates.find(candidate => cost(candidate) === 0) ||
      candidates.reduce((a, b) => (cost(b) < cost(a) ? b : a));

    taken.push(best.box);
    return {
      ...item,
      label: { x: best.x, y: best.y, anchor: best.anchor, text }
    };
  });
};

const CountryMapBlock: FC<Props> = ({ block }) => {
  const shape = block.country ? COUNTRY_SHAPES[block.country] : undefined;
  const points = (block.points || []).filter(
    point =>
      point.city &&
      typeof point.lat === "number" &&
      typeof point.lon === "number"
  );
  if (!shape || !points.length) return null;

  const placed = placeLabels(
    shape.width,
    shape.height,
    points.map((point, index) => ({
      point,
      text: `${index + 1}. ${point.city}`,
      ...projectPoint(shape, point.lat as number, point.lon as number)
    }))
  );

  return (
    <section className={styles.map}>
      {block.title && <h3 className={styles.title}>{block.title}</h3>}
      {block.subtitle && <p className={styles.subtitle}>{block.subtitle}</p>}

      <div className={styles.body}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${shape.width} ${shape.height}`}
          role="img"
          aria-label={points.map(point => point.city).join(", ")}
        >
          {shape.shapes.map((item, index) => (
            <path
              key={index}
              d={item.d}
              className={item.muted ? styles.landMuted : styles.land}
            />
          ))}
          {placed.map(({ point, x, y }) => (
            <circle
              key={point._key}
              cx={x}
              cy={y}
              r={8}
              className={styles.point}
            />
          ))}
          {placed.map(({ point, label }) => (
            <text
              key={point._key}
              x={label.x}
              y={label.y}
              textAnchor={label.anchor}
              className={styles.cityLabel}
            >
              {label.text}
            </text>
          ))}
        </svg>

        <ol className={styles.list}>
          {points.map(point => (
            <li key={point._key} className={styles.city}>
              <p className={styles.cityName}>{point.city}</p>
              {point.universities && point.universities.length > 0 && (
                <ul className={styles.universities}>
                  {point.universities.map(university => (
                    <li key={university._key}>
                      {university.href ? (
                        <Link href={university.href} className={styles.link}>
                          {university.name}
                        </Link>
                      ) : (
                        university.name
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>

      {block.note && <p className={styles.note}>{block.note}</p>}
    </section>
  );
};

export default CountryMapBlock;
