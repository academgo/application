import React, { FC } from "react";
import styles from "../StepOne/StepOne.module.scss";
import { StepFour as StepFourType } from "@/types/homepage";
import StepCarousel from "../StepCarousel/StepCarousel";
import VideoStep from "../VideoStep/VideoStep";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

type Props = {
  stepFour: StepFourType;
};

const StepFour: FC<Props> = ({ stepFour }) => {
  return (
    <section className={styles.stepSection}>
      <img
        src="/decor/ce8f01cdba.svg"
        alt=""
        aria-hidden="true"
        className={styles.backgroundShape6}
        width={724}
        height={474}
        loading="lazy"
        decoding="async"
      />
      <StepCarousel
        number={stepFour.number}
        title={stepFour.title}
        // style={{ animationDirection: "reverse" }}
      >
        <div className={styles.step}>
          <p className={styles.number}>{stepFour.number}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#091728" />
          </svg>
          <p className={styles.title}>{stepFour.title}</p>
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
          <p className={styles.number}>{stepFour.number}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#091728" />
          </svg>
          <p className={styles.title}>{stepFour.title}</p>
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
              <div className={styles.stepFourText}>
                {stepFour.littleText.map(item => (
                  <p key={item._key} className={styles.smallText}>
                    {item.title}
                  </p>
                ))}
              </div>
              <ul className={styles.stepList}>
                {stepFour.list.map(item => (
                  <li
                    key={item._key}
                    className={`${styles.bigText} ${styles.stepListItem}`}
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.videoBlock}>
            <div className={styles.imageBlock}>
              {stepFour.video ? (
                <VideoStep
                  videoId={stepFour.video.videoId}
                  posterImage={stepFour.video.posterImage}
                  text={stepFour.video.text}
                />
              ) : (
                <Image
                  alt={stepFour.title}
                  src={urlFor(stepFour.image).url()}
                  fill={true}
                  className={styles.imagePoster}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepFour;
