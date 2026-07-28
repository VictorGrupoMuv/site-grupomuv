import MuvApp from "../MuvApp";

export const metadata = {
  title: "MUV Hub \u2014 Locadora, Studio, Coworking e Comunidade Criativa em SP",
  description: "Quatro m\u00f3dulos num s\u00f3 endere\u00e7o: locadora de equipamento, studio, cowork e comunidade para filmmakers, ag\u00eancias e marcas. Alameda Santos, S\u00e3o Paulo.",
  alternates: { canonical: "https://grupomuv.com.br/hub/" },
  openGraph: {
    title: "MUV Hub \u2014 Locadora, Studio, Coworking e Comunidade Criativa em SP",
    description: "Quatro m\u00f3dulos num s\u00f3 endere\u00e7o: locadora de equipamento, studio, cowork e comunidade para filmmakers, ag\u00eancias e marcas. Alameda Santos, S\u00e3o Paulo.",
    url: "https://grupomuv.com.br/hub/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="hub" />;
}
