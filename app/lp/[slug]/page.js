import ReactDOM from "react-dom";
import MuvApp from "../../MuvApp";
import { LANDINGS, LP_SLUGS } from "../conteudo";

// Landings de tráfego pago (Google Ads), uma por serviço, no molde da
// /eventos/. São noindex de propósito: quem disputa a busca orgânica é
// /servicos/<slug>/, e estas páginas não entram em public/sitemap.xml.
const SITE = "https://grupomuv.com.br";

export function generateStaticParams() {
  return LP_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

const maior = (lp) => lp.hero.larguras[lp.hero.larguras.length - 1];

export function generateMetadata({ params }) {
  const lp = LANDINGS[params.slug];
  if (!lp) return {};
  const og = `${lp.hero.base}-${maior(lp)}.jpg`;
  const w = maior(lp);
  return {
    title: lp.title,
    description: lp.desc,
    alternates: { canonical: `${SITE}${lp.path}` },
    robots: { index: false, follow: true },
    openGraph: {
      title: lp.title,
      description: lp.desc,
      url: `${SITE}${lp.path}`,
      type: "website",
      images: [{ url: og, width: w, height: Math.round(w * 9 / 16), alt: lp.title }] },
    twitter: {
      card: "summary_large_image",
      title: lp.title,
      description: lp.desc,
      images: [og] } };
}

export default function Page({ params }) {
  const lp = LANDINGS[params.slug];
  // A foto do hero é o LCP da página. O <picture> escolhe AVIF, então o
  // preload aponta para o mesmo conjunto, como em app/eventos/page.js.
  const padrao = lp.hero.larguras.includes(1080) ? 1080 : maior(lp);
  ReactDOM.preload(`${lp.hero.base}-${padrao}.avif`, {
    as: "image",
    type: "image/avif",
    imageSrcSet: lp.hero.larguras.map((w) => `${lp.hero.base}-${w}.avif ${w}w`).join(", "),
    imageSizes: "100vw",
    fetchPriority: "high" });

  return <MuvApp page="lp" slug={params.slug} />;
}
