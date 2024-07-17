import React, { FC } from "react";
import styles from "./StepOne.module.scss";
import { StepOne as StepOneType } from "@/types/homepage";
import StepCarousel from "../StepCarousel/StepCarousel";

type Props = {
  stepOne: StepOneType;
};

const StepOne: FC<Props> = ({ stepOne }) => {
  return (
    <section className={styles.stepSection}>
      <StepCarousel number={stepOne.number} title={stepOne.title} />
    </section>
  );
};

export default StepOne;
