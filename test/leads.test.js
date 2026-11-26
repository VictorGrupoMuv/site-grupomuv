const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { prepararLead, contemCartao } = require('../lib/leads');
const { montarCheckout, urlDoCheckout, PLANOS } = require('../lib/checkout');

const agora = new Date('2026-11-26T18:00:00.000Z');

test('lead de orçamento grava os campos pedidos e ignora a data do navegador', () => {
  const r = prepararLead({
    formulario: 'orcamento',
    nome: 'Ana Lima',
    empresa: 'Casa Lima',
    email: 'Ana@Casa.com',
    fone: '(11) 98888-7777',
    mensagem: 'Preciso de cobertura no dia 12.',
    pagina: '/eventos/?utm_source=google',
    origem: 'Landing · Eventos',
    utm: { utm_source: 'google', utm_medium: 'cpc', gclid: 'abc', extra: 'nao' },
    criado_em: '2000-01-01T00:00:00.000Z',
  }, agora);
  assert.equal(r.linha.email, 'ana@casa.com');
  assert.equal(r.linha.nome, 'Ana Lima');
  assert.equal(r.linha.empresa, 'Casa Lima');
  assert.equal(r.linha.fone, '(11) 98888-7777');
  assert.equal(r.linha.pagina, '/eventos/?utm_source=google');
  assert.deepEqual(r.linha.utm, { utm_source: 'google', utm_medium: 'cpc', gclid: 'abc' });
  assert.equal(r.linha.criado_em, '2026-11-26T18:00:00.000Z');
});

test('newsletter só com e-mail passa', () => {
  const r = prepararLead({ formulario: 'newsletter', email: 'a@b.co', pagina: '/blog/' }, agora);
  assert.equal(r.linha.email, 'a@b.co');
  assert.equal(r.linha.nome, null);
});

test('sem e-mail e sem telefone é recusado', () => {
  const r = prepararLead({ formulario: 'orcamento', nome: 'Ana' }, agora);
  assert.equal(r.erro, 'Informe um e-mail ou um telefone.');
});

test('honeypot preenchido não vira lead', () => {
  const r = prepararLead({
    formulario: 'orcamento', email: 'a@b.co', botField: 'compre agora',
  }, agora);
  assert.equal(r.spam, true);
  assert.equal(r.linha, undefined);
});

test('formulário desconhecido é recusado', () => {
  const r = prepararLead({ formulario: 'outro', email: 'a@b.co' }, agora);
  assert.match(r.erro, /desconhecido/);
});

test('dado de cartão no lead é recusado e não entra na linha', () => {
  const r = prepararLead({
    formulario: 'hub-cadastro',
    email: 'a@b.co',
    cartao: { numero: '4111111111111111', cvv: '123' },
  }, agora);
  assert.match(r.erro, /cartão/);
  assert.equal(contemCartao(r.linha), false);
});

test('checkout do sinal não leva cartão e o preço é o do servidor', () => {
  const r = montarCheckout({
    plano: 'sinal',
    nome: 'Ana Lima',
    email: 'ana@casa.com',
    telefone: '(11) 98888-7777',
    cpfCnpj: '529.982.247-25',
    cep: '01419-000',
    valor: 1,
  }, agora);
  assert.equal(r.payload.items[0].value, PLANOS.sinal.valor);
  assert.equal(r.payload.items[0].value, 300);
  assert.deepEqual(r.payload.billingTypes, ['PIX', 'CREDIT_CARD']);
  assert.equal(JSON.stringify(r.payload).includes('4111'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(r.payload, 'creditCard'), false);
  assert.equal(r.payload.callback.successUrl, 'https://grupomuv.com.br/hub/cadastro/?ok=1');
});

test('mensal vira assinatura e o anual vira parcelamento, sem dado de cartão', () => {
  const mensal = montarCheckout({
    plano: 'mensal', nome: 'Ana Lima', email: 'ana@casa.com',
    telefone: '11988887777', cpfCnpj: '52998224725',
  }, agora);
  assert.deepEqual(mensal.payload.chargeTypes, ['RECURRENT']);
  assert.equal(mensal.payload.subscription.cycle, 'MONTHLY');
  assert.equal(mensal.payload.subscription.nextDueDate, '2026-11-26');

  const anual = montarCheckout({
    plano: 'anual12', nome: 'Ana Lima', email: 'ana@casa.com',
    telefone: '11988887777', cpfCnpj: '52998224725',
  }, agora);
  assert.equal(anual.payload.installment.maxInstallmentCount, 12);
  assert.equal(anual.payload.items[0].value, 9480);
});

test('checkout recusa corpo com cartão e não monta payload', () => {
  const r = montarCheckout({
    plano: 'sinal', nome: 'Ana Lima', email: 'ana@casa.com',
    telefone: '11988887777', cpfCnpj: '52998224725',
    cartao: { numero: '4111111111111111', cvv: '123' },
  }, agora);
  assert.match(r.erro, /cartão/);
  assert.equal(r.payload, undefined);
});

test('link do checkout só aceita domínio do Asaas', () => {
  assert.equal(urlDoCheckout({ link: 'https://sandbox.asaas.com/checkoutSession/show/abc' }), 'https://sandbox.asaas.com/checkoutSession/show/abc');
  assert.equal(urlDoCheckout({ link: 'https://evil.example/asaas.com/x' }), '');
  assert.equal(urlDoCheckout({ id: '131ca662-56c8-4479-b5b3-fd61a413fce7' }), 'https://asaas.com/checkoutSession/show?id=131ca662-56c8-4479-b5b3-fd61a413fce7');
});

test('o cadastro do Hub não tem campo de cartão ativo', () => {
  const html = fs.readFileSync('public/hub/cadastro/index.html', 'utf8');
  const vivo = html.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal(vivo.includes('ccnum'), false);
  assert.equal(vivo.includes('cccvv'), false);
  assert.equal(vivo.includes('cartao:'), false);
});

test('a função publicada não contém o handler antigo de cartão', () => {
  const viva = fs.readFileSync('netlify/functions/criar-cobranca.js', 'utf8');
  assert.equal(viva.includes('creditCard'), false);
  assert.equal(viva.includes('holderName'), false);
  const legado = fs.readFileSync('netlify/legado/criar-cobranca-cartao.js', 'utf8');
  assert.match(legado, /DESATIVADO/);
  assert.match(legado, /throw new Error/);
  assert.equal(fs.existsSync('netlify/functions/criar-cobranca-cartao.js'), false);
});
