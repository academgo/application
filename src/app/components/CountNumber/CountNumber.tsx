"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

type Props = {
  children: string | number;
};

const CountNumber: FC<Props> = ({ children }) => {
  const [count, setCount] = useState(0);
  const targetNumber =
    typeof children === "string" ? parseInt(children, 10) : children;

  const ref = useRef<HTMLParagraphElement>(null);
  const isVisible = useIntersectionObserver(ref);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = targetNumber;
    if (start === end) return;

    const incrementTime = Math.abs(Math.floor(1500 / (end as number))); // duration of animation (2 seconds)

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetNumber, isVisible]);

  return <p ref={ref}>{count}</p>;
};

export default CountNumber;
