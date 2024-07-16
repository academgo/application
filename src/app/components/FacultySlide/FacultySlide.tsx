import { List as ListType } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./FacultySlide.module.scss";
import Link from "next/link";

type Props = {
  facultyName: string;
  facultyDescription: string;
  specialtiesTitle: string;
  specialties: ListType[];
  semesters: string;
  cost: string;
  universitiesTitle: string;
  universities: ListType[];
  linkLabel: string;
  linkDestination: string;
  hasBorder: boolean;
};

const FacultySlide: FC<Props> = ({
  facultyName,
  facultyDescription,
  specialtiesTitle,
  specialties,
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
      className={styles.facultySlide}
      style={{
        border: hasBorder ? "3px solid #1A2644" : "none",
        backgroundColor: hasBorder ? "" : "#fff"
      }}
    >
      <div className={styles.textBlock}>
        <h3 className={styles.title}>{facultyName}</h3>
        <p className={styles.text}>{facultyDescription}</p>
        <div className={styles.specialties}>
          <h4 className={styles.subtitle}>{specialtiesTitle}</h4>
          <ul className={styles.list}>
            {specialties.map((specialty, index) => (
              <li key={index} className={styles.listItem}>
                {specialty.title}
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.textMark}>{semesters}</p>
        <p className={styles.textMark}>{cost}</p>
        <div className={styles.universities}>
          <h4 className={styles.subtitle}>{universitiesTitle}</h4>
          <ul className={styles.list}>
            {universities.map((university, index) => (
              <li key={index} className={styles.listItem}>
                {university.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.buttonBlock}>
        <Link href={linkDestination} className={styles.button}>
          {linkLabel}
        </Link>
      </div>
    </div>
  );
};

export default FacultySlide;
