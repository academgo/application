import { SliderList } from "@/types/blog";
import { Image as ImageProp } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./SlideFull.module.scss";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  image?: ImageProp;
  title: string;
  description: string;
  subTitle: string;
  sliderList: SliderList[];
  semesters: string;
  cost: string;
  universitiesTitle?: string;
  universities?: SliderList[];
  linkLabel: string;
  linkDestination: string;
  hasBorder: boolean;
};

const SlideFull: FC<Props> = ({
  image,
  title,
  description,
  subTitle,
  sliderList,
  semesters,
  cost,
  universitiesTitle,
  universities,
  linkLabel,
  linkDestination,
  hasBorder
}) => {
  return (
    <div
      className={styles.slideWrapper}
      style={{
        border: hasBorder ? "3px solid #1A2644" : "none",
        backgroundColor: hasBorder ? "" : "#fff"
      }}
    >
      <div className={styles.slideImage}>
        {image && (
          <Image
            alt={title}
            src={urlFor(image).url()}
            fill={true}
            className={styles.image}
          />
        )}
      </div>

      <div className={styles.slideFull}>
        <div className={styles.textBlock}>
          {title && <p className={styles.title}>{title}</p>}
          {description && <p className={styles.text}>{description}</p>}
          {subTitle && subTitle.length > 0 && (
            <div className={styles.specialties}>
              <p className={styles.subtitle}>{subTitle}</p>
              <ul className={styles.list}>
                {sliderList.map((specialty, index) => (
                  <li key={index} className={styles.listItem}>
                    {specialty.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {semesters && <p className={styles.textMark}>{semesters}</p>}
          {cost && <p className={styles.textMark}>{cost}</p>}
          {universitiesTitle && universities && universities.length > 0 && (
            <div className={styles.universities}>
              <p className={styles.subtitle}>{universitiesTitle}</p>
              <ul className={styles.list}>
                {universities.map((university, index) => (
                  <li key={index} className={styles.listItem}>
                    {university.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className={styles.buttonBlock}>
          {linkLabel && linkDestination && (
            <Link href={linkDestination} className={styles.button}>
              {linkLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideFull;
