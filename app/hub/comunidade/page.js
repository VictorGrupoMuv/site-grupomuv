import MuvApp from "../../MuvApp";
import { JsonLd, faqSchema, breadcrumbSchema, HUB_FAQ, HOME_CRUMB, HUB_CRUMB } from "../hubSeo";

const PATH = "/hub/comunidade/";
const TITLE = "Comunidade de Filmmakers em SP: Encontros e Networking | MUV Hub";
const DESC = "Rede de filmmakers, diretores, editores, agências e marcas que se encontra no MUV Hub, na região da Paulista. Encontros presenciais, oportunidades e troca entre quem produz.";

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
        faqSchema(HUB_FAQ.comunidade),
        breadcrumbSchema([HOME_CRUMB, HUB_CRUMB, { name: "Comunidade", path: PATH }])]} />
      <MuvApp page="hub-comunidade" />
    </>);
}
