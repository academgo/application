import React, { FC } from "react";
import styles from "./StepOne.module.scss";
import { StepOne as StepOneType } from "@/types/homepage";
import StepCarousel from "../StepCarousel/StepCarousel";
import VideoStep from "../VideoStep/VideoStep";

type Props = {
  stepOne: StepOneType;
};

const StepOne: FC<Props> = ({ stepOne }) => {
  return (
    <section className={styles.stepSection}>
      <StepCarousel number={stepOne.number} title={stepOne.title} />
      <div className={styles.stepContainer}>
        <div className={styles.stepWrapper}>
          <div className={styles.videoBlock}>
            <VideoStep
              videoId={stepOne.video.videoId}
              posterImage={stepOne.video.posterImage}
              text={stepOne.video.text}
            />
          </div>
          <div className={styles.contentBlock}>
            <div className={styles.contentWrapperAlt}>
              <div className={styles.stepOneText}>
                <p className={styles.bigText}>{stepOne.description}</p>
              </div>
              <div className={styles.stepOneData}>
                <p className={styles.subtitle}>{stepOne.resultText}</p>
                <div className={styles.stepOneItems}>
                  {stepOne.items.map(item => (
                    <div key={item._key} className={styles.stepOneItem}>
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
                      <p>
                        <strong>{item.title}</strong> {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <button className={styles.button}>{stepOne.buttonText}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepOne;
