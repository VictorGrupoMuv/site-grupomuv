// pages.jsx — todas as páginas do site MUV
const { useState, useEffect, useRef } = React;

// ───── Dados ─────────────────────────────────────────────────────────────────
const SERVICOS = [
{
  num: "01",
  tag: "Estratégia",
  title: "Pensamos antes de ligar a câmera.",
  desc: "Briefing, posicionamento, narrativa e distribuição fazem parte do escopo. Cada frame tem intenção.",
  items: ["Discovery & briefing", "Posicionamento de conteúdo", "Roteiro & narrativa", "Estratégia de distribuição"]
},
{
  num: "02",
  tag: "Produção",
  title: "Captação\ncinematográfica.",
  desc: "Sony FX3/FX6, drones DJI, iluminação controlada, direção criativa e workflow otimizado.",
  items: ["Direção criativa", "Captação multi-câmera", "Drone & aéreo", "Iluminação & som"]
},
{
  num: "03",
  tag: "Conteúdo",
  title: "Pronto pra plataforma certa.",
  desc: "Entregamos peças nos formatos certos, com a linguagem certa, pra distribuição que faz sentido.",
  items: ["Edição & finalização", "Color grading", "Motion graphics", "Adaptação multi-formato"]
},
{
  num: "04",
  tag: "Comunidade",
  title: "Hub criativo, não fornecedor.",
  desc: "Relações de longo prazo, troca, parceria. MUV Hub conecta filmmakers, marcas e cultura.",
  items: ["Acesso a equipe sênior", "Studio & locadora", "Eventos & networking", "Mentorias & conteúdo"]
}];


const PROCESSO = [
{ num: "01", title: "Ideia", desc: "Briefing, escuta, mergulho no negócio. A gente quer entender o que move sua marca antes de propor qualquer coisa.", deliverables: "Briefing · Discovery · Diagnóstico" },
{ num: "02", title: "Roteiro", desc: "Estratégia narrativa traduzida em roteiro, storyboard, mood board e cronograma. Tudo aprovado antes da produção.", deliverables: "Roteiro · Storyboard · Mood" },
{ num: "03", title: "Direção", desc: "Pré-produção completa: casting, locação, decupagem, plano de produção. Sem improviso no set.", deliverables: "Plano · Casting · Locação" },
{ num: "04", title: "Captação", desc: "Equipe sênior, equipamento profissional, direção criativa no set. Backup de tudo, sempre.", deliverables: "Sony FX3/FX6 · Drone · Som" },
{ num: "05", title: "Pós", desc: "Edição, color grade cinematográfico, sound design, motion graphics. Rounds de aprovação claros.", deliverables: "Edit · Color · Motion · Mix" },
{ num: "06", title: "Entrega", desc: "Versões pra cada plataforma, no formato certo. Pacote de assets organizado e arquivado.", deliverables: "Master · Cortes · Assets" }];


const TRABALHOS = [
{
  slug: "convocasso-itau",
  title: "CONVOCASSO\nItaú",
  client: "Itaú × África Creative",
  tag: "CASE FILM · 60s",
  year: "2026",
  category: "Brand film",
  format: "Case film publicitário (cobertura de ação OOH)",
  team: "4 pessoas — filmmaker D1+D2, filmmaker parceiro, piloto de drone, editor",
  gear: "Sony FX3 · A7CII · GMaster 16-35 / 24-70 / 35mm · Sony 70-200 · DJI Mini 4 Pro / Avata",
  summary: "Ação OOH publicitária real-time pra convocação da Seleção Brasileira. Quatro fases na Paulista, 24h pra edição.",
  body: [
    { h: "Contexto", p: "A África Creative trouxe uma ação do Itaú pra cima do calendário esportivo mais carregado do ano: o dia da convocação da Seleção Brasileira. O conceito era CONVOCASSO — uma ativação OOH viva, com quatro fases na cidade de São Paulo: peça \"ansioso pré\", peça pré-convocação 30 minutos antes do anúncio, OOH com transmissão ao vivo nos pontos físicos da Avenida Paulista (171 e 1912), e peça conceito pós-convocação. Faltavam três dias quando o briefing entrou de forma definitiva." },
    { h: "Desafio", p: "Capturar uma ação publicitária que só existe enquanto ela acontece — e transformar isso num case film entregue em 24h pra começar a rodar em mídia. Janela de captação de basicamente um dia, com pré-captação no dia anterior e edição no dia seguinte. Operação multi-ponto numa Paulista cheia, sem poder ensaiar, sem poder repetir. Direitos de uso comercial nacional por dois meses já contratados." },
    { h: "Abordagem MUV", p: "A gente entrou na pré sabendo que o segredo do projeto era logística. Mapeamos a Paulista em quatro pontos com tempo de deslocamento entre eles, alinhamos com a África quem era o representante de set pra alinhamento real-time, e desenhamos uma operação de guerrilha multi-ponto com agilidade e cobertura simultânea. FX3 e A7CII como dupla, lentes GMaster 16-35 pra contexto urbano amplo, 70-200 pra cobertura distante das reações nas calçadas, 35mm pra estética de rua. Tudo gravando em S-Log3, com color base aplicada na edição." },
    { h: "Resultado", p: "Entrega rodou no prazo contratado. O case film entrou em circulação comercial nos dois formatos (9x16 e 16x9), em mídia nacional, dentro da janela de dois meses prevista no contrato. Primeira entrega pra África Creative numa ação de marca dessa relevância — projeto que valida a MUV como produtora que opera com agilidade publicitária sem perder camada cinematográfica." }
  ]
},
{
  slug: "isla-gatorade-orlando",
  title: "Seleção em\nOrlando",
  client: "ISLA / Gatorade × CBF",
  tag: "FOOTAGE INSTITUCIONAL",
  year: "2026",
  category: "Documentário",
  format: "Footage institucional + publicitário (captação internacional)",
  team: "3 filmmakers — DOP, operador de câmera, assistente",
  gear: "Sony FX6 · 2x FX3 · GMaster 16-35 / 24-70 / 35 · Sony FE 70-200 / 200-600 · Cine 7Artisans · Laowa 10mm · Ronin RS3 Mini",
  summary: "Captação da Seleção Brasileira no Camping World Stadium pra alimentar o banco audiovisual da Gatorade.",
  body: [
    { h: "Contexto", p: "A ISLA chegou com um pedido que carregava peso simbólico grande: captar footage da Seleção Brasileira em Orlando, no Camping World Stadium, pra alimentar o banco audiovisual da Gatorade em parceria com a CBF. Material que ia virar publicidade, institucional e ativação — captação pensada pra ter vida longa, virar peça de campanha, aparecer recortada num comercial seis meses depois." },
    { h: "Desafio", p: "Operar em ambiente de acesso controlado, com equipe enxuta, em outro país, em duas diárias (27/03 e 31/03), entregando material bruto com qualidade de cinema. Discrição, mobilidade, qualidade técnica consistente entre as duas câmeras principais, versatilidade do plano fechado de atleta ao plano geral de estádio com 600mm. Logística internacional embutida: passagens, transporte local, estadia, seguros, contingência." },
    { h: "Abordagem MUV", p: "Operação desenhada em torno de três funções específicas — DOP, operador de câmera e assistente — todos habilitados pra captar simultaneamente. Equipe lateral: três pessoas podendo virar três câmeras ao mesmo tempo, ou se concentrar em uma cena maior. FX6 como câmera principal pra cinema-look, duas FX3 pra mobilidade, todas rodando S-Log3 com mesmo padrão de exposição. Backup duplo em SSDs (1TB e 2TB Sandisk), loggagem em campo, color grading básico já aplicado na entrega." },
    { h: "Resultado", p: "Materiais brutos organizados e com color grade básico entregues no prazo. A operação rodou sem ruído logístico, equipamento voltou inteiro, e o material entrou no banco da Gatorade pronto pra desdobramentos futuros. Marco de operação internacional com equipe reduzida e setup cinematográfico — modelo que a MUV quer expandir pra outras captações fora do Brasil." }
  ]
},
{
  slug: "adidas-runners",
  title: "Adidas\nRunners",
  client: "Adidas × Valiant",
  tag: "EVENTO · SOCIAL · 2 DIAS",
  year: "2026",
  category: "Cobertura",
  format: "Cobertura de evento + branded social",
  team: "3 pessoas — fotógrafo, filmmaker, assistente — operação multi-ponto",
  gear: "Sony A7III, A7IV, FX3 · GMaster 16-35 / 24-70 / 35mm · Laowa 10mm · LED Aputure · Flash Godox · Intercom",
  summary: "Dois dias, dois contextos: evento fechado em Alphaville com entrega real-time + treinão aberto no Ibirapuera.",
  body: [
    { h: "Contexto", p: "A Adidas estava reposicionando peso na comunidade de running brasileira. Acabava de assumir parcerias que historicamente eram de outra marca, e o desafio do time não era mais \"ter produto bom\" — era recuperar pertencimento na cena. O briefing chegou via Valiant, agência que cuida da parte de relacionamento estratégico com assessorias, atletas, influenciadores e os Adidas Runners." },
    { h: "Desafio", p: "Dois dias seguidos, dois contextos completamente diferentes. Dia 1: evento fechado no escritório de Alphaville, formato instagramável, até 100 convidados — influência, AR, atletas, palestras e ambientação de marca, com entrega parcial em real-time pro time poder postar enquanto o evento ainda rolava. Dia 2: treinão aberto no Ibirapuera, captação documental, sem pressão de feed mas com o peso simbólico de marcar a chegada da marca naquele território." },
    { h: "Abordagem MUV", p: "Em Alphaville: operação dupla — fotógrafo dedicado ao registro de marca, filmmaker em segunda câmera capturando interação real, assistente fazendo backup e enviando primeiras fotos pro time da agência durante o evento. A cada 30-40 minutos um lote de fotos selecionadas saía pro WhatsApp do cliente, já com tratamento da Adidas em LUT no Lightroom. No Ibirapuera: foco em narrativa — corredor real, comunidade real, luz natural da manhã, lente 35mm pra ficar próximo sem ser invasivo, Laowa 10mm pra capturar o coletivo em movimento." },
    { h: "Resultado", p: "Time da Valiant validou as fotos do Dia 1 durante a captação, cliente começou a postar antes do evento terminar. Material do Dia 2 entrou em circulação interna como bank pra desdobramentos futuros. Mais importante: o trabalho abriu relação. Na sequência fechamos cobertura da Kings Nation no Allianz Parque, também pra Adidas, com a mesma equipe — sinal claro de que o primeiro entregável funcionou." }
  ]
},
{
  slug: "nissan-kicks-suba",
  title: "Nissan\nKicks",
  client: "Nissan × Suba",
  tag: "BRANDED · 6 VERTICAIS",
  year: "2025",
  category: "Brand film",
  format: "Branded content (6 verticais + 12 fotos + backstage)",
  team: "Equipe enxuta — filmmaker, fotógrafo, assistente",
  gear: "Sony FX3 · A73 · Insta 360 · GMaster 16-35 / 24-70 / 35 / 70-200mm · Cine 7Artisans T2 35/50/85mm · Aputure F22c/F21c · DJI Avata",
  summary: "Social-first pros quatro pilares do Kicks: conforto, tecnologia, dirigibilidade, segurança.",
  body: [
    { h: "Contexto", p: "A Nissan chegou via Suba com o briefing do Kicks. O carro já tem campanha consolidada, mas a marca queria social-first — conteúdo nativo de feed, vertical, com cara de criador e cabeça de cliente. A ideia era cobrir os quatro pilares de comunicação do veículo (conforto, tecnologia, dirigibilidade, segurança) em peças curtas, com edição dinâmica, sem cara de comercial antigo." },
    { h: "Desafio", p: "Traduzir uma narrativa institucional automotiva — historicamente pesada, com aprovação longa e muito controle — num formato leve, vertical e cabível em 30 segundos. Em paralelo, entregar um banco de 12 fotos com a mesma cobertura conceitual. E entregar conteúdo extra de backstage como diferencial, com pré-aprovação dupla pela agência e pela marca. Vídeo em 7 dias, fotos em 7 dias, pagamento em 60." },
    { h: "Abordagem MUV", p: "Entramos na pré com um roteiro proprietário — base do diálogo com a Suba. Captação em torno do que cada pilar pedia visualmente: conforto exige interno em luz controlada e detalhe; tecnologia exige plano fechado de painel, gestual de toque, transições rápidas; dirigibilidade exige movimento, drone, FPV; segurança exige plano amplo, contexto, presença do carro no ambiente. FX3 pra cinema, A73 pra fotografia em paralelo, Insta 360 pra POV de motorista, drone Avata pra dirigibilidade. Iluminação com painéis Amaran F22c e F21c pra controlar reflexo na lataria. Lentes Cine 7Artisans T2 pra os planos preparados de close." },
    { h: "Resultado", p: "Seis verticais entregues, 12 fotos editadas, banco de backstage usado como conteúdo orgânico pra alimentar o canal nas semanas seguintes ao lançamento. Mais relevante: o trabalho gerou base pra renovação dos direitos de uso com a Nissan, num segundo aditivo que estendeu a presença das peças além da janela inicial." }
  ]
},
{
  slug: "pop-comm-bento",
  title: "Pop-Comm\nSerie de 7",
  client: "Pop-Comm · Fernando Bento",
  tag: "REELS · 7 PEÇAS · 1 DIA",
  year: "2023",
  category: "Social",
  format: "Sete reels de até 1 min (banco de produto)",
  team: "3 pessoas — videomaker, assistente, editor",
  gear: "Sony FX3 · A73 · GMaster 16-35 / 24-70 / 70-200mm · Rode direcional · Hollyland lapela · MacBook Pro",
  summary: "Sete reels mostrando sete serviços diferentes — tudo captado numa única diária.",
  body: [
    { h: "Contexto", p: "A Pop-Comm é integradora de comunicação corporativa — vende serviços que, no fundo, são intangíveis: estratégia, operação, mídia. Esse é o tipo de cliente que mais sofre na hora de virar conteúdo, porque o produto não é um objeto. É processo, é gente, é decisão. Fernando, à frente, queria uma forma de mostrar o que a Pop vende sem cair no discurso institucional cansado." },
    { h: "Desafio", p: "Sete reels, cada um mostrando um serviço diferente, todos captados em uma única diária. Equipe enxuta, prazo curto, e a barra alta: o conteúdo precisava parecer feito pra plataforma, não adaptado pra ela. Reel de 1 minuto não é vídeo institucional cortado — é estrutura própria, gancho nos primeiros 3 segundos, ritmo que segura o dedo." },
    { h: "Abordagem MUV", p: "Pré-produção condensada. Mapeamos com o Fernando os sete serviços, definimos qual seria a virada visual de cada um (entrevista direta, bastidor, metáfora visual?), e desenhamos uma ordem de captação que minimizava troca de setup — o que economizou hora e permitiu entregar os sete sem perder energia no último. FX3 como câmera principal em S-Log3, A73 como segunda câmera. Lentes GMaster cobrindo de 16-35 a 70-200. Áudio em duas vias — Rode direcional como referência ambiente, Hollyland de lapela como áudio principal." },
    { h: "Resultado", p: "Os sete reels viraram a base do feed da Pop-Comm naquele ciclo, com cadência de postagem espaçada por algumas semanas. Mais importante, o trabalho mostrou um modelo que repetimos até hoje com clientes B2B — uma diária densa, sete peças, custo unitário enxuto. O case da Pop-Comm ainda é referência interna pra projetos onde o orçamento pede eficiência sem cair na perda de qualidade." }
  ]
}];


