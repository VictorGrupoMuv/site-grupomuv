import MuvApp from "../../MuvApp";

export const metadata = {
  title: "Comunidade Criativa MUV \u2014 Networking para Filmmakers | MUV Hub",
  description: "Comunidade de filmmakers, diretores, editores e ag\u00eancias. Networking, encontros e trocas reais entre quem produz em S\u00e3o Paulo.",
  alternates: { canonical: "https://grupomuv.com.br/hub/comunidade/" },
  openGraph: {
    title: "Comunidade Criativa MUV \u2014 Networking para Filmmakers | MUV Hub",
    description: "Comunidade de filmmakers, diretores, editores e ag\u00eancias. Networking, encontros e trocas reais entre quem produz em S\u00e3o Paulo.",
    url: "https://grupomuv.com.br/hub/comunidade/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="hub-comunidade" />;
}
