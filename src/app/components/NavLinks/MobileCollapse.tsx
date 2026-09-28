"use client";

import { ReactNode, useEffect, useState } from "react";

type Props = {
  open: boolean;
  className?: string;
  children: ReactNode;
};

// Раскрытие подменю в мобильном меню: высота 0 → 50vh за 0,5 с и обратно.
// Раньше это делал framer-motion (~115 КБ JS на каждой странице ради одной
// анимации) — теперь CSS-переход. При закрытии подменю остаётся в DOM, пока
// не закончится анимация.
const MobileCollapse = ({ open, className, children }: Props) => {
  const [mounted, setMounted] = useState(open);
  const [expanded, setExpanded] = useState(false);

  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      return;
    }
    // два кадра: сначала рисуется высота 0, потом включается переход
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setExpanded(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className={className}
      style={{
        maxHeight: expanded ? "50vh" : 0,
        overflow: expanded ? "auto" : "hidden",
        transition: "max-height 0.5s ease"
      }}
      onTransitionEnd={event => {
        if (event.target === event.currentTarget && !open) setMounted(false);
      }}
    >
      {children}
    </div>
  );
};

export default MobileCollapse;
