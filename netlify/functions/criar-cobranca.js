/**
 * MUV Hub — criação de cobrança com cartão (checkout transparente Asaas)
 *
 * Recebe os dados do cadastro + cartão, cria/reaproveita o cliente no Asaas
 * e gera a cobrança. A chave de API vive só aqui, nas variáveis de ambiente
 * do Netlify — nunca no HTML.
 *
 * Variáveis necessárias no Netlify (Site settings → Environment variables):
 *   ASAAS_API_KEY   chave da conta (produção OU sandbox, conforme ASAAS_ENV)
 *   ASAAS_ENV       "sandbox" (padrão) ou "producao"
 */

// Os valores vivem no servidor de propósito: se viessem do navegador,
// qualquer pessoa poderia editar o JS e pagar R$ 1 pelo plano anual.
const PLANOS = {
  sinal:    { nome: 'Sinal de reserva · MUV Hub Turma 01',      valor: 300,  parcelas: 1  },
  mensal:   { nome: 'Mensalidade Fundador · MUV Hub Turma 01',  valor: 890,  assinatura: 'MONTHLY' },
  anualPix: { nome: 'Anual Fundador · MUV Hub Turma 01',        valor: 8900, parcelas: 1  },
  anual12:  { nome: 'Anual Fundador 12x · MUV Hub Turma 01',    valor: 9480, parcelas: 12 },
};

const BASE = process.env.ASAAS_ENV === 'producao'
  ? 'https://api.asaas.com/v3'
  : 'https://api-sandbox.asaas.com/v3';

