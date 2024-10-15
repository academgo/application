import { DoubleTextBlock, BlockContentWithStyle } from "@/types/blog";
import React, { FC } from "react";
import { PortableText } from "@portabletext/react";
import { RichText } from "../RichText/RichText";
import styles from "./DoubleTextBlockComponent.module.scss";

type Props = {
  block: DoubleTextBlock;
};

const DoubleTextBlockComponent: FC<Props> = ({ block }) => {
  const getBlockStyle = (textBlock: BlockContentWithStyle) => ({
    background: textBlock.backgroundColor,
    border: textBlock.isBorder ? "1px solid #000" : "none",
    padding: textBlock.backgroundColor ? "25px" : "0", // Задайте подходящий размер паддинга
    borderRadius: textBlock.backgroundColor ? "20px" : "0" // Задайте подходящий радиус
  });

  return (
    <div className={styles.doubleTextBlock}>
      {block.doubleTextBlockTitle && (
        <h2 className="h2-main mb-h2">{block.doubleTextBlockTitle}</h2>
      )}
      <div className={styles.wrapper}>
        <div
          className={styles.textBlock}
          style={getBlockStyle(block.leftTextBlock)}
        >
          <PortableText
            value={block.leftTextBlock.content}
            components={RichText}
          />
        </div>
        <div
          className={styles.textBlock}
          style={getBlockStyle(block.rightTextBlock)}
        >
          <PortableText
            value={block.rightTextBlock.content}
            components={RichText}
          />
        </div>
      </div>
    </div>
  );
};

export default DoubleTextBlockComponent;
