import { DoubleTextBlock } from "@/types/blog";
import React, { FC } from "react";
import { PortableText } from "@portabletext/react";
import { RichText } from "../RichText/RichText";
import styles from "./DoubleTextBlockComponent.module.scss";

type Props = {
  block: DoubleTextBlock;
};

const DoubleTextBlockComponent: FC<Props> = ({ block }) => {
  return (
    <div className={styles.doubleTextBlock}>
      {block.doubleTextBlockTitle && (
        <h2 className="h2-main mb-h2">{block.doubleTextBlockTitle}</h2>
      )}
      <div className={styles.wrapper}>
        <div className={styles.textBlock}>
          <PortableText value={block.leftTextBlock} components={RichText} />
        </div>
        <div className={styles.textBlock}>
          <PortableText value={block.rightTextBlock} components={RichText} />
        </div>
      </div>
    </div>
  );
};

export default DoubleTextBlockComponent;
