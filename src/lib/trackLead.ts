import {
  detectStudyDestination,
  detectStudyDestinationCode
} from "./studyDestination";

declare global {
  interface Window {
    // Meta Pixel: инициализируется в components/pixel-events.tsx
    fbq?: (...args: any[]) => void;
  }
}

/**
 * Событие отправленной заявки со страной обучения — для GA4/GTM и Meta Pixel.
 * Вызывается после успешной отправки любой формы.
 */
export const trackLead = (formName: string, lang?: string) => {
  if (typeof window === "undefined") return;

  const url = window.location.href;
  const countryCode = detectStudyDestinationCode(url) || "unknown";
  const countryTitle = detectStudyDestination(url, lang) || "";

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "lead_submit",
    form_name: formName,
    study_country: countryCode,
    study_country_title: countryTitle,
    page_url: url
  });

  // Meta Pixel: стандартное событие Lead с теми же параметрами
  try {
    window.fbq?.("track", "Lead", {
      content_name: formName,
      content_category: countryCode,
      study_country: countryCode,
      study_country_title: countryTitle,
      page_url: url
    });
  } catch {
    // аналитика не должна ломать отправку заявки
  }
};
