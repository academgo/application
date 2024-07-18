import React, { FC } from "react";
import styles from "../StepOne/StepOne.module.scss";
import { StepThree as StepThreeType } from "@/types/homepage";
import StepCarousel from "../StepCarousel/StepCarousel";
import VideoStep from "../VideoStep/VideoStep";

type Props = {
  stepThree: StepThreeType;
};

const StepThree: FC<Props> = ({ stepThree }) => {
  return (
    <section className={styles.stepSection}>
      <StepCarousel number={stepThree.number} title={stepThree.title}>
        <div className={styles.step}>
          <p className={styles.number}>{stepThree.number}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#091728" />
          </svg>
          <h2 className={styles.title}>{stepThree.title}</h2>
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
          <p className={styles.number}>{stepThree.number}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#091728" />
          </svg>
          <h2 className={styles.title}>{stepThree.title}</h2>
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
      </StepCarousel>
      <div className={styles.stepContainer}>
        <div className={styles.stepWrapper}>
          <div className={styles.videoBlock}>
            <VideoStep
              videoId={stepThree.video.videoId}
              posterImage={stepThree.video.posterImage}
              text={stepThree.video.text}
            />
          </div>
          <div className={styles.contentBlock}>
            <div className={styles.substeps}>
              {stepThree.substeps.map(substep => (
                <div key={substep._key} className={styles.substep}>
                  <h3 className={styles.substepTitle}>{substep.title}</h3>
                  <p className={styles.substepText}>
                    {substep.description}
                    {""}
                    {substep.highlight && (
                      <span className={styles.substepHighlight}>
                        {substep.highlight}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepThree;
