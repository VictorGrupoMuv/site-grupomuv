"use client";
import { useEffect, useRef, useState } from "react";
import { trackAnalytics, trackAdsConversion } from "./GoogleAnalytics";
import { ADS_CONV } from "./gtag-config";

// ─────────────────────────────────────────────────────────────────────────────
// Pop-up de captação de leads · 10% na primeira produção
//
// Oferta trocada em 17/11/2026 (antes: diagnóstico gratuito). Capta nome,
// e-mail e WhatsApp. A chave do localStorage mudou junto, para quem fechou
// o pop-up antigo ver a oferta nova.
//
// Regras de exibição:
//  · aparece UMA vez por visitante, depois da decisão de cookies e de 50%
//    de rolagem (Design System rodada 03, "um aviso por vez");
//  · quem fecha só volta a ver depois de 7 dias; quem envia nunca mais vê;
//  · não aparece em /contato/ (já tem formulário) nem com o drawer aberto;
//  · fica ABAIXO do banner de cookies (z-index 9990 < 9999) pra nunca
//    bloquear a decisão de consentimento.
//
// Envio: Netlify Forms, form "lead-primeira-producao" declarado em public/__forms.html.
// Leads: painel Netlify > Forms (ativar notificação por e-mail).
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY   = "muv-lead-popup-10";
const SCROLL_RATIO  = 0.5;
const SNOOZE_DAYS   = 7;
const FORM_NAME     = "lead-primeira-producao";
const OFERTA        = "10% na primeira produção";
const WHATSAPP_URL  = "https://wa.me/message/D6LG7EUSTIR7C1";
// /eventos voltou a mostrar o pop-up em 17/11/2026, a pedido do Victor,
// junto com a versão curta da landing.
const SKIP_PATHS    = ["/contato"];

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}
function writeState(status) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, at: Date.now() })); } catch (_) {}
}
function shouldShow() {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname || "/";
  if (SKIP_PATHS.some((p) => path.startsWith(p))) return false;
  const state = readState();
  if (!state) return true;
  if (state.status === "sent") return false;
  if (state.status === "dismissed") {
    return Date.now() - (state.at || 0) > SNOOZE_DAYS * 24 * 60 * 60 * 1000;
  }
  return true;
}

async function postToNetlify(formName, data) {
  const body = new URLSearchParams({ "form-name": formName, ...data }).toString();
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body });
  if (!res.ok) throw new Error("Falha no envio (" + res.status + ")");
  return true;
}

