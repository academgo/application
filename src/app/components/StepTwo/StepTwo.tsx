import React, { FC } from "react";
import styles from "../StepOne/StepOne.module.scss";
import { StepTwo as StepTwoType } from "@/types/homepage";
import StepCarousel from "../StepCarousel/StepCarousel";
import VideoStep from "../VideoStep/VideoStep";

type Props = {
  stepTwo: StepTwoType;
};

const StepTwo: FC<Props> = ({ stepTwo }) => {
  return (
    <section className={styles.stepSection}>
      <StepCarousel
        number={stepTwo.number}
        title={stepTwo.title}
        style={{ animationDirection: "reverse" }}
      >
        <div className={styles.step}>
          <p className={styles.number}>{stepTwo.number}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#091728" />
          </svg>
          <h2 className={styles.title}>{stepTwo.title}</h2>
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
          <p className={styles.number}>{stepTwo.number}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#091728" />
          </svg>
          <h2 className={styles.title}>{stepTwo.title}</h2>
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
        <div className={styles.stepWrapperReverse}>
          <div className={styles.contentBlock}>
            <div className={styles.contentWrapper}>
              <div className={styles.stepTwoText}>
                <p className={styles.littleText}>{stepTwo.littleText}</p>
              </div>
              <div className={styles.stepTwoData}>
                {stepTwo.description.map(item => (
                  <p key={item._key} className={styles.bigText}>
                    {item.title}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.videoBlock}>
            <VideoStep
              videoId={stepTwo.video.videoId}
              posterImage={stepTwo.video.posterImage}
              text={stepTwo.video.text}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepTwo;
