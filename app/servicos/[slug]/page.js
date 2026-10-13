import MuvApp from "../../MuvApp";
import _services from "../../../content/services.json";

const SERVICOS = _services.items;
const SITE = "https://grupomuv.com.br";

export function generateStaticParams() {
  return SERVICOS.map((s) => ({ slug: s.slug }));
}

// Service + FAQPage: o Service descreve a oferta, o FAQPage é o que pode
// render como pergunta expansível no resultado de busca. Sem FAQ real a
// página seria rasa demais para o Google indexar — já aconteceu com outras
// duas rotas do site.
function serviceSchema(s) {
  const nome = (s.title || "").replace(/\n/g, " ").trim();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.tag,
    alternateName: nome,
    description: s.desc,
    serviceType: s.tag,
    url: `${SITE}/servicos/${s.slug}/`,
    areaServed: { "@type": "Country", name: "Brasil" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE}/contato/#s=${encodeURIComponent(s.scope)}` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `O que entra em ${s.tag.toLowerCase()}`,
      itemListElement: (s.items || []).map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item } })) },
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
    inLanguage: "pt-BR" };
}

function faqSchema(s) {
  if (!s.faq || !s.faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faq.map((f) => ({
      "@type": "Question",
      name: f.p,
      acceptedAnswer: { "@type": "Answer", text: f.r } })) };
}

function breadcrumbSchema(s) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Serviços", item: `${SITE}/servicos/` },
      { "@type": "ListItem", position: 2, name: s.tag, item: `${SITE}/servicos/${s.slug}/` }] };
}

export function generateMetadata({ params }) {
  const s = SERVICOS.find((x) => x.slug === params.slug);
  if (!s) return {};
  const url = `${SITE}/servicos/${s.slug}/`;
  const title = s.metaTitle || `${s.tag} | Grupo MUV`;
  const description = s.metaDesc || s.desc;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" } };
}

export default function Page({ params }) {
  const s = SERVICOS.find((x) => x.slug === params.slug);
  if (!s) return <MuvApp page="servicos" />;
  const blocos = [serviceSchema(s), faqSchema(s), breadcrumbSchema(s)].filter(Boolean);
  return (
    <>
      {blocos.map((b, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }} />
      ))}
      <MuvApp page="servico" slug={params.slug} />
    </>);
}
