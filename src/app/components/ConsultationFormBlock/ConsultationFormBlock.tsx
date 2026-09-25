"use client";

import React, { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { urlFor } from "@/sanity/sanity.client";
import { trackLead } from "@/lib/trackLead";
import StudyCountryField from "../StudyCountryField/StudyCountryField";
import OfferDecor from "../OfferDecor/OfferDecor";
import styles from "./ConsultationFormBlock.module.scss";
// поля и кнопка — со стилей обычных форм сайта, как в лид-магните
import formStyles from "../FormStandard/FormStandard.module.scss";

export type ConsultationFormBlockType = {
  _key: string;
  _type: "consultationFormBlock";
  title?: string;
  titleHighlight?: string;
  description?: string;
  formTitle?: string;
  nameLabel?: string;
  phoneLabel?: string;
  buttonText?: string;
  successText?: string;
  errorText?: string;
  altText?: string;
  contactLinks?: {
    _key: string;
    title?: string;
    link?: string;
    icon?: any;
  }[];
};

type Policy = {
  text?: string;
  linkLabel?: string;
  linkDestination?: string;
};

type Props = {
  block: ConsultationFormBlockType;
  lang: string;
  /** согласие берём из общего документа форм, как во всех формах сайта */
  policy?: Policy;
};

const ConsultationFormBlock: FC<Props> = ({ block, lang, policy }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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

    try {
      await axios.post("/api/email", {
        name,
        phone,
        lang,
        studyCountry,
        url: typeof window !== "undefined" ? window.location.href : ""
      });

      trackLead("consultation-form", lang, studyCountry);
      setStatus("done");
      setName("");
      setPhone("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className={styles.consultation}>
      <OfferDecor className={styles.decor} />

      <div className={styles.content}>
        {block.title && (
          <h2 className={styles.title}>
            {block.title}{" "}
            {block.titleHighlight && (
              <span className={styles.highlight}>{block.titleHighlight}</span>
            )}
          </h2>
        )}
        {block.description && (
          <p className={styles.description}>{block.description}</p>
        )}

        {block.contactLinks && block.contactLinks.length > 0 && (
          <div className={styles.messengers}>
            {block.altText && <p className={styles.altText}>{block.altText}</p>}
            <div className={styles.links}>
              {block.contactLinks.map(link =>
                link.link && link.icon ? (
                  <Link
                    key={link._key}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.title}
                  >
                    <Image
                      src={urlFor(link.icon).url()}
                      alt={link.title || ""}
                      width={56}
                      height={56}
                      className={styles.icon}
                    />
                  </Link>
                ) : null
              )}
            </div>
          </div>
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
            required
            autoComplete="name"
            className={formStyles.inputField}
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </div>

        <div className={formStyles.inputWrapper}>
          <label
            htmlFor={`${block._key}-phone`}
            className={`${formStyles.label} ${phone ? formStyles.filled : ""}`}
          >
            {block.phoneLabel ||
              (isEnglish ? "Phone or WhatsApp" : "Телефон или WhatsApp")}
          </label>
          <input
            id={`${block._key}-phone`}
            type="tel"
            required
            autoComplete="tel"
            className={formStyles.inputField}
            value={phone}
            onChange={event => setPhone(event.target.value)}
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
              (isEnglish ? "Send a request" : "Оставить заявку")}
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
                ? "Thank you! We will contact you soon."
                : "Спасибо! Скоро свяжемся с вами.")}
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

export default ConsultationFormBlock;