const TIME = [
{ name: "Victor Almeida", role: "Founder & Director", short: "Direção criativa e estratégia." },
{ name: "Equipe Direção", role: "Direção & Roteiro", short: "Narrativa e direção de conteúdo." },
{ name: "Equipe DOP", role: "Direção de Fotografia", short: "Imagem e linguagem cinematográfica." },
{ name: "Equipe Pós", role: "Edição & Color", short: "Pós-produção e finalização." }];


const POSTS = [
{
  slug: "cobertura-tempo-real-evento",
  date: "2026 · MAI",
  title: "Cobertura em tempo real evento: como entregar conteúdo enquanto o show acontece.",
  excerpt: "O segundo dia de um festival grande começa às 13h. Às 19h, antes do headliner subir, a marca já quer um corte no story. É no pipeline que se ganha, não no equipamento.",
  read: "8 min",
  category: "Framework",
  body: [
    { p: "O segundo dia de um festival grande começa às 13h. Às 19h, antes do headliner subir, a marca patrocinadora já quer um corte de 30 segundos no story, um carrossel com três frames e uma versão de 60s pronta pro YouTube. A captação ainda não acabou. É exatamente esse o jogo da cobertura em tempo real de evento — e é um jogo que se ganha no pipeline, não no equipamento." },
    { p: "O equipamento ajuda. Mas o que separa quem entrega de quem promete é o desenho do fluxo entre o que entra pelo sensor e o que sai pra timeline do cliente." },
    { h: "O que é \"tempo real\" na prática" },
    { p: "Tempo real em festival não é live streaming. É turnaround de horas — às vezes de minutos. O conteúdo capturado às 16h precisa estar revisado, cortado, com som tratado e cor batida pra entrar no feed antes das 21h, enquanto o público ainda está dentro do evento e a conversa ainda está acontecendo." },
    { p: "Isso muda tudo na operação. Não dá pra esperar terminar o festival pra \"começar a editar\". A edição começa no terceiro frame capturado. E o aftermovie de uma semana depois é só consequência de um workflow que já vinha cortando desde o dia um." },
    { h: "Pipeline: captação, ingest, edit, aprovação" },
    { p: "O fluxo enxuto tem quatro camadas rodando em paralelo. Captação: câmera principal em FX6 ou FX3, segunda A7S III ou A7 IV, drone quando autorizado, mic direcional + lav nos pontos quentes, tudo em proxy nativo. Ingest: DIT no festival, não no escritório. Cartão sai da câmera, vai pro DIT, backup duplo em SSD rápido, proxy liberado pra edit station em segundos. Edit station no local: MacBook potente, monitor extra, Resolve ou Premiere com projeto montado, LUTs prontos, templates de social na timeline. Aprovação ágil: Frame.io, WeTransfer, qualquer ferramenta — desde que cliente esteja no mesmo canal e decisão venha em minutos." },
    { h: "Equipe mínima, função clara" },
    { p: "Cobertura em tempo real não pede crew gigante. Pede crew certa. Pra festival de porte médio: 1 DOP (câmera A), 1 cinegrafista de apoio (câmera B), 1 drone op, 1 DIT/assistente, 1 editor no local, 1 produtor. Seis pessoas. Em festival grande dobra time de câmera, mantém DIT e edit station — não vira 20 pessoas, vira duas células de seis rodando em paralelo." },
    { h: "O que dá pra entregar (e quando)" },
    { p: "Stories e reels do dia: 2 a 4 horas depois da captação. Carrossel de fotos selecionadas: mesmo dia, fim de noite. Teaser do dia seguinte: sai na manhã. Recap diário (30s a 60s): final do dia ou primeira hora do dia seguinte. Aftermovie principal (90s a 3min): 5 a 10 dias depois. Versões extras pra parceiros: duas semanas seguintes. Tudo sai do mesmo material bruto — o segredo é capturar pensando nas múltiplas entregas." },
    { h: "Conclusão" },
    { p: "Cobertura em tempo real é técnica + logística + decisão. O equipamento é commodity — quem tem FX6 hoje tem FX6 amanhã. O diferencial está no desenho do pipeline, no tamanho certo da equipe e na maturidade de aprovação do cliente. Quando essas três variáveis estão alinhadas, entregar conteúdo enquanto o show ainda acontece deixa de ser exceção e vira parte do produto." }
  ]
},
{
  slug: "branded-vs-publicidade",
  date: "2026 · MAI",
  title: "Branded content vs publicidade tradicional: a diferença que multiplica resultado.",
  excerpt: "Publicidade tradicional interrompe. Branded é procurado. A frase de efeito é meio verdadeira e meio mentira — a diferença real está nos quatro critérios que ninguém quer rodar.",
  read: "7 min",
  category: "Ensaio",
  body: [
    { p: "Publicidade tradicional interrompe. Branded content é procurado. Essa é a frase de efeito que circula em todo deck de agência desde 2015 — e como toda frase de efeito, ela é meio verdadeira e meio mentira." },
    { p: "A verdade é que branded content só funciona quando é construído como conteúdo de verdade, com ponto de vista, e não como \"comercial com história\". A mentira é fingir que basta colocar uma narrativa em volta do produto pra deixar de ser publicidade. Não basta. E o público sente em três segundos." },
    { h: "A diferença que importa" },
    { p: "Publicidade tradicional tem uma promessa clara com o espectador: você me dá 30 segundos da sua atenção em troca do conteúdo que você veio consumir. É um pedágio. Funciona dentro desse contrato — alcance, frequência, top of mind. Branded content tem outra promessa: eu te entrego algo que você assistiria de graça, e a marca paga essa conta. O custo dela é fazer um conteúdo bom o bastante pra justificar a presença." },
    { p: "Publicidade é pulada, branded é salvo. Publicidade gera lembrança, branded gera percepção. Publicidade tem CTR, branded tem reescuta. Publicidade é medida em GRP, branded é medida em conversa." },
    { h: "Os quatro critérios" },
    { p: "1. Tem POV? Um ponto de vista que pertence à marca e não é genérico? \"Celebrar a diversidade\" não é POV. POV é arriscado, divide, posiciona. 2. Sobrevive sem o logo? Se cortar os 2 segundos finais e o filme continuar interessante, é branded. 3. Gera salvamento? Ninguém salva propaganda. 4. Gera conversa? Conversa de tema, não de marketing — se o filme faz as pessoas falarem do tema, e não da marca, o branded funcionou. Quatro sins: é branded. Dois ou três: tá no meio. Zero ou um: é publicidade — e tudo bem assumir." },
    { h: "Quando branded NÃO faz sentido" },
    { p: "Lançamento com janela curta (ciclo de 30 dias não dá tempo de fermentar). Performance pura (anúncio direto com oferta clara performa mais). Categoria ultracomoditizada (decisão 100% preço). Marca sem maturidade narrativa (resolve o discurso primeiro, faz branded depois). A pergunta honesta: a marca tem o que dizer, ou tá pagando pra parecer que tem?" },
    { h: "ROI percebido" },
    { p: "Branded bom roda por anos, não por trimestres. Mídia paga menor por reach orgânico maior. Associação de marca mais profunda — lembrança você compra, percepção você constrói. ROI raramente cabe num dashboard de campanha. Mora em pesquisa de marca, share of voice, brand lift. Quem só olha CPM e CTR não vai entender o investimento." },
    { h: "Conclusão" },
    { p: "A pergunta certa não é \"branded ou publicidade\". É: o que esse problema de marketing precisa, neste momento? Algumas vezes é interrupção bem feita. Outras vezes é uma narrativa que mereça atenção voluntária. Quem trata os dois como ferramentas distintas, com KPIs próprios, multiplica o resultado das duas." }
  ]
},
{
  slug: "video-referencia-5-ingredientes",
  date: "2026 · MAI",
  title: "O que faz um vídeo virar referência: 5 ingredientes invisíveis.",
  excerpt: "Nike, A24, Arc'teryx, Apple. Sempre os mesmos nomes aparecem nas reuniões. A resposta não está no equipamento, nem no orçamento, nem no diretor famoso.",
  read: "9 min",
  category: "Framework",
  body: [
    { p: "Todo mundo tem aquela pasta. Vídeos salvos no Vimeo, links no Notion, prints no celular. Sempre os mesmos nomes aparecem nas reuniões de referência. A pergunta interessante não é \"por que esses?\". É: o que esses têm em comum que os outros não têm? A resposta tá em cinco ingredientes que ninguém vê quando assiste — mas que o sistema todo sente." },
    { h: "1. POV claro" },
    { p: "Ponto de vista é a coisa mais subestimada do audiovisual brasileiro. POV não é \"a marca acredita em pessoas\". POV é uma posição específica sobre alguma coisa específica. \"Dream Crazy\" da Nike não é sobre esporte — é sobre acreditar em si mesmo a ponto de incomodar os outros. \"Shot on iPhone\" não é sobre câmera — é sobre democratizar a produção de imagem premium. Sem POV, o filme vira voo cego. Aplicação: antes de qualquer pré-produção, escreva em UMA frase o que o filme defende." },
    { h: "2. Ritmo invisível (cortes no respiro)" },
    { p: "Boa edição é a edição que ninguém percebe. O corte entra exatamente no frame em que o espectador já tava pedindo pra trocar. Editores chamam de \"cortar no respiro\": o ritmo segue a respiração de quem assiste, não a métrica da trilha. Aplicação: cortar com som mudo na primeira passada. Se o ritmo funciona sem áudio, vai funcionar muito melhor com áudio. Se só funciona com a trilha, ela tá carregando o filme — e o filme não vira referência." },
    { h: "3. Sound design (som faz 50%)" },
    { p: "Por que uma cena ruim com som excelente é melhor que uma cena ótima com som ruim? Porque som carrega emoção que a imagem sozinha não carrega. A imagem fala com o olho. O som fala direto com o sistema nervoso. Esse é o gap mais visível do mercado brasileiro. Sobra investimento em câmera e direção, falta em som. Aplicação: orçar sound design como item separado, contratar designer de som dedicado. A diferença de custo é marginal. A diferença de resultado é estrutural." },
    { h: "4. Tipografia e grafismo coerente" },
    { p: "Lettering aparece em frações de segundo, mas define muito do que o espectador sente. Apple usa San Francisco. Nike usa Futura quando quer força. A24 usa Romana pra parecer cinema clássico de autor. Cada escolha é coerência. Aplicação: definir tipografia na pré-produção, não na pós. Testar em telas reais, em movimento, em legibilidade vertical pra social." },
    { h: "5. Ousadia controlada" },
    { p: "Nike arriscou em escalar Colin Kaepernick. Apple em mostrar fotos amadoras como capa de campanha global. A24 em deixar trailer com mais silêncio do que diálogo. Risco bem dosado. Não é \"vamos quebrar tudo pra chamar atenção\". É: \"vamos fazer uma escolha que a maioria das marcas não faria, mas que faz sentido pro que a nossa marca defende\". Ousadia descontrolada vira polêmica vazia. Ousadia controlada vira posicionamento." },
    { h: "Checklist do próximo projeto" },
    { p: "POV em uma frase, aprovado pelo cliente. Plano de ritmo, editor envolvido desde a decupagem. Briefing de sound design, designer contratado, não terceirizado. Sistema de grafismo, tipografia testada. A decisão corajosa, identificada e defendida. Filmes que cumprem cinco viram referência. Três viram bons. Um ou dois cumprem tabela." }
  ]
},
{
  slug: "bastidores-lollapalooza-72h",
  date: "2026 · MAI",
  title: "Bastidores cobertura Lollapalooza: 72 horas de captação, edição e entrega em tempo real.",
  excerpt: "Sexta-feira, 9h da manhã. A van já tá carregada. Quatro câmeras, dois drones, três notebooks. A próxima vez que esse equipamento vai parar é segunda à tarde.",
  read: "10 min",
  category: "Bastidor",
  body: [
    { p: "Sexta-feira, 9h da manhã. A van já tá carregada na frente do escritório. Quatro câmeras, dois drones (um titular, um reserva), três notebooks, dez SSDs, dois monitores portáteis, duas tendas, cabos pra cobrir um quarteirão, lentes de 14 a 200, monopés, gimbals, um par de walkie-talkies que ainda funcionam desde 2019. A próxima vez que esse equipamento vai parar é segunda à tarde. O que segue é o relato honesto de uma operação de cobertura de Lollapalooza pela equipe MUV." },
    { h: "Pré-festival: a semana que define os três dias" },
    { p: "A coisa mais importante de uma cobertura de festival não acontece no festival. Acontece nos sete dias anteriores. Briefing fechado uma semana antes. Mapa do evento marcado: onde fica cada palco, camarote do cliente, ativações. Lista de artistas com prioridade — quem é must, quem é nice to have. Credenciamento resolvido três semanas antes. O briefing de entrega também sai antes: stories e reels durante o evento, recap diário, aftermovie em janela combinada, cortes pra parceiros, banco de fotos pra deck do ano seguinte. Cada entrega vira uma coluna no spreadsheet, cada coluna vira uma timeline na edit station." },
    { h: "Dia 1: abrindo a operação" },
    { p: "11h, chegada no Autódromo de Interlagos. Montagem da base — tenda 3x3 com mesa, duas cadeiras, energia em nobreak, internet via 5G dedicado (internet do festival não serve pra subir nada). Edit station: MacBook Pro M3 Max, monitor portátil 16\", fone de referência, dois SSDs Samsung T9 espelhados. 12h primeira reunião. Câmera A (FX6 + 24-70 + 70-200) cobre palco principal. Câmera B (A7S III + 16-35 + 50mm prime) cobre bastidor. Câmera C (A7 IV) fica de apoio. 14h primeiro show. 17h primeira leva chega na edit. 19h primeiro story no celular do cliente. Aprovação volta em 12 minutos. Sobe." },
    { h: "Dia 2: o ritmo se consolida" },
    { p: "Sábado é o dia que separa quem aguenta de quem não aguenta. O entusiasmo do dia 1 já passou. O cansaço do dia 3 ainda não chegou. Reforço de rotina: almoço marcado, trocas de operador entre câmeras pra evitar exaustão da mesma posição, editor com descanso de 90 minutos no meio da tarde. Aprovação no dia 2 é o teste real do pipeline — se na sexta saiu em 12 minutos, no sábado costuma demorar mais. Criamos fluxo paralelo: enquanto material principal espera aprovação, editor adianta recortes secundários pra patrocinadores menores." },
    { h: "Dia 3: a colheita" },
    { p: "Domingo é colheita. O grosso do material bruto já tá capturado. Operação mais cirúrgica: completar o que faltou, capturar planos de cobertura específicos, garantir que o último headliner tem captação à altura. Editor adianta o máximo possível do aftermovie no domingo à tarde, durante shows secundários. Recap final sai na madrugada. Equipe desmonta às 04h. Volta pro escritório segunda à tarde pra descarga completa e início da pós pesada." },
    { h: "Aprendizados" },
    { p: "Backup espelho não-negociável (um cartão deu pau no dia 2, backup salvou). Editor no campo > editor remoto (já testamos, não rola). Aprovação humana presencial vale ouro. Sobrar tempo no dia 3 > correr no dia 3. Sound design separado — o ruído ambiente de festival é hostil, áudio de qualidade pra entrevistas só sai com captação dedicada." },
    { h: "Conclusão" },
    { p: "Cobertura de festival como o Lollapalooza não é heroísmo. É processo. É a soma de cem decisões pequenas tomadas em ordem certa, antes, durante e depois. Quem chega no dia 1 sem o pré-festival resolvido, perde. Quem chega na pós sem material capturado pensando em todas as entregas, perde." }
  ]
},
{
  slug: "equipe-pequena-premium",
  date: "2026 · MAI",
  title: "Produção audiovisual premium equipe pequena: por que menos gente entrega mais.",
  excerpt: "Existe uma confusão antiga: a ideia de que produção premium pede produtora grande. A prática mostra o contrário. Premium não é headcount, é densidade.",
  read: "8 min",
  category: "Ensaio",
  body: [
    { p: "Existe uma confusão antiga no mercado audiovisual brasileiro: a ideia de que produção premium pede produtora grande. Crew de 30, três níveis de assistente, departamento de arte com cinco pessoas. Quanto mais nome na call sheet, mais \"premium\" o projeto pareceria. A prática mostra o contrário. Os projetos audiovisuais mais admirados da última década — A24, Stink, Boiler, Highsnobiety, Arc'teryx — operam com equipe pequena. Não por restrição de orçamento. Por escolha estratégica." },
    { p: "A tese é simples: premium não é headcount, é densidade. E densidade não escala com gente nova entrando no projeto — escala com gente certa fazendo a coisa certa." },
    { h: "O problema da equipe grande" },
    { p: "Primeiro: dilui POV. Cada pessoa nova traz uma opinião. Em dose grande vira ruído. Quando 15 pessoas têm voz sobre uma decisão criativa, o resultado tende ao denominador comum mais baixo. Ninguém defende o risco. Todo mundo entrega a versão segura. A versão segura nunca vira referência." },
    { p: "Segundo: atrasa decisão. Em equipe pequena, alguém propõe, alguém defende, alguém aprova — em uma manhã. Em equipe grande, a mesma decisão vira pauta de reunião, ata, aprovação por e-mail, nova rodada de ajuste. Duas semanas pra resolver o que resolveria em duas horas." },
    { p: "Terceiro: encarece sem entregar mais qualidade. Equipe grande tem custo fixo alto — honorários, estrutura, hierarquia, processo. O dinheiro extra vai pra administração, não pra tela. O cliente paga 30% a mais pra ver o mesmo filme que entregaria com equipe 40% menor." },
    { h: "A24 como caso de estudo" },
    { p: "Vale olhar pra A24 como referência prática. Os filmes ganham Oscar com crew menor que produções similares dos grandes estúdios. Não é pobreza — é escolha de modelo. Equipe enxuta, diretores autorais com poder real, pós verticalizada, marketing inteligente. Cada filme tem assinatura. Replicar em branded content brasileiro é não só possível como, na prática, o caminho que os melhores projetos brasileiros já seguem." },
    { h: "Quando equipe grande faz sentido" },
    { p: "Escala industrial (novela, série de TV com 100 episódios, longa grande). Operação multi-praça simultânea (campanha em cinco capitais ao mesmo tempo). Formato com volume de elenco/figuração (200 figurantes, três locações). Pós com VFX pesado (40s de efeitos complexos). Pra todo o resto — branded content, série digital, cobertura, conteúdo institucional premium, campanha até 90s — equipe pequena entrega mais." },
    { h: "Como o MUV opera" },
    { p: "Direção criativa próxima do cliente, sem intermediário. Diretor envolvido desde a primeira conversa. Crew dimensionada por projeto — núcleo pequeno fixo, expansão pontual com freelas certos. Pós-produção integrada — editor e finalizador conversam com diretor durante captação. Aprovação rápida, menos camadas internas. Consequência prática: projetos saem do briefing à entrega em ciclos menores, com mais densidade criativa, e custo total geralmente menor — não porque a equipe seja barata, porque o overhead não pesa." },
    { h: "Conclusão" },
    { p: "Headcount é vaidade. Densidade é resultado. O melhor sinal de que uma produção tá bem dimensionada não é quantas pessoas estão no set, mas quanto cada pessoa do set tá efetivamente decidindo, criando, executando." }
  ]
}];


