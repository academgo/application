import React, { FC } from "react";
import styles from "./WhiteBlockComponent.module.scss";
import { WhiteBlock } from "@/types/blog";
import { PortableText } from "next-sanity";
import { RichText } from "../RichText/RichText";

type Props = {
  block: WhiteBlock;
};

const WhiteBlockComponent: FC<Props> = ({ block }) => {
  return (
    <section className={styles.whiteBlock}>
      <div className={styles.content}>
        <h2 className="h2-main mb20">{block.title}</h2>
        <div className={styles.portableText}>
          <PortableText value={block.text} components={RichText} />
        </div>
      </div>
      {block.bullets && (
        <div className={styles.bulletsList}>
          {block.bullets.map((bullet, index) => (
            <div key={index} className={styles.bullet}>
              <div className={styles.bulletNumber}>{bullet.number}</div>
              {bullet.sign && (
                <p className={styles.bulletTitle}>{bullet.sign}</p>
              )}
              {bullet.text && (
                <p className={styles.bulletText}>{bullet.text}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default WhiteBlockComponent;
