import MuvApp from "../../MuvApp";
import _posts from "../../../content/posts.json";

const POSTS = _posts.items;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = POSTS.find((x) => x.slug === params.slug);
  if (!p) return {};
  const title = `${p.title} | Diário MUV`;
  const url = `https://grupomuv.com.br/blog/${p.slug}/`;
  return {
    title,
    description: p.excerpt,
    alternates: { canonical: url },
    openGraph: { title, description: p.excerpt, url, type: "article" } };

}

export default function Page({ params }) {
  return <MuvApp page="blog" slug={params.slug} />;
}
