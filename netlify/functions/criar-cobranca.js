/**
 * MUV Hub — abre o checkout hospedado do Asaas.
 *
 * Esta função cria a sessão de pagamento e devolve o link. O cartão e o CVV
 * são digitados só na página do Asaas. Se o corpo trouxer dado de cartão,
 * a função recusa e não chama o Asaas.
 *
 * O código antigo, que recebia número e CVV, ficou em
 * netlify/legado/criar-cobranca-cartao.js. Não é função da Netlify e não
 * pode voltar para netlify/functions sem autorização do Victor.
 *
 * Variáveis (as mesmas de antes):
 *   ASAAS_API_KEY   chave da conta (produção ou sandbox, conforme ASAAS_ENV)
 *   ASAAS_ENV       "sandbox" ou "producao" (qualquer outro valor usa o sandbox)
 */

const { montarCheckout, urlDoCheckout } = require('../../lib/checkout');

const BASE = process.env.ASAAS_ENV === 'producao'
  ? 'https://api.asaas.com/v3'
  : 'https://api-sandbox.asaas.com/v3';

const CORS = {
  'Access-Control-Allow-Origin': 'https://grupomuv.com.br',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function cabecalhos(event) {
  const origem = String((event.headers && (event.headers.origin || event.headers.Origin)) || '');
  const permitida = origem === 'https://grupomuv.com.br' || origem === 'https://www.grupomuv.com.br';
  return { ...CORS, 'Access-Control-Allow-Origin': permitida ? origem : CORS['Access-Control-Allow-Origin'] };
}

const resp = (event, statusCode, body) => ({
  statusCode,
  headers: cabecalhos(event),
  body: JSON.stringify(body),
});

function erroLegivel(data) {
  const e = data && data.errors && data.errors[0];
  if (!e) return 'Não conseguimos abrir o pagamento. Tente de novo ou fale com a gente pelo WhatsApp.';
  return e.description || 'Não conseguimos abrir o pagamento.';
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cabecalhos(event), body: '' };
  if (event.httpMethod !== 'POST') return resp(event, 405, { erro: 'Método não permitido.' });
  if (String(event.body || '').length > 8000) return resp(event, 413, { erro: 'Requisição grande demais.' });

  const KEY = process.env.ASAAS_API_KEY;
  if (!KEY) return resp(event, 500, { erro: 'Pagamento indisponível no momento. Fale com a gente pelo WhatsApp.' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (_) { return resp(event, 400, { erro: 'Requisição inválida.' }); }

  const montado = montarCheckout(body, new Date());
  if (montado.erro) return resp(event, 400, { erro: montado.erro });

  try {
    const r = await fetch(BASE + '/checkouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', access_token: KEY },
      body: JSON.stringify(montado.payload),
    });
    let data = {};
    try { data = await r.json(); } catch (_) {}
    if (!r.ok) return resp(event, 400, { erro: erroLegivel(data) });

    const url = urlDoCheckout(data);
    if (!url) return resp(event, 502, { erro: 'O Asaas não devolveu o link de pagamento. Nenhuma cobrança foi confirmada.' });

    return resp(event, 200, {
      ok: true,
      url,
      id: data.id || null,
      plano: montado.plano.nome,
    });
  } catch (e) {
    console.error('[criar-cobranca] falha inesperada:', e && e.message);
    return resp(event, 500, { erro: 'Tivemos um problema ao abrir o pagamento. Nada foi cobrado. Tente de novo em instantes.' });
  }
};
