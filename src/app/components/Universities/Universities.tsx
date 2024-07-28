import { UniversitiesBlock } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./Universities.module.scss";
import LogosCarousel from "../LogosCarousel/LogosCarousel";

type Props = {
  data: UniversitiesBlock;
};

const Universities: FC<Props> = ({ data }) => {
  const { title, universities, programHighlight, programTitle, programs } =
    data;

  return (
    <section className={styles.universitiesBlock}>
      <div className="container">
        <h2 className={styles.title}>{title}</h2>
      </div>
      <LogosCarousel universities={universities} />
    </section>
  );
};

export default Universities;
