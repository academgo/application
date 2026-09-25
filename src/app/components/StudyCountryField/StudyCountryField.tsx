"use client";

import { FC, useEffect, useState } from "react";
import {
  STUDY_COUNTRIES,
  UNDECIDED_STUDY_COUNTRY,
  detectStudyDestinationCode
} from "@/lib/studyDestination";
import styles from "./StudyCountryField.module.scss";

type Props = {
  id: string;
  lang: string;
  value: string;
  onChange: (code: string) => void;
  error?: string;
};

/**
 * Поле «Страна обучения». На странице страны его не видно — страна берётся
 * из адреса. На главной, в контактах, блоге и других общих страницах человек
 * выбирает её сам, чтобы заявка пришла уже с направлением.
 */
const StudyCountryField: FC<Props> = ({ id, lang, value, onChange, error }) => {
  // До гидрации не знаем адрес — поле не рисуем, чтобы не мигало
  const [mode, setMode] = useState<"pending" | "auto" | "select">("pending");
  const isEnglish = lang === "en";

  useEffect(() => {
    const code = detectStudyDestinationCode(window.location.href);
    if (code) {
      onChange(code);
      setMode("auto");
    } else {
      setMode("select");
    }
    // onChange меняется на каждом рендере формы — определяем страну один раз
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mode !== "select") return null;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.visuallyHidden}>
        {isEnglish ? "Country of study" : "Страна обучения"}
      </label>
      <select
        id={id}
        name="studyCountry"
        required
        value={value}
        onChange={event => onChange(event.target.value)}
        className={`${styles.select} ${value ? "" : styles.placeholder}`}
      >
        <option value="" disabled>
          {isEnglish ? "Country of study" : "Страна обучения"}
        </option>
        {STUDY_COUNTRIES.map(country => (
          <option key={country.code} value={country.code}>
            {isEnglish ? country.en : country.ru}
          </option>
        ))}
        <option value={UNDECIDED_STUDY_COUNTRY}>
          {isEnglish ? "Not decided yet" : "Пока не решил(а)"}
        </option>
      </select>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default StudyCountryField;
