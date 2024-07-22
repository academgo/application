import { TextContent } from "@/types/blog";
import React, { FC } from "react";
import { PortableText } from "@portabletext/react";
import { RichText } from "../RichText/RichText";

type Props = {
  block: TextContent;
};

const TextContentComponent: FC<Props> = ({ block }) => {
  return (
    <div>
      <PortableText value={block.content} components={RichText} />
    </div>
  );
};

export default TextContentComponent;
