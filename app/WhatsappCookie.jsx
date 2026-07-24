"use client";
import { useEffect, useState } from "react";

export default function WhatsappCookie() {
  const [showWA, setShowWA] = useState(false);
  const [showCookie, setShowCookie] = useState(false);
  useEffect(() => {
    let consent = null;
    try { consent = localStorage.getItem("muv-cookie-consent"); } catch (_) {}
    let t;
    if (!consent) t = setTimeout(() => setShowCookie(true), 4200);
    const onScroll = () => setShowWA(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); if (t) clearTimeout(t); };
  }, []);
  const decide = (v) => {
    try { localStorage.setItem("muv-cookie-consent", v); localStorage.setItem("muv-cookie-consent-at", new Date().toISOString()); } catch (_) {}
    setShowCookie(false);
  };
  return (
    <>
      <a id="muv-whatsapp" href="https://wa.me/message/D6LG7EUSTIR7C1" target="_blank" rel="noopener noreferrer" aria-label="Fale com a gente no WhatsApp" hidden={!showWA}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M16 0C7.16 0 0 7.16 0 16c0 2.82.74 5.46 2.02 7.76L0 32l8.46-2.22A15.93 15.93 0 0 0 16 32c8.84 0 16-7.16 16-16S24.84 0 16 0Zm0 29.33c-2.5 0-4.83-.67-6.84-1.83l-.49-.29-5.02 1.32 1.34-4.9-.32-.5A13.27 13.27 0 0 1 2.67 16C2.67 8.65 8.65 2.67 16 2.67S29.33 8.65 29.33 16 23.35 29.33 16 29.33Zm7.34-9.95c-.4-.2-2.37-1.17-2.74-1.3-.37-.13-.64-.2-.91.2-.27.4-1.04 1.3-1.27 1.57-.23.27-.47.3-.87.1-.4-.2-1.69-.62-3.22-1.98-1.19-1.06-1.99-2.37-2.22-2.77-.23-.4-.02-.61.18-.81.18-.18.4-.47.6-.7.2-.23.27-.4.4-.67.13-.27.07-.5-.03-.7-.1-.2-.91-2.19-1.25-3-.33-.78-.66-.67-.91-.69-.23-.01-.5-.01-.77-.01-.27 0-.7.1-1.07.5-.37.4-1.4 1.37-1.4 3.33s1.44 3.86 1.64 4.13c.2.27 2.83 4.33 6.86 6.07 4.04 1.74 4.04 1.16 4.77 1.09.73-.07 2.37-.97 2.7-1.9.34-.94.34-1.74.23-1.9-.1-.17-.37-.27-.77-.47Z" fill="white"/>
        </svg>
        <span className="muv-whatsapp__tooltip">Fale com a gente</span>
      </a>
      <div id="muv-cookie" hidden={!showCookie} role="dialog" aria-live="polite" aria-label="Aviso de cookies">
        <div className="muv-cookie__text">
          Usamos cookies pra entender o que funciona e melhorar a experiência. <a href="/politica-privacidade.html">Saiba mais →</a>
        </div>
        <div className="muv-cookie__actions">
          <button type="button" className="muv-cookie__btn muv-cookie__btn--ghost" onClick={() => decide("rejected")}>Recusar</button>
          <button type="button" className="muv-cookie__btn muv-cookie__btn--primary" onClick={() => decide("accepted")}>Aceitar</button>
        </div>
      </div>
    </>
  );
}
