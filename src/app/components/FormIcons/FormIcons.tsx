import React, { FC, SVGProps } from "react";
import styles from "./FormIcons.module.scss";

/**
 * Иконки полей форм: одна линейная стилистика, 24×24, цвет — currentColor.
 * FieldIcon ставит иконку в начало поля; сами отступы полей — в
 * FormStandard.module.scss (--field-icon-left / --field-text-left).
 */

type IconProps = SVGProps<SVGSVGElement>;

const Base: FC<IconProps> = ({ children, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const PhoneIcon: FC<IconProps> = props => (
  <Base {...props}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </Base>
);

export const GlobeIcon: FC<IconProps> = props => (
  <Base {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Base>
);

export const MailIcon: FC<IconProps> = props => (
  <Base {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </Base>
);

export const UserIcon: FC<IconProps> = props => (
  <Base {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Base>
);

export const CapIcon: FC<IconProps> = props => (
  <Base {...props}>
    <path d="M22 10 12 5 2 10l10 5 10-5z" />
    <path d="M6 12v5c3 2 9 2 12 0v-5" />
    <path d="M22 10v6" />
  </Base>
);

export const ChevronIcon: FC<IconProps> = props => (
  <Base strokeWidth="2" {...props}>
    <path d="m6 9 6 6 6-6" />
  </Base>
);

export const CheckIcon: FC<IconProps> = props => (
  <Base strokeWidth="2.2" {...props}>
    <path d="M20 6 9 17l-5-5" />
  </Base>
);

const ICONS = {
  phone: PhoneIcon,
  globe: GlobeIcon,
  mail: MailIcon,
  user: UserIcon,
  cap: CapIcon
};

/** Иконка в начале поля — поверх инпута, не перехватывает клики */
export const FieldIcon: FC<{ name: keyof typeof ICONS }> = ({ name }) => {
  const Icon = ICONS[name];
  return (
    <span className={styles.fieldIcon}>
      <Icon />
    </span>
  );
};

/**
 * Иконка вместо «глобуса» в поле телефона (react-phone-number-input):
 * пока код страны не выбран, там стоит трубка; выбран — флаг страны
 */
export const PhoneInternationalIcon: FC<{ title?: string }> = ({ title }) => (
  <span className={styles.phoneIcon} title={title}>
    <PhoneIcon />
  </span>
);
