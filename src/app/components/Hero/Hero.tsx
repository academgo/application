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
                <p className={styles.mainHeading}>
                  {mainHeadingStart}{" "}
                  <span className={styles.highlight}>
                    {mainHeadingHighlight}
                    <span className={styles.tooltip}>{tooltip}</span>
                  </span>{" "}
                  {mainHeadingContinue}{" "}
                  <PL title="Poland" className={styles.flagIcon} />{" "}
                  {mainHeadingEnd}{" "}
                </p>
              </div>
              <div className={styles.descriptionBlock}>
                {description && (
                  <p className={styles.description}>{description}</p>
                )}
                {descriptionSmall && (
                  <p className={styles.descriptionSmall}>{descriptionSmall}</p>
                )}
              </div>
              <div className={styles.buttonBlock}>
                <ButtonModal>{heroButtonText}</ButtonModal>
              </div>
            </div>
          </div>
          <div className={styles.flexChild}>
            {heroImage && (
              <div className={styles.imageWrapper}>
                <Image
                  alt={description}
                  src={urlFor(heroImage).url()}
                  width={850}
                  height={700}
                  sizes="(max-width: 768px) 100vw, 850px"
                  className={styles.heroImage}
                />
              </div>
            )}
            <div className={styles.flagsBlock}>
              {heroDescription && (
                <p className={styles.heroDescription}>{heroDescription}</p>
              )}
              {heroTitle && <h2 className={styles.heroTitle}>{heroTitle}</h2>}
              <FlagsCarousel flags={flags} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
