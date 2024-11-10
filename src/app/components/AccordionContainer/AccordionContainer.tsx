"use client";
import React, { useState } from "react";
import { AccordionBlock } from "@/types/blog";
import { AccordionBlockComponent } from "@/app/components/AccordionBlockComponent/AccordionBlockComponent";

type AccordionContainerProps = {
  block: AccordionBlock;
};

const AccordionContainer: React.FC<AccordionContainerProps> = ({ block }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Создаем JSON-LD разметку для FAQ на основе данных блока
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: block.items.map((item: any) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.content
          .map((block: any) =>
            block.children
              ? block.children.map((child: any) => child.text || "").join("")
              : ""
          )
          .join(" ")
      }
    }))
  };

  return (
    <div>
      {/* Вставляем JSON-LD разметку для FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AccordionBlockComponent
        block={block}
        expandedIndex={expandedIndex}
        setExpandedIndex={setExpandedIndex}
      />
    </div>
  );
};

export default AccordionContainer;
