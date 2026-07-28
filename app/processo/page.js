import MuvApp from "../MuvApp";

export const metadata = {
  title: "Como trabalhamos \u2014 Processo de Produ\u00e7\u00e3o Audiovisual | Grupo MUV",
  description: "Do briefing \u00e0 entrega: diagn\u00f3stico, dire\u00e7\u00e3o, capta\u00e7\u00e3o, p\u00f3s e distribui\u00e7\u00e3o. Prazo acordado, escopo claro e revis\u00e3o que n\u00e3o vira retrabalho.",
  alternates: { canonical: "https://grupomuv.com.br/processo/" },
  openGraph: {
    title: "Como trabalhamos \u2014 Processo de Produ\u00e7\u00e3o Audiovisual | Grupo MUV",
    description: "Do briefing \u00e0 entrega: diagn\u00f3stico, dire\u00e7\u00e3o, capta\u00e7\u00e3o, p\u00f3s e distribui\u00e7\u00e3o. Prazo acordado, escopo claro e revis\u00e3o que n\u00e3o vira retrabalho.",
    url: "https://grupomuv.com.br/processo/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="processo" />;
}