const BRANDS = ["NIKE", "RED BULL", "APPLE", "A24", "STINK", "ARC'TERYX", "PUMA", "RIOT", "SPOTIFY", "VANS", "HEINEKEN", "ITAÚ"];
const MARQUEE_WORDS = ["AUTÊNTICO", "CINEMATOGRÁFICO", "ESTRATÉGICO", "RÁPIDO", "CONTEMPORÂNEO"];

// ───── FAQ ───────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    cat: "Prazos & escopo",
    q: "Quais prazos vocês conseguem entregar?",
    a: "Depende do formato. Pra social — reel, story, corte vertical de evento — a gente roda em ciclo de 7 dias entre captação e entrega final, com primeira versão saindo em 2 a 7 dias úteis e ajuste final em 2 dias após aprovação. Branded film completo (com roteiro, captação, edição refinada, sound design e color grade dedicado) é ciclo de 3 a 6 semanas, dependendo da complexidade. Cobertura de evento em real-time entrega cortes durante o próprio dia. E projeto-relâmpago — tipo case film publicitário em 24h — a gente faz quando o briefing exige, desde que esteja na agenda. Em todos os casos, prazo é combinado por escrito no orçamento."
  },
  {
    cat: "Orçamento",
    q: "Como funciona o orçamento? Vocês trabalham com tabela fixa?",
    a: "Não — e a gente acha que tabela fixa atrapalha mais do que ajuda. Cada projeto tem variáveis próprias: número de diárias, tamanho da equipe, equipamento envolvido, complexidade da edição, direitos de uso, prazo. O que a gente faz é montar proposta customizada com escopo, equipe, equipamento e investimento detalhados — assim você sabe exatamente onde cada real vai parar. Pra ter referência: branded social mensal começa em torno de R$ 3.300, captação branded de meio porte fica entre R$ 8 mil e R$ 30 mil, case film publicitário com direitos de uso comerciais varia conforme veiculação. Valor sob proposta, sempre."
  },
  {
    cat: "Locação",
    q: "Vocês têm locação de equipamento? Posso alugar avulso?",
    a: "Sim. O Grupo MUV é hub criativo, e o parque de equipamentos (FX6, FX3, A7CII, A7IV, drones DJI, lentes GMaster e Cine 7Artisans, iluminação Aputure e Amaran, áudio Hollyland e Rode) fica disponível pra locação avulsa quando não está em projeto interno. Funciona melhor pra parceiros recorrentes — produtoras parceiras, freelancers de confiança, projetos com alinhamento prévio. Fala com a equipe pelo WhatsApp pra checar disponibilidade da data e fechar valor."
  },
  {
    cat: "Direitos",
    q: "Quais direitos de uso ficam com a marca depois da entrega?",
    a: "Direitos são contratados separadamente do valor de produção, e variam conforme três eixos: canal (internet/intranet, OOH, mídia exterior, indoormídia, onboard TV, painéis eletrônicos, mobile, PDV, brinde, e-mail mkt, broadcast), duração (períodos típicos de 2 meses, 6 meses, 12 meses, ou perpetuidade) e território (nacional, regional, internacional). O padrão das nossas propostas é cessão limitada a canais e prazo definidos — se a marca quiser estender, faz aditivo. Tudo descrito por escrito no orçamento e no contrato, sem zona cinzenta."
  },
  {
    cat: "Equipamento",
    q: "Quais equipamentos vocês usam?",
    a: "Câmeras Sony — FX6 e FX3 da linha cinema, A7CII, A7IV e A73 pra captação fotográfica e segunda câmera. Lentes GMaster (16-35, 24-70, 35mm, 70-200) e Sony FE (200-600 quando precisa de distância), além de Cine 7Artisans T2 (35, 50, 85mm) pra plano preparado. Drones DJI Mini 4 Pro e Avata, dependendo do espaço aéreo e do estilo. Estabilização com Ronin RS3 Mini, Weebill-S e Glidecam. Iluminação Aputure (Amaran F22c, F21c, T2C) e flash Godox. Áudio com Rode direcional e Hollyland Lark150 de lapela. Workflow em S-Log3 com ingest em proxy + RAW e backup duplo em SSD Sandisk."
  },
  {
    cat: "Posicionamento",
    q: "Vocês são produtora ou agência?",
    a: "Os dois e nenhum dos dois. A gente se posiciona como ecossistema criativo — produção audiovisual no coração, estratégia de conteúdo em volta, comunidade e relacionamento com criadores como camada lateral. A gente roteiriza, capta, edita e entrega. A gente também ajuda a pensar o que postar, em qual ordem, em qual formato. O que a gente não faz é compra de mídia paga — pra isso indicamos parceiros. Se você precisa de produtora pura, atende. Se precisa de pacote estratégico mais amplo, também."
  },
  {
    cat: "Equipe",
    q: "Qual o tamanho típico da equipe num projeto?",
    a: "Varia muito conforme o formato. Branded film completo: 6 a 12 pessoas (direção, DOP, operador de câmera, assistente, áudio, gaffer, produção, editor, finalizador). Cobertura de evento ou ação real-time: 3 a 6 pessoas (filmmaker principal, filmmaker secundário, piloto de drone, DIT/assistente, editor no local). Branded social ou pacote mensal: 2 a 4 pessoas. A regra interna é densidade alta por pessoa — gente que executa mais de uma função e entrega no padrão. Não somos crew gigante por princípio."
  },
  {
    cat: "Entregas",
    q: "Quais formatos vocês entregam?",
    a: "Por padrão a entrega vem em master + cortes adaptados. Branded film sai em 16:9 (horizontal) como master, com cortes 9:16 (vertical pra reels e stories), 4:5 (feed quadrado-vertical) e 1:1 (feed clássico) quando o briefing pede. Cobertura de evento normalmente entrega versão 9:16 prioritária + 16:9 institucional. Fotografia entrega em RAW + JPEG editado, com tratamento alinhado ao manual da marca. Tudo nomeado e organizado em pastas estruturadas — não chega ao cliente solto."
  },
  {
    cat: "Revisões",
    q: "Quantas rodadas de revisão estão inclusas?",
    a: "Duas rodadas por padrão, sem mudar a estrutura principal do material. Os alinhamentos contínuos durante a produção rolam via WhatsApp em tempo real, então geralmente a primeira versão já chega bem afinada. Alterações que mudam a estrutura ou pedem nova captação são tratadas como escopo adicional. Pra pacotes mensais (tipo Importek), o padrão é 2 alterações por vídeo sem custo extra, e ajustes adicionais a partir de R$ 110 por alteração. Tudo combinado por escrito."
  },
  {
    cat: "Fiscal",
    q: "Vocês emitem nota fiscal?",
    a: "Sim. CNPJ Mudafilms LTDA, 46.941.289/0001-44, regime Simples Nacional. NF emitida em São Paulo, com prestação de serviço descrita conforme o escopo do projeto (produção audiovisual, captação, edição, direitos de uso, etc.). O prazo de pagamento padrão é 30 dias após emissão da NF, mas a gente trabalha com prazos maiores quando o cliente exige (60 ou 90 dias, mediante combinação prévia). Toda documentação fiscal fica organizada e disponível pra auditoria da contabilidade da marca."
  },
  {
    cat: "Pagamento",
    q: "Quais formas de pagamento?",
    a: "PIX e TED são os preferidos, simplesmente porque são instantâneos e sem custo. Padrão pra projetos pontuais: 50% sinal na assinatura, 50% na entrega final. Pra projetos longos ou em pacote mensal, a gente parcela conforme cronograma de produção — por exemplo, 30% sinal, 30% no meio do projeto, 40% na entrega. Pagamento à vista tem desconto negociável. Cartão e boleto a gente faz quando é exigência do financeiro do cliente, mas avisa: dá menos margem pra negociar prazo."
  },
  {
    cat: "Logística",
    q: "Vocês atendem fora de São Paulo?",
    a: "Sim. A base é São Paulo, mas a equipe viaja sempre que o projeto pede — Brasil inteiro, e em alguns casos internacional (já captamos em Orlando pra Gatorade + CBF, viajamos pela América Latina pra Shell). Pra projetos fora de SP, a logística (passagem, transporte local, estadia, alimentação, seguro de equipamento e viagem, contingência) entra no orçamento de forma transparente, item por item. A gente também tem rede de parceiros confiáveis em outras praças — quando faz mais sentido operar com equipe local, indica e coordena à distância."
  }
];

