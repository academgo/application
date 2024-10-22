import { BlockContentWithStyle, CascadeBlock } from "@/types/blog";
import React, { FC } from "react";
import styles from "./CascadeBlockComponent.module.scss";
import { PortableText } from "@portabletext/react";
import { RichText } from "../RichText/RichText";

type Props = {
  block: CascadeBlock;
};

const CascadeBlockComponent: FC<Props> = ({ block }) => {
  const getBlockStyle = (textBlock: BlockContentWithStyle) => ({
    background: textBlock.backgroundColor,
    border: textBlock.isBorder ? "1px solid #000" : "none"
  });

  return (
    <section className={styles.cascadeBlock}>
      <div className={styles.wrapper}>
        {block.contentCascadeBlocks.map(contentBlock => (
          <div
            key={contentBlock._key}
            className={styles.textBlock}
            style={getBlockStyle(contentBlock.contentBlock)}
          >
            <PortableText
              value={contentBlock.contentBlock.content}
              components={RichText}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CascadeBlockComponent;
