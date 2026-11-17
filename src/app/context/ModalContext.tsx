"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * Какой текст показывать в попапе. default — общая плашка «Остались
 * вопросы», chances — текст кнопки «Оценить шансы» в шапке. Компонент
 * попапа один и тот же, меняются только тексты
 */
export type ModalVariant = "default" | "chances";

type ModalContextType = {
  isModalOpen: boolean;
  modalVariant: ModalVariant;
  openModal: (variant?: ModalVariant) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<ModalVariant>("default");

  const openModal = (variant: ModalVariant = "default") => {
    setModalVariant(variant);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider
      value={{ isModalOpen, modalVariant, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
