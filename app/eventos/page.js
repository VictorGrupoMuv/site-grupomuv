import ReactDOM from "react-dom";
import MuvApp from "../MuvApp";
import { EVENTOS_FAQ } from "./conteudo";

// Landing de tráfego pago (Google Ads) para cobertura de eventos, MUV Live.
const SITE = "https://grupomuv.com.br";
const PATH = "/eventos/";
const TITLE = "Cobertura de Eventos em Tempo Real em SP | Grupo MUV";
const DESC = "Cobertura audiovisual de eventos corporativos, festivais e ativações em São Paulo. Reels, stories e fotos publicados enquanto o evento acontece.";

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE}${PATH}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE}${PATH}`,
    type: "website",
    images: [{ url: "/assets/eventos/hero-1920.jpg", width: 1920, height: 1080, alt: TITLE }] },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/assets/eventos/hero-1920.jpg"] } };

const SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Cobertura de eventos em tempo real",
    serviceType: "Cobertura audiovisual de eventos",
    description: DESC,
    url: `${SITE}${PATH}`,
    areaServed: { "@type": "City", name: "São Paulo" },
    provider: {
      "@type": "Organization",
      name: "Grupo MUV",
      url: SITE,
      telephone: "+55-11-99108-7786",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Alameda Santos, 211, 15º andar, Sala 1507",
        addressLocality: "São Paulo",
        addressRegion: "SP",
        postalCode: "01419-000",
        addressCountry: "BR" } },
    inLanguage: "pt-BR" },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Cobertura de eventos", item: `${SITE}${PATH}` }] },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: EVENTOS_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a } })) }];

export default function Page() {
  // A foto do hero é o LCP da página. O <picture> escolhe AVIF, então o
  // preload aponta para o mesmo conjunto: sem isso o navegador só descobre a
  // imagem depois de baixar o CSS.
  ReactDOM.preload("/assets/eventos/hero-1080.avif", {
    as: "image",
    type: "image/avif",
    imageSrcSet: "/assets/eventos/hero-640.avif 640w, /assets/eventos/hero-1080.avif 1080w, /assets/eventos/hero-1920.avif 1920w",
    imageSizes: "100vw",
    fetchPriority: "high" });

  return (
    <>
      {SCHEMAS.map((b, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }} />
      ))}
      <MuvApp page="eventos" />
    </>);
}
