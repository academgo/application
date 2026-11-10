import React from "react";
import Link from "next/link";
import { getFooterByLang } from "@/sanity/sanity.utils";
import {
  findTelegramLink,
  findWhatsappLink,
  getSocialIcon
} from "@/lib/socialIcons";
import styles from "./QuizSocials.module.scss";

type Props = {
  lang: string;
};

/**
 * Ссылки мессенджеров для кнопок финального экрана квиза. Берутся из контактов
 * футера, чтобы не заводить одни и те же адреса в CMS второй раз; в самом блоке
 * квиза их можно переопределить своими полями.
 */
export const getQuizMessengers = async (lang: string) => {
  const footer = await getFooterByLang(lang).catch(() => null);
  const links = footer?.contactLinks || [];

  return {
    telegram: findTelegramLink(links),
    whatsapp: findWhatsappLink(links)
  };
};

/**
 * Иконки соцсетей под кнопкой финального экрана: те же ссылки и те же
 * однотонные иконки, что в футере. Сети, для которой иконки нет, в ряду не
 * показываем — ряд должен остаться однородным.
 */
const QuizSocials = async ({ lang }: Props) => {
  const footer = await getFooterByLang(lang).catch(() => null);
  const links = (footer?.contactLinks || []).filter(
    item => item?.link && getSocialIcon(item.link)
  );

  if (!links.length) return null;

  return (
    <ul className={styles.socials}>
      {links.map(item => {
        const Icon = getSocialIcon(item.link)!;

        return (
          <li key={item._key}>
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.title}
              className={styles.link}
            >
              <Icon className={styles.icon} aria-hidden="true" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default QuizSocials;
