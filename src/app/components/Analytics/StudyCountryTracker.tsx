"use client";

import { useEffect } from "react";

type Props = {
  countryCode?: string;
  countryTitle?: string;
  pageType?: string;
};

declare global {
  interface Window {
    dataLayer?: Object[];
  }
}

/**
 * Кладёт страну обучения в dataLayer при открытии страницы,
 * чтобы в GA4 и GTM можно было смотреть трафик и заявки по направлениям.
 */
const StudyCountryTracker: React.FC<Props> = ({
  countryCode,
  countryTitle,
  pageType
}) => {
  useEffect(() => {
    if (!countryCode) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "study_country_view",
      study_country: countryCode,
      study_country_title: countryTitle,
      page_type: pageType
    });

    // Meta Pixel: аудитории по странам для ретаргетинга
    try {
      window.fbq?.("trackCustom", "ViewCountryPage", {
        study_country: countryCode,
        study_country_title: countryTitle,
        page_type: pageType
      });
    } catch {
      // аналитика не должна ломать страницу
    }
  }, [countryCode, countryTitle, pageType]);

  return null;
};

export default StudyCountryTracker;
