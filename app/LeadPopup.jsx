"use client";
import { useEffect, useRef, useState } from "react";
import { trackAnalytics, trackAdsConversion } from "./GoogleAnalytics";
import { ADS_CONV } from "./gtag-config";

// ─────────────────────────────────────────────────────────────────────────────
// Pop-up de captação de leads · Diagnóstico gratuito
//
// Regras de exibição (decididas em 13/10/2026):
//  · aparece UMA vez por visitante: após 8s na página OU 40% de rolagem,
//    o que vier primeiro;
//  · quem fecha só volta a ver depois de 7 dias; quem envia nunca mais vê;
//  · não aparece em /contato/ (já tem formulário) nem com o drawer aberto;
//  · fica ABAIXO do banner de cookies (z-index 9990 < 9999) pra nunca
//    bloquear a decisão de consentimento.
//
// Envio: Netlify Forms, form "lead-diagnostico" declarado em public/__forms.html.
// Leads: painel Netlify > Forms (ativar notificação por e-mail).
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY   = "muv-lead-popup";
const DELAY_MS      = 8000;
const SCROLL_RATIO  = 0.4;
const SNOOZE_DAYS   = 7;
const FORM_NAME     = "lead-diagnostico";
const WHATSAPP_URL  = "https://wa.me/message/D6LG7EUSTIR7C1";
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
  const [form, setForm] = useState({ nome: "", whatsapp: "", empresa: "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState("");
  const firstFieldRef = useRef(null);
  const triggeredRef = useRef(false);

  // Gatilho: 8s OU 40% de rolagem, uma única vez
  useEffect(() => {
    if (!shouldShow()) return;
    let timer = null;
    const fire = (how) => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      cleanup();
      setOpen(true);
      try { trackAnalytics("lead_popup_view", { trigger: how, page_path: window.location.pathname }); } catch (_) {}
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (window.scrollY / max >= SCROLL_RATIO) fire("scroll");
    };
    const cleanup = () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
    timer = setTimeout(() => fire("timer"), DELAY_MS);
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
    if (digits.length < 10)     { setError("Confere o WhatsApp: precisa do DDD + número."); return; }
    if (!form.empresa.trim())   { setError("Qual a empresa ou marca? Ajuda a preparar o diagnóstico."); return; }
    if (!consent)               { setError("Confirme o aceite da política de privacidade para enviar."); return; }
    setError("");
    setStatus("sending");
    try {
      await postToNetlify(FORM_NAME, {
        nome: form.nome.trim(),
        whatsapp: form.whatsapp,
        empresa: form.empresa.trim(),
        origem: `Pop-up diagnóstico · ${window.location.pathname}`,
        "aceite-privacidade": `sim · ${new Date().toISOString()}`,
      });
      writeState("sent");
      try {
        trackAnalytics("generate_lead", { form_name: "lead_popup_diagnostico", method: "popup" });
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
            <span className="muv-lead__eyebrow">Diagnóstico gratuito · 30 min</span>
            <h2 id="muv-lead-title" className="muv-lead__title">Seu conteúdo está vendendo pela sua marca?</h2>
            <p className="muv-lead__text">
              A gente analisa a presença da sua marca e aponta, com franqueza, onde o audiovisual gera mais retorno e onde está só gastando verba. Sem apresentação de vendas.
            </p>

            <form className="muv-lead__form" onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor="muv-lead-nome">Nome</label>
                <input ref={firstFieldRef} id="muv-lead-nome" name="nome" type="text" autoComplete="name" placeholder="Como te chamar" value={form.nome} onChange={update("nome")} required />
              </div>
              <div className="field">
                <label htmlFor="muv-lead-whatsapp">WhatsApp</label>
                <input id="muv-lead-whatsapp" name="whatsapp" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="(11) 99999-9999" value={form.whatsapp} onChange={update("whatsapp")} required />
              </div>
              <div className="field">
                <label htmlFor="muv-lead-empresa">Empresa ou marca</label>
                <input id="muv-lead-empresa" name="empresa" type="text" autoComplete="organization" placeholder="Nome da empresa" value={form.empresa} onChange={update("empresa")} required />
              </div>

              <label className="quote-card__consent muv-lead__consent" htmlFor="muv-lead-consent">
                <input id="muv-lead-consent" name="privacy-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>Autorizo o Grupo MUV a usar meus dados para entrar em contato, conforme a <a href="/politica-privacidade.html" target="_blank" rel="noopener noreferrer">política de privacidade</a>.</span>
              </label>

              {error && <p className="quote-card__error muv-lead__error" role="alert">{error}</p>}

              <div className="muv-lead__actions">
                <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
                  {status === "sending" ? "Enviando…" : "Quero meu diagnóstico"}
                </button>
                <button type="button" className="muv-lead__skip" onClick={dismiss}>Agora não</button>
              </div>
            </form>
          </>
        ) : (
          <div className="muv-lead__done">
            <span className="muv-lead__eyebrow">Recebido</span>
            <h2 id="muv-lead-title" className="muv-lead__title">Fechado, {form.nome.trim().split(" ")[0] || "valeu"}.</h2>
            <p className="muv-lead__text">
              A gente te chama no WhatsApp em até 1 dia útil pra marcar o diagnóstico. Se preferir adiantar, abre a conversa agora:
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
