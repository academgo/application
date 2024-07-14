import { Condition } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./Conditions.module.scss";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  conditionsTitle: string;
  conditionFirst: Condition;
  conditionSecond: Condition;
  conditionThird: Condition;
  conditionFourth: Condition;
};

const Conditions: FC<Props> = ({
  conditionsTitle,
  conditionFirst,
  conditionSecond,
  conditionThird,
  conditionFourth
}) => {
  return (
    <section className={styles.conditions}>
      <div className="container">
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
              <h3 className={styles.conditionTitle}>{conditionFirst.title}</h3>
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
            <h3 className={styles.conditionTitle}>{conditionSecond.title}</h3>
            <p className={styles.conditionDescription}>
              {conditionSecond.description}
            </p>
          </div>
          <div className={`${styles.condition} ${styles.conditionThird}`}>
            <div className={styles.conditionThidrContent}>
              <h3 className={styles.conditionTitle}>{conditionThird.title}</h3>
              <p className={styles.conditionDescription}>
                {conditionThird.description}
              </p>
            </div>
          </div>
          <div className={`${styles.condition} ${styles.conditionFourth}`}>
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
              <h3 className={styles.conditionTitle}>{conditionFourth.title}</h3>
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
