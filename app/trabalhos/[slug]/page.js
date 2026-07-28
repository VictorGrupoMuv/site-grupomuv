import MuvApp from "../../MuvApp";
import _works from "../../../content/works.json";

const WORKS = _works.items;

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export function generateMetadata({ params }) {
  const w = WORKS.find((x) => x.slug === params.slug);
  if (!w) return {};
  const clean = (w.title || "").replace(/\n/g, " ").trim();
  const title = `${clean} — ${w.client} | Case Grupo MUV`;
  const url = `https://grupomuv.com.br/trabalhos/${w.slug}/`;
  return {
    title,
    description: w.summary,
    alternates: { canonical: url },
    openGraph: { title, description: w.summary, url, type: "article" } };

}

export default function Page({ params }) {
  return <MuvApp page="trabalhos" slug={params.slug} />;
}
