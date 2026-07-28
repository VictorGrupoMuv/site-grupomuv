import MuvApp from "../MuvApp";

export const metadata = {
  title: "Trabalhos \u2014 Cases de V\u00eddeo para Ita\u00fa, Adidas, Nissan e Gatorade | Grupo MUV",
  description: "Portf\u00f3lio de produ\u00e7\u00e3o audiovisual: brand films, campanhas publicit\u00e1rias, cobertura de evento em tempo real e conte\u00fado social para grandes marcas.",
  alternates: { canonical: "https://grupomuv.com.br/trabalhos/" },
  openGraph: {
    title: "Trabalhos \u2014 Cases de V\u00eddeo para Ita\u00fa, Adidas, Nissan e Gatorade | Grupo MUV",
    description: "Portf\u00f3lio de produ\u00e7\u00e3o audiovisual: brand films, campanhas publicit\u00e1rias, cobertura de evento em tempo real e conte\u00fado social para grandes marcas.",
    url: "https://grupomuv.com.br/trabalhos/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="trabalhos" />;
}
