import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegramPlane,
  FaTiktok,
  FaVk,
  FaWhatsapp,
  FaYoutube
} from "react-icons/fa";

/**
 * Однотонные иконки соцсетей подбираются по адресу ссылки. Один список на всё
 * приложение: футер и финальный экран квиза показывают одни и те же иконки для
 * одних и тех же ссылок, заведённых в футере.
 */
const socialIcons = [
  { match: ["instagram."], Icon: FaInstagram },
  { match: ["t.me", "telegram."], Icon: FaTelegramPlane },
  { match: ["tiktok."], Icon: FaTiktok },
  { match: ["youtube.", "youtu.be"], Icon: FaYoutube },
  { match: ["wa.me", "whatsapp."], Icon: FaWhatsapp },
  { match: ["facebook.", "fb.com", "fb.me"], Icon: FaFacebookF },
  { match: ["vk.com", "vk.ru"], Icon: FaVk },
  { match: ["linkedin."], Icon: FaLinkedinIn }
];

/** Иконка для ссылки; undefined для незнакомой сети — тогда нужен запасной вариант */
export const getSocialIcon = (link: string) => {
  const href = (link || "").toLowerCase();
  return socialIcons.find(item => item.match.some(part => href.includes(part)))
    ?.Icon;
};

/** Первая ссылка из списка, которая ведёт в Telegram */
export const findTelegramLink = (
  links?: { link?: string }[] | null
): string | undefined =>
  (links || []).find(item => {
    const href = (item?.link || "").toLowerCase();
    return href.includes("t.me") || href.includes("telegram.");
  })?.link;

/** Первая ссылка из списка, которая ведёт в WhatsApp */
export const findWhatsappLink = (
  links?: { link?: string }[] | null
): string | undefined =>
  (links || []).find(item => {
    const href = (item?.link || "").toLowerCase();
    return href.includes("wa.me") || href.includes("whatsapp.");
  })?.link;
