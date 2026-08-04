"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const GA_MEASUREMENT_ID = "G-7R4ECZGR9S";

export function trackAnalytics(eventName, parameters = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, parameters);
}

function updateConsent(value) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const granted = value === "accepted" ? "granted" : "denied";
  window.gtag("consent", "update", {
    analytics_storage: granted,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [accepted, setAccepted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let storedConsent = null;
    try {
      storedConsent = localStorage.getItem("muv-cookie-consent");
    } catch (_) {}
    setAccepted(storedConsent === "accepted");

    const onConsent = (event) => {
      const value = event.detail?.value;
      updateConsent(value);
      setAccepted(value === "accepted");
    };

    window.addEventListener("muv:cookie-consent", onConsent);
    return () => window.removeEventListener("muv:cookie-consent", onConsent);
  }, []);

  useEffect(() => {
    if (!accepted || !ready) return;

    updateConsent("accepted");
    const caseMatch = pathname.match(/^\/trabalhos\/([^/]+)\/?$/);
    if (caseMatch) {
      trackAnalytics("view_case", {
        case_slug: caseMatch[1],
        page_path: pathname,
      });
    }
  }, [accepted, pathname, ready]);

  useEffect(() => {
    if (!accepted) return;

    const trackContactClick = (event) => {
      const link = event.target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";

      if (href.includes("wa.me") || href.includes("whatsapp")) {
        trackAnalytics("click_whatsapp", { link_location: pathname });
      } else if (href.startsWith("tel:")) {
        trackAnalytics("click_phone", { link_location: pathname });
      } else if (href.startsWith("mailto:")) {
        trackAnalytics("click_email", { link_location: pathname });
      }
    };

    document.addEventListener("click", trackContactClick);
    return () => document.removeEventListener("click", trackContactClick);
  }, [accepted, pathname]);

  return (
    <>
      <Script id="muv-ga-consent" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>
      {accepted && (
        <>
          <Script
            id="muv-ga-library"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
            onLoad={() => setReady(true)}
            onReady={() => setReady(true)}
          />
          <Script id="muv-ga-config" strategy="afterInteractive">
            {`
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}
    </>
  );
}
