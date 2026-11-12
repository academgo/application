import styles from "./Hero.module.scss";
import React, { FC } from "react";
import { Image as ImageType, Flag, HeroStat, HeroVideo } from "@/types/homepage";
import FlagsCarousel from "../FlagsCarousel/FlagsCarousel";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { ButtonModal } from "../ButtonModal/ButtonModal";
import HeroVideoButton from "../HeroVideoButton/HeroVideoButton";

type Props = {
  lang: string;
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
  heroStats?: HeroStat[];
  heroVideo?: HeroVideo;
};

const Hero: FC<Props> = ({
  lang,
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
  heroTitle,
  heroStats,
  heroVideo
}) => {
  const hasStats = Boolean(heroStats && heroStats.length);
  const hasVideo = Boolean(heroVideo && heroVideo.videoId);
  const videoButtonText =
    heroVideo?.buttonText || (lang === "ru" ? "Как мы работаем" : "How we work");

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.content}>
            {description && <p className={styles.eyebrow}>{description}</p>}

            <p className={styles.mainHeading}>
              {mainHeadingStart}{" "}
              <span className={styles.highlight}>
                {mainHeadingHighlight}
                <span className={styles.tooltip}>{tooltip}</span>
              </span>{" "}
              {mainHeadingContinue} {mainHeadingEnd}
            </p>

            {descriptionSmall && (
              <p className={styles.lead}>{descriptionSmall}</p>
            )}

            <div className={styles.actions}>
              <ButtonModal>{heroButtonText}</ButtonModal>
              {hasVideo && (
                <HeroVideoButton
                  videoId={heroVideo!.videoId!}
                  startSeconds={heroVideo?.startSeconds}
                  title={heroVideo?.title || videoButtonText}
                >
                  {videoButtonText}
                </HeroVideoButton>
              )}
            </div>

            {hasStats && (
              <dl className={styles.stats}>
                {heroStats!.map(stat => (
                  <div key={stat._key} className={styles.stat}>
                    <dt className={styles.statValue}>{stat.value}</dt>
                    <dd className={styles.statLabel}>{stat.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className={styles.media}>
            {heroImage && (
              <div className={styles.imageWrapper}>
                <Image
                  alt={description}
                  src={urlFor(heroImage).url()}
                  width={850}
                  height={700}
                  sizes="(max-width: 768px) 100vw, 850px"
                  // LCP на мобильном: грузится сразу и с высоким приоритетом
                  preload
                  fetchPriority="high"
                  className={styles.heroImage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.flagsStrip}>
        <div className="container">
          <div className={styles.flagsInner}>
            <div className={styles.flagsLabel}>
              {heroTitle && <p className={styles.flagsTitle}>{heroTitle}</p>}
              {heroDescription && (
                <p className={styles.flagsHint}>{heroDescription}</p>
              )}
            </div>
            <div className={styles.flagsTrack}>
              <FlagsCarousel flags={flags} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
