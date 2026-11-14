import styles from "./Hero.module.scss";
import React, { FC } from "react";
import { Image as ImageType, Flag, HeroStat, HeroVideo } from "@/types/homepage";
import FlagsCarousel from "../FlagsCarousel/FlagsCarousel";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { ButtonModal } from "../ButtonModal/ButtonModal";
import HeroVideoButton from "../HeroVideoButton/HeroVideoButton";

/**
 * Разбивает строку на буквы для набора заголовка. Серверный рендер: в HTML
 * уходит весь текст, анимацией занимается только CSS по номеру буквы.
 * Пробелы оставляем обычными текстовыми узлами — в span они становятся
 * неразрывными и заголовок перестаёт переноситься по строкам.
 */
const splitChars = (
  text: string,
  start: number,
  extraClass?: string
): { nodes: React.ReactNode[]; next: number } => {
  const nodes: React.ReactNode[] = [];
  let index = start;

  for (const char of Array.from(text)) {
    if (char === " ") {
      nodes.push(" ");
      index += 1;
      continue;
    }

    nodes.push(
      <span
        key={index}
        className={`${styles.char} ${extraClass || ""}`}
        style={{ "--i": index } as React.CSSProperties}
      >
        {char}
      </span>
    );
    index += 1;
  }

  return { nodes, next: index };
};

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
  // Заголовок набирается по буквам: нумерация сквозная через все куски,
  // иначе выделенное слово начало бы печататься заново
  const headingStart = splitChars(`${mainHeadingStart} `, 0);
  const headingHighlight = splitChars(
    mainHeadingHighlight,
    headingStart.next,
    styles.charHighlight
  );
  const headingRest = splitChars(
    ` ${mainHeadingContinue} ${mainHeadingEnd}`,
    headingHighlight.next
  );

  const videoButtonText =
    heroVideo?.buttonText || (lang === "ru" ? "Как мы работаем" : "How we work");

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.content}>
            <div className={styles.contentTop}>
              {description && <p className={styles.eyebrow}>{description}</p>}

              <p className={styles.mainHeading}>
                {headingStart.nodes}
                <span className={styles.highlight}>
                  {headingHighlight.nodes}
                  <span className={styles.tooltip}>{tooltip}</span>
                </span>
                {headingRest.nodes}
                <span
                  className={styles.caret}
                  style={
                    { "--total": headingRest.next } as React.CSSProperties
                  }
                  aria-hidden="true"
                />
              </p>

              {descriptionSmall && (
                <p className={styles.lead}>{descriptionSmall}</p>
              )}
            </div>

            <div className={styles.contentBottom}>
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
