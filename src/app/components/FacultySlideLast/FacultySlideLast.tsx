import React, { FC } from "react";
import styles from "./FacultySlideLast.module.scss";

type Props = {
  lastSlideTitle: string;
  lastSlideDescription: string;
};

const FacultySlideLast: FC<Props> = ({
  lastSlideTitle,
  lastSlideDescription
}) => {
  return (
    <div className={styles.facultySlideLast}>
      <h3 className={styles.title}>{lastSlideTitle}</h3>
      <p className={styles.text}>{lastSlideDescription}</p>
    </div>
  );
};

export default FacultySlideLast;
