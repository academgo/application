import React, { FC } from "react";
import styles from "./SinglePageIntroBlock.module.scss";

type Props = {
  title: string;
};

const SinglePageIntroBlock: FC<Props> = ({ title }) => {
  return (
    <div className={styles.intro}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
};

export default SinglePageIntroBlock;
