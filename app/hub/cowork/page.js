import MuvApp from "../../MuvApp";
import { JsonLd, serviceSchema, faqSchema, breadcrumbSchema, HUB_FAQ, HOME_CRUMB, HUB_CRUMB } from "../hubSeo";

const PATH = "/hub/cowork/";
const TITLE = "Coworking Criativo em São Paulo: Day Pass e Plano Flex | MUV Hub";
const DESC = "Coworking para filmmakers, editores e criativos na Alameda Santos, região da Paulista. Day pass R$ 90, plano flex de 8 dias por R$ 600 e sala de reunião. Sem fidelidade.";

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
          name: "Coworking criativo",
          serviceType: "Coworking",
          description: DESC,
          offers: [
            { name: "Day pass (9h às 19h)", price: 90, anchor: "#cowork" },
            { name: "Plano Flex, 8 dias por mês", price: 600, anchor: "#cowork" },
            { name: "Sala de reunião para até 6 pessoas (hora)", price: 120, anchor: "#cowork" }] }),
        faqSchema(HUB_FAQ.cowork),
        breadcrumbSchema([HOME_CRUMB, HUB_CRUMB, { name: "Cowork", path: PATH }])]} />
      <MuvApp page="hub-cowork" />
    </>);
}
