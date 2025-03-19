import React, { FC } from "react";
import styles from "./PriceSlide.module.scss";
import Link from "next/link";
import { List } from "@/types/homepage";

type Props = {
  preTitle: string;
  title: string;
  itemsTitle: string;
  items: List[];
  cost: string;
  stageCost: string;
  buttonText: string;
  buttonLink: string;
  hasBorder: boolean;
  hasBg: boolean;
};

const PriceSlide: FC<Props> = ({
  preTitle,
  title,
  itemsTitle,
  items,
  cost,
  stageCost,
  buttonText,
  buttonLink,
  hasBorder,
  hasBg
}) => {
  return (
    <div
      className={styles.priceSlide}
      style={{
        border: hasBorder ? "3px solid #1A2644" : "3px solid transparent",
        backgroundColor: hasBg ? "#1A2644" : ""
      }}
    >
      <div className={styles.slideFlex}>
        <div className={styles.wrapper}>
          <p
            className={styles.pretitle}
            style={{
              color: hasBg ? "#fff" : ""
            }}
          >
            {preTitle}
          </p>
          <p
            style={{
              color: hasBg ? "#fff" : ""
            }}
            className={styles.title}
          >
            {title}
          </p>
          <div
            style={{
              color: hasBg ? "#fff" : ""
            }}
            className={styles.options}
          >
            <p
              style={{
                color: hasBg ? "#fff" : ""
              }}
              className={styles.optionsTitle}
            >
              {itemsTitle}
            </p>
            <ul className={styles.list}>
              {items.map(item => (
                <li
                  style={{
                    color: hasBg ? "#fff" : ""
                  }}
                  key={item._key}
                  className={styles.listItem}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          <p className={styles.cost}>{cost}</p>
          <p className={styles.stageCost}>{stageCost}</p>
        </div>
        {buttonLink && (
          <Link className={styles.button} href={buttonLink}>
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default PriceSlide;
