import MuvApp from "../../MuvApp";

export const metadata = {
  title: "Locadora de Equipamento Audiovisual em S\u00e3o Paulo | MUV Hub",
  description: "C\u00e2meras Sony FX3 e FX6, \u00f3ticas G Master, drones DJI, ilumina\u00e7\u00e3o e acess\u00f3rios para loca\u00e7\u00e3o em S\u00e3o Paulo. Reserva r\u00e1pida pelo WhatsApp.",
  alternates: { canonical: "https://grupomuv.com.br/hub/locadora/" },
  openGraph: {
    title: "Locadora de Equipamento Audiovisual em S\u00e3o Paulo | MUV Hub",
    description: "C\u00e2meras Sony FX3 e FX6, \u00f3ticas G Master, drones DJI, ilumina\u00e7\u00e3o e acess\u00f3rios para loca\u00e7\u00e3o em S\u00e3o Paulo. Reserva r\u00e1pida pelo WhatsApp.",
    url: "https://grupomuv.com.br/hub/locadora/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="hub-locadora" />;
}
