// Fonte única de verdade para SEO das páginas do MUV Hub:
// FAQ (renderizada na página E emitida como FAQPage), dados do negócio
// (LocalBusiness) e helpers de JSON-LD. Preços seguem a tabela avulsa
// publicada em /hub/tabela/ (vigência 2026). Se a tabela mudar, mude aqui.

export const SITE = "https://grupomuv.com.br";
export const WHATSAPP = "https://wa.me/message/D6LG7EUSTIR7C1";
export const TABELA = "/hub/tabela/";

export const HUB_BIZ = {
  name: "MUV Hub",
  legalName: "MUDAFILMS LTDA",
  telephone: "+55-11-99108-7786",
  email: "contato@grupomuv.com.br",
  url: `${SITE}/hub/`,
  image: `${SITE}/og-image.png`,
  streetAddress: "Alameda Santos, 211, 15º andar, Sala 1507",
  addressLocality: "São Paulo",
  addressRegion: "SP",
  postalCode: "01419-000",
  addressCountry: "BR",
};

// ── FAQ por página ─────────────────────────────────────────────────────────
// Perguntas escritas do jeito que as pessoas digitam no Google. Cada resposta
// precisa ficar de pé sozinha (o Google pode exibi-la fora do contexto).

export const HUB_FAQ = {
  locadora: [
    {
      q: "Quanto custa alugar uma Sony FX3 ou FX6 em São Paulo?",
      a: "Na locadora do MUV Hub a diária da Sony FX3 sai por R$ 450 e a da Sony FX6 por R$ 650, sempre com corpo, baterias, cartões e cage. Em 3 dias o avulso tem 15% de desconto e a semana fechada, 25%. Quem é membro do Hub paga menos em todos os itens. A tabela completa está publicada em /hub/tabela/.",
    },
    {
      q: "Precisa de caução ou seguro para alugar equipamento?",
      a: "A caução varia conforme o item, fica pré-autorizada no cartão e não é cobrada se o equipamento voltar íntegro. Membro do Hub tem caução dispensada até R$ 5.000. Seguro de produção não está incluso, mas a gente cota junto quando o projeto pede.",
    },
    {
      q: "Como funciona a retirada e a devolução?",
      a: "A reserva é confirmada com 50% de sinal via PIX e contrato digital curto. A retirada é na Alameda Santos, 211, sala 1507, na região da Avenida Paulista em São Paulo, com checklist de saída assinado. A devolução acontece no horário combinado, no mesmo endereço.",
    },
    {
      q: "Vocês alugam drone com piloto?",
      a: "Sim. Os drones DJI saem sempre com pilotagem, que é obrigatória, por R$ 750 a diária. Para voos em área urbana a gente orienta sobre autorização e janela de voo antes de confirmar.",
    },
    {
      q: "Dá para montar um kit fechado com câmera, luz e áudio?",
      a: "Dá, e o pacote fica mais barato que a soma das linhas da tabela. Manda a data, a duração e o tipo de job pelo WhatsApp que a gente devolve o kit sugerido com orçamento em até um dia útil.",
    },
  ],
  studio: [
    {
      q: "Quanto custa alugar o estúdio do MUV Hub?",
      a: "A hora avulsa custa R$ 250 com mínimo de 2 horas, o bloco de 4 horas sai por R$ 850 e a diária de 8 horas por R$ 1.500. Fim de semana e fora do horário comercial têm acréscimo de 35%. Membros do Hub pagam cerca de 40% menos em todos os formatos.",
    },
    {
      q: "O que está incluso no aluguel do estúdio?",
      a: "Ciclorama, grid de luz montado, tomadas e réguas, wi-fi, camarim, área de apoio e café, sem taxa escondida de limpeza. Equipamento de captação, maquiagem, cenografia, catering e seguro de produção não entram no valor, mas podem ser cotados junto.",
    },
    {
      q: "Tem operador técnico ou luz montada na chegada?",
      a: "Tem. O operador técnico monta a luz, opera e desmonta com você por R$ 600 a diária. O setup de luz pronto antes de você entrar custa R$ 350 e é incluso para membros do Hub.",
    },
    {
      q: "Onde fica o estúdio e como reservar?",
      a: "O estúdio fica na Alameda Santos, 211, sala 1507, região da Avenida Paulista, em São Paulo. A data só é confirmada com 50% de sinal e o saldo é pago até o dia da gravação. A reserva começa por uma mensagem no WhatsApp com data, formato e duração.",
    },
    {
      q: "Posso alugar câmera e lente junto com o estúdio?",
      a: "Pode. A locadora fica no mesmo endereço e entra no mesmo contrato: Sony FX6, FX3, lentes G Master, luz Aputure, áudio e gimbal. Quem reserva estúdio e equipamento juntos recebe um pacote fechado.",
    },
  ],
  cowork: [
    {
      q: "Quanto custa o day pass do coworking?",
      a: "O day pass custa R$ 90 e dá direito a uma baia das 9h às 19h, internet dedicada, café e acesso ao lounge. Não precisa de plano nem de fidelidade.",
    },
    {
      q: "Tem plano mensal de coworking?",
      a: "Tem o plano Flex com 8 dias por mês por R$ 600, mediante reserva, e dia extra a R$ 90. Quem é membro do MUV Hub já tem os 8 dias inclusos e paga R$ 50 no dia extra.",
    },
    {
      q: "Tem sala de reunião?",
      a: "Tem uma sala para até 6 pessoas com TV e câmera para videoconferência por R$ 120 a hora. Membros do Hub têm 2 horas por mês inclusas e pagam R$ 70 nas horas seguintes.",
    },
    {
      q: "Onde fica o coworking e para quem ele é?",
      a: "Fica na Alameda Santos, 211, sala 1507, região da Avenida Paulista, em São Paulo, dentro do mesmo endereço do estúdio e da locadora. Foi pensado para filmmakers, editores, fotógrafos e criativos: a internet aguenta upload de material bruto e você senta ao lado de gente do mesmo ramo.",
    },
  ],
  comunidade: [
    {
      q: "O que é a comunidade do MUV Hub?",
      a: "É a rede de filmmakers, diretores, editores, fotógrafos, agências e marcas que gravita em torno do MUV Hub em São Paulo. Ela se encontra presencialmente no Hub, troca oportunidades de trabalho e compartilha o que aprende em projeto real.",
    },
    {
      q: "Como participar da comunidade?",
      a: "Chame no WhatsApp ou deixe seu e-mail na lista. A gente avisa dos próximos encontros, mostras e sessões de portfolio review, e conecta quem produz com quem precisa contratar.",
    },
    {
      q: "A comunidade é só para quem mora em São Paulo?",
      a: "Os encontros acontecem no Hub, na região da Avenida Paulista, mas a troca de oportunidades e o conteúdo circulam online para o Brasil inteiro. Quem está fora de São Paulo participa da rede e aparece quando vier gravar na cidade.",
    },
  ],
};

