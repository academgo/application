"use client";
import React from "react";
import styles from "./ButtonModal.module.scss";
import { useModal } from "@/app/context/ModalContext";

type Props = {
  children: React.ReactNode;
};

export const ButtonModal = ({ children }: Props) => {
  const { openModal } = useModal(); // Используйте хук useModal для открытия модального окна

  return (
    <button className={styles.buttonModal} onClick={openModal}>
      {children}
    </button>
  );
};
