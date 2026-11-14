"use client";

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ModalFull.module.scss";
import { useModal } from "@/app/context/ModalContext";
import { FormStandardDocument } from "@/types/formStandardDocument";
import { MessengerCtaDocument } from "@/types/homepage";
import MessengerCta from "../MessengerCta/MessengerCta";
import {
  detectStudyDestinationCode,
  studyCountryName,
  studyCountryNameIn
} from "@/lib/studyDestination";
// Старая форма заявки. Оставлена специально: если плашка мессенджеров не
// подойдёт, достаточно вернуть разметку из комментария ниже.
// import FormStandard from "../FormStandard/FormStandard";

const customStyles: ReactModal.Styles = {
  overlay: {
    backgroundColor: "rgba(20, 50, 88, 0.7)",
    zIndex: 999
  },
  content: {
    position: "absolute",
    backgroundColor: "rgba(20, 50, 88, 0.7)",
    padding: "20px",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    inset: "0"
  }
};

type Props = {
  lang: string;
  formDocument: FormStandardDocument;
  /** Плашка в мессенджер — та же, что над футером */
  ctaBlock?: MessengerCtaDocument | null;
};

/** Запасные тексты: попап не должен остаться пустым, если документ не заполнен */
const fallback = (lang: string) =>
  lang === "en"
    ? {
        eyebrow: "Free consultation",
        title: "Still have questions? Message us",
        description:
          "We will help you pick a university and a programme, and walk you through documents and the visa.",
        note: "We reply within one working day",
        country: "your chosen country",
        countryIn: "your chosen country"
      }
    : {
        eyebrow: "Бесплатная консультация",
        title: "Остались вопросы? Напишите нам",
        description:
          "Подберём университет и специальность, расскажем про документы и визу. Отвечаем в мессенджере — без звонков и анкет.",
        note: "Отвечаем в течение рабочего дня",
        country: "выбранное направление",
        countryIn: "выбранную страну"
      };

const ModalFull = ({ lang, ctaBlock }: Props) => {
  const { isModalOpen, closeModal } = useModal();
  const [pageCountryCode, setPageCountryCode] = useState<string | undefined>();

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isModalOpen]);

  // Страна страницы для подстановки в тексты — как на финальном экране квиза
  useEffect(() => {
    setPageCountryCode(detectStudyDestinationCode(window.location.href));
  }, []);

  const texts = fallback(lang);

  const fill = (text?: string) => {
    if (!text) return "";

    const nominative = studyCountryName(pageCountryCode, lang) || texts.country;
    const inflected =
      studyCountryNameIn(pageCountryCode, lang) || texts.countryIn;

    return text
      .replace(/\{countryIn\}/g, inflected)
      .replace(/\{country\}/g, nominative);
  };

  return (
    <AnimatePresence>
      <Modal
        closeTimeoutMS={50}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.ctaPopup}>
            {/* Соцсети в попапе не выводим: socials не передаём,
                showSocials выключен принудительно */}
            <MessengerCta
              lang={lang}
              content={{
                eyebrow: ctaBlock?.eyebrow || texts.eyebrow,
                title: ctaBlock?.heading || texts.title,
                description: ctaBlock?.description || texts.description,
                mode: ctaBlock?.mode,
                telegramLabel: ctaBlock?.telegramLabel,
                telegramLink: ctaBlock?.telegramLink,
                whatsappLabel: ctaBlock?.whatsappLabel,
                whatsappLink: ctaBlock?.whatsappLink,
                note: ctaBlock?.note || texts.note,
                showSocials: false
              }}
              transformText={fill}
              trackAs="cta"
            />

            <button className={styles.closeButton} onClick={closeModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="#BABABA"
              >
                <path
                  d="M15 1L1 15M1.00001 1L15 15"
                  stroke="#BABABA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/*
          Прежний попап с формой заявки. Не удалён намеренно — вернуть
          можно, раскомментировав этот блок, импорт FormStandard сверху
          и убрав плашку выше.

          <div className={styles.popupContent}>
            <div className={styles.popupContentWrapper}>
              <div className={styles.formContent}>
                <div className={styles.formText}>
                  <h3 className={styles.modalTitle}>
                    {lang === "ru"
                      ? "Укажите контакты для связи"
                      : "Please provide your contact details"}
                  </h3>
                  <p className={styles.modalText}>
                    {lang === "ru"
                      ? "Свяжемся с вами как можно скорее"
                      : "We will contact you as soon as possible"}
                  </p>
                </div>
                <div className={styles.formInner}>
                  <FormStandard form={formDocument} />
                </div>
              </div>
              <button className={styles.closeButton} onClick={closeModal}>
                ...
              </button>
            </div>
          </div>
          */}
        </motion.div>
      </Modal>
    </AnimatePresence>
  );
};

export default ModalFull;