// ── Builders de JSON-LD ────────────────────────────────────────────────────

export function localBusinessSchema(extra = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE}/hub/#business`,
    name: HUB_BIZ.name,
    legalName: HUB_BIZ.legalName,
    url: HUB_BIZ.url,
    image: HUB_BIZ.image,
    telephone: HUB_BIZ.telephone,
    email: HUB_BIZ.email,
    priceRange: "R$ 90 a R$ 1.500",
    address: {
      "@type": "PostalAddress",
      streetAddress: HUB_BIZ.streetAddress,
      addressLocality: HUB_BIZ.addressLocality,
      addressRegion: HUB_BIZ.addressRegion,
      postalCode: HUB_BIZ.postalCode,
      addressCountry: HUB_BIZ.addressCountry,
    },
    areaServed: { "@type": "City", name: "São Paulo" },
    parentOrganization: { "@type": "Organization", name: "Grupo MUV", url: SITE },
    sameAs: ["https://instagram.com/grupomuv"],
    ...extra,
  };
}

export function serviceSchema({ path, name, serviceType, description, offers = [] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}${path}#service`,
    name,
    serviceType,
    description,
    url: `${SITE}${path}`,
    areaServed: { "@type": "City", name: "São Paulo" },
    provider: { "@id": `${SITE}/hub/#business` },
    ...(offers.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${name}: tabela avulsa`,
            itemListElement: offers.map((o) => ({
              "@type": "Offer",
              name: o.name,
              ...(o.description ? { description: o.description } : {}),
              price: String(o.price),
              priceCurrency: "BRL",
              url: `${SITE}${TABELA}${o.anchor || ""}`,
              availability: "https://schema.org/InStock",
            })),
          },
        }
      : {}),
  };
}

export function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function breadcrumbSchema(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE}${t.path}`,
    })),
  };
}

export const HUB_CRUMB = { name: "MUV Hub", path: "/hub/" };
export const HOME_CRUMB = { name: "Grupo MUV", path: "/" };

// Renderiza uma lista de schemas como <script type="application/ld+json">.
export function JsonLd({ schemas }) {
  return schemas.filter(Boolean).map((s, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
  ));
}
