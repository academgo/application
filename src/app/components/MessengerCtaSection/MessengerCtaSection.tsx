import React from "react";
import MessengerCta from "../MessengerCta/MessengerCta";
import QuizSocials, { getQuizMessengers } from "../QuizSocials/QuizSocials";
import { MessengerCtaDocument } from "@/types/homepage";
import {
  detectStudyDestinationCode,
  studyCountryName,
  studyCountryNameIn
} from "@/lib/studyDestination";
import styles from "./MessengerCtaSection.module.scss";

type Props = {
  lang: string;
  block?: MessengerCtaDocument | null;
  /** Адрес страницы — для подстановки страны в тексты */
  path?: string;
};

const countryFallback = (lang: string) =>
  lang === "en"
    ? { country: "your chosen country", countryIn: "your chosen country" }
    : { country: "выбранное направление", countryIn: "выбранную страну" };

/**
 * Самостоятельная секция с той же плашкой, что на финальном экране квиза.
 * Тексты и ссылки редактируются в документе «Плашка в мессенджер».
 */
const MessengerCtaSection = async ({ lang, block, path }: Props) => {
  if (!block) return null;

  const [messengers] = await Promise.all([getQuizMessengers(lang)]);

  const code = detectStudyDestinationCode(path);
  const fallback = countryFallback(lang);
  const nominative = studyCountryName(code, lang) || fallback.country;
  const inflected = studyCountryNameIn(code, lang) || fallback.countryIn;

  const fill = (text: string) =>
    text
      .replace(/\{countryIn\}/g, inflected)
      .replace(/\{country\}/g, nominative);

  return (
    <section className={styles.section}>
      <div className="container">
        <MessengerCta
          lang={lang}
          content={{
            eyebrow: block.eyebrow,
            title: block.heading,
            description: block.description,
            mode: block.mode,
            telegramLabel: block.telegramLabel,
            telegramLink: block.telegramLink,
            whatsappLabel: block.whatsappLabel,
            whatsappLink: block.whatsappLink,
            note: block.note,
            showSocials: block.showSocials
          }}
          socials={<QuizSocials lang={lang} />}
          fallbackMessengers={messengers}
          transformText={fill}
          trackAs="cta"
        />
      </div>
    </section>
  );
};

export default MessengerCtaSection;