// ───── Showreel BG — placeholder cinematográfico com cenas em loop ───────────
const SHOWREEL_SCENES = [
{ label: "INT. SET · MARCA DE MODA", code: "01/06", grad: "radial-gradient(ellipse at 35% 60%, rgba(222,78,43,0.55), transparent 55%), radial-gradient(ellipse at 75% 30%, rgba(27,87,173,0.25), transparent 60%), linear-gradient(135deg, #2a1410 0%, #1B1B1F 60%, #0d0d12 100%)" },
{ label: "EXT. NOITE · FESTIVAL", code: "02/06", grad: "radial-gradient(ellipse at 20% 30%, rgba(27,87,173,0.55), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(222,78,43,0.3), transparent 50%), linear-gradient(225deg, #0e1a2a 0%, #1B1B1F 55%, #0d0d12 100%)" },
{ label: "CLOSE · EQUIPAMENTO", code: "03/06", grad: "radial-gradient(ellipse at 60% 50%, rgba(245,240,235,0.18), transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(222,78,43,0.4), transparent 55%), linear-gradient(180deg, #221b18 0%, #1B1B1F 50%, #0d0d12 100%)" },
{ label: "DRONE · CIDADE", code: "04/06", grad: "radial-gradient(ellipse at 50% 30%, rgba(222,78,43,0.42), transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(27,87,173,0.4), transparent 55%), linear-gradient(160deg, #1a1410 0%, #181c28 70%, #0d0d12 100%)" },
{ label: "STUDIO · CICLORAMA", code: "05/06", grad: "radial-gradient(ellipse at 50% 60%, rgba(245,240,235,0.22), transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(222,78,43,0.35), transparent 55%), linear-gradient(200deg, #1b1814 0%, #1B1B1F 60%, #0d0d12 100%)" },
{ label: "INT. CLIENTE · BRIEFING", code: "06/06", grad: "radial-gradient(ellipse at 70% 40%, rgba(27,87,173,0.45), transparent 55%), radial-gradient(ellipse at 25% 70%, rgba(222,78,43,0.35), transparent 55%), linear-gradient(140deg, #14182a 0%, #1B1B1F 60%, #0d0d12 100%)" }];


