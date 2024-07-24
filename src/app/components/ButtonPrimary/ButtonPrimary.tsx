import React from "react";
import styles from "./ButtonPrimary.module.scss";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const ButtonPrimary = ({ children, onClick, disabled, className }: Props) => {
  return (
    <button
      className={`${styles.buttonPrimary} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
