import styles from "./Hero.module.scss";
import React, { FC } from "react";
import { Image as ImageType, Flag } from "@/types/homepage";
import { PL } from "country-flag-icons/react/1x1";
import FlagsCarousel from "../FlagsCarousel/FlagsCarousel";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import { ButtonModal } from "../ButtonModal/ButtonModal";

type Props = {
  mainHeadingStart: string;
  mainHeadingHighlight: string;
  mainHeadingContinue: string;
  mainHeadingEnd: string;
  tooltip: string;
  description: string;
  descriptionSmall: string;
  heroButtonText: string;
  heroImage: ImageType;
  heroDescription: string;
  flags: Flag[];
  heroTitle: string;
};

const Hero: FC<Props> = ({
  mainHeadingStart,
  mainHeadingHighlight,
  mainHeadingContinue,
  mainHeadingEnd,
  tooltip,
  description,
  descriptionSmall,
  heroButtonText,
  heroImage,
  heroDescription,
  flags,
  heroTitle
}) => {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.flexBlock}>
          <div className={styles.flexChild}>
            <div className={styles.heroTitleWrapper}>
              <div className={styles.headingBlock}>
                <h1 className={styles.mainHeading}>
                  {mainHeadingStart}{" "}
                  <span className={styles.highlight}>
                    {mainHeadingHighlight}
                    <span className={styles.tooltip}>{tooltip}</span>
                  </span>{" "}
                  {mainHeadingContinue}{" "}
                  <PL title="Poland" className={styles.flagIcon} />{" "}
                  {mainHeadingEnd}{" "}
                </h1>
              </div>
              <div className={styles.descriptionBlock}>
                <p className={styles.description}>{description}</p>
                <p className={styles.descriptionSmall}>{descriptionSmall}</p>
              </div>
              <div className={styles.buttonBlock}>
                <ButtonModal>{heroButtonText}</ButtonModal>
                {/* <button className={styles.heroButton}>{heroButtonText}</button> */}
              </div>
            </div>
          </div>
          <div className={styles.flexChild}>
            <div className={styles.imageWrapper}>
              <Image
                alt={description}
                src={urlFor(heroImage).url()}
                fill={true}
                className={styles.logoImage}
                quality={100}
              />
            </div>
            <div className={styles.flagsBlock}>
              <p className={styles.heroDescription}>{heroDescription}</p>
              <h2 className={styles.heroTitle}>{heroTitle}</h2>
              <FlagsCarousel flags={flags} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
