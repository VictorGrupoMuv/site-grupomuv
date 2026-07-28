import MuvApp from "../../MuvApp";

export const metadata = {
  title: "Studio para Grava\u00e7\u00e3o e Fotografia em S\u00e3o Paulo | MUV Hub",
  description: "Studio equipado para grava\u00e7\u00e3o, fotografia de produto, entrevista e conte\u00fado social. Specs completas, planos por hora e di\u00e1ria. S\u00e3o Paulo.",
  alternates: { canonical: "https://grupomuv.com.br/hub/studio/" },
  openGraph: {
    title: "Studio para Grava\u00e7\u00e3o e Fotografia em S\u00e3o Paulo | MUV Hub",
    description: "Studio equipado para grava\u00e7\u00e3o, fotografia de produto, entrevista e conte\u00fado social. Specs completas, planos por hora e di\u00e1ria. S\u00e3o Paulo.",
    url: "https://grupomuv.com.br/hub/studio/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="hub-studio" />;
}
