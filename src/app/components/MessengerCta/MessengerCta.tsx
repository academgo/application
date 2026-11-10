"use client";

import React from "react";
import Link from "next/link";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { trackLead } from "@/lib/trackLead";
import styles from "./MessengerCta.module.scss";

/** Какие кнопки показывает плашка */
export type MessengerCtaMode = "telegram" | "whatsapp" | "both";

export type MessengerCtaChannel = "telegram" | "whatsapp" | "none";

export type MessengerCtaContent = {
  eyebrow?: string;
  title?: string;
  description?: string;
  mode?: MessengerCtaMode;
  telegramLabel?: string;
  telegramLink?: string;
  whatsappLabel?: string;
  whatsappLink?: string;
  note?: string;
  showSocials?: boolean;
};

type Props = {
  lang: string;
  content: MessengerCtaContent;
  /** Готовый ряд иконок соцсетей, собранный на сервере */
  socials?: React.ReactNode;
  /** Ссылки из контактов футера — если в самом блоке свои не заданы */
  fallbackMessengers?: { telegram?: string; whatsapp?: string };
  /** Подстановка в тексты: страна, число и прочее */
  transformText?: (text: string) => string;
  /** Что сделать по клику до перехода в мессенджер */
  onChannelClick?: (channel: MessengerCtaChannel) => void;
  /** Источник для счётчика конверсии, если своего обработчика нет */
  trackAs?: string;
  /** Строка про согласие нужна только там, где что-то действительно уходит */
  showPolicy?: boolean;
  /** Запасная кнопка ведёт сюда, если ни одной ссылки на мессенджер нет */
  fallbackHref?: string;
};

// Запасной адрес, пока поле «Ссылка на Telegram» не заполнено в админке.
// Заполненное поле его перебивает — менять адрес в коде не нужно
export const DEFAULT_TELEGRAM = "https://t.me/infoacademgo";

const fallbackTexts = (lang: string) =>
  lang === "en"
    ? {
        telegram: "Message us on Telegram",
        whatsapp: "Message us on WhatsApp",
        policyPrefix: "By clicking the button you agree to the",
        policyLink: "Privacy Policy"
      }
    : {
        telegram: "Написать в Telegram",
        whatsapp: "Написать в WhatsApp",
        policyPrefix: "Нажимая кнопку, вы соглашаетесь с",
        policyLink: "политикой конфиденциальности"
      };

const MessengerCta: React.FC<Props> = ({
  lang,
  content,
  socials,
  fallbackMessengers,
  transformText,
  onChannelClick,
  trackAs,
  showPolicy = false
}) => {
  const texts = fallbackTexts(lang);
  const fill = (text?: string) =>
    transformText ? transformText(text || "") : text || "";

  const mode = content.mode || "telegram";
  // Телеграм футера — это приглашение в канал, а кнопке после анкеты нужен
  // аккаунт, который отвечает. Поэтому здесь либо поле из админки, либо адрес
  // по умолчанию; футер подставляется только для WhatsApp
  const telegramHref = content.telegramLink || DEFAULT_TELEGRAM;
  const whatsappHref =
    content.whatsappLink || fallbackMessengers?.whatsapp || "";

  const showTelegram = mode === "telegram" || mode === "both";
  const showWhatsapp =
    (mode === "whatsapp" || mode === "both") && Boolean(whatsappHref);

  // Волна всегда идёт ровно у одной кнопки — главной. Два набора волн дерутся
  // за взгляд, а ноль волн выглядит как сломанная анимация
  const pulseOnTelegram = showTelegram;
  const pulseOnWhatsapp = showWhatsapp && !showTelegram;

  const handleClick = (channel: MessengerCtaChannel) => {
    if (onChannelClick) {
      onChannelClick(channel);
      return;
    }

    if (trackAs) trackLead(trackAs, lang);
  };

  const waves = (
    <>
      <span aria-hidden="true" className={styles.pulse} />
      <span
        aria-hidden="true"
        className={`${styles.pulse} ${styles.pulseLate}`}
      />
    </>
  );

  return (
    <div className={styles.card}>
      {fill(content.eyebrow) && (
        <p className={styles.eyebrow}>{fill(content.eyebrow)}</p>
      )}

      {fill(content.title) && (
        <h3 className={styles.title}>{fill(content.title)}</h3>
      )}

      {fill(content.description) && (
        <p className={styles.description}>{fill(content.description)}</p>
      )}

      <div className={styles.actions}>
        {showTelegram && (
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.messengerBtn} ${styles.messengerTelegram}`}
            onClick={() => handleClick("telegram")}
          >
            {pulseOnTelegram && waves}
            <FaTelegramPlane
              aria-hidden="true"
              className={styles.messengerIcon}
            />
            <span className={styles.messengerLabel}>
              {fill(content.telegramLabel) || texts.telegram}
            </span>
          </a>
        )}

        {showWhatsapp && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.messengerBtn} ${styles.messengerWhatsapp}`}
            onClick={() => handleClick("whatsapp")}
          >
            {pulseOnWhatsapp && waves}
            <FaWhatsapp aria-hidden="true" className={styles.messengerIcon} />
            <span className={styles.messengerLabel}>
              {fill(content.whatsappLabel) || texts.whatsapp}
            </span>
          </a>
        )}
      </div>

      {fill(content.note) && (
        <p className={styles.note}>{fill(content.note)}</p>
      )}

      {showPolicy && (
        <p className={styles.policy}>
          {texts.policyPrefix}{" "}
          <Link
            className={styles.policyLink}
            href={
              lang === "en"
                ? "/privacy-policy"
                : "/ru/politika-konfidencialnosti"
            }
            target="_blank"
          >
            {texts.policyLink}
          </Link>
        </p>
      )}

      {content.showSocials !== false && socials}
    </div>
  );
};

export default MessengerCta;
