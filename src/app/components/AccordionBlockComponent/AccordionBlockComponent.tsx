import React from "react";
import { AccordionBlock } from "@/types/blog";
import Accordion from "../Accordion/Accordion";
import AccordionItem from "../AccordionItem/AccordionItem";

type AccordionBlockComponentProps = {
  block: AccordionBlock;
  expandedIndex: number | null;
  setExpandedIndex: (index: number | null) => void;
};

export const AccordionBlockComponent: React.FC<
  AccordionBlockComponentProps
> = ({ block, expandedIndex, setExpandedIndex }) => {
  return (
    <Accordion>
      {block.items.map((item, index) => (
        <AccordionItem
          key={item._key}
          title={item.question}
          content={item.answer}
          expanded={index === expandedIndex}
          onClick={() =>
            setExpandedIndex(index === expandedIndex ? null : index)
          }
        />
      ))}
    </Accordion>
  );
};
