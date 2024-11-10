// Accordion.tsx
import React, { ReactNode } from "react";
import { Accordion as BaseAccordion } from "@szhsin/react-accordion";
import styles from "./Accordion.module.scss";

type AccordionProps = {
  children: ReactNode;
};

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return (
    <div className={styles.accordion}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: React.Children.map(children, (child: any) => ({
              "@type": "Question",
              name: child.props.title,
              acceptedAnswer: {
                "@type": "Answer",
                text: child.props.content
                  ? child.props.content
                      .map((block: any) =>
                        block.children
                          ? block.children.map((c: any) => c.text).join("")
                          : ""
                      )
                      .join("")
                  : ""
              }
            }))
          })
        }}
      />
      <BaseAccordion transition transitionTimeout={250} allowMultiple={false}>
        {children}
      </BaseAccordion>
    </div>
  );
};

export default Accordion;
