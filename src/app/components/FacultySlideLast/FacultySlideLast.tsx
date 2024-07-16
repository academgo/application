import React, { FC } from "react";
import styles from "./FacultySlideLast.module.scss";

type Props = {
  lastSlideTitle: string;
  lastSlideDescription: string;
  lastSlideTitleHighlight: string;
};

const FacultySlideLast: FC<Props> = ({
  lastSlideTitle,
  lastSlideDescription,
  lastSlideTitleHighlight
}) => {
  console.log("lastSlideTitleHighlight", lastSlideTitleHighlight);
  return (
    <div className={styles.facultySlideLast}>
      <h3 className={styles.title}>
        <span className={styles.highlight}>{lastSlideTitleHighlight} </span>
        <br />
        {lastSlideTitle}
      </h3>
      <p className={styles.text}>{lastSlideDescription}</p>
    </div>
  );
};

export default FacultySlideLast;
