// Validação dos leads do site, sem rede e sem segredo.
// A função da Netlify (netlify/functions/salvar-lead.js) usa isto e grava
// em public.prospeccao. O navegador nunca vê a chave do Supabase.

const FORMULARIOS = new Set([
  'orcamento',
  'newsletter',
  'hub-waitlist',
  'hub-cadastro',
  'hub-fundadores',
  'hub-checkout',
  'lead-primeira-producao',
  'lead-diagnostico',
]);

const UTM_CHAVES = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHAVES_CARTAO = new Set([
  'cartao', 'cartão', 'creditcard', 'credit_card', 'creditcardholderinfo',
  'credit_card_holder_info', 'cvv', 'ccv', 'cvc', 'cardnumber', 'card_number',
]);

function limpa(s, max) {
  return String(s == null ? '' : s)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function limpaTexto(s, max) {
  return String(s == null ? '' : s)
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, max);
}

function digitos(s) {
  return String(s || '').replace(/\D/g, '');
}

function contemCartao(valor) {
  if (!valor || typeof valor !== 'object') return false;
  const lista = Array.isArray(valor) ? valor : Object.keys(valor);
  if (Array.isArray(valor)) return valor.some(contemCartao);
  for (const chave of lista) {
    if (CHAVES_CARTAO.has(String(chave).toLowerCase())) return true;
    if (contemCartao(valor[chave])) return true;
  }
  return false;
}

function honeypotCheio(body) {
  const campos = [body.botField, body['bot-field'], body.bot_field, body.honeypot];
  return campos.some((v) => limpa(v, 200) !== '');
}

function utmDe(body) {
  const fonte = body && typeof body.utm === 'object' && body.utm ? body.utm : body || {};
  const utm = {};
  UTM_CHAVES.forEach((chave) => {
    const v = limpa(fonte[chave], 200);
    if (v) utm[chave] = v;
  });
  return utm;
}

function paginaDe(s) {
  const t = limpa(s, 300);
  if (!t || !t.startsWith('/') || t.startsWith('//')) return '/';
  if (!/^\/[A-Za-z0-9/_.?=&%-]*$/.test(t)) return '/';
  return t;
}

// Devolve { spam }, { erro } ou { linha } pronta para o insert.
// criado_em é sempre o relógio do servidor: o valor do navegador é ignorado.
function prepararLead(body, agora) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { erro: 'Requisição inválida.' };
  }
  if (contemCartao(body)) {
    return { erro: 'Este formulário não recebe dados de cartão.' };
  }
  if (honeypotCheio(body)) return { spam: true };

  const formulario = limpa(body.formulario, 80);
  if (!FORMULARIOS.has(formulario)) return { erro: 'Formulário desconhecido.' };

  const email = limpa(body.email, 200).toLowerCase();
  const foneBruto = limpa(body.fone || body.phone || body.telefone || body.whatsapp, 40);
  const foneDigitos = digitos(foneBruto);
  if (email && !EMAIL.test(email)) return { erro: 'Confere o e-mail: parece incompleto.' };
  if (foneBruto && (foneDigitos.length < 10 || foneDigitos.length > 15)) {
    return { erro: 'Confere o telefone: precisa do DDD e do número.' };
  }
  if (!email && !foneDigitos) return { erro: 'Informe um e-mail ou um telefone.' };

  const quando = agora instanceof Date ? agora : new Date();
  return {
    linha: {
      nome: limpa(body.nome || body.name, 160) || null,
      empresa: limpa(body.empresa || body.company, 200) || null,
      email: email || null,
      fone: foneBruto || null,
      mensagem: limpaTexto(body.mensagem || body.message || body.brief, 4000) || null,
      pagina: paginaDe(body.pagina),
      formulario,
      origem: limpa(body.origem, 200) || null,
      utm: utmDe(body),
      criado_em: quando.toISOString(),
    },
  };
}

module.exports = {
  FORMULARIOS,
  UTM_CHAVES,
  contemCartao,
  prepararLead,
};
