"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Uma única tag do Google serve as duas propriedades — o Google não permite
// mais de uma tag gtag.js por página. GA4 mede o site; Ads mede conversão e
// alimenta remarketing. O carregamento da tag vive no <head> (app/layout.js);
// este componente cuida só dos eventos e da atualização de consentimento.
import { ADS_CONV } from "./gtag-config";
export { GA_MEASUREMENT_ID, ADS_CONVERSION_ID, ADS_CONVERSION_ID_2, ADS_CONV, CONSENT_KEY } from "./gtag-config";

const CONCEDIDO = {
  analytics_storage: "granted",
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};

const NEGADO = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

export function trackAnalytics(eventName, parameters = {}) {
  if (typeof window === "undefined") return;
  // gtag → GA4 e Ads (configurados no <head>).
  if (typeof window.gtag === "function") window.gtag("event", eventName, parameters);
  // dataLayer em formato de objeto → GTM (pixels de terceiros ouvem o mesmo
  // evento, ex.: trigger "Custom Event: generate_lead" dispara o Meta Pixel).
  // O gtag também escreve no dataLayer, mas como `arguments`, que o GTM ignora.
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...parameters });
  } catch (_) {}
}

// Dispara uma conversão do Google Ads. Exige o rótulo gerado no painel do Ads
// em Metas > Conversões — formato "AW-17425244543/AbCdEfGhIjKl".
export function trackAdsConversion(sendTo, parameters = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (!sendTo) return;
  window.gtag("event", "conversion", { send_to: sendTo, ...parameters });
}

function updateConsent(value) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", value === "accepted" ? CONCEDIDO : NEGADO);
}

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const onConsent = (event) => updateConsent(event.detail?.value);
    window.addEventListener("muv:cookie-consent", onConsent);
    return () => window.removeEventListener("muv:cookie-consent", onConsent);
  }, []);

  useEffect(() => {
    const caseMatch = pathname.match(/^\/trabalhos\/([^/]+)\/?$/);
    if (caseMatch) {
      trackAnalytics("view_case", { case_slug: caseMatch[1], page_path: pathname });
    }
  }, [pathname]);

  useEffect(() => {
    const trackContactClick = (event) => {
      const link = event.target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";

      if (href.includes("wa.me") || href.includes("whatsapp")) {
        trackAnalytics("click_whatsapp", { link_location: pathname });
        trackAdsConversion(ADS_CONV.whatsapp);
      } else if (href.startsWith("tel:")) {
        trackAnalytics("click_phone", { link_location: pathname });
      } else if (href.startsWith("mailto:")) {
        trackAnalytics("click_email", { link_location: pathname });
      }
    };

    document.addEventListener("click", trackContactClick);
    return () => document.removeEventListener("click", trackContactClick);
  }, [pathname]);

  return null;
}
