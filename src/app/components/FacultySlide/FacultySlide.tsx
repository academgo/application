import { List as ListType } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./FacultySlide.module.scss";
import Link from "next/link";

type Props = {
  facultyName: string;
  facultyDescription: string;
  specialtiesTitle: string;
  specialties?: ListType[]; // Сделаем это поле необязательным
  semesters: string;
  cost: string;
  universitiesTitle: string;
  universities?: ListType[]; // Сделаем это поле необязательным
  linkLabel: string;
  linkDestination: string;
  hasBorder: boolean;
};

const FacultySlide: FC<Props> = ({
  facultyName,
  facultyDescription,
  specialtiesTitle,
  specialties = [], // Значение по умолчанию
  semesters,
  cost,
  universitiesTitle,
  universities = [], // Значение по умолчанию
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
        {facultyName && <p className={styles.title}>{facultyName}</p>}
        {facultyDescription && (
          <p className={styles.text}>{facultyDescription}</p>
        )}
        {specialtiesTitle && specialties.length > 0 && (
          <div className={styles.specialties}>
            <p className={styles.subtitle}>{specialtiesTitle}</p>
            <ul className={styles.list}>
              {specialties.map((specialty, index) => (
                <li key={index} className={styles.listItem}>
                  {specialty.title}
                </li>
              ))}
            </ul>
          </div>
        )}
        {semesters && <p className={styles.textMark}>{semesters}</p>}
        {cost && <p className={styles.textMark}>{cost}</p>}
        {universitiesTitle && universities.length > 0 && (
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
  );
};

export default FacultySlide;
