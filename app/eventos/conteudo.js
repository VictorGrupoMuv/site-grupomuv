// Conteúdo da landing /eventos/. Módulo neutro (sem "use client") porque o
// mesmo texto alimenta a página (app/MuvApp.jsx) e o schema FAQPage
// (app/eventos/page.js): os dois precisam dizer exatamente a mesma coisa.

// Preço de entrada. null = não mostra. Com valor (ex.: "4.900"), a última
// resposta do FAQ ganha a frase "Coberturas a partir de R$ X."
export const PRECO_A_PARTIR = null;

// Os logos vêm de BRAND_LOGOS (app/MuvApp.jsx). Marca sem logo lá aparece
// com o nome em texto no quadro.
export const EVENTOS_MARCAS = ["Itaú", "Ambev", "Shell", "Corona", "Adidas", "Brastemp"];

export const EVENTOS_PALCOS = ["Lollapalooza", "Primavera Sound", "Rock in Rio", "Kings League", "Stock Car", "Carnaval de São Paulo"];

export const EVENTOS_FORMATOS = [
  { t: "Tempo real", d: "Reels, stories e fotos editados no evento e publicados no ritmo da programação. Para a marca que quer estar no feed enquanto o público ainda está lá." },
  { t: "Aftermovie", d: "Filme com direção, trilha e cor, entregue depois do evento. O registro que vira peça de campanha, de venda e argumento para o próximo patrocínio." },
  { t: "Corporativo", d: "Convenções, congressos, lançamentos e encontros de vendas. Palestras em takes curtos, depoimentos e informação em lettering, não slide filmado." }];

export const EVENTOS_PASSOS = [
  { t: "Briefing e pautas", d: "Antes do evento, alinhamos objetivo, programação e pautas. Chegamos sabendo o que precisa sair e em que horário." },
  { t: "Equipe em campo", d: "Vídeo, foto, creator quando faz sentido e editor no local." },
  { t: "Edição no evento", d: "O material sai durante o dia, no formato de cada rede, com aprovação rápida pelo WhatsApp." },
  { t: "Entrega e direitos", d: "Arquivos organizados, aftermovie no prazo combinado e direitos de uso definidos na proposta." }];

// `still` e `slug` são opcionais: sem foto o card mostra o quadro vazio do
// site, sem slug não vira link.
export const EVENTOS_CASES = [
  { t: "Guaraná Antarctica no Carnaval", d: "Blocos cobertos em tempo real, com conteúdo publicado durante o desfile.",
    slug: "guarana-monobloco", still: "/assets/eventos/hero-1080.jpg", label: "CARNAVAL · SÃO PAULO" },
  { t: "Buy Ticket no Rock in Rio", d: "Captação, creators e edição em campo. Material para 7 dias de postagem captado em 2 dias de festival.",
    label: "ROCK IN RIO" },
  { t: "Congresso médico em Ribeirão Preto", d: "Stories editados todos os dias, até 100 fotos tratadas e vídeo de encerramento, com equipe viajando.",
    label: "RIBEIRÃO PRETO" }];

export const EVENTOS_PARA_QUEM = [
  "Marcas com ativação, patrocínio ou estande",
  "Agências que precisam de time de execução",
  "Empresas com convenção, congresso, lançamento ou evento interno",
  "Festivais e produtoras de eventos"];

export const EVENTOS_NAO_E = "Não fazemos casamento, aniversário, formatura e eventos sociais. Nesses casos, indicamos quem faz isso muito bem.";

const ORCAMENTO = "Você manda data, cidade e o que precisa sair. Voltamos com escopo, equipe, prazos e investimento.";

export const EVENTOS_FAQ = [
  { q: "Em quanto tempo o conteúdo fica pronto?", a: "Em tempo real, os primeiros posts saem no mesmo dia, em horários combinados com você. Aftermovie e fotos completas, no prazo da proposta." },
  { q: "Quantas pessoas vão?", a: "Depende do porte e das entregas. Coberturas menores rodam com 2 pessoas; festivais, com time completo de captação, creators e edição." },
  { q: "Vocês viajam?", a: "Sim. Base em São Paulo, coberturas em todo o Brasil. Deslocamento e hospedagem entram na proposta." },
  { q: "Quem fica com os direitos?", a: "Canais, prazo e mídia paga ficam definidos na proposta. Sem surpresa depois." },
  { q: "Como funciona o orçamento?", a: PRECO_A_PARTIR ? `${ORCAMENTO} Coberturas a partir de R$ ${PRECO_A_PARTIR}.` : ORCAMENTO }];
