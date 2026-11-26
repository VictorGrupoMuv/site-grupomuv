"use client";
import { useRef } from "react";

// Captura de campanha e envio dos formulários.
// O lead vai para a função salvar-lead (Supabase, no servidor) e, em seguida,
// para o Netlify Forms, que continua mandando o e-mail de notificação.

const ATTR_KEY = "muv-attr";
const ATTR_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];

export function lerAtribuicao() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.sessionStorage.getItem(ATTR_KEY) || "{}") || {}; }
  catch (_) { return {}; }
}

export function capturarAtribuicao() {
  if (typeof window === "undefined") return;
  try {
    const q = new URLSearchParams(window.location.search);
    const novos = {};
    ATTR_PARAMS.forEach((k) => { const v = q.get(k); if (v) novos[k] = v.slice(0, 200); });
    if (!Object.keys(novos).length) return;
    window.sessionStorage.setItem(ATTR_KEY, JSON.stringify({ ...lerAtribuicao(), ...novos }));
  } catch (_) {}
}

export function useHoneypot() {
  const ref = useRef(null);
  return {
    valor: () => (ref.current && ref.current.value) || "",
    campo: (
      <p style={{ display: "none" }} aria-hidden="true">
        <label>
          Não preencha
          <input ref={ref} type="text" name="bot-field" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </p>
    ),
  };
}

async function postToNetlify(formName, data) {
  const body = new URLSearchParams({ "form-name": formName, ...data }).toString();
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error("Falha no envio (" + res.status + ")");
  return true;
}

export async function salvarLead(lead) {
  const res = await fetch("/.netlify/functions/salvar-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: lead.nome || "",
      empresa: lead.empresa || "",
      email: lead.email || "",
      fone: lead.fone || "",
      mensagem: lead.mensagem || "",
      pagina: lead.pagina || (typeof window !== "undefined" ? window.location.pathname : "/"),
      formulario: lead.formulario || "",
      origem: lead.origem || "",
      utm: lead.utm || lerAtribuicao(),
      botField: lead.botField || "",
    }),
  });
  let data = {};
  try { data = await res.json(); } catch (_) {}
  if (!res.ok || data.ok === false) {
    throw new Error(data.erro || "Não conseguimos registrar o contato.");
  }
  return data;
}

// Grava no Supabase e mantém o Netlify Forms. Se o banco falhar, o e-mail
// ainda sai e o formulário mostra o erro para a pessoa tentar de novo.
export async function enviarFormulario(formName, netlifyData, lead) {
  const bot = lead.botField || "";
  const utm = lead.utm || lerAtribuicao();
  let leadErro = null;
  try {
    await salvarLead({ ...lead, botField: bot, utm });
  } catch (e) {
    leadErro = e;
  }
  const extraUtm = formName === "orcamento" ? {
    utm_source: utm.utm_source || "",
    utm_medium: utm.utm_medium || "",
    utm_campaign: utm.utm_campaign || "",
    utm_term: utm.utm_term || "",
    utm_content: utm.utm_content || "",
    gclid: utm.gclid || "",
  } : {};
  await postToNetlify(formName, { ...netlifyData, ...extraUtm, "bot-field": bot });
  if (leadErro) throw leadErro;
}
