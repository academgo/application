import { Translation } from "@/types/post";
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher";
import { getCountriesByLang, getHeaderByLang } from "@/sanity/sanity.utils";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import styles from "./Header.module.scss";
import Link from "next/link";
import NavWrapper from "../NavWrapper/NavWrapper";

type Props = {
  translations?: Translation[];
  params: { lang: string };
};

const Header = async ({ translations, params }: Props) => {
  const [data, countries] = await Promise.all([
    getHeaderByLang(params.lang),
    getCountriesByLang(params.lang)
  ]);

  const contactLinks = data.contactLinks || [];

  // Контакт Telegram нужен промо-карточке в мега-меню: ссылка и иконка
  const telegramContact = contactLinks.find(link =>
    /t\.me|telegram/i.test(link.link || "")
  );
  // Промо-карточка в мега-меню: тексты из Sanity, иначе значения по языку,
  // ссылка и иконка по умолчанию — из контакта Telegram
  const isRu = params.lang === "ru";
  const promoDefaults = {
    label: isRu ? "Telegram-бот" : "Telegram bot",
    title: isRu ? "Быстрый подбор вуза" : "Quick university match",
    text: isRu
      ? "Перейдите в наш Telegram-бот. Ответьте на 3 вопроса, и мы пришлём варианты поступления под ваш бюджет."
      : "Open our Telegram bot. Answer 3 questions and we will send admission options for your budget.",
    buttonText: isRu ? "Перейти в Telegram" : "Open Telegram"
  };

  // Нижняя плашка мобильного меню
  const mobileCta = {
    title: isRu
      ? "Оценить шансы на поступление?"
      : "Check your admission chances?",
    text: isRu
      ? "Напишите нашему боту в Telegram"
      : "Message our bot on Telegram"
  };

  const promo = {
    label: data.countriesPromo?.label || promoDefaults.label,
    title: data.countriesPromo?.title || promoDefaults.title,
    text: data.countriesPromo?.text || promoDefaults.text,
    buttonText: data.countriesPromo?.buttonText || promoDefaults.buttonText,
    link: data.countriesPromo?.link || telegramContact?.link,
    icon: data.countriesPromo?.icon || telegramContact?.icon
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.companyData}>
            <Link className={styles.logoLink} href={`/${params.lang}`}>
              <Image
                alt="Academgo Logo"
                src={urlFor(data.logo).url()}
                width={200}
                height={200}
                className={styles.logoImage}
              />
              <Image
                alt="Academgo Logo"
                src={urlFor(data.logoMobile).url()}
                width={40}
                height={40}
                className={`${styles.logoImageMobile} logoImageMobile`}
              />
              <Image
                alt="Academgo Logo"
                src={urlFor(data.logoMobileActive).url()}
                width={40}
                height={40}
                className={`${styles.logoImageMobile} logoImageMobileActive`}
              />
            </Link>
            <p className={styles.description}>{data.description}</p>
          </div>

          <div className={styles.navWrapperParent}>
            <NavWrapper
              navLinks={data.navLinks}
              params={params}
              countries={countries}
              promo={promo}
              contactLinks={contactLinks}
              mobileCta={mobileCta}
            />
          </div>

          <div className={styles.contacts}>
            <div className={styles.contactLinks}>
              {contactLinks.map(link => (
                <Link
                  key={link._key}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.title}
                  className={styles.contactLink}
                >
                  <Image
                    alt={link.title}
                    src={urlFor(link.icon).url()}
                    width={50}
                    height={50}
                    className={styles.contactIcon}
                  />
                </Link>
              ))}
            </div>

            <div className={styles.contactButtons}>
              <LocaleSwitcher translations={translations} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
