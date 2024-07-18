import React, { FC } from "react";
import styles from "../StepOne/StepOne.module.scss";
import { StepFour as StepFourType } from "@/types/homepage";
import StepCarousel from "../StepCarousel/StepCarousel";
import VideoStep from "../VideoStep/VideoStep";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  stepFour: StepFourType;
};

const StepFour: FC<Props> = ({ stepFour }) => {
  return (
    <section className={styles.stepSection}>
      <svg
        className={styles.backgroundShape6}
        xmlns="http://www.w3.org/2000/svg"
        width="724"
        height="474"
        viewBox="0 0 724 474"
        fill="none"
      >
        <path
          opacity="0.5"
          d="M685.399 -2.71881e-05L706.399 1.19998L705.799 11.7C703.799 45.8 694.199 69.1 676.299 83C663.299 93.1 647.399 97.1 631.999 101C618.399 104.4 606.099 107.5 597.799 114.2C604.799 120.3 610.699 129.3 614.899 140.5C622.199 159.9 615.299 169.9 610.599 174.1C601.999 181.8 587.999 181.2 578.699 172.8C572.699 167.4 568.999 159.7 567.299 149.2C566.199 142.7 565.699 134.1 567.699 125.2C555.799 124.4 538.099 123.8 526.799 128C489.999 141.8 489.199 176.5 489.799 186.7C490.799 203.8 500.299 219.3 513.899 226.2C526.599 232.6 542.899 232.1 557.199 231.7C560.099 231.6 563.199 231.5 566.399 231.4C601.199 230.1 653.699 228 691.499 257C714.899 275 721.599 297.2 723.099 312.7C725.199 333.7 718.599 355.7 705.899 370.1C686.899 391.7 656.899 403.7 616.8 405.8C609.1 406.2 601.199 405.1 592.799 403.9C572.499 401 551.599 398.1 529.799 415.9C524.9 419.9 520.999 425.5 516.799 431.4C513.199 436.5 509.399 441.8 504.699 446.6C492.199 459.4 480.9 467.1 469.299 470.7C455.5 474.9 441.4 473.5 426.2 466.2C413.3 460.1 409.7 448.5 406.7 439.2C402.8 426.9 400.199 418.7 378.4 417.5C368.6 416.9 359.1 412.3 351.5 404.3C344.5 397 339.899 387.7 338.5 378.1C334.299 350.4 358.2 328.6 370.999 316.8C395.899 293.9 396.499 281.6 394.799 274.2L394.7 273.8C394.4 272.5 393.499 268.5 380.599 266.6C364.899 264.3 360.299 272.1 351.299 295.3C344.299 313.3 335.499 335.6 311.7 344.1C298.5 348.8 278 348.1 264.499 337.7C255.299 330.7 250.8 320.2 251.7 308.3C252.9 293.5 263.099 278.5 271.299 266.5C274.299 262 277.499 257.4 278.499 255C289.499 229.4 287.4 210.6 272.199 199.2C248.199 181 200.9 185.5 188.699 195.3C181.6 201 176.6 209.2 171.2 217.9C159.1 237.7 143.999 262.3 98.5995 264.6C61.9995 266.5 34.0995 266.8 10.4995 265.6L-0.000506461 265.1L0.999492 244.1L11.4995 244.6C34.2995 245.7 61.5995 245.4 97.3995 243.6C131.7 241.9 141.7 225.7 153.2 206.9C159.199 197.1 165.499 186.9 175.4 178.9C194.999 163.1 252.899 158.3 284.799 182.4C298.199 192.6 317.7 216.5 297.7 263.2C295.9 267.5 292.499 272.4 288.499 278.2C281.999 287.7 273.2 300.6 272.499 309.9C272.1 314.7 273.6 318.2 277.1 320.9C284.3 326.4 296.899 326.9 304.499 324.1C319.299 318.8 325.3 303.5 331.6 287.4C335.8 276.7 340.099 265.7 347.299 257.6C356.399 247.4 368.499 243.4 383.499 245.6C401.499 248.3 412.099 256.2 414.999 269L415.1 269.3C421.1 295.3 400.799 317.6 384.999 332.1C371.299 344.7 356.8 359.4 359.1 374.8C360.8 385.8 370.299 395.8 379.399 396.4C415.699 398.4 422.2 419.1 426.5 432.8C429.2 441.4 430.699 445.1 434.9 447.1C454.699 456.5 469.499 452.3 489.499 431.8C493.099 428.1 496.199 423.7 499.499 419.1C504.299 412.3 509.299 405.3 516.399 399.5C545.399 375.9 574.399 380 595.599 383C602.999 384 609.899 385 615.599 384.7C649.899 383 674.899 373.4 689.999 356.1C698.799 346.1 703.599 329.8 702.099 314.6C700.999 303.3 695.999 287 678.499 273.5C646.799 249.2 600.699 250.9 566.999 252.2C563.699 252.3 560.599 252.4 557.699 252.5C541.699 253 521.699 253.6 504.299 244.8C484.099 234.6 470.099 212.2 468.699 187.8C466.999 159.1 479.399 123.1 519.299 108.1C537.699 101.2 564.099 103.5 576.799 104.6C576.999 104.6 577.199 104.6 577.399 104.7C589.799 89.7 609.299 84.8 626.799 80.4C640.699 76.9 653.799 73.6 663.299 66.2C676.199 56.2 683.199 37.9 684.799 10.2L685.399 -2.71881e-05ZM595.999 158.6C596.299 158.6 596.499 158.6 596.599 158.5C596.999 158.1 597.699 154.6 595.199 148C594.199 145.2 591.499 139 587.399 133.8C586.999 137.6 587.099 141.6 587.799 145.9C588.699 151.4 590.299 155.3 592.599 157.3C593.699 158.2 595.199 158.6 595.999 158.6Z"
          fill="white"
        />
      </svg>
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
          <h2 className={styles.title}>{stepFour.title}</h2>
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
          <h2 className={styles.title}>{stepFour.title}</h2>
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
              <Image
                alt={stepFour.title}
                src={urlFor(stepFour.image).url()}
                fill={true}
                className={styles.imagePoster}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepFour;
