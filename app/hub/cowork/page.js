import MuvApp from "../../MuvApp";

export const metadata = {
  title: "Coworking Criativo em S\u00e3o Paulo \u2014 Day Pass e Planos Mensais | MUV Hub",
  description: "Coworking para filmmakers e criativos na Alameda Santos. Day pass, planos mensais, esta\u00e7\u00e3o fixa e acesso ao ecossistema MUV.",
  alternates: { canonical: "https://grupomuv.com.br/hub/cowork/" },
  openGraph: {
    title: "Coworking Criativo em S\u00e3o Paulo \u2014 Day Pass e Planos Mensais | MUV Hub",
    description: "Coworking para filmmakers e criativos na Alameda Santos. Day pass, planos mensais, esta\u00e7\u00e3o fixa e acesso ao ecossistema MUV.",
    url: "https://grupomuv.com.br/hub/cowork/",
    type: "website" } };

export default function Page() {
  return <MuvApp page="hub-cowork" />;
}
