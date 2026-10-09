import MuvApp from "../MuvApp";
import { JsonLd, localBusinessSchema, breadcrumbSchema, HOME_CRUMB, HUB_CRUMB } from "./hubSeo";

const TITLE = "MUV Hub | Locadora audiovisual, estúdio e coworking em São Paulo";
const DESC = "Locadora de equipamento (Sony FX6, FX3, lentes G Master, drones), estúdio com ciclorama e coworking criativo na Alameda Santos, região da Paulista. Preços abertos, reserva pelo WhatsApp.";

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://grupomuv.com.br/hub/" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://grupomuv.com.br/hub/",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }] } };

export default function Page() {
  return (
    <>
      <JsonLd schemas={[
        localBusinessSchema({
          description: DESC,
          makesOffer: [
            { "@type": "Offer", name: "Locação de equipamento audiovisual", url: "https://grupomuv.com.br/hub/locadora/" },
            { "@type": "Offer", name: "Aluguel de estúdio com ciclorama", url: "https://grupomuv.com.br/hub/studio/" },
            { "@type": "Offer", name: "Coworking criativo", url: "https://grupomuv.com.br/hub/cowork/" }] }),
        breadcrumbSchema([HOME_CRUMB, HUB_CRUMB])]} />
      <MuvApp page="hub" />
    </>);
}
