import "./globals.css";
import WhatsappCookie from "./WhatsappCookie";


const LEGACY_HASH_REDIRECT = `(function(){try{var m={servicos:"/servicos/",processo:"/processo/",trabalhos:"/trabalhos/",sobre:"/sobre/",hub:"/hub/","hub-locadora":"/hub/locadora/","hub-studio":"/hub/studio/","hub-comunidade":"/hub/comunidade/","hub-cowork":"/hub/cowork/",blog:"/blog/",faq:"/faq/",contato:"/contato/"};var h=(location.hash||"").replace("#","");if(h&&m[h]&&location.pathname==="/"){location.replace(m[h]);}}catch(e){}})();`;

export const viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1 };

export const metadata = {
  metadataBase: new URL("https://grupomuv.com.br"),
  title: "Grupo MUV — Produtora Audiovisual em São Paulo",
  description: "Produtora audiovisual e hub criativo em São Paulo. Estratégia, produção e conteúdo. Cinematográfico, no prazo, impossível de ignorar.",
  authors: [{ name: "Grupo MUV" }],
  alternates: { canonical: "https://grupomuv.com.br/" },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }, { url: "/favicon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website", siteName: "Grupo MUV",
    title: "Grupo MUV — Produtora Audiovisual em São Paulo | Conteúdo que move",
    description: "Produtora audiovisual e hub criativo em São Paulo. Estratégia, produção e conteúdo. Cinematográfico, no prazo, impossível de ignorar.",
    url: "https://grupomuv.com.br/", locale: "pt_BR",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Grupo MUV — Produtora Audiovisual em São Paulo | Conteúdo que move" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grupo MUV — Produtora Audiovisual em São Paulo | Conteúdo que move",
    description: "Produtora audiovisual e hub criativo em São Paulo. Estratégia, produção e conteúdo. Cinematográfico, no prazo, impossível de ignorar.",
    images: ["/og-image.png"],
  },
};

const JSONLD = '{\n    "@context": "https://schema.org",\n    "@type": "Organization",\n    "name": "Grupo MUV",\n    "legalName": "MUDAFILMS LTDA",\n    "alternateName": "MUV",\n    "url": "https://grupomuv.com.br",\n    "logo": "https://grupomuv.com.br/assets/logo-horizontal-black.png",\n    "image": "https://grupomuv.com.br/og-image.png",\n    "description": "Produtora audiovisual e hub criativo em São Paulo. Estratégia, produção e conteúdo. Cinematográfico, no prazo, impossível de ignorar.",\n    "telephone": "+55-11-99108-7786",\n    "email": "contato@grupomuv.com.br",\n    "foundingDate": "2022-06-28",\n    "taxID": "46.941.289/0001-44",\n    "address": {\n      "@type": "PostalAddress",\n      "streetAddress": "Alameda Santos, 211, 15º andar, Sala 1507, Edif. Paulista Boulevard",\n      "addressLocality": "São Paulo",\n      "addressRegion": "SP",\n      "postalCode": "01419-000",\n      "addressCountry": "BR"\n    },\n    "areaServed": {\n      "@type": "Country",\n      "name": "Brasil"\n    },\n    "founder": {\n      "@type": "Person",\n      "name": "Victor França"\n    },\n    "sameAs": [\n      "https://instagram.com/grupomuv",\n      "https://wa.me/message/D6LG7EUSTIR7C1"\n    ],\n    "knowsAbout": [\n      "Audiovisual",\n      "Branded Content",\n      "Produção de Vídeo",\n      "Estratégia de Conteúdo",\n      "Cobertura de Eventos",\n      "Direção de Fotografia",\n      "Pós-produção"\n    ]\n  }';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSONLD }} />
        <script dangerouslySetInnerHTML={{ __html: LEGACY_HASH_REDIRECT }} />
      </head>
      <body>
        {children}
        <WhatsappCookie />
      </body>
    </html>
  );
}
