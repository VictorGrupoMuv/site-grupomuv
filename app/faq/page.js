import MuvApp from "../MuvApp";

export const metadata = {
  title: "Perguntas Frequentes \u2014 Prazos, Pre\u00e7os e Direitos de Uso | Grupo MUV",
  description: "Como funciona or\u00e7amento, prazo de entrega, direitos de uso, revis\u00f5es e escopo de produ\u00e7\u00e3o audiovisual. As d\u00favidas mais comuns, respondidas.",
  alternates: { canonical: "https://grupomuv.com.br/faq/" },
  openGraph: {
    title: "Perguntas Frequentes \u2014 Prazos, Pre\u00e7os e Direitos de Uso | Grupo MUV",
    description: "Como funciona or\u00e7amento, prazo de entrega, direitos de uso, revis\u00f5es e escopo de produ\u00e7\u00e3o audiovisual. As d\u00favidas mais comuns, respondidas.",
    url: "https://grupomuv.com.br/faq/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="faq" />;
}
