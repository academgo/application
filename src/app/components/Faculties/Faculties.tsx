import React, { FC } from "react";
import styles from "./Faculties.module.scss";
import { Faculty } from "@/types/homepage";
import SliderMain from "../SliderMain/SliderMain";
import FacultySlide from "../FacultySlide/FacultySlide";
import { Form } from "@/types/form";

type Props = {
  facultiesTitle: string;
  faculties: Faculty[];
  lastSlideTitleHighlight: string;
  lastSlideTitle: string;
  lastSlideDescription: string;
  form: Form;
};

const Faculties: FC<Props> = ({
  facultiesTitle,
  faculties,
  lastSlideTitleHighlight,
  lastSlideTitle,
  lastSlideDescription,
  form
}) => {
  return (
    <section className={styles.faculties} id="faculties">
      <div className="container">
        <h2 className={styles.title}>{facultiesTitle}</h2>
        <SliderMain
          className={styles.videosSlider}
          lastSlideTitleHighlight={lastSlideTitleHighlight}
          lastSlideTitle={lastSlideTitle}
          lastSlideDescription={lastSlideDescription}
          form={form}
        >
          {faculties.map((faculty, index) => (
            <FacultySlide
              key={index}
              facultyName={faculty.facultyName}
              facultyDescription={faculty.facultyDescription}
              specialtiesTitle={faculty.specialtiesTitle}
              specialties={faculty.specialties}
              semesters={faculty.semesters}
              cost={faculty.cost}
              universitiesTitle={faculty.universitiesTitle}
              universities={faculty.universities}
              linkLabel={faculty.linkLabel}
              linkDestination={faculty.linkDestination}
              hasBorder={faculty.hasBorder}
            />
          ))}
        </SliderMain>
      </div>
    </section>
  );
};

export default Faculties;
