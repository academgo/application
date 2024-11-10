"use client";
import React, { useState } from "react";
import { AccordionBlock } from "@/types/blog";
import { AccordionBlockComponent } from "@/app/components/AccordionBlockComponent/AccordionBlockComponent";

type AccordionContainerProps = {
  block: AccordionBlock;
};

const AccordionContainer: React.FC<AccordionContainerProps> = ({ block }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <AccordionBlockComponent
      block={block}
      expandedIndex={expandedIndex}
      setExpandedIndex={setExpandedIndex}
    />
  );
};

export default AccordionContainer;