// Mantém só dígitos e formata como (11) 99999-9999 enquanto digita.
function formatPhone(value) {
  const d = String(value || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2)  return d;
  if (d.length <= 6)  return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", whatsapp: "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState("");
  const firstFieldRef = useRef(null);
  const triggeredRef = useRef(false);

  // Gatilho (Design System rodada 03, "um aviso por vez"): só depois que a
  // pessoa decidiu sobre cookies e leu metade da página. Sem disparo por tempo.
  useEffect(() => {
    if (!shouldShow()) return;
    const cookieDecided = () => { try { return Boolean(localStorage.getItem("muv-cookie-consent")); } catch (_) { return true; } };
    const fire = (how) => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      cleanup();
      setOpen(true);
      try { trackAnalytics("lead_popup_view", { trigger: how, page_path: window.location.pathname }); } catch (_) {}
    };
    const onScroll = () => {
      if (!cookieDecided()) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (window.scrollY / max >= SCROLL_RATIO) fire("scroll");
    };
    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, []);

  // Aberto: trava o scroll do body, foca o 1º campo, fecha no Esc
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("lead-popup-open");
    const t = setTimeout(() => firstFieldRef.current?.focus(), 420);
    const onKey = (e) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("lead-popup-open");
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dismiss = () => {
    if (status !== "sent") {
      writeState("dismissed");
      try { trackAnalytics("lead_popup_dismiss", { stage: status }); } catch (_) {}
    }
    setOpen(false);
  };

  const update = (k) => (e) => {
    const v = k === "whatsapp" ? formatPhone(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const digits = form.whatsapp.replace(/\D/g, "");
    if (!form.nome.trim())      { setError("Me diz seu nome pra gente te chamar direito."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError("Confere o e-mail: parece incompleto."); return; }
    if (digits.length < 10)     { setError("Confere o WhatsApp: precisa do DDD + número."); return; }
    if (!consent)               { setError("Confirme o aceite da política de privacidade para enviar."); return; }
    setError("");
    setStatus("sending");
    try {
      await postToNetlify(FORM_NAME, {
        nome: form.nome.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp,
        oferta: OFERTA,
        origem: `Pop-up 10% primeira produção · ${window.location.pathname}`,
        "aceite-privacidade": `sim · ${new Date().toISOString()}`,
      });
      writeState("sent");
      try {
        trackAnalytics("generate_lead", { form_name: "lead_popup_primeira_producao", method: "popup" });
        trackAdsConversion(ADS_CONV.orcamento);
      } catch (_) {}
      setStatus("sent");
    } catch (_) {
      setStatus("idle");
      setError("Não conseguimos enviar agora. Tenta de novo ou chama direto no WhatsApp.");
    }
  };

  return (
    <div id="muv-lead" hidden={!open} role="presentation">
      <div className="muv-lead__backdrop" onClick={dismiss} aria-hidden="true" />
      <div className="muv-lead__card" role="dialog" aria-modal="true" aria-labelledby="muv-lead-title">
        <button type="button" className="muv-lead__close" onClick={dismiss} aria-label="Fechar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>

        {status !== "sent" ? (
          <>
            <span className="muv-lead__eyebrow">Primeira produção</span>
            <h2 id="muv-lead-title" className="muv-lead__title"><em>10%</em> na sua primeira produção com a MUV</h2>
            <p className="muv-lead__text">
              Deixa seu contato e a gente te chama no WhatsApp para entender o projeto. O desconto entra no seu primeiro orçamento.
            </p>

            <form className="muv-lead__form" onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor="muv-lead-nome">Nome</label>
                <input ref={firstFieldRef} id="muv-lead-nome" name="nome" type="text" autoComplete="name" placeholder="Como te chamar" value={form.nome} onChange={update("nome")} required />
              </div>
              <div className="field">
                <label htmlFor="muv-lead-email">E-mail</label>
                <input id="muv-lead-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="voce@empresa.com" value={form.email} onChange={update("email")} required />
              </div>
              <div className="field">
                <label htmlFor="muv-lead-whatsapp">WhatsApp</label>
                <input id="muv-lead-whatsapp" name="whatsapp" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="(11) 99999-9999" value={form.whatsapp} onChange={update("whatsapp")} required />
              </div>

              <label className="quote-card__consent muv-lead__consent" htmlFor="muv-lead-consent">
                <input id="muv-lead-consent" name="privacy-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>Autorizo o Grupo MUV a usar meus dados para entrar em contato, conforme a <a href="/politica-privacidade.html" target="_blank" rel="noopener noreferrer">política de privacidade</a>.</span>
              </label>

              {error && <p className="quote-card__error muv-lead__error" role="alert">{error}</p>}

              <div className="muv-lead__actions">
                <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
                  {status === "sending" ? "Enviando…" : "Quero meus 10%"}
                </button>
                <button type="button" className="muv-lead__skip" onClick={dismiss}>Agora não</button>
              </div>
              <p className="muv-lead__fine">Válido para novos clientes, no primeiro projeto fechado.</p>
            </form>
          </>
        ) : (
          <div className="muv-lead__done">
            <span className="muv-lead__eyebrow">Reservado</span>
            <h2 id="muv-lead-title" className="muv-lead__title">Fechado, {form.nome.trim().split(" ")[0] || "valeu"}.</h2>
            <p className="muv-lead__text">
              Seus 10% estão reservados. A gente te chama no WhatsApp em até 1 dia útil. Se quiser adiantar a conversa, chama agora:
            </p>
            <div className="muv-lead__actions">
              <a className="btn btn--ink" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                 onClick={() => { try { trackAnalytics("generate_lead", { method: "whatsapp", lead_source: "popup_pos_envio" }); } catch (_) {} }}>
                Abrir WhatsApp
              </a>
              <button type="button" className="muv-lead__skip" onClick={() => setOpen(false)}>Continuar navegando</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
