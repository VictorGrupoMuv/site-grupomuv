import MuvApp from "../../MuvApp";
import _works from "../../../content/works.json";

const WORKS = _works.items.filter((w) => !w.hidden);
const SITE = "https://grupomuv.com.br";

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

const abs = (u) => (!u ? null : /^https?:\/\//.test(u) ? u : SITE + u);

// Vimeo guarda o id como "123456789" ou "123456789/hash" (vídeo privado).
const vimeoEmbedUrl = (raw) => {
  const v = String(raw || "").trim();
  const id = v.split("/")[0];
  const h = v.split("/")[1];
  return id ? `https://player.vimeo.com/video/${id}${h ? `?h=${h}` : ""}` : null;
};

// VideoObject: é o que faz o case concorrer na aba de vídeos do Google
// e aparecer com miniatura no resultado. Duração e data vêm do Vimeo/ffprobe,
// não são estimadas.
function videoSchema(w) {
  if (!w.vimeoId && !w.video) return null;
  const nome = (w.title || "").replace(/\n/g, " ").trim();
  const thumb = abs(w.poster) || abs(w.still);
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${nome} — ${w.client}`,
    description: w.summary,
    ...(thumb ? { thumbnailUrl: [thumb] } : {}),
    ...(w.videoDate ? { uploadDate: `${w.videoDate}T12:00:00-03:00` } : {}),
    ...(w.videoDuration ? { duration: w.videoDuration } : {}),
    ...(w.vimeoId ? { embedUrl: vimeoEmbedUrl(w.vimeoId) } : {}),
    ...(w.video ? { contentUrl: abs(w.video) } : {}),
    inLanguage: "pt-BR",
    isFamilyFriendly: true,
    publisher: {
      "@type": "Organization",
      name: "Grupo MUV",
      url: SITE,
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/assets/logo-horizontal-preto.png` } } };


}

export function generateMetadata({ params }) {
  const w = WORKS.find((x) => x.slug === params.slug);
  if (!w) return {};
  const clean = (w.title || "").replace(/\n/g, " ").trim();
  const title = `${clean} — ${w.client} | Case Grupo MUV`;
  const url = `${SITE}/trabalhos/${w.slug}/`;
  return {
    title,
    description: w.summary,
    alternates: { canonical: url },
    openGraph: { title, description: w.summary, url, type: "article" } };

}

export default function Page({ params }) {
  const w = WORKS.find((x) => x.slug === params.slug);
  const schema = w ? videoSchema(w) : null;
  return (
    <>
      {schema ?
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /> :
      null}
      <MuvApp page="trabalhos" slug={params.slug} />
    </>);

}
