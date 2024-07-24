import { TextContent } from "@/types/blog";
import React, { FC } from "react";
import { PortableText } from "@portabletext/react";
import { RichText } from "../RichText/RichText";
import styles from "./TextContentComponent.module.scss";

type Props = {
  block: TextContent;
};

const TextContentComponent: FC<Props> = ({ block }) => {
  return (
    <div className={styles.textContentComponent}>
      <PortableText value={block.content} components={RichText} />
    </div>
  );
};

export default TextContentComponent;
