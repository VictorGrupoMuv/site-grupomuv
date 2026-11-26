/**
 * Grava um lead do site em public.prospeccao, no Supabase do muv-hub.
 *
 * A chave de serviço fica só nas variáveis de ambiente da Netlify.
 * O navegador chama esta função e nunca vê SUPABASE_SERVICE_ROLE_KEY.
 *
 * Variáveis (Site settings → Environment variables):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * A tabela ainda não existe no banco. O SQL para o Victor aplicar está em
 * docs/sql/prospeccao-site.sql. Sem esse SQL, o insert responde erro e o
 * formulário avisa; o e-mail do Netlify Forms continua sendo enviado pelo
 * navegador antes desta chamada falhar.
 */

const { prepararLead } = require('../../lib/leads');

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

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cabecalhos(event), body: '' };
  if (event.httpMethod !== 'POST') return resp(event, 405, { ok: false, erro: 'Método não permitido.' });
  if (String(event.body || '').length > 20000) return resp(event, 413, { ok: false, erro: 'Mensagem longa demais.' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (_) { return resp(event, 400, { ok: false, erro: 'Requisição inválida.' }); }

  const preparado = prepararLead(body, new Date());
  if (preparado.spam) return resp(event, 200, { ok: true });
  if (preparado.erro) return resp(event, 400, { ok: false, erro: preparado.erro });

  const urlBase = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!urlBase || !chave) {
    console.error('[salvar-lead] faltam SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY');
    return resp(event, 500, { ok: false, erro: 'Não conseguimos registrar agora. Tenta de novo ou chama no WhatsApp.' });
  }

  try {
    const r = await fetch(urlBase + '/rest/v1/prospeccao', {
      method: 'POST',
      headers: {
        apikey: chave,
        Authorization: 'Bearer ' + chave,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(preparado.linha),
    });
    if (!r.ok) {
      const detalhe = await r.text().catch(() => '');
      console.error('[salvar-lead] supabase', r.status, detalhe.slice(0, 300));
      return resp(event, 502, { ok: false, erro: 'Não conseguimos registrar agora. Tenta de novo ou chama no WhatsApp.' });
    }
    return resp(event, 200, { ok: true });
  } catch (e) {
    console.error('[salvar-lead] falha', e && e.message);
    return resp(event, 502, { ok: false, erro: 'Não conseguimos registrar agora. Tenta de novo ou chama no WhatsApp.' });
  }
};
