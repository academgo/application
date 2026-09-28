// Код попапа (react-modal, framer-motion, полная форма с libphonenumber)
// не нужен для первой отрисовки: грузится при первом открытии, а заранее —
// когда посетитель наводит курсор, фокусирует или касается кнопки.
export const loadModalFull = () => import("./ModalFull");
