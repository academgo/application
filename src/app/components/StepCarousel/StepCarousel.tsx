"use client";
import React, { FC, useEffect, useRef, ReactNode } from "react";
import styles from "./StepCarousel.module.scss";
import Marquee from "react-fast-marquee";

type Props = {
  number: string;
  title: string;
  children: ReactNode;
};

const StepCarousel: FC<Props> = ({ children }) => {
  return (
    <div className={styles.stepCarousel}>
      <Marquee loop={0} autoFill={true}>
        {children}
      </Marquee>
    </div>
  );
};

export default StepCarousel;
