// Constantes da tag do Google. Módulo neutro de propósito: o layout é server
// component e o GoogleAnalytics é client — importar de um arquivo "use client"
// entregaria a referência do módulo, não o valor, e o ID iria para o HTML como
// "[object Object]".

export const GA_MEASUREMENT_ID = "G-7R4ECZGR9S";

// Duas contas do Google Ads estão declaradas de propósito. A primeira é a que
// aparece no painel de instalação de tag; a segunda é a conta "Grupo Muv", onde
// as ações de conversão abaixo foram criadas em 15/09/2026. Manter as duas
// custa nada e evita conversão perdida caso a campanha rode na outra conta.
export const ADS_CONVERSION_ID = "AW-17425244543";
export const ADS_CONVERSION_ID_2 = "AW-18360678358";

// Rótulos das ações de conversão (Ads > Metas > Conversões).
export const ADS_CONV = {
  // Ação principal: briefing da página Contato e CTA da home.
  orcamento: "AW-18360678358/lmB-CNGv7_gcENbvhrNE",
  // Ação principal, negócio separado: funil do MUV Hub.
  hub: "AW-18360678358/uzfSCNSv7_gcENbvhrNE",
  // Ação secundária, fora da otimização de lances de propósito: é barata
  // demais e distorceria o algoritmo se disputasse com os leads reais.
  whatsapp: "AW-18360678358/HcjgCNev7_gcENbvhrNE",
};

export const CONSENT_KEY = "muv-cookie-consent";
