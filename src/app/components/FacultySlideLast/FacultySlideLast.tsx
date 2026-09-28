import React, { FC } from "react";
import styles from "./FacultySlideLast.module.scss";
import { Form as FormType } from "@/types/form";
import FormSuperLite from "../FormSuperLite/FormSuperLite";

type Props = {
  lastSlideTitle: string;
  lastSlideDescription: string;
  lastSlideTitleHighlight: string;
  form: FormType;
};

const FacultySlideLast: FC<Props> = ({
  lastSlideTitle,
  lastSlideDescription,
  lastSlideTitleHighlight,
  form
}) => {
  return (
    <div className={styles.facultySlideLast}>
      <img
        src="/decor/ba2a6f47cb.svg"
        alt=""
        aria-hidden="true"
        className={styles.decor}
        width={364}
        height={294}
        loading="lazy"
        decoding="async"
      />
      <div className={styles.slideContent}>
        <p className={styles.title}>
          <span className={styles.highlight}>{lastSlideTitleHighlight} </span>
          <br />
          {lastSlideTitle}
        </p>
        <p className={styles.text}>{lastSlideDescription}</p>
        <FormSuperLite
          form={form}
          // offerButtonCustomText={offerButtonCustomText}
        />
      </div>
    </div>
  );
};

export default FacultySlideLast;
