import React, { ReactNode } from "react";
import { Accordion as BaseAccordion } from "@szhsin/react-accordion";
import styles from "./Accordion.module.scss";

type AccordionProps = {
  children: ReactNode;
};

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return (
    <div className={styles.accordion}>
      <BaseAccordion transition transitionTimeout={250} allowMultiple={false}>
        {children}
      </BaseAccordion>
    </div>
  );
};

export default Accordion;
