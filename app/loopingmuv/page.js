import LoopClient from "./LoopClient";

export const metadata = {
  title: "MUV — Loop",
  description: "Loop visual do Grupo MUV.",
  alternates: { canonical: "https://grupomuv.com.br/loopingmuv/" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "MUV — Loop",
    description: "Loop visual do Grupo MUV.",
    url: "https://grupomuv.com.br/loopingmuv/",
    type: "video.other",
    images: [{ url: "/assets/muv-loop-poster.jpg", width: 1920, height: 1080, alt: "Grupo MUV — loop" }],
  },
};

export default function Page() {
  return <LoopClient />;
}
