// Conteúdo das landings de tráfego pago em /lp/<slug>/, uma por serviço.
// Módulo neutro (sem "use client"), como app/eventos/conteudo.js: o mesmo
// texto alimenta a página (LandingServico em app/MuvApp.jsx) e o metadata
// (app/lp/[slug]/page.js).
//
// Estas páginas são noindex e ficam fora do sitemap: existem para o anúncio,
// não para a busca orgânica, onde quem responde é /servicos/<slug>/.

export const LP_PRAZOS = ["Este mês", "Em 1 a 3 meses", "Ainda sem data"];

// hero.base + "-<largura>.<avif|jpg>" em public/assets/lp/. As larguras
// variam porque parte dos stills de origem é vertical, com 1080 px de largura:
// gerar 1920 a partir deles só aumentaria o arquivo.
// Marca sem logo em BRAND_LOGOS (app/MuvApp.jsx) aparece com o nome em texto.
export const LANDINGS = {
  institucional: {
    path: "/lp/institucional/",
    title: "Vídeo Institucional para Empresas em SP | Grupo MUV",
    desc: "Filme institucional, manifesto e depoimentos com direção de cinema, captados na sua operação. Produtora audiovisual em São Paulo.",
    eyebrow: "MUV Studio · Institucional e corporativo",
    h1: "Vídeo institucional com cara de empresa que se leva a sério.",
    sub: "Filme institucional, manifesto e depoimentos com direção de cinema, captados na sua operação. Sem cara de vídeo de treinamento.",
    hero: {
      base: "/assets/lp/institucional-hero",
      larguras: [640, 1080],
      alt: "Palestrante no palco do XP Expert, em captação do Grupo MUV" },
    marcas: ["XP Investimentos", "Diageo"],
    formatos: [
      { t: "Filme institucional e manifesto", d: "O filme que apresenta a empresa, com roteiro construído a partir do que ela precisa comunicar e para quem." },
      { t: "Depoimentos e entrevistas com pauta dirigida", d: "Perguntas preparadas e aprovadas antes. A pessoa responde, não decora, e o recorte acontece na edição." },
      { t: "Séries B2B e cortes para LinkedIn", d: "Ciclo mensal de entrevistas curtas que constrói autoridade continuamente. O mesmo material rende as peças de LinkedIn e de comunicação interna." }],
    formTitulo: "Orçamento de vídeo institucional",
    filtro: "Atendemos empresas, marcas e agências.",
    tipos: ["Filme institucional", "Depoimentos", "Série recorrente", "Outro"],
    formName: "orcamento_lp_institucional",
    projectType: "Institucional e corporativo",
    scope: "Institucional",
    origem: "Landing · Institucional",
    faq: [
      { q: "Quanto tempo leva?", a: "De 3 a 5 semanas, do briefing ao filme final. Séries recorrentes rodam em ciclo mensal." },
      { q: "Vocês filmam na nossa empresa?", a: "Sim. Fábrica, escritório ou operação, em São Paulo ou com a equipe viajando." },
      { q: "O que vem junto?", a: "Roteiro, captação, edição e versões curtas para LinkedIn e comunicação interna. Tudo detalhado na proposta." }] },

  redes: {
    path: "/lp/redes/",
    title: "Conteúdo em Vídeo para Redes Sociais em SP | Grupo MUV",
    desc: "Reels, vídeos verticais e criativos para mídia paga com a mesma linguagem visual do começo ao fim. Produtora audiovisual em São Paulo.",
    eyebrow: "MUV Studio · Conteúdo para redes",
    h1: "Uma diária de filmagem, semanas de feed.",
    sub: "Reels, verticais e criativos para mídia paga com a mesma linguagem visual do começo ao fim. O feed parece de uma marca só.",
    hero: {
      base: "/assets/lp/redes-hero",
      larguras: [640, 1080],
      alt: "Apresentadora grava conteúdo vertical em lançamento da Clear, em captação do Grupo MUV" },
    marcas: ["MAC Cosmetics", "Kylie Cosmetics", "Clear", "Budweiser"],
    formatos: [
      { t: "Reels e vídeos verticais", d: "Enquadrado em 9:16 já na captação, com espaço real para legenda, interface e o corte de cada plataforma." },
      { t: "Criativos para anúncios", d: "Versões com gancho nos três primeiros segundos, para rodar em anúncio e não só no orgânico." },
      { t: "Captação com influenciador e bastidor", d: "Setup leve de luz e áudio, com registro do making of, que em muitos casos performa tanto quanto a peça principal." }],
    formTitulo: "Orçamento de conteúdo para redes",
    filtro: "Atendemos marcas, empresas e agências.",
    tipos: ["Pacote mensal", "Diária avulsa", "Criativos para anúncios", "Outro"],
    formName: "orcamento_lp_redes",
    projectType: "Conteúdo para redes",
    scope: "Conteúdo Social",
    origem: "Landing · Redes",
    faq: [
      { q: "Quantas peças saem de uma diária?", a: "Definimos no briefing, conforme o calendário e os formatos de cada rede." },
      { q: "Em quanto tempo recebo?", a: "Entregas semanais a partir da primeira diária." },
      // CONFIRMAR COM VICTOR ANTES DE PUBLICAR. Resposta montada a partir do
      // que /servicos/conteudo-para-redes/ já diz ("Não é gestão de redes: a
      // gente produz, quem publica é você ou sua agência").
      { q: "Vocês postam nas redes?", a: "Não. A gente produz o conteúdo, e quem publica é você ou a sua agência." }] },

  publicidade: {
    path: "/lp/publicidade/",
    title: "Produtora de Filme Publicitário em SP | Grupo MUV",
    desc: "Filme de campanha com pré-produção completa, direção de fotografia e finalização em 16:9, 9:16 e 1:1. Produtora audiovisual em São Paulo.",
    eyebrow: "MUV Studio · Captação publicitária",
    h1: "Filme de campanha com direção no set, não só câmera.",
    sub: "Pré-produção completa, direção de fotografia e finalização com versões 16:9, 9:16 e 1:1 prontas para veicular.",
    hero: {
      base: "/assets/lp/publicidade-hero",
      larguras: [640, 1080, 1920],
      alt: "Cena do filme Convocasso, do Itaú, com captação do Grupo MUV" },
    marcas: ["Itaú", "Nissan"],
    formatos: [
      { t: "Filme principal e versões", d: "O master mais os cortes de cada canal, versionados dentro da mesma edição e com a mesma direção." },
      { t: "Pré-produção e direção no set", d: "Casting, locação e plano de produção fechados antes da diária. No set, cada decisão de luz, lente e movimento responde ao roteiro." },
      { t: "Banco de assets always-on", d: "O que sobra da captação vira acervo utilizável, em vez de bruto esquecido no HD depois da campanha." }],
    formTitulo: "Orçamento de filme publicitário",
    filtro: "Atendemos marcas e agências.",
    tipos: ["Filme de campanha", "Comercial para TV ou digital", "Pacote de assets", "Outro"],
    formName: "orcamento_lp_publicidade",
    projectType: "Captação publicitária",
    scope: "Captação Publicitária",
    origem: "Landing · Publicidade",
    faq: [
      { q: "Quanto tempo leva?", a: "De 4 a 8 semanas, do briefing ao master." },
      { q: "Vocês trabalham com agências?", a: "Sim. Entramos como produtora da agência ou direto com a marca." },
      { q: "Fazem drone?", a: "Quando o roteiro pede, captação aérea entra no plano de produção." }] },

  "branded-content": {
    path: "/lp/branded-content/",
    title: "Branded Content e Documentário de Marca em SP | Grupo MUV",
    desc: "Documentário, websérie e branded content que o público assiste por vontade própria. Produtora audiovisual em São Paulo.",
    eyebrow: "MUV Studio · Documental e branded content",
    h1: "A marca dentro da história, não em cima dela.",
    sub: "Documentário, websérie e branded content que o público assiste por vontade própria.",
    hero: {
      base: "/assets/lp/branded-content-hero",
      larguras: [640, 1080, 1920],
      alt: "Retrato do filme para Dolce & Gabbana, com captação do Grupo MUV" },
    marcas: ["Dolce & Gabbana", "Consul"],
    formatos: [
      { t: "Documentário de marca", d: "Apuração e pesquisa antes da filmagem, captação documental com direção de fotografia e câmera B." },
      { t: "Websérie", d: "Série para construir audiência, de minisséries a temporadas recorrentes." },
      { t: "Teaser e cortes de distribuição", d: "Peças curtas pensadas para levar público ao filme, planejadas junto com o filme e não depois dele." }],
    formTitulo: "Orçamento de branded content",
    filtro: "Atendemos marcas, empresas e agências.",
    tipos: ["Documentário", "Websérie", "Branded content", "Outro"],
    formName: "orcamento_lp_branded",
    projectType: "Documental e branded content",
    scope: "Documentário",
    origem: "Landing · Branded content",
    faq: [
      { q: "Quanto tempo leva?", a: "De 3 a 6 semanas, com apuração antes da filmagem." },
      { q: "Qual a diferença para um comercial?", a: "O comercial vende o produto. O branded content conta uma história em que a marca faz sentido, e por isso é assistido até o fim." },
      { q: "Vocês fazem séries?", a: "Sim, de minisséries a temporadas recorrentes." }] } };

export const LP_SLUGS = Object.keys(LANDINGS);
