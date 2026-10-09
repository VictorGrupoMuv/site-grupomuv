import MuvApp from "../../MuvApp";
import { JsonLd, serviceSchema, faqSchema, breadcrumbSchema, HUB_FAQ, HOME_CRUMB, HUB_CRUMB } from "../hubSeo";

const PATH = "/hub/studio/";
const TITLE = "Estúdio para Gravação e Fotografia em São Paulo | MUV Hub";
const DESC = "Estúdio de 60 m² com ciclorama e luz montada na Alameda Santos, região da Paulista. Hora a R$ 250, bloco de 4h a R$ 850, diária a R$ 1.500. Reserva pelo WhatsApp.";

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
          name: "Estúdio para gravação e fotografia",
          serviceType: "Aluguel de estúdio",
          description: DESC,
          offers: [
            { name: "Hora avulsa (mínimo de 2 horas)", price: 250, anchor: "#studio" },
            { name: "Bloco de 4 horas", price: 850, anchor: "#studio" },
            { name: "Diária de 8 horas", price: 1500, anchor: "#studio" },
            { name: "Operador técnico no set (diária)", price: 600, anchor: "#studio" }] }),
        faqSchema(HUB_FAQ.studio),
        breadcrumbSchema([HOME_CRUMB, HUB_CRUMB, { name: "Estúdio", path: PATH }])]} />
      <MuvApp page="hub-studio" />
    </>);
}
