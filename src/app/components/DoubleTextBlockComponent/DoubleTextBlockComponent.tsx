import {
  DoubleTextBlock,
  ContentChoice,
  BlockContentWithStyle
} from "@/types/blog";
import React, { FC } from "react";
import { PortableText } from "@portabletext/react";
import { RichText } from "../RichText/RichText";
import Image from "next/image";
import styles from "./DoubleTextBlockComponent.module.scss";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  block: DoubleTextBlock;
};

const marginValues: Record<string, string> = {
  small: "clamp(0.625rem, 2.5vw, 1.875rem)",
  medium: "clamp(1.25rem, 0.5rem + 3vw, 2.75rem)",
  large: "clamp(1.25rem, 5vw, 3.75rem)"
};

const getBlockStyle = (textBlock?: BlockContentWithStyle) => ({
  background: textBlock?.backgroundColor || "transparent",
  border: textBlock?.isBorder ? "1px solid #000" : "none",
  padding: textBlock?.backgroundColor ? "25px" : "0",
  borderRadius: textBlock?.backgroundColor ? "20px" : "0"
});

const DoubleTextBlockComponent: FC<Props> = ({ block }) => {
  const { marginBottom } = block;

  const computedMargin =
    marginBottom && marginValues[marginBottom]
      ? marginValues[marginBottom]
      : "0";

  const renderContent = (content?: ContentChoice) => {
    if (!content) return null; // Проверка на наличие контента

    if (content.type === "text" && content.blockContent) {
      return (
        <div
          className={styles.textBlock}
          style={getBlockStyle(content.blockContent)}
        >
          <PortableText
            value={content.blockContent.content}
            components={RichText}
          />
        </div>
      );
    } else if (content.type === "image" && content.image) {
      const imageUrl = urlFor(content.image).url();
      const imageAlt = content.image.alt || "Academgo Image";
      return (
        <div className={styles.imageBlock}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            layout="responsive"
            width={500}
            height={300}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={styles.doubleTextBlock}
      style={{
        marginBottom: computedMargin
      }}
    >
      {block.doubleTextBlockTitle && (
        <h2 className="h2-main mb-h2">{block.doubleTextBlockTitle}</h2>
      )}
      <div className={styles.wrapper}>
        {block.leftContent && renderContent(block.leftContent)}
        {block.rightContent && renderContent(block.rightContent)}
      </div>
    </div>
  );
};

export default DoubleTextBlockComponent;
