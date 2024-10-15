import { BulletsBlock } from "@/types/blog";
import React, { FC } from "react";
import styles from "./BulletsBlockComponent.module.scss";
import CountNumber from "../CountNumber/CountNumber";

type Props = {
  block: BulletsBlock;
};

const BulletsBlockComponent: FC<Props> = ({ block }) => {
  return (
    <section className={styles.bulletsBlock}>
      <div className={styles.bulletsList}>
        {block.bullets.map((bullet, index) => (
          <div key={index} className={styles.bullet}>
            <div className={styles.bulletTitle}>
              <CountNumber>{bullet.number}</CountNumber>
              {bullet.sign && <span>{bullet.sign}</span>}
            </div>
            <div className={styles.bulletText}>{bullet.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BulletsBlockComponent;
