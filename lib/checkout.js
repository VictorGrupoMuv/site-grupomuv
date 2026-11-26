// Monta o checkout hospedado do Asaas. Não há campo de cartão neste módulo:
// o número e o CVV só são digitados na página do Asaas.

const { contemCartao } = require('./leads');

// Valores no servidor de propósito. Se viessem do navegador, daria para
// editar o pedido e pagar outro preço.
const PLANOS = {
  sinal: {
    nome: 'Sinal de reserva · MUV Hub Turma 01',
    item: 'Sinal MUV Hub',
    valor: 300,
    billingTypes: ['PIX', 'CREDIT_CARD'],
    chargeTypes: ['DETACHED'],
  },
  mensal: {
    nome: 'Mensalidade Fundador · MUV Hub Turma 01',
    item: 'Mensal Fundador Hub',
    valor: 890,
    billingTypes: ['CREDIT_CARD'],
    chargeTypes: ['RECURRENT'],
    assinatura: 'MONTHLY',
  },
  anualPix: {
    nome: 'Anual Fundador · MUV Hub Turma 01',
    item: 'Anual Fundador Hub',
    valor: 8900,
    billingTypes: ['PIX'],
    chargeTypes: ['DETACHED'],
  },
  anual12: {
    nome: 'Anual Fundador 12x · MUV Hub Turma 01',
    item: 'Anual 12x Fundador Hub',
    valor: 9480,
    billingTypes: ['CREDIT_CARD'],
    chargeTypes: ['INSTALLMENT'],
    parcelas: 12,
  },
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE = 'https://grupomuv.com.br';

// Pixel transparente. O schema do checkout marca imagem do item como
// obrigatória; não é dado de ninguém.
const PIXEL = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

const so = (v) => String(v == null ? '' : v).replace(/\D/g, '');
const texto = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);

function dia(agora) {
  const d = agora instanceof Date ? agora : new Date();
  return d.toISOString().slice(0, 10);
}

// Devolve { erro } ou { payload, plano }. O payload vai para POST /v3/checkouts.
function montarCheckout(body, agora) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { erro: 'Requisição inválida.' };
  }
  if (contemCartao(body)) {
    return { erro: 'Não envie dados de cartão. O pagamento abre na página do Asaas.' };
  }

  const plano = PLANOS[body.plano];
  if (!plano) return { erro: 'Plano inválido.' };

  const nome = texto(body.nome, 120);
  const email = texto(body.email, 200).toLowerCase();
  const cpf = so(body.cpfCnpj);
  const fone = so(body.telefone || body.fone);
  const cep = so(body.cep);
  const faltando = [];
  if (nome.split(/\s+/).filter(Boolean).length < 2) faltando.push('nome completo');
  if (!EMAIL.test(email)) faltando.push('e-mail');
  if (cpf.length !== 11 && cpf.length !== 14) faltando.push('CPF ou CNPJ');
  if (fone.length < 10 || fone.length > 15) faltando.push('WhatsApp');
  if (cep && cep.length !== 8) faltando.push('CEP');
  if (faltando.length) return { erro: 'Confira: ' + faltando.join(', ') + '.' };

  const hoje = dia(agora);
  const customerData = { name: nome, cpfCnpj: cpf, email, phone: fone };
  if (cep.length === 8) customerData.postalCode = cep;

  const payload = {
    billingTypes: plano.billingTypes,
    chargeTypes: plano.chargeTypes,
    minutesToExpire: 180,
    externalReference: 'muvhub-' + body.plano,
    callback: {
      successUrl: SITE + '/hub/cadastro/?ok=1',
      cancelUrl: SITE + '/hub/cadastro/',
      expiredUrl: SITE + '/hub/cadastro/?expirado=1',
    },
    items: [{
      name: plano.item,
      description: plano.nome.slice(0, 150),
      quantity: 1,
      value: plano.valor,
      imageBase64: PIXEL,
    }],
    customerData,
  };

  if (plano.assinatura) {
    payload.subscription = { cycle: plano.assinatura, nextDueDate: hoje };
  }
  if (plano.parcelas) {
    payload.installment = { maxInstallmentCount: plano.parcelas };
  }

  return { payload, plano };
}

function urlDoCheckout(data) {
  if (data && typeof data.link === 'string' && /^https:\/\/[a-z0-9.-]*asaas\.com\//i.test(data.link)) {
    return data.link;
  }
  if (data && typeof data.id === 'string' && /^[0-9a-f-]{32,36}$/i.test(data.id)) {
    return 'https://asaas.com/checkoutSession/show?id=' + data.id;
  }
  return '';
}

module.exports = { PLANOS, SITE, montarCheckout, urlDoCheckout };
