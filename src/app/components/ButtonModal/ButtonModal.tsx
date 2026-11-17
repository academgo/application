"use client";
import React from "react";
import styles from "./ButtonModal.module.scss";
import { ModalVariant, useModal } from "@/app/context/ModalContext";
import { loadModalFull } from "../ModalFull/loadModalFull";

type Props = {
  children: React.ReactNode;
  /** Свой класс кнопки: блок «Направления» рисует её по-своему.
      Без него — обычный оранжевый вид по умолчанию */
  className?: string;
  /** Какой текст показать в окне. По умолчанию общая плашка */
  variant?: ModalVariant;
};

export const ButtonModal = ({ children, className, variant }: Props) => {
  const { openModal } = useModal(); // Используйте хук useModal для открытия модального окна

  return (
    <button
      type="button"
      className={className || styles.buttonModal}
      onClick={() => openModal(variant)}
      onMouseEnter={loadModalFull}
      onFocus={loadModalFull}
      onTouchStart={loadModalFull}
    >
      {children}
    </button>
  );
};
