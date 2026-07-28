import MuvApp from "../MuvApp";

export const metadata = {
  title: "Di\u00e1rio MUV \u2014 Textos sobre Produ\u00e7\u00e3o Audiovisual e Conte\u00fado de Marca",
  description: "Bastidor, m\u00e9todo e opini\u00e3o sobre produ\u00e7\u00e3o audiovisual, cobertura em tempo real, branded content e estrat\u00e9gia de conte\u00fado para marcas.",
  alternates: { canonical: "https://grupomuv.com.br/blog/" },
  openGraph: {
    title: "Di\u00e1rio MUV \u2014 Textos sobre Produ\u00e7\u00e3o Audiovisual e Conte\u00fado de Marca",
    description: "Bastidor, m\u00e9todo e opini\u00e3o sobre produ\u00e7\u00e3o audiovisual, cobertura em tempo real, branded content e estrat\u00e9gia de conte\u00fado para marcas.",
    url: "https://grupomuv.com.br/blog/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="blog" />;
}
