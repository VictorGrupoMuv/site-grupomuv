import MuvApp from "../../MuvApp";
import { JsonLd, serviceSchema, faqSchema, breadcrumbSchema, HUB_FAQ, HOME_CRUMB, HUB_CRUMB } from "../hubSeo";

const PATH = "/hub/locadora/";
const TITLE = "Locadora de Equipamento Audiovisual em São Paulo | MUV Hub";
const DESC = "Sony FX6 a R$ 650 e FX3 a R$ 450 a diária, lentes G Master, drones DJI com piloto, luz Aputure e áudio. Retirada na Alameda Santos, região da Paulista. Reserva pelo WhatsApp.";

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://grupomuv.com.br${PATH}` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `https://grupomuv.com.br${PATH}`,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }] } };

export default function Page() {
  return (
    <>
      <JsonLd schemas={[
        serviceSchema({
          path: PATH,
          name: "Locadora de equipamento audiovisual",
          serviceType: "Locação de equipamento audiovisual",
          description: DESC,
          offers: [
            { name: "Sony FX6 (diária)", description: "Corpo, baterias, cartões e cage", price: 650, anchor: "#locadora" },
            { name: "Sony FX3 (diária)", description: "Corpo, baterias, cartões e cage", price: 450, anchor: "#locadora" },
            { name: "Sony A7 III (diária)", description: "Corpo, baterias e cartões", price: 230, anchor: "#locadora" },
            { name: "Kit de lentes G Master 16-35, 24-70 e 70-200 (diária)", price: 550, anchor: "#locadora" },
            { name: "Kit de luz LED (diária)", description: "Dois pontos, softbox, tripés e difusão", price: 400, anchor: "#locadora" },
            { name: "Drone DJI com pilotagem (diária)", price: 750, anchor: "#locadora" },
            { name: "Kit de áudio (diária)", description: "Lapelas sem fio, boom e gravador", price: 280, anchor: "#locadora" }] }),
        faqSchema(HUB_FAQ.locadora),
        breadcrumbSchema([HOME_CRUMB, HUB_CRUMB, { name: "Locadora", path: PATH }])]} />
      <MuvApp page="hub-locadora" />
    </>);
}
