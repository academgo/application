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
      <div className={styles.logos}>
        <LogosCarousel universities={universities} />
      </div>
      <div className="container">
        <div className={styles.principles}>
          <h3 className={styles.subtitle}>
            <span className={styles.highlight}>{programHighlight}</span>{" "}
            {programTitle}
          </h3>
          <div className={styles.principlesWrapper}>
            <div className={styles.principlesList}>
              {programs.map(program => (
                <div key={program._key} className={styles.principle}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <rect width="25" height="25" rx="5" fill="#112546" />
                    <path
                      d="M18.7861 9.24419L17.7287 8.2093C17.5861 8.06977 17.4079 8 17.2059 8C17.004 8 16.8257 8.06977 16.6832 8.2093L11.598 13.186L9.32871 10.9535C9.18614 10.814 9.00792 10.7442 8.80594 10.7442C8.60396 10.7442 8.42574 10.814 8.28317 10.9535L7.22574 11.9884C7.07129 12.1279 7 12.3023 7 12.5C7 12.6977 7.07129 12.8721 7.21386 13.0116L10.0178 15.7558L11.0752 16.7907C11.2178 16.9302 11.396 17 11.598 17C11.8 17 11.9782 16.9302 12.1208 16.7907L13.1782 15.7558L18.7861 10.2674C18.9287 10.1279 19 9.95349 19 9.75581C19 9.55814 18.9287 9.38372 18.7861 9.24419Z"
                      fill="white"
                    />
                  </svg>
                  {program.boldStartOrEnd ? (
                    <p className={styles.text}>
                      <strong>{program.textStart}</strong> {program.textEnd}
                    </p>
                  ) : (
                    <p className={styles.text}>
                      {program.textStart} <strong>{program.textEnd}</strong>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Universities;
