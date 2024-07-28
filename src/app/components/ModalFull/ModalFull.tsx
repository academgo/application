"use client";
import React from "react";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ModalFull.module.scss";
import { useModal } from "@/app/context/ModalContext";
import { FormStandardDocument } from "@/types/formStandardDocument";
import FormStandard from "../FormStandard/FormStandard";

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
};

const ModalFull = ({ lang, formDocument }: Props) => {
  const { isModalOpen, closeModal } = useModal(); // Используйте хук useModal для управления состоянием модального окна

  // console.log("formDocument", formDocument);
  return (
    <AnimatePresence>
      <Modal
        closeTimeoutMS={50}
        isOpen={isModalOpen} // Состояние открытия модального окна
        onRequestClose={closeModal} // Функция для закрытия модального окна
        ariaHideApp={false}
        style={customStyles}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
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
          </div>
        </motion.div>
      </Modal>
    </AnimatePresence>
  );
};

export default ModalFull;