const CORS = {
  'Access-Control-Allow-Origin': 'https://grupomuv.com.br',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const so = (v) => String(v == null ? '' : v).replace(/\D/g, '');   // só dígitos
const resp = (statusCode, body) => ({ statusCode, headers: CORS, body: JSON.stringify(body) });

async function asaas(path, method, payload, key) {
  const r = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', access_token: key },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  let data = {};
  try { data = await r.json(); } catch (_) {}
  return { ok: r.ok, status: r.status, data };
}

/** Mensagem de erro do Asaas em português, legível para quem está pagando. */
function erroLegivel(data) {
  const e = data && data.errors && data.errors[0];
  if (!e) return 'Não conseguimos processar o pagamento. Confira os dados do cartão e tente de novo.';
  const map = {
    invalid_creditCard: 'Os dados do cartão não foram aceitos. Confira número, validade e CVV.',
    invalid_cpfCnpj:    'O CPF/CNPJ informado não é válido.',
    invalid_postalCode: 'O CEP informado não é válido.',
  };
  return map[e.code] || e.description || 'Pagamento não autorizado pela operadora.';
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST')    return resp(405, { erro: 'Método não permitido.' });

  const KEY = process.env.ASAAS_API_KEY;
  if (!KEY) return resp(500, { erro: 'Pagamento indisponível no momento. Fale com a gente pelo WhatsApp.' });

  let b;
  try { b = JSON.parse(event.body || '{}'); }
  catch (_) { return resp(400, { erro: 'Requisição inválida.' }); }

  const plano = PLANOS[b.plano];
  if (!plano) return resp(400, { erro: 'Plano inválido.' });

  // ── validação do que é obrigatório para o Asaas ──
  const nome  = (b.nome || '').trim();
  const email = (b.email || '').trim();
  const cpf   = so(b.cpfCnpj);
  const fone  = so(b.telefone);
  const cep   = so(b.cep);
  const faltando = [];
  if (nome.split(' ').length < 2) faltando.push('nome completo');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) faltando.push('e-mail');
  if (cpf.length !== 11 && cpf.length !== 14)     faltando.push('CPF ou CNPJ');
  if (fone.length < 10)                            faltando.push('WhatsApp');
  if (cep.length !== 8)                            faltando.push('CEP');
  const c = b.cartao || {};
  if (!so(c.numero) || so(c.numero).length < 13)   faltando.push('número do cartão');
  if (!so(c.mes) || !so(c.ano))                    faltando.push('validade do cartão');
  if (!so(c.cvv))                                  faltando.push('CVV');
  if (!(c.titular || '').trim())                   faltando.push('nome impresso no cartão');
  if (faltando.length) return resp(400, { erro: 'Confira: ' + faltando.join(', ') + '.' });

  // IP de quem está comprando — o Asaas exige, e recusa IP de servidor
  const ip = (event.headers['x-nf-client-connection-ip']
           || (event.headers['x-forwarded-for'] || '').split(',')[0]
           || '').trim();

  try {
    // ── 1. cliente: reaproveita se o CPF já existe, cria se não ──
    let clienteId = null;
    const busca = await asaas('/customers?cpfCnpj=' + cpf, 'GET', null, KEY);
    if (busca.ok && busca.data && Array.isArray(busca.data.data) && busca.data.data.length) {
      clienteId = busca.data.data[0].id;
    } else {
      const novo = await asaas('/customers', 'POST', {
        name: nome, email, cpfCnpj: cpf, mobilePhone: fone, postalCode: cep,
        notificationDisabled: false,
      }, KEY);
      if (!novo.ok) return resp(400, { erro: erroLegivel(novo.data) });
      clienteId = novo.data.id;
    }

    // ── 2. cobrança com cartão ──
    const hoje = new Date().toISOString().slice(0, 10);
    const cobranca = {
      customer: clienteId,
      billingType: 'CREDIT_CARD',
      dueDate: hoje,
      description: plano.nome,
      externalReference: 'muvhub-' + b.plano,
      remoteIp: ip,
      creditCard: {
        holderName: (c.titular || '').trim().toUpperCase(),
        number: so(c.numero),
        expiryMonth: so(c.mes).padStart(2, '0'),
        expiryYear: so(c.ano).length === 2 ? '20' + so(c.ano) : so(c.ano),
        ccv: so(c.cvv),
      },
      creditCardHolderInfo: {
        name: nome, email, cpfCnpj: cpf, mobilePhone: fone,
        postalCode: cep,
        addressNumber: (b.numero || 'S/N').toString().trim() || 'S/N',
      },
    };
    if (plano.parcelas > 1) {
      cobranca.installmentCount = plano.parcelas;
      cobranca.totalValue = plano.valor;
    } else {
      cobranca.value = plano.valor;
    }

    // assinatura recorrente usa outro endpoint e cobra sozinha todo mês
    let pag;
    if (plano.assinatura) {
      delete cobranca.dueDate;
      cobranca.nextDueDate = hoje;
      cobranca.cycle = plano.assinatura;
      cobranca.value = plano.valor;
      pag = await asaas('/subscriptions', 'POST', cobranca, KEY);
    } else {
      pag = await asaas('/payments', 'POST', cobranca, KEY);
    }
    if (!pag.ok) return resp(400, { erro: erroLegivel(pag.data) });

    // numa assinatura, o Asaas devolve o status da assinatura, não do pagamento
    const st = plano.assinatura ? (pag.data.status === 'ACTIVE' ? 'CONFIRMED' : pag.data.status) : pag.data.status;
    const aprovado = st === 'CONFIRMED' || st === 'RECEIVED' || st === 'RECEIVED_IN_CASH';
    return resp(200, {
      ok: aprovado,
      status: st,
      id: pag.data.id,
      plano: plano.nome,
      erro: aprovado ? null : 'A operadora não confirmou o pagamento. Tente outro cartão ou fale com a gente.',
    });
  } catch (e) {
    // nunca logar corpo da requisição: contém dados de cartão
    console.error('[criar-cobranca] falha inesperada:', e && e.message);
    return resp(500, { erro: 'Tivemos um problema ao processar. Nenhuma cobrança foi feita. Tente de novo em instantes.' });
  }
};
