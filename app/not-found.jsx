import Link from "next/link";

export const metadata = {
  title: "Página não encontrada | Grupo MUV",
  description: "O endereço que você abriu não existe mais ou foi movido.",
  robots: { index: false, follow: true } };


export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", background: "#0D0D0D", color: "#F2F0ED", padding: "7vw" }}>
      <div style={{ maxWidth: 620 }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#DE4E2B", marginBottom: 20 }}>
          Erro 404
        </p>
        <h1 style={{ fontFamily: "'Archivo Black', system-ui, sans-serif", fontSize: "clamp(34px, 6vw, 68px)", lineHeight: 1.02, letterSpacing: "-0.02em", margin: 0 }}>
          Essa página saiu de cena.
        </h1>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 16, lineHeight: 1.6, color: "#9B9691", marginTop: 22 }}>
          O endereço que você abriu não existe mais ou foi movido. O resto do site continua no lugar.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap", fontFamily: "Inter, system-ui, sans-serif", fontSize: 14 }}>
          <Link href="/" style={{ background: "#DE4E2B", color: "#fff", padding: "13px 22px", borderRadius: 999, textDecoration: "none", fontWeight: 600 }}>
            Voltar pra home
          </Link>
          <Link href="/trabalhos/" style={{ border: "1px solid #3A3A3A", color: "#F2F0ED", padding: "13px 22px", borderRadius: 999, textDecoration: "none" }}>
            Ver os trabalhos
          </Link>
          <Link href="/contato/" style={{ border: "1px solid #3A3A3A", color: "#F2F0ED", padding: "13px 22px", borderRadius: 999, textDecoration: "none" }}>
            Falar com a gente
          </Link>
        </div>
      </div>
    </main>);

}
