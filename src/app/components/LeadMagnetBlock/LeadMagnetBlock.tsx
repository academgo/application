"use client";

import React, { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { trackLead } from "@/lib/trackLead";
import StudyCountryField from "../StudyCountryField/StudyCountryField";
import styles from "./LeadMagnetBlock.module.scss";
// форма собрана на стилях обычных форм сайта, чтобы выглядеть одинаково
import formStyles from "../FormStandard/FormStandard.module.scss";

export type LeadMagnetBlockType = {
  _key: string;
  _type: "leadMagnetBlock";
  title?: string;
  description?: string;
  bullets?: string[];
  magnetName?: string;
  formTitle?: string;
  nameLabel?: string;
  emailLabel?: string;
  buttonText?: string;
  policyText?: string;
  successText?: string;
  errorText?: string;
  fileUrl?: string;
  coverUrl?: string;
};

type Policy = {
  text?: string;
  linkLabel?: string;
  linkDestination?: string;
};

type Props = {
  block: LeadMagnetBlockType;
  lang: string;
  /** согласие берём из общего документа форм, как во всех формах сайта */
  policy?: Policy;
};

const LeadMagnetBlock: FC<Props> = ({ block, lang, policy }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studyCountry, setStudyCountry] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  const isEnglish = lang === "en";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!agreed || status === "sending") return;

    setStatus("sending");

    // Вкладку открываем сразу по клику: после await её съедает блокировщик
    const fileWindow =
      block.fileUrl && typeof window !== "undefined"
        ? window.open("", "_blank")
        : null;

    if (fileWindow) fileWindow.opener = null;

    try {
      await axios.post("/api/lead-magnet", {
        email,
        name,
        magnet: block.magnetName || block.title,
        lang,
        studyCountry,
        url: typeof window !== "undefined" ? window.location.href : ""
      });

      trackLead("lead-magnet", lang, studyCountry);
      setStatus("done");

      if (block.fileUrl && fileWindow) {
        fileWindow.location.href = block.fileUrl;
      }
    } catch {
      fileWindow?.close();
      setStatus("error");
    }
  };

  return (
    <section className={styles.leadMagnet}>
      <div className={styles.content}>
        {block.title && <h2 className={styles.title}>{block.title}</h2>}
        {block.description && (
          <p className={styles.description}>{block.description}</p>
        )}
        {block.bullets && block.bullets.length > 0 && (
          <ul className={styles.bullets}>
            {block.bullets.map(bullet => (
              <li key={bullet}>
                <span className={styles.marker} aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
        {block.coverUrl && (
          <Image
            src={block.coverUrl}
            alt=""
            width={320}
            height={420}
            className={styles.cover}
          />
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {block.formTitle && (
          <p className={styles.formTitle}>{block.formTitle}</p>
        )}

        <div className={formStyles.inputWrapper}>
          <label
            htmlFor={`${block._key}-name`}
            className={`${formStyles.label} ${name ? formStyles.filled : ""}`}
          >
            {block.nameLabel || (isEnglish ? "Name" : "Имя")}
          </label>
          <input
            id={`${block._key}-name`}
            type="text"
            autoComplete="name"
            className={formStyles.inputField}
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </div>

        <div className={formStyles.inputWrapper}>
          <label
            htmlFor={`${block._key}-email`}
            className={`${formStyles.label} ${email ? formStyles.filled : ""}`}
          >
            {block.emailLabel || "E-mail"}
          </label>
          <input
            id={`${block._key}-email`}
            type="email"
            required
            autoComplete="email"
            className={formStyles.inputField}
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </div>

        <StudyCountryField
          id={`${block._key}-study-country`}
          lang={lang}
          value={studyCountry}
          onChange={setStudyCountry}
        />

        <button
          type="submit"
          className={formStyles.sentBtn}
          disabled={!agreed || status === "sending"}
        >
          {status === "sending"
            ? isEnglish
              ? "Sending…"
              : "Отправляем…"
            : block.buttonText ||
              (isEnglish ? "Get the file" : "Получить файл")}
        </button>

        <div className={formStyles.customCheckbox}>
          <input
            type="checkbox"
            id={`${block._key}-policy`}
            checked={agreed}
            onChange={event => setAgreed(event.target.checked)}
            required
          />
          <label htmlFor={`${block._key}-policy`}>
            {policy?.text ||
              block.policyText ||
              (isEnglish
                ? "I agree with the terms of the"
                : "Cогласен с условиями")}{" "}
            {policy?.linkLabel && policy?.linkDestination && (
              <Link
                href={policy.linkDestination}
                target="_blank"
                className={formStyles.policyLink}
              >
                {policy.linkLabel}
              </Link>
            )}
          </label>
        </div>

        {status === "done" && (
          <p className={styles.success}>
            {block.successText ||
              (isEnglish
                ? "Done — the file is opening in a new tab."
                : "Готово — файл открывается в новой вкладке.")}{" "}
            {block.fileUrl && (
              <a href={block.fileUrl} target="_blank" rel="noopener noreferrer">
                {isEnglish ? "Download again" : "Скачать ещё раз"}
              </a>
            )}
          </p>
        )}

        {status === "error" && (
          <p className={styles.error}>
            {block.errorText ||
              (isEnglish
                ? "Something went wrong. Please try again."
                : "Что-то пошло не так. Попробуйте ещё раз.")}
          </p>
        )}
      </form>
    </section>
  );
};

export default LeadMagnetBlock;
