"use client";
import React, { FC, useEffect, useRef } from "react";
import styles from "./StepCarousel.module.scss";

type Props = {
  number: string;
  title: string;
};

const StepCarousel: FC<Props> = ({ number, title }) => {
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
    <div className={styles.stepCarousel} ref={carouselRef}>
      <div className={styles.step}>
        <p className={styles.number}>{number}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <circle cx="5" cy="5" r="5" fill="#091728" />
        </svg>
        <h2 className={styles.title}>{title}</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <circle cx="5" cy="5" r="5" fill="#091728" />
        </svg>
      </div>
      <div className={styles.step}>
        <p className={styles.number}>{number}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <circle cx="5" cy="5" r="5" fill="#091728" />
        </svg>
        <h2 className={styles.title}>{title}</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <circle cx="5" cy="5" r="5" fill="#091728" />
        </svg>
      </div>
      <div className={styles.step}>
        <p className={styles.number}>{number}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <circle cx="5" cy="5" r="5" fill="#091728" />
        </svg>
        <h2 className={styles.title}>{title}</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <circle cx="5" cy="5" r="5" fill="#091728" />
        </svg>
      </div>
      <div className={styles.step}>
        <p className={styles.number}>{number}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <circle cx="5" cy="5" r="5" fill="#091728" />
        </svg>
        <h2 className={styles.title}>{title}</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <circle cx="5" cy="5" r="5" fill="#091728" />
        </svg>
      </div>
    </div>
  );
};

export default StepCarousel;
