import { TextContent } from "@/types/blog";
import React, { FC } from "react";
import { PortableText } from "@portabletext/react";
import { RichText } from "../RichText/RichText";
import styles from "./TextContentComponent.module.scss";

type Props = {
  block: TextContent;
};

const marginValues: Record<string, string> = {
  small: "clamp(0.625rem, 2.5vw, 1.875rem)",
  medium: "clamp(1.25rem, 0.5rem + 3vw, 2.75rem)",
  large: "clamp(1.25rem, 5vw, 3.75rem)"
};

const TextContentComponent: FC<Props> = ({ block }) => {
  const { content, marginBottom } = block;

  // Проверяем, что marginBottom существует и является ключом в marginValues
  const computedMargin =
    marginBottom && marginValues[marginBottom]
      ? marginValues[marginBottom]
      : "0";

  return (
    <div
      className={styles.textContentComponent}
      style={{
        marginBottom: computedMargin
      }}
    >
      <PortableText value={content} components={RichText} />
    </div>
  );
};

export default TextContentComponent;
