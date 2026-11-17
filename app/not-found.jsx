import Link from "next/link";
import "./ds/ds.css";
import "./ds/site.css";

export const metadata = {
  title: "Página não encontrada | Grupo MUV",
  description: "O endereço que você abriu não existe mais ou foi movido.",
  robots: { index: false, follow: true } };

// Página de erro clara, com os tokens do Design System (rodada 03) e saída de
// navegação: logo para a home e os três caminhos principais.
export default function NotFound() {
  return (
    <main className="err404">
      <Link href="/" className="err404__logo" aria-label="Grupo MUV, voltar para a home">
        <img src="/brand-assets/vectors/muv-horizontal-black.svg" alt="Grupo MUV" height="25" />
      </Link>
      <div className="err404__body">
        <span className="muv-eyebrow"><span className="muv-eyebrow__dot" aria-hidden="true" />Erro 404</span>
        <h1 className="muv-h1s err404__title">Essa página saiu de <em>cena.</em></h1>
        <p className="err404__text">
          O endereço que você abriu não existe mais ou foi movido. O resto do site continua no lugar.
        </p>
        <div className="hv2-actions">
          <Link href="/" className="muv-btn muv-btn--primary">Voltar pra home <span className="muv-arrow" aria-hidden="true">→</span></Link>
          <Link href="/trabalhos/" className="muv-btn muv-btn--ghost">Ver os trabalhos</Link>
          <Link href="/contato/" className="muv-btn muv-btn--ghost">Falar com a gente</Link>
        </div>
      </div>
    </main>);

}