function ShowreelBG() {
  const [scene, setScene] = useState(0);
  const [tc, setTc] = useState({ m: 0, s: 0, f: 0 });
  useEffect(() => {
    const id = setInterval(() => setScene((s) => (s + 1) % SHOWREEL_SCENES.length), 4200);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setTc((t) => {
        let f = t.f + 1;
        let s = t.s,m = t.m;
        if (f >= 24) {f = 0;s += 1;}
        if (s >= 60) {s = 0;m += 1;}
        if (m >= 99) m = 0;
        return { m, s, f };
      });
    }, 41); // ~24fps
    return () => clearInterval(id);
  }, []);
  const pad = (n, w = 2) => String(n).padStart(w, "0");

  return (
    <div className="showreel">
      {SHOWREEL_SCENES.map((sc, i) =>
      <div key={i} className={`showreel__scene ${i === scene ? "is-on" : ""}`} style={{ background: sc.grad }} />
      )}
      <div className="showreel__bars" />
      <div className="showreel__grain" />
      <div className="showreel__vignette" />
      <div className="showreel__scanlines" />

      {/* HUD */}
      <div className="showreel__hud showreel__hud--tl">
        <span className="showreel__rec"><span className="showreel__rec-dot" /> REC</span>
        <span className="showreel__hud-text">SHOWREEL · MUV · 2026</span>
      </div>
      <div className="showreel__hud showreel__hud--tr">
        <span className="showreel__hud-text">TC {pad(tc.m)}:{pad(tc.s)}:{pad(tc.f)}</span>
        <span className="showreel__hud-text">{SHOWREEL_SCENES[scene].code}</span>
      </div>
      <div className="showreel__hud showreel__hud--bl">
        <span className="showreel__hud-text">{SHOWREEL_SCENES[scene].label}</span>
      </div>
      <div className="showreel__hud showreel__hud--br">
        <span className="showreel__hud-text">SONY FX6 · 4K · 24P</span>
      </div>

      {/* Timeline scrubber */}
      <div className="showreel__timeline">
        <div className="showreel__timeline-fill" style={{ width: `${(scene + 1) / SHOWREEL_SCENES.length * 100}%` }} />
        {SHOWREEL_SCENES.map((_, i) =>
        <span key={i} className="showreel__timeline-mark" style={{ left: `${i / SHOWREEL_SCENES.length * 100}%` }} />
        )}
      </div>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// HOME
// ═════════════════════════════════════════════════════════════════════════════
function Home({ setCurrent, density }) {
  const heroRef = useRef(null);
  const [intro, setIntro] = useState("boot"); // boot → open → title → done

  // Letterbox intro timeline
  useEffect(() => {
    const t1 = setTimeout(() => setIntro("open"), 900); // bars start retracting
    const t2 = setTimeout(() => setIntro("title"), 2000); // headline + meta reveal
    const t3 = setTimeout(() => setIntro("done"), 3600); // everything settled
    return () => {clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  }, []);

  useEffect(() => {
    let scrollProg = 0;
    let autoFade = 0;
    let rafId;

    const apply = () => {
      if (!heroRef.current) return;
      const t = Math.max(scrollProg, autoFade);
      heroRef.current.style.opacity = String(Math.max(0.18, 1 - t));
      heroRef.current.style.transform = `translateY(${-t * 32}px)`;
    };

    const onScroll = () => {
      const h = window.innerHeight;
      scrollProg = Math.max(0, Math.min(1, window.scrollY / (h * 0.55)));
      apply();
    };

    // Auto-fade only AFTER intro finishes (4.5s total: 3.6s intro + 0.9s grace)
    const start = performance.now() + 5500;
    const tick = (now) => {
      const elapsed = now - start;
      if (elapsed >= 0) autoFade = Math.min(1, elapsed / 2500);else
      autoFade = 0;
      apply();
      if (autoFade < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="page page--no-top" data-screen-label="Home">
      {/* HERO CINEMÁTICO — letterbox intro + showreel + headline reveal */}
      <section className={`hero-cine intro-${intro}`}>
        <div className="hero-cine__media">
          <ShowreelBG />
        </div>
        <div className="hero-cine__scrim" />

        {/* Title card que aparece durante o boot */}
        <div className="hero-cine__bootcard">
          <p className="mono">GRUPO MUV</p>
          <p className="mono hero-cine__bootcard-meta">EDIÇÃO 01 · 2026 · ECOSSISTEMA CRIATIVO</p>
        </div>

        {/* Letterbox bars */}
        <div className="hero-cine__bar hero-cine__bar--top" aria-hidden="true" />
        <div className="hero-cine__bar hero-cine__bar--bot" aria-hidden="true" />

        <div className="hero-cine__content" ref={heroRef}>
          <div className="hero-cine__top">
            <div>
              <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Edição 01 · 2026 · Ecossistema criativo</p>
              <p className="mono" style={{ color: "var(--dark-ink-2)", marginTop: 12 }}>SP · BR · 23.5505° S · 46.6333° W</p>
            </div>
            <p className="mono hero-cine__rec" style={{ color: "var(--dark-ink-2)" }}>REEL 2026 — V01 · LIVE</p>
          </div>

          <div className="hero-cine__mid">
            <h1 className="hero-cine__display" data-comment-anchor="03f73c495c-h1-88-9">
              <span className="reveal-word"><span>Conteúdo</span></span><br />
              <span className="reveal-word"><span className="italic" style={{ fontFamily: "\"Archivo Black\"", width: "284px" }}>que </span></span>
              <span className="reveal-word"><span className="accent">move.</span></span>
            </h1>
          </div>

          <div className="hero-cine__bottom">
            <p className="hero-cine__sub">
              A gente não entrega vídeo. Entrega estratégia em formato audiovisual — cinematográfica, no prazo, e impossível de ignorar.
            </p>
            <div className="hero-cine__actions">
              <button className="btn btn--primary" onClick={() => setCurrent("contato")}>Começar um projeto <Arrow /></button>
              <button className="btn btn--ghost-dark" onClick={() => setCurrent("trabalhos")}>Ver portfolio <Arrow /></button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="hero-stats">
        <div className="hero-stats__inner">
          <div className="stat"><span className="stat__num">+120</span><span className="stat__label">Produções entregues</span></div>
          <div className="stat"><span className="stat__num">+30</span><span className="stat__label">Marcas parceiras</span></div>
          <div className="stat"><span className="stat__num">7 dias</span><span className="stat__label">Ciclo médio captação→entrega</span></div>
          <div className="stat"><span className="stat__num" style={{ color: "var(--accent)" }}>01</span><span className="stat__label">Ecossistema, três pilares</span></div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee items={MARQUEE_WORDS} />

      {/* MANIFESTO */}
      <section className="section" style={{ padding: "41px 98px 123px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 48, alignItems: "start", fontFamily: "\"Archivo Black\"", fontWeight: "200" }}>
          <div>
            <p className="mono" style={{ color: "var(--ink-3)" }}>// 01</p>
            <p className="eyebrow eyebrow-dot" style={{ marginTop: 12 }}>Manifesto</p>
          </div>
          <p className="manifesto-text" style={{ fontFamily: "\"Archivo Black\"" }}>
            Mudafilms virou MUV. Produtora virou <em style={{ fontFamily: "\"Archivo Black\"", fontWeight: "100" }}>ecossistema</em> criativo
            que entrega <span className="blue">resultado</span>, estética e verdade. Criatividade com direção.
            Estética com propósito. <em style={{ fontFamily: "\"Archivo Black\"", fontWeight: "100" }}>Conteúdo que move.</em>
          </p>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="section section--dark" data-comment-anchor="a9dc642ec8-section-138-7" style={{ padding: "112px 98px 113px" }}>
        <SectionHead
          num="02"
          eyebrow="Serviços · 4 pilares"
          title="Estratégia, produção, conteúdo, comunidade."
          sub="Um ecossistema, quatro frentes integradas. Você fala com uma equipe — entrega no nível de quatro produtoras." />
        
        <div className="grid-2">
          {SERVICOS.map((s, i) =>
          <ServiceCardDark key={s.num} {...s} />
          )}
        </div>
        <div style={{ marginTop: 48, display: "flex", justifyContent: "flex-end" }} data-comment-anchor="1cd804d6a0-div-150-9">
          <button className="btn btn--ghost-dark" onClick={() => setCurrent("servicos")}>Detalhar serviços <Arrow /></button>
        </div>
      </section>

      {/* PROCESSO (preview clicável) */}
      <section className="section" style={{ padding: "134px 98px 70px" }}>
        <SectionHead
          num="03"
          eyebrow="Processo"
          title={"Da ideia ao master.\nEm seis passos."}
          sub="Sem improviso, sem surpresa no orçamento. Toda etapa tem entregável, prazo e aprovação." />
        
        <div>
          {PROCESSO.slice(0, 3).map((p) =>
          <StepRow key={p.num} {...p} onClick={() => setCurrent("processo")} linkable />
          )}
          <div className="step"><div className="step__num">···</div><div></div><div></div><div style={{ textAlign: "right" }}><button className="link-arrow" onClick={() => setCurrent("processo")} style={{ background: "transparent", border: 0, padding: 0, font: "inherit" }}>Ver processo completo <Arrow /></button></div></div>
        </div>
      </section>

      {/* TRABALHOS PREVIEW */}
      <section className="section">
        <SectionHead
          num="04"
          eyebrow="Trabalhos selecionados"
          title="Cases recentes."
          sub="Recortes de 2024–25. Marcas, eventos e narrativas que a gente ajudou a contar." />
        
        <div className="grid-3">
          {TRABALHOS.slice(0, 3).map((t, i) => <CaseCard key={i} {...t} idx={i} />)}
        </div>
        <div style={{ marginTop: 48, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn--ghost" onClick={() => setCurrent("trabalhos")}>Ver todos os trabalhos <Arrow /></button>
        </div>
      </section>

      {/* MARCAS — esteira */}
      <section className="section section--tight" data-comment-anchor="5fa0ad7c32-section-186-7">
        <SectionHead num="05" eyebrow="Confiança" title="Marcas que confiam na gente." />
        <BrandMarquee brands={BRANDS} />
        <p className="mono" style={{ marginTop: 24, color: "var(--ink-3)", textAlign: "center" }}>// + 30 marcas · 2019 → 2026</p>
      </section>

      {/* MUV HUB TEASER */}
      <section className="section section--ink" style={{ position: "relative", overflow: "hidden", padding: "122px 98px 123px 35px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>06 · Em breve · 2026</p>
            <h2 className="display" style={{ color: "var(--bg)", marginTop: 24, fontSize: "106px", margin: "24px 0px 88px", letterSpacing: "-5px", width: "563px", height: "126px" }}>
              MUV <span style={{ color: "var(--accent)", fontSize: "63px", margin: "0px 0px 0px -29px" }}>Hub.</span><br />
              <span style={{ fontStyle: "italic", textAlign: "left", fontFamily: "\"Archivo Black\"", fontWeight: "100", lineHeight: "0", borderStyle: "solid", letterSpacing: "-1.9px", fontSize: "52px", borderWidth: "0px", margin: "0px", padding: "0px" }}>O ecossistema vivo.</span>
            </h2>
            <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 24, maxWidth: 480, fontWeight: "100" }}>
              Locadora de equipamentos, reserva de studio e comunidade criativa
              num só lugar. Exclusivo pra filmmakers, agências e marcas parceiras.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn--primary" onClick={() => setCurrent("hub")}>Conhecer o Hub <Arrow /></button>
              <button className="btn btn--ghost-dark">Entrar na lista <Arrow /></button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "808px", height: "740px", padding: "0px", borderWidth: "0px", borderStyle: "solid" }}>
            <Cine label="LOCADORA · CATÁLOGO" code="HUB.A" variant="dark" aspect="4/5" />
            <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 48 }}>
              <Cine label="STUDIO · CICLORAMA" code="HUB.B" variant="accent" aspect="1/1" />
              <Cine label="COMUNIDADE" code="HUB.C" variant="dark" aspect="4/3" />
            </div>
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="section" style={{ padding: "106px 98px 118px" }}>
        <SectionHead num="07" eyebrow="Diário MUV" title="Conteúdo sobre conteúdo." sub="Bastidor, ensaio, frameworks. O que a gente aprende, a gente compartilha." />
        <div>
          {POSTS.slice(0, 3).map((p, i) => <PostRow key={i} {...p} />)}
        </div>
        <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn--ghost" onClick={() => setCurrent("blog")}>Ver todos os posts <Arrow /></button>
        </div>
      </section>

      {/* CTA FINAL */}
      <HomeCTA setCurrent={setCurrent} />
    </div>);

}

function HomeCTA({ setCurrent }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", type: "", budget: "", brief: "" });
  const [sent, setSent] = useState(false);
  const types = ["Brand Film", "Campanha publicitária", "Cobertura de evento", "Conteúdo social", "Documentário", "Showreel / institucional", "Outro"];
  const budgets = ["R$ 5–10k", "R$ 10–25k", "R$ 25–50k", "R$ 50–100k", "R$ 100k+", "A definir"];
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.type) return;
    setSent(true);
  };

  return (
    <section className="section section--ink home-cta" style={{ fontSize: "46px", padding: "128px 98px 225px" }}>
      <div className="home-cta__grid">
        {/* LEFT: form card */}
        <div className="home-cta__form">
          <div className="quote-card">
            {sent ?
            <div style={{ padding: "24px 0" }}>
                <p className="eyebrow eyebrow-dot" style={{ color: "var(--accent)" }}>Recebido ✓</p>
                <h3 className="h3" style={{ marginTop: 16 }}>Obrigado, {form.name.split(" ")[0] || "parceiro"}.</h3>
                <p className="body" style={{ color: "var(--ink-2)", marginTop: 16, lineHeight: 1.55 }}>
                  Em até 24h a gente volta com diagnóstico, escopo e timeline. Enquanto isso, dá uma olhada nos trabalhos recentes.
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                  <button className="btn btn--ink" onClick={() => setCurrent("trabalhos")}>Ver portfolio <Arrow /></button>
                  <button className="btn btn--ghost" onClick={() => {setSent(false);setForm({ name: "", company: "", email: "", phone: "", type: "", budget: "", brief: "" });}}>Novo orçamento</button>
                </div>
              </div> :

            <form onSubmit={submit}>
                <h3 className="quote-card__title">Solicite um orçamento</h3>
                <p className="quote-card__sub">Campos com <span style={{ color: "var(--accent)" }}>*</span> são obrigatórios</p>

                <div className="quote-card__row">
                  <div className="field field--solid">
                    <label>Nome <span style={{ color: "var(--accent)" }}>*</span></label>
                    <input placeholder="Seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="field field--solid">
                    <label>Empresa</label>
                    <input placeholder="Nome da empresa" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  </div>
                </div>

                <div className="quote-card__row">
                  <div className="field field--solid">
                    <label>E-mail <span style={{ color: "var(--accent)" }}>*</span></label>
                    <input type="email" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="field field--solid">
                    <label>Telefone <span style={{ color: "var(--accent)" }}>*</span></label>
                    <input placeholder="(11) 99999-9999" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                </div>

                <div className="field field--solid" style={{ marginBottom: 20 }}>
                  <label>Tipo de projeto <span style={{ color: "var(--accent)" }}>*</span></label>
                  <div className="select-wrap">
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required>
                      <option value="">Selecione</option>
                      {types.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <svg className="select-chev" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>

                <div className="field field--solid" style={{ marginBottom: 20 }}>
                  <label>Faixa de investimento</label>
                  <div className="budget-grid">
                    {budgets.map((b) =>
                  <button
                    key={b}
                    type="button"
                    className={`budget-chip ${form.budget === b ? "budget-chip--on" : ""}`}
                    onClick={() => setForm({ ...form, budget: form.budget === b ? "" : b })}>
                    
                        {b}
                      </button>
                  )}
                  </div>
                </div>

                <div className="field field--solid" style={{ marginBottom: 24 }}>
                  <label>Sobre o projeto</label>
                  <textarea
                  rows="4"
                  placeholder="Descreva o que precisa, prazo e detalhes..."
                  value={form.brief}
                  onChange={(e) => setForm({ ...form, brief: e.target.value })} />
                
                </div>

                <button type="submit" className="btn btn--ink quote-submit">
                  ENVIAR SOLICITAÇÃO <Arrow />
                </button>
                <p className="quote-card__disclaimer">Seus dados não serão compartilhados com terceiros.</p>
              </form>
            }
          </div>
        </div>

        {/* RIGHT: manchete + CTAs */}
        <div className="home-cta__hero">
          <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Próximo passo</p>
          <h2 className="display" style={{ marginTop: 32, color: "var(--dark-ink)", fontSize: "67px" }}>
            Vamos contar<br />sua <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>história?</span>
          </h2>
          <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 32, maxWidth: 420, fontFamily: "Inter", fontWeight: "200" }}>
            Conta o que você quer fazer. Em 24h a gente volta com diagnóstico, escopo e timeline — sem proposta genérica.
          </p>
          <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn--ghost-dark" onClick={() => setCurrent("trabalhos")}>Ver portfolio <Arrow /></button>
            <button className="btn btn--ghost-dark" onClick={() => setCurrent("contato")}>Briefing completo <Arrow /></button>
          </div>
          <div className="home-cta__contact">
            <a href="mailto:contato@grupomuv.com.br" className="home-cta__contact-item">
              <span className="mono" style={{ color: "var(--dark-ink-2)" }}>E-mail</span>
              <span>contato@grupomuv.com.br</span>
            </a>
            <a href="tel:+5511991087786" className="home-cta__contact-item">
              <span className="mono" style={{ color: "var(--dark-ink-2)" }}>Telefone</span>
              <span>+55 11 99108-7786</span>
            </a>
            <div className="home-cta__contact-item">
              <span className="mono" style={{ color: "var(--dark-ink-2)" }}>Estúdio</span>
              <span>São Paulo · SP</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function ServiceCardDark({ num, tag, title, desc, items }) {
  return (
    <div className="svc" style={{ background: "rgba(255,255,255,0.02)", borderColor: "var(--dark-line)", color: "var(--dark-ink)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="svc__num" style={{ color: "var(--accent)" }}>// {num}</span>
        <span className="pill pill--accent">{tag}</span>
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark-ink-2)" }}>
        {items.join(" · ")}
      </p>
      <h3 className="svc__title" style={{ color: "var(--dark-ink)", fontFamily: "\"Archivo Black\"" }}>{title}</h3>
      <p className="svc__desc" style={{ color: "var(--dark-ink-2)" }}>{desc}</p>
    </div>);

}

function StepRow({ num, title, desc, deliverables, onClick, linkable }) {
  return (
    <div
      className={`step ${linkable ? "step--link" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();onClick();}} : undefined}>
      
      <div className="step__num">{num}</div>
      <h3 className="step__title" style={{ fontFamily: "\"Archivo Black\"" }}>{title}</h3>
      <p className="step__desc">{desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <p className="step__deliverables">{deliverables}</p>
        {linkable && <span className="step__arrow">Ver processo <Arrow /></span>}
      </div>
    </div>);

}

function CaseCard({ title, client, tag, year, idx, variant }) {
  const variants = ["default", "dark", "accent", "default", "dark", "accent"];
  const v = variant || variants[idx % variants.length];
  return (
    <div className="case">
      <div className="case__media" style={{ fontSize: "10px", width: "412px" }}>
        <Cine label={title.toUpperCase()} code={`CASE.${String(idx + 1).padStart(2, "0")}`} aspect="4/3" variant={v} center={v === "accent" ? "▶ PREVIEW" : null} />
      </div>
      <div className="case__meta">
        <div>
          <p className="case__tag">{client}</p>
          <h3 className="case__title" style={{ fontFamily: "\"Archivo Black\"" }}>{title}</h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <p className="case__tag">{tag}</p>
          <p className="case__tag" style={{ marginTop: 4 }}>{year}</p>
        </div>
      </div>
    </div>);

}

function PostRow({ date, title, excerpt, read }) {
  return (
    <article className="post">
      <div className="post__head">
        <h3 className="post__title">{title}</h3>
        <span className="post__date">{date} · {read}</span>
      </div>
      <p className="post__excerpt" style={{ fontFamily: "Inter", fontWeight: "200" }}>{excerpt}</p>
      <span className="link-arrow" style={{ color: "var(--ink-2)" }}>Ler texto <Arrow /></span>
    </article>);

}

// ═════════════════════════════════════════════════════════════════════════════
// SERVIÇOS
// ═════════════════════════════════════════════════════════════════════════════
function Servicos({ setCurrent }) {
  return (
    <div className="page" data-screen-label="Servicos">
      <PageHead crumb="01 · Serviços" title="Quatro frentes. Um ecossistema." lead="A gente integra estratégia, produção, conteúdo e comunidade num único parceiro. Sem terceirizar o que importa." accent="ecossistema" meta="04 pilares · 01 ecossistema" />

      <section className="section">
        <div className="svc-stack">
          {SERVICOS.map((s, i) =>
          <div key={s.num} className="svc-row">
              <div className="svc-row__sidebar">
                <p className="mono svc-row__num">// {s.num}</p>
                <span className="pill pill--accent svc-row__pill">{s.tag}</span>
                <h2 className="svc-row__title">{s.title}</h2>
              </div>
              <div className="svc-row__main">
                <Cine label={s.tag.toUpperCase()} code={`SVC.${s.num}`} aspect="16/10" variant={i % 2 === 0 ? "dark" : "default"} />
                <p className="body-l svc-row__desc">{s.desc}</p>
                <p className="eyebrow eyebrow-dot svc-row__scope-label">O que entra no escopo</p>
                <ul className="svc-row__list">
                  {s.items.map((it, k) =>
                <li key={k}>
                      <span className="svc-row__plus">+</span>{it}
                    </li>
                )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section section--ink" style={{ textAlign: "center" }}>
        <h2 className="display" style={{ fontSize: "clamp(40px, 7vw, 120px)" }}>
          Um briefing.<br />
          <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>Uma equipe.</span>
        </h2>
        <button className="btn btn--primary" style={{ marginTop: 48 }} onClick={() => setCurrent("contato")}>Começar um projeto <Arrow /></button>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// PROCESSO
// ═════════════════════════════════════════════════════════════════════════════
function Processo({ setCurrent }) {
  return (
    <div className="page" data-screen-label="Processo">
      <PageHead crumb="02 · Processo" title="Da ideia ao master." lead="Seis passos. Cada um com entregável, prazo e aprovação. Sem improviso, sem surpresa no orçamento — claro do dia zero." accent="master" meta="06 etapas · Workflow MUV" />

      <section className="section">
        <div>
          {PROCESSO.map((p) => <StepRow key={p.num} {...p} />)}
        </div>
      </section>

      <section className="section section--dark">
        <SectionHead num="*" eyebrow="Como medimos" title="O que conta como bom trabalho." sub="Estética é metade. A outra metade é como o conteúdo performa no mundo real." />
        <div className="grid-3">
          <Metric num="01" label="Direção" desc="Cada decisão estética tem motivo estratégico. Não filmamos por filmar." />
          <Metric num="02" label="Prazo" desc="Cronograma respeitado. Atraso é exceção justificada, nunca padrão." />
          <Metric num="03" label="Retenção" desc="Conteúdo entregue pra plataforma certa, no formato certo, na curva certa." />
        </div>
      </section>

      <section className="section" style={{ textAlign: "center" }}>
        <p className="eyebrow eyebrow-dot" style={{ display: "inline-flex" }}>Próximo passo</p>
        <h2 className="h1" style={{ marginTop: 24 }}>Briefa a gente em 5 minutos.</h2>
        <button className="btn btn--ink" style={{ marginTop: 32 }} onClick={() => setCurrent("contato")}>Mandar briefing <Arrow /></button>
      </section>
    </div>);

}

function Metric({ num, label, desc }) {
  return (
    <div style={{ padding: 32, border: "1px solid var(--dark-line)", display: "flex", flexDirection: "column", gap: 16, minHeight: 240 }}>
      <p className="mono" style={{ color: "var(--accent)" }}>// {num}</p>
      <h3 className="h3" style={{ marginTop: "auto" }}>{label}</h3>
      <p style={{ color: "var(--dark-ink-2)", fontSize: 14 }}>{desc}</p>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// TRABALHOS
// ═════════════════════════════════════════════════════════════════════════════
function Trabalhos({ setCurrent }) {
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const filters = ["Todos", "Brand film", "Documentário", "Social", "Cobertura"];

  if (selected !== null) {
    const t = TRABALHOS[selected];
    return (
      <div className="page" data-screen-label="CaseDetail">
        <article className="case-detail">
          <div className="case-detail__nav">
            <button className="link-arrow link-arrow--back" onClick={() => { setSelected(null); window.scrollTo({ top: 0, behavior: "instant" }); }}>
              <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Arrow /></span> Todos os cases
            </button>
          </div>
          <header className="case-detail__head">
            <div className="case-detail__meta">
              <span className="pill pill--accent">{t.category}</span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>{t.year} · {t.tag}</span>
            </div>
            <p className="case-detail__client mono">{t.client}</p>
            <h1 className="case-detail__title">{t.title}</h1>
            <p className="body-l case-detail__lead">{t.summary}</p>
          </header>
          <div className="case-detail__hero">
            <Cine label={t.title.toUpperCase().replace(/\n/g, " ")} code={`CASE.${String(selected + 1).padStart(2, "0")}`} aspect="16/9" variant="accent" play />
          </div>

          <section className="case-detail__specs">
            <div className="case-detail__spec">
              <p className="mono case-detail__spec-label">// FORMATO</p>
              <p>{t.format}</p>
            </div>
            <div className="case-detail__spec">
              <p className="mono case-detail__spec-label">// EQUIPE</p>
              <p>{t.team}</p>
            </div>
            <div className="case-detail__spec">
              <p className="mono case-detail__spec-label">// EQUIPAMENTO</p>
              <p>{t.gear}</p>
            </div>
          </section>

          <div className="case-detail__body">
            {t.body.map((b, i) =>
              <div key={i} className="case-detail__block">
                <h2 className="case-detail__h2">{b.h}</h2>
                <p className="case-detail__p">{b.p}</p>
              </div>
            )}
          </div>

          <footer className="case-detail__footer">
            <p className="eyebrow eyebrow-dot">Próximo passo</p>
            <h3 className="h2" style={{ marginTop: 16 }}>Briefing parecido no seu radar?</h3>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn--ink" onClick={() => setCurrent("contato")}>Começar um projeto <Arrow /></button>
              <button className="btn btn--ghost" onClick={() => { setSelected(null); window.scrollTo({ top: 0, behavior: "instant" }); }}>Ver outros cases</button>
            </div>
          </footer>
        </article>
      </div>);
  }

  const filtered = filter === "Todos" ? TRABALHOS : TRABALHOS.filter((t) => t.category === filter);

  return (
    <div className="page" data-screen-label="Trabalhos">
      <PageHead crumb="03 · Trabalhos" title="Cases selecionados." lead="Recortes de produções de 2023 a 2026. Cada projeto carrega uma marca real, um problema real e uma solução audiovisual com intenção." accent="Cases" meta={`${TRABALHOS.length} projetos · 2023–2026`} />

      <div className="works-filter">
        <div className="works-filter__inner">
          <div className="works-filter__chips">
            {filters.map((f) =>
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pill ${filter === f ? "pill--accent" : ""}`}
              style={{ cursor: "pointer", background: filter === f ? undefined : "transparent" }}>

                {f}
              </button>
            )}
          </div>
          <p className="mono works-filter__count">{filtered.length} resultado{filtered.length === 1 ? "" : "s"}</p>
        </div>
      </div>

      <section className="section works-grid-section">
        <div className="works-grid">
          {filtered.map((t, i) => {
            const realIdx = TRABALHOS.indexOf(t);
            return (
              <article
                key={t.slug}
                className={`work-card work-card--${i % 3 === 0 ? "wide" : "regular"} work-card--link`}
                role="button"
                tabIndex={0}
                onClick={() => { setSelected(realIdx); window.scrollTo({ top: 0, behavior: "instant" }); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(realIdx); window.scrollTo({ top: 0, behavior: "instant" }); }}}>
                <Cine
                  label={t.title.toUpperCase().replace(/\n/g, " ")}
                  code={`CASE.${String(realIdx + 1).padStart(2, "0")}`}
                  aspect={i % 3 === 0 ? "16/9" : "4/3"}
                  variant={i % 4 === 0 ? "accent" : i % 4 === 2 ? "dark" : "default"}
                  play={i % 3 === 0} />
                <div className="work-card__meta">
                  <div className="work-card__left">
                    <p className="case__tag">{t.client}</p>
                    <h3 className="case__title">{t.title}</h3>
                  </div>
                  <div className="work-card__right">
                    <p className="case__tag">{t.tag}</p>
                    <p className="case__tag work-card__year">{t.year}</p>
                  </div>
                </div>
              </article>);
          })}
        </div>
      </section>

      <section className="section section--ink works-reel">
        <div className="works-reel__head">
          <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Quer ver mais?</p>
          <h2 className="display works-reel__title">
            Showreel<br /><span style={{ color: "var(--accent)" }}>completo.</span>
          </h2>
        </div>
        <div className="works-reel__media">
          <Cine label="REEL EXTENDED · 03'20" code="REEL.FULL" aspect="16/9" variant="dark" play />
        </div>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// SOBRE
// ═════════════════════════════════════════════════════════════════════════════
function Sobre({ setCurrent }) {
  return (
    <div className="page" data-screen-label="Sobre">
      <PageHead crumb="04 · Sobre" title="A gente é um hub. Não uma produtora." lead="Nascemos na rua, nos eventos, nas madrugadas de edição. E levamos essa energia pra marcas que querem ser lembradas." accent="hub" meta="Equipe · Manifesto · Pilares" />

      {/* MANIFESTO */}
      <section className="section about-manifesto">
        <div className="about-manifesto__inner">
          <div className="about-manifesto__label">
            <p className="mono" style={{ color: "var(--ink-3)" }}>// MANIFESTO</p>
            <p className="eyebrow eyebrow-dot" style={{ marginTop: 12 }}>O que define a gente</p>
          </div>
          <p className="manifesto-text">
            Criatividade com <em>direção.</em><br />
            Estética com <em>propósito.</em><br />
            <span className="blue">Conteúdo</span> que <em>move.</em>
          </p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section section--tight about-gallery">
        <div className="about-gallery__grid">
          <div className="about-gallery__main" data-comment-anchor="e7d656e993-div-759-11">
            <Cine label="EQUIPE EM AÇÃO · BACKSTAGE" code="ABOUT.01" aspect="4/3" />
          </div>
          <div className="about-gallery__col">
            <Cine label="STUDIO · INTERIOR" code="ABOUT.02" aspect="1/1" variant="dark" />
            <Cine label="EQUIPAMENTO" code="ABOUT.03" aspect="3/2" variant="accent" />
          </div>
        </div>
        <div className="about-gallery__caption">
          <p className="mono">Backstage · Studio · Equipamento</p>
          <p className="mono">São Paulo · 2025</p>
        </div>
      </section>

      {/* PILARES */}
      <section className="section about-pilares">
        <SectionHead num="01" eyebrow="Pilares" title="O que move a gente." />
        <div className="about-pilares__grid">
          {[
          { tag: "Autêntico", desc: "Não encenamos. A verdade é a base de tudo que produzimos." },
          { tag: "Sofisticado", desc: "Imagem e som no nível de grandes marcas globais — com calor humano." },
          { tag: "Estratégico", desc: "Cada frame tem intenção. Pensamos posicionamento antes da câmera." },
          { tag: "Veloz", desc: "Entrega rápida sem sacrificar qualidade. Edição overnight quando precisa." }].
          map((p, i) =>
          <div key={i} className="pilar-card">
              <p className="mono pilar-card__num">// 0{i + 1}</p>
              <h3 className="pilar-card__title">{p.tag}.</h3>
              <p className="pilar-card__desc">{p.desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* EQUIPE */}
      <section className="section section--dark about-team">
        <SectionHead num="02" eyebrow="Equipe" title="Quem faz acontecer." sub="Direção criativa, captação, pós e estratégia. Uma equipe sênior, integrada do briefing à entrega." />
        <div className="team">
          {TIME.map((t, i) =>
          <div key={i} className="team__card">
              <Cine label={t.role.toUpperCase()} code={`TEAM.${String(i + 1).padStart(2, "0")}`} aspect="4/5" variant={i % 2 === 0 ? "dark" : "default"} />
              <p className="team__role" style={{ color: "var(--dark-ink-2)" }}>{t.role}</p>
              <h3 className="team__name" style={{ color: "var(--dark-ink)" }}>{t.name}</h3>
              <p style={{ color: "var(--dark-ink-2)", fontSize: 13 }}>{t.short}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section about-cta">
        <div className="about-cta__inner">
          <p className="eyebrow eyebrow-dot">Quer trabalhar com a gente?</p>
          <h2 className="about-cta__title">A gente lê todo briefing.</h2>
          <button className="btn btn--primary" onClick={() => setCurrent("contato")}>Falar com a gente <Arrow /></button>
        </div>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// MUV HUB
// ═════════════════════════════════════════════════════════════════════════════
function MuvHub({ setCurrent }) {
  return (
    <div className="page" data-screen-label="MuvHub">
      <section className="hero" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="hero__top">
          <span className="pill pill--accent pill--dot">Em breve · 2026</span>
          <p className="mono" style={{ color: "var(--ink-3)" }}>// HUB.OVERVIEW</p>
        </div>
        <h1 className="hero__display" style={{ letterSpacing: "0px", textAlign: "left" }}>
          MUV <span className="accent">Hub.</span><br />
          <span className="italic" style={{ fontSize: "145px" }}>O ecossistema vivo.</span>
        </h1>
        <p className="hero__sub" style={{ marginTop: 48 }}>
          Locadora de equipamentos, reserva de studio e comunidade criativa
          num só lugar. Plataforma exclusiva pra filmmakers, agências e marcas parceiras.
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn--primary">Entrar na lista de espera <Arrow /></button>
          <button className="btn btn--ghost" onClick={() => setCurrent("contato")}>Saber mais <Arrow /></button>
        </div>
      </section>

      <section className="section section--ink">
        <SectionHead num="01" eyebrow="Três módulos · Uma plataforma" title="Tudo num só ecossistema." />
        <div className="grid-3">
          <Module tag="LOCADORA" title="Equipamento profissional sob demanda." items={["Sony FX6, FX3", "Drones DJI", "Iluminação completa", "Reserva online", "Retirada na MUV"]} icon="A" />
          <Module tag="STUDIO" title="Espaço pra criar, gravar, produzir." items={["Ciclorama", "Iluminação inclusa", "Equipamento básico", "Reserva por turno", "Café & wifi"]} icon="B" />
          <Module tag="COMUNIDADE" title="Hub criativo de filmmakers e marcas." items={["Feed & networking", "Agenda de eventos", "Conteúdos exclusivos", "Cursos & mentorias", "Conexão com marcas"]} icon="C" />
        </div>
      </section>

      <section className="section">
        <SectionHead num="02" eyebrow="Como funciona" title="Conta grátis. Acesso instantâneo." sub="Cria sua conta em 30 segundos e já tem acesso ao catálogo, agenda e comunidade." />
        <div className="grid-3">
          {[
          { n: "01", t: "Cadastro", d: "Conta grátis em 30s. Sem cartão, sem compromisso. Filmmakers, agências e marcas." },
          { n: "02", t: "Catálogo & Reserva", d: "Equipamento e studio online. Reserva, contrato digital, retirada na MUV." },
          { n: "03", t: "Comunidade", d: "Feed, eventos, networking, conteúdo educativo. Cresce junto com o hub." }].
          map((s) =>
          <div key={s.n} style={{ padding: "32px 24px", borderTop: "1px solid var(--ink)", minHeight: 240 }}>
              <p className="mono" style={{ color: "var(--accent)" }}>// {s.n}</p>
              <h3 className="h3" style={{ marginTop: 32 }}>{s.t}</h3>
              <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 12 }}>{s.d}</p>
            </div>
          )}
        </div>
      </section>

      <section className="section section--dark" style={{ textAlign: "center", padding: "148px 86px 68px" }}>
        <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)", display: "inline-flex" }}>Lançamento · 2026</p>
        <h2 className="display" style={{ marginTop: 24, fontSize: "clamp(48px, 8vw, 140px)" }}>
          Lista de <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>espera</span><br />prioritária.
        </h2>
        <p className="body-l" style={{ color: "var(--dark-ink-2)", maxWidth: 540, margin: "32px auto 0" }}>
          Quem entra na lista agora tem acesso antecipado, condição de fundador e prioridade na agenda de studio.
        </p>
        <div style={{ marginTop: 48, maxWidth: 480, margin: "48px auto 0", display: "flex", gap: 8 }}>
          <input
            type="email"
            placeholder="seu@email.com"
            style={{ flex: 1, padding: "16px 20px", borderRadius: 999, border: "1px solid var(--dark-line)", background: "rgba(255,255,255,0.04)", color: "var(--dark-ink)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none" }} />
          
          <button className="btn btn--primary">Entrar <Arrow /></button>
        </div>
      </section>
    </div>);

}

function Module({ tag, title, items, icon }) {
  return (
    <div className="module">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="module__icon">{icon}</div>
        <span className="pill pill--accent" style={{ background: "transparent", borderColor: "rgba(222,78,43,0.4)" }}>{tag}</span>
      </div>
      <h3 className="module__title">{title}</h3>
      <ul className="module__features">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// BLOG
// ═════════════════════════════════════════════════════════════════════════════
function Blog({ setCurrent }) {
  const [selected, setSelected] = useState(null);

  if (selected !== null) {
    const post = POSTS[selected];
    return (
      <div className="page" data-screen-label="BlogPost">
        <article className="post-detail">
          <div className="post-detail__nav">
            <button className="link-arrow link-arrow--back" onClick={() => { setSelected(null); window.scrollTo({ top: 0, behavior: "instant" }); }}>
              <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Arrow /></span> Todos os textos
            </button>
          </div>
          <header className="post-detail__head">
            <div className="post-detail__meta">
              <span className="pill pill--accent">{post.category}</span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>{post.date} · {post.read}</span>
            </div>
            <h1 className="post-detail__title">{post.title}</h1>
            <p className="body-l post-detail__lead">{post.excerpt}</p>
          </header>
          <div className="post-detail__hero">
            <Cine label={post.title.toUpperCase()} code={`POST.${String(selected + 1).padStart(2, "0")}`} aspect="16/9" variant={selected % 3 === 0 ? "accent" : selected % 3 === 1 ? "dark" : "default"} />
          </div>
          <div className="post-detail__body">
            {post.body.map((b, i) =>
              b.h ?
                <h2 key={i} className="post-detail__h2">{b.h}</h2> :
                <p key={i} className="post-detail__p">{b.p}</p>
            )}
          </div>
          <footer className="post-detail__footer">
            <p className="eyebrow eyebrow-dot">Próximo passo</p>
            <h3 className="h2" style={{ marginTop: 16 }}>Próximo projeto que pede esse tipo de operação?</h3>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn--ink" onClick={() => setCurrent("contato")}>Falar com a gente <Arrow /></button>
              <button className="btn btn--ghost" onClick={() => { setSelected(null); window.scrollTo({ top: 0, behavior: "instant" }); }}>Ver outros textos</button>
            </div>
          </footer>
        </article>
      </div>);
  }

  const feat = POSTS[0];
  const rest = POSTS.slice(1);
  return (
    <div className="page" data-screen-label="Blog">
      <PageHead crumb="05 · Diário MUV" title="Conteúdo sobre conteúdo." lead="Bastidor, ensaio, frameworks. O que a gente aprende produzindo, a gente compartilha por escrito." accent="conteúdo" meta={`${POSTS.length} textos · Atualizado mensal`} />

      {/* DESTAQUE */}
      <section className="section blog-feature">
        <div className="blog-feature__head">
          <p className="eyebrow eyebrow-dot">Em destaque</p>
          <p className="mono" style={{ color: "var(--ink-3)" }}>// FEAT.01</p>
        </div>
        <div className="blog-feature__grid">
          <div className="blog-feature__media">
            <Cine label={feat.title.toUpperCase()} code="POST.FEAT" aspect="16/9" variant="accent" />
          </div>
          <div className="blog-feature__body">
            <div className="blog-feature__meta">
              <span className="pill pill--accent">{feat.category}</span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>{feat.date} · {feat.read}</span>
            </div>
            <h2 className="blog-feature__title">{feat.title}</h2>
            <p className="body-l blog-feature__excerpt">{feat.excerpt}</p>
            <button className="btn btn--ink" onClick={() => { setSelected(0); window.scrollTo({ top: 0, behavior: "instant" }); }}>Ler texto completo <Arrow /></button>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="section blog-list">
        <div className="blog-list__head">
          <p className="eyebrow eyebrow-dot">Todos os textos</p>
          <p className="mono" style={{ color: "var(--ink-3)" }}>{rest.length} publicações</p>
        </div>
        <div className="blog-list__rows">
          {rest.map((p, i) =>
          <article
            key={i}
            className="blog-row blog-row--link"
            role="button"
            tabIndex={0}
            onClick={() => { setSelected(i + 1); window.scrollTo({ top: 0, behavior: "instant" }); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(i + 1); window.scrollTo({ top: 0, behavior: "instant" }); }}}>
              <div className="blog-row__num">{String(i + 2).padStart(2, "0")}</div>
              <div className="blog-row__cat"><span className="pill">{p.category}</span></div>
              <h3 className="blog-row__title">{p.title}</h3>
              <div className="blog-row__meta">
                <p className="mono">{p.date}</p>
                <p className="mono">{p.read}</p>
              </div>
              <div className="blog-row__cta">
                <span className="link-arrow">Ler <Arrow /></span>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section section--dark blog-newsletter">
        <div className="blog-newsletter__inner">
          <div>
            <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Newsletter</p>
            <h2 className="blog-newsletter__title">Recebe os textos no e-mail.</h2>
            <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 16, maxWidth: 420 }}>1 texto por mês. Sem spam. Cancela quando quiser.</p>
          </div>
          <form className="blog-newsletter__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="seu@email.com" />
            <button type="submit" className="btn btn--primary">Assinar <Arrow /></button>
          </form>
        </div>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// CONTATO
// ═════════════════════════════════════════════════════════════════════════════
function Contato({ setCurrent }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: "", company: "", email: "", phone: "", scope: [], budget: "", deadline: "", brief: "" });
  const SCOPES = ["Brand Film", "Campanha", "Cobertura de Evento", "Conteúdo Social", "Documentário", "Showreel"];
  const BUDGETS = ["< R$30k", "R$30k – 80k", "R$80k – 200k", "+ R$200k"];

  const submit = () => setStep(4);

  return (
    <div className="page" data-screen-label="Contato">
      <PageHead crumb="06 · Contato" title="A gente lê todo briefing." lead="Conta o que você quer fazer. Em 24h a gente volta com diagnóstico, próximo passo e timeline. Sem proposta genérica." accent="briefing" meta="Resposta em 24h" />

      <section className="section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64 }}>
          {/* Sidebar */}
          <aside style={{ position: "sticky", top: 120, alignSelf: "start" }}>
            <p className="eyebrow eyebrow-dot">Direto</p>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <li><a className="link-arrow" href="mailto:contato@grupomuv.com.br">contato@grupomuv.com.br <Arrow /></a></li>
              <li><a className="link-arrow" href="tel:+5511991087786">+55 11 99108-7786 <Arrow /></a></li>
              <li><a className="link-arrow" href="#">WhatsApp <ArrowDiag /></a></li>
            </ul>

            <p className="eyebrow eyebrow-dot" style={{ marginTop: 48 }}>Estúdio</p>
            <p style={{ marginTop: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
              Rua Exemplo, 000<br />
              Vila Madalena · São Paulo<br />
              SP · 05000-000
            </p>

            <p className="eyebrow eyebrow-dot" style={{ marginTop: 48 }}>Horário</p>
            <p style={{ marginTop: 16, color: "var(--ink-2)" }}>Seg–Sex · 10h–19h<br />Set & set: agenda 24/7</p>

            <p className="eyebrow eyebrow-dot" style={{ marginTop: 48 }}>Social</p>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><a className="link-arrow" href="#">Instagram <ArrowDiag size={10} /></a></li>
              <li><a className="link-arrow" href="#">LinkedIn <ArrowDiag size={10} /></a></li>
              <li><a className="link-arrow" href="#">YouTube <ArrowDiag size={10} /></a></li>
            </ul>
          </aside>

          {/* Form */}
          <div>
            <div style={{ display: "flex", gap: 24, marginBottom: 48 }}>
              {[1, 2, 3].map((n) =>
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, opacity: step >= n ? 1 : 0.4 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${step >= n ? "var(--accent)" : "var(--line)"}`, background: step > n ? "var(--accent)" : "transparent", color: step > n ? "#fff" : step === n ? "var(--accent)" : "var(--ink-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                    {step > n ? "✓" : n}
                  </span>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>{n === 1 ? "Você" : n === 2 ? "Projeto" : "Briefing"}</span>
                </div>
              )}
            </div>

            {step === 1 &&
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                <div className="field"><label>Seu nome</label><input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} /></div>
                <div className="field"><label>Marca / Empresa</label><input value={data.company} onChange={(e) => setData({ ...data, company: e.target.value })} /></div>
                <div className="field"><label>E-mail</label><input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} /></div>
                <div className="field"><label>Telefone</label><input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} /></div>
                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                  <button className="btn btn--primary" onClick={() => setStep(2)} disabled={!data.name || !data.email}>Próximo <Arrow /></button>
                </div>
              </div>
            }

            {step === 2 &&
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <p className="eyebrow eyebrow-dot">O que você precisa? (Pode marcar mais de um)</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                    {SCOPES.map((s) =>
                  <button
                    key={s}
                    type="button"
                    className={`pill ${data.scope.includes(s) ? "pill--accent" : ""}`}
                    style={{ cursor: "pointer", background: data.scope.includes(s) ? undefined : "transparent" }}
                    onClick={() => setData({ ...data, scope: data.scope.includes(s) ? data.scope.filter((x) => x !== s) : [...data.scope, s] })}>
                    
                        {s}
                      </button>
                  )}
                  </div>
                </div>
                <div>
                  <p className="eyebrow eyebrow-dot">Faixa de investimento</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                    {BUDGETS.map((b) =>
                  <button key={b} type="button" className={`pill ${data.budget === b ? "pill--accent" : ""}`} style={{ cursor: "pointer", background: data.budget === b ? undefined : "transparent" }} onClick={() => setData({ ...data, budget: b })}>{b}</button>
                  )}
                  </div>
                </div>
                <div className="field" style={{ maxWidth: 360 }}>
                  <label>Prazo desejado</label>
                  <input type="text" placeholder="Ex: até 30 dias" value={data.deadline} onChange={(e) => setData({ ...data, deadline: e.target.value })} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button className="btn btn--ghost" onClick={() => setStep(1)}>← Voltar</button>
                  <button className="btn btn--primary" onClick={() => setStep(3)} disabled={!data.scope.length}>Próximo <Arrow /></button>
                </div>
              </div>
            }

            {step === 3 &&
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div className="field">
                  <label>Conta um pouco sobre o projeto</label>
                  <textarea
                  placeholder="O que você quer comunicar? Pra quem? Qual o sonho? Quanto mais específico, melhor."
                  value={data.brief}
                  onChange={(e) => setData({ ...data, brief: e.target.value })} />
                
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button className="btn btn--ghost" onClick={() => setStep(2)}>← Voltar</button>
                  <button className="btn btn--primary" onClick={submit} disabled={!data.brief.trim()}>Enviar briefing <Arrow /></button>
                </div>
              </div>
            }

            {step === 4 &&
            <div style={{ padding: "64px 0" }}>
                <p className="eyebrow eyebrow-dot" style={{ color: "var(--accent)" }}>Recebido</p>
                <h2 className="h1" style={{ marginTop: 24 }}>Obrigado, {data.name.split(" ")[0] || "parceiro"}.</h2>
                <p className="body-l" style={{ color: "var(--ink-2)", marginTop: 24, maxWidth: 540 }}>
                  Em até 24h a gente volta com diagnóstico, próximo passo e timeline.
                  Enquanto isso, dá uma olhada nos cases mais recentes.
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
                  <button className="btn btn--ink" onClick={() => setCurrent("trabalhos")}>Ver portfolio <Arrow /></button>
                  <button className="btn btn--ghost" onClick={() => {setStep(1);setData({ name: "", company: "", email: "", phone: "", scope: [], budget: "", deadline: "", brief: "" });}}>Novo briefing</button>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// FAQ
// ═════════════════════════════════════════════════════════════════════════════
function Faq({ setCurrent }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="page" data-screen-label="FAQ">
      <PageHead crumb="07 · FAQ" title="Perguntas que clientes fazem antes de fechar." lead="Prazos, orçamento, equipamento, direitos, NF. Respostas diretas, sem rodeio. Se sua dúvida não tá aqui, manda mensagem no WhatsApp no rodapé." accent="fechar" meta={`${FAQ_ITEMS.length} perguntas · Atualizado 2026`} />

      <section className="section faq-section">
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
                <button
                  type="button"
                  className="faq-item__head"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="faq-item__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="faq-item__cat">
                    <span className="pill">{item.cat}</span>
                  </span>
                  <span className="faq-item__q">{item.q}</span>
                  <span className="faq-item__chev" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-item__body">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section section--ink faq-cta">
        <div className="faq-cta__inner">
          <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Não achou sua dúvida?</p>
          <h2 className="h1" style={{ marginTop: 24, color: "var(--dark-ink)" }}>
            A gente responde<br />no <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>mesmo dia útil.</span>
          </h2>
          <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 24, maxWidth: 540 }}>
            Provavelmente sua dúvida tá no nível mais específico — orçamento de um projeto real, equipamento pra uma necessidade exata, alinhamento de prazo apertado. Esse tipo de coisa a gente resolve em conversa.
          </p>
          <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn btn--primary" href="https://wa.me/message/D6LG7EUSTIR7C1" target="_blank" rel="noopener noreferrer">WhatsApp <Arrow /></a>
            <button className="btn btn--ghost-dark" onClick={() => setCurrent("contato")}>Briefing completo <Arrow /></button>
          </div>
        </div>
      </section>
    </div>);

}

// ───── Export ────────────────────────────────────────────────────────────────
Object.assign(window, { Home, Servicos, Processo, Trabalhos, Sobre, MuvHub, Blog, Contato, Faq });