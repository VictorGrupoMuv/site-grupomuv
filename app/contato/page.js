import MuvApp from "../MuvApp";

export const metadata = {
  title: "Contato \u2014 Solicite um Or\u00e7amento de Produ\u00e7\u00e3o Audiovisual | Grupo MUV",
  description: "Conta o que voc\u00ea quer fazer. A gente volta com diagn\u00f3stico, escopo e timeline. Sem proposta gen\u00e9rica. S\u00e3o Paulo \u00b7 contato@grupomuv.com.br",
  alternates: { canonical: "https://grupomuv.com.br/contato/" },
  openGraph: {
    title: "Contato \u2014 Solicite um Or\u00e7amento de Produ\u00e7\u00e3o Audiovisual | Grupo MUV",
    description: "Conta o que voc\u00ea quer fazer. A gente volta com diagn\u00f3stico, escopo e timeline. Sem proposta gen\u00e9rica. S\u00e3o Paulo \u00b7 contato@grupomuv.com.br",
    url: "https://grupomuv.com.br/contato/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="contato" />;
}
