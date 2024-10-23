import { BlockContentWithStyle, ProcessBlock } from "@/types/blog";
import React, { FC } from "react";
import { PortableText } from "@portabletext/react";
import { RichText } from "../RichText/RichText";
import styles from "./ProcessBlockComponent.module.scss";

type Props = {
  block: ProcessBlock;
};

const ProcessBlockComponent: FC<Props> = ({ block }) => {
  const getBlockStyle = (textBlock: BlockContentWithStyle) => ({
    background: textBlock.backgroundColor,
    border: textBlock.isBorder ? "2px solid #112546" : "none",
    padding: textBlock.backgroundColor ? "25px" : "0", // Задайте подходящий размер паддинга
    borderRadius: textBlock.backgroundColor ? "25px" : "0" // Задайте подходящий радиус
  });

  return (
    <section className={styles.processBlock}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h2 className={styles.title}>{block.title}</h2>
          <p className={styles.description}>{block.description}</p>
        </div>
        <div className={styles.chain}>
          {block.items.map(item => (
            <div key={item._key} className={styles.chainItem}>
              <div className={styles.number}>{item.number}</div>
              <div
                style={getBlockStyle(item.content)}
                className={styles.richText}
              >
                <PortableText
                  value={item.content.content}
                  components={RichText}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessBlockComponent;
