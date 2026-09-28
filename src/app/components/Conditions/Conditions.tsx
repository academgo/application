import { Condition } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./Conditions.module.scss";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

type Props = {
  mainHeadingH1: string;
  mainHeadingH1Highlight: string;
  conditionsTitle: string;
  conditionFirst: Condition;
  conditionSecond: Condition;
  conditionThird: Condition;
  conditionFourth: Condition;
};

const Conditions: FC<Props> = ({
  mainHeadingH1,
  mainHeadingH1Highlight,
  conditionsTitle,
  conditionFirst,
  conditionSecond,
  conditionThird,
  conditionFourth
}) => {
  return (
    <section className={styles.conditions}>
      <div className="container">
        <h1 className={styles.mainHeadingH1}>
          {mainHeadingH1}
          {mainHeadingH1Highlight && (
            <span className={styles.mainHeadingH1Highlight}>
              &nbsp;
              {mainHeadingH1Highlight}
            </span>
          )}
        </h1>
        <h2 className={styles.conditionsTitle}>{conditionsTitle}</h2>
        <div className={styles.conditionsGrid}>
          <div className={`${styles.condition} ${styles.conditionFirst}`}>
            <Image
              alt={conditionSecond.title}
              src={urlFor(conditionFirst.image).url()}
              width={550}
              height={550}
              className={styles.posterImage}
            />
            <div className={styles.conditionFirstContent}>
              <p className={styles.conditionTitle}>{conditionFirst.title}</p>
              <p className={styles.conditionDescription}>
                {conditionFirst.description}
              </p>
            </div>
          </div>
          <div className={`${styles.condition} ${styles.conditionSecond}`}>
            <div className={styles.conditionOverlay}></div>
            {conditionSecond.image && (
              <div className={styles.imageWrapper}>
                <Image
                  alt={conditionSecond.title}
                  src={urlFor(conditionSecond.image).url()}
                  fill={true}
                  className={styles.bgImage}
                />
              </div>
            )}
            <p className={styles.conditionTitle}>{conditionSecond.title}</p>
            <p className={styles.conditionDescription}>
              {conditionSecond.description}
            </p>
          </div>
          <div className={`${styles.condition} ${styles.conditionThird}`}>
            <div className={styles.conditionThidrContent}>
              <p className={styles.conditionTitle}>{conditionThird.title}</p>
              <p className={styles.conditionDescription}>
                {conditionThird.description}
              </p>
            </div>
          </div>
          <div className={`${styles.condition} ${styles.conditionFourth}`}>
            <img
              src="/decor/6dad325294.svg"
              alt=""
              aria-hidden="true"
              className={styles.decorMobile}
              width={276}
              height={254}
              loading="lazy"
              decoding="async"
            />
            <img
              src="/decor/8e9b844499.svg"
              alt=""
              aria-hidden="true"
              className={styles.decor}
              width={570}
              height={291}
              loading="lazy"
              decoding="async"
            />
            {conditionFourth.image && (
              <Image
                alt={conditionFourth.title}
                src={urlFor(conditionFourth.image).url()}
                width={400}
                height={400}
                className={styles.posterImage}
              />
            )}
            <div className={styles.conditionFourthContent}>
              <p className={styles.conditionTitle}>{conditionFourth.title}</p>
              <p className={styles.conditionDescription}>
                {conditionFourth.description}
              </p>
              {conditionFourth.linkDestination && conditionFourth.linkLabel && (
                <Link
                  href={conditionFourth.linkDestination}
                  className={styles.conditionLink}
                >
                  {conditionFourth.linkLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Conditions;
