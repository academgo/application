import React, { FC } from "react";

// Волнистая линия на тёмных баннерах с заявкой
const OfferDecor: FC<{ className?: string }> = ({ className }) => (
  <img
    src="/decor/49121a973b.svg"
    alt=""
    aria-hidden="true"
    className={className}
    width={724}
    height={444}
    loading="lazy"
    decoding="async"
  />
);

export default OfferDecor;
