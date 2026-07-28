import MuvApp from "../MuvApp";

export const metadata = {
  title: "Sobre o Grupo MUV \u2014 Produtora Audiovisual e Hub Criativo em S\u00e3o Paulo",
  description: "Produtora audiovisual e hub criativo em S\u00e3o Paulo. Dire\u00e7\u00e3o, capta\u00e7\u00e3o, p\u00f3s e estrat\u00e9gia sob o mesmo teto. Fundada por Victor Fran\u00e7a.",
  alternates: { canonical: "https://grupomuv.com.br/sobre/" },
  openGraph: {
    title: "Sobre o Grupo MUV \u2014 Produtora Audiovisual e Hub Criativo em S\u00e3o Paulo",
    description: "Produtora audiovisual e hub criativo em S\u00e3o Paulo. Dire\u00e7\u00e3o, capta\u00e7\u00e3o, p\u00f3s e estrat\u00e9gia sob o mesmo teto. Fundada por Victor Fran\u00e7a.",
    url: "https://grupomuv.com.br/sobre/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="sobre" />;
}
