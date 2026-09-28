"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const GA_ID = "G-XTMLVRC9RR";
const GTM_ID = "GTM-NMJPFJ6N";
const PIXEL_ID = "315352041248685";

// Скрипты грузятся при первом действии посетителя или через 4 с после load:
// так ~1 с чужого JS (gtag, GTM с Clarity, Meta Pixel) не попадает в окно,
// за которое считаются FCP, LCP и TBT.
const INTERACTION_EVENTS = [
  "scroll",
  "pointerdown",
  "touchstart",
  "keydown",
  "mousemove"
] as const;
const FALLBACK_DELAY_MS = 4000;

declare global {
  interface Window {
    dataLayer?: Object[];
    gtag?: (...args: any[]) => void;
    _fbq?: any;
  }
}

const addScript = (src: string) => {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

/**
 * Очереди создаются сразу, поэтому события, отправленные до загрузки
 * скриптов (lead_submit, страна обучения, Lead в Pixel), не теряются:
 * gtag.js, GTM и fbevents.js разбирают их после загрузки.
 */
const createQueues = () => {
  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = function gtag() {
      // gtag.js ждёт именно объект arguments
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }

  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  // Официальный сниппет Meta Pixel без загрузки fbevents.js
  if (!window.fbq) {
    const fbq: any = function (...args: any[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = window._fbq || fbq;
    fbq("init", PIXEL_ID);
  }
};

const loadScripts = () => {
  addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  addScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
  addScript("https://connect.facebook.net/en_US/fbevents.js");
};

export default function DeferredAnalytics() {
  const pathname = usePathname();
  const started = useRef(false);

  useEffect(() => {
    createQueues();

    let timer: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      if (started.current) return;
      started.current = true;
      cleanup();
      loadScripts();
    };

    const onLoad = () => {
      timer = setTimeout(start, FALLBACK_DELAY_MS);
    };

    const cleanup = () => {
      INTERACTION_EVENTS.forEach(event =>
        window.removeEventListener(event, start)
      );
      window.removeEventListener("load", onLoad);
      if (timer) clearTimeout(timer);
    };

    INTERACTION_EVENTS.forEach(event =>
      window.addEventListener(event, start, { once: true, passive: true })
    );

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    return cleanup;
  }, []);

  // PageView в Pixel на каждую страницу; GA4 считает переходы сам
  // (улучшенная статистика отслеживает смену адреса в истории браузера)
  useEffect(() => {
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
