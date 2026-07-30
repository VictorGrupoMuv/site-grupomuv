import MuvApp from "../../MuvApp";
import _posts from "../../../content/posts.json";

const POSTS = _posts.items;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

const SITE = "https://grupomuv.com.br";
const MESES = { JAN: "01", FEV: "02", MAR: "03", ABR: "04", MAI: "05", JUN: "06",
                JUL: "07", AGO: "08", SET: "09", OUT: "10", NOV: "11", DEZ: "12" };

// "2026 · JUL" -> "2026-07-01": o schema precisa de data ISO
function dataISO(d) {
  const m = String(d || "").match(/(\d{4}).*?([A-ZÇ]{3})/i);
  if (!m) return undefined;
  const mes = MESES[m[2].toUpperCase()];
  return mes ? `${m[1]}-${mes}-01` : undefined;
}

function capa(p) {
  return p.cover ? `${SITE}${p.cover}` : `${SITE}/og-image.png`;
}

export function generateMetadata({ params }) {
  const p = POSTS.find((x) => x.slug === params.slug);
  if (!p) return {};
  const title = `${p.title} | Diário MUV`;
  const url = `${SITE}/blog/${p.slug}/`;
  const image = capa(p);
  const publicado = dataISO(p.date);
  return {
    title,
    description: p.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title, description: p.excerpt, url, type: "article",
      siteName: "Grupo MUV",
      locale: "pt_BR",
      publishedTime: publicado,
      images: [{ url: image, width: 1920, height: 1080, alt: p.coverAlt || p.title }] },

    twitter: {
      card: "summary_large_image",
      title, description: p.excerpt,
      images: [image] } };

}

export default function Page({ params }) {
  const p = POSTS.find((x) => x.slug === params.slug);
  const schema = p ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    image: [capa(p)],
    datePublished: dataISO(p.date),
    dateModified: dataISO(p.date),
    author: { "@type": "Organization", name: "Grupo MUV", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Grupo MUV",
      logo: { "@type": "ImageObject", url: `${SITE}/favicon-512.png` } },

    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${p.slug}/` },
    articleSection: p.category,
    inLanguage: "pt-BR" } : null;

  return (
    <>
      {schema &&
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}

      <MuvApp page="blog" slug={params.slug} />
    </>);

}
