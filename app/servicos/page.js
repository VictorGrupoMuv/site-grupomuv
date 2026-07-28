import MuvApp from "../MuvApp";

export const metadata = {
  title: "Servi\u00e7os \u2014 Produ\u00e7\u00e3o Audiovisual, Branded Content e Cobertura | Grupo MUV",
  description: "Estrat\u00e9gia, capta\u00e7\u00e3o cinematogr\u00e1fica, p\u00f3s-produ\u00e7\u00e3o e conte\u00fado para plataforma. Uma equipe integrada, uma dire\u00e7\u00e3o \u2014 n\u00e3o quatro fornecedores. S\u00e3o Paulo.",
  alternates: { canonical: "https://grupomuv.com.br/servicos/" },
  openGraph: {
    title: "Servi\u00e7os \u2014 Produ\u00e7\u00e3o Audiovisual, Branded Content e Cobertura | Grupo MUV",
    description: "Estrat\u00e9gia, capta\u00e7\u00e3o cinematogr\u00e1fica, p\u00f3s-produ\u00e7\u00e3o e conte\u00fado para plataforma. Uma equipe integrada, uma dire\u00e7\u00e3o \u2014 n\u00e3o quatro fornecedores. S\u00e3o Paulo.",
    url: "https://grupomuv.com.br/servicos/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="servicos" />;
}
