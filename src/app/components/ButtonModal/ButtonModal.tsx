"use client";
import React from "react";
import styles from "./ButtonModal.module.scss";
import { useModal } from "@/app/context/ModalContext";
import { loadModalFull } from "../ModalFull/loadModalFull";

type Props = {
  children: React.ReactNode;
  /** Свой класс кнопки: блок «Направления» рисует её по-своему.
      Без него — обычный оранжевый вид по умолчанию */
  className?: string;
};

export const ButtonModal = ({ children, className }: Props) => {
  const { openModal } = useModal(); // Используйте хук useModal для открытия модального окна

  return (
    <button
      type="button"
      className={className || styles.buttonModal}
      onClick={openModal}
      onMouseEnter={loadModalFull}
      onFocus={loadModalFull}
      onTouchStart={loadModalFull}
    >
      {children}
    </button>
  );
};
