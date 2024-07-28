"use client";
import React, { FC, useEffect, useRef, ReactNode } from "react";
import styles from "./StepCarousel.module.scss";

type Props = {
  number: string;
  title: string;
  children: ReactNode;
  style?: any;
};

const StepCarousel: FC<Props> = ({ children, style }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      const items = Array.from(carousel.children);
      items.forEach(item => {
        const clone = item.cloneNode(true);
        carousel.appendChild(clone);
      });
    }
  }, []);

  return (
    <div style={style} className={styles.wrapper}>
      <div className={styles.stepCarousel} ref={carouselRef}>
        {children}
        {children}
      </div>
    </div>
  );
};

export default StepCarousel;
