import React, { FC } from "react";
import { STUDY_COUNTRIES } from "@/lib/studyDestination";

export const SITE_URL = "https://academgo.com";
/** Общий @id: рейтинг в подвале дополняет эту же организацию, а не создаёт вторую */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const LOGO_URL =
  "https://cdn.sanity.io/images/19hn716s/production/8045a404151f6af68d6964abcda08bd5c5e78946-1159x231.png";

// Только проверенные ссылки: Instagram — со страницы контактов, Telegram —
// из шапки. Телефон не указываем, пока не подтверждён верный номер WhatsApp.
const SAME_AS = [
  "https://www.instagram.com/academgo",
  "https://t.me/infoacademgo"
];

type Props = {
  lang: string;
};

/** Разметка schema.org об агентстве — на всех страницах сайта */
const OrganizationSchema: FC<Props> = ({ lang }) => {
  const isEnglish = lang === "en";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "AcademGo",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 1159,
      height: 231
    },
    description: isEnglish
      ? "AcademGo helps international students get into universities in ten countries: programme choice, documents, visa and support."
      : "AcademGo помогает поступить в университеты десяти стран: подбор программы, документы, виза и сопровождение.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ul. Złota 7/28",
      addressLocality: "Warszawa",
      addressCountry: "PL"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Russian", "English"],
      url: isEnglish ? `${SITE_URL}/contacts` : `${SITE_URL}/ru/kontakty`
    },
    // Направления обучения, с которыми работает агентство
    knowsAbout: STUDY_COUNTRIES.map(country =>
      isEnglish ? `Study in ${country.en}` : `Учёба: ${country.ru}`
    ),
    sameAs: SAME_AS
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default OrganizationSchema;
