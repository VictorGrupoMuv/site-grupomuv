"use client";

import { useEffect, useRef, useState } from "react";

// Página de loop em tela cheia. Fica fora do layout do site (sem Nav/Footer)
// de propósito: a peça é a imagem, não a navegação.
export default function LoopClient() {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Autoplay silencioso é bloqueado em alguns navegadores; se falhar,
    // a página mostra o controle de play em vez de ficar num frame parado.
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => setPaused(true));
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => undefined); setPaused(false); }
    else { v.pause(); setPaused(true); }
  };

  return (
    <main className="loopmuv">
      <video
        ref={videoRef}
        className="loopmuv__video"
        src="/assets/muv-loop.mp4"
        poster="/assets/muv-loop-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label="Loop visual do Grupo MUV"
      />

      <button
        type="button"
        className="loopmuv__hit"
        onClick={toggle}
        aria-label={paused ? "Reproduzir" : "Pausar"}>
        {paused ?
        <span className="loopmuv__play" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span> :
        null}
      </button>

      <div className="loopmuv__bar">
        <a className="loopmuv__brand" href="/">GRUPO MUV</a>
        <span className="loopmuv__meta">LOOP · 1080p</span>
      </div>

      <style>{`
        html, body { background: #000; }
        .loopmuv {
          position: fixed; inset: 0; background: #000;
          overflow: hidden; display: block;
        }
        .loopmuv__video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .loopmuv__hit {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          background: transparent; border: 0; padding: 0;
          cursor: pointer; display: grid; place-items: center;
          -webkit-tap-highlight-color: transparent;
        }
        .loopmuv__play {
          display: grid; place-items: center;
          width: 76px; height: 76px; border-radius: 50%;
          background: rgba(0,0,0,.55); color: #fff;
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,.25);
        }
        .loopmuv__bar {
          position: absolute; left: 0; right: 0; bottom: 0;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; padding: 20px 24px;
          font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
          color: rgba(255,255,255,.72);
          background: linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,0));
          pointer-events: none;
        }
        .loopmuv__brand { color: #fff; text-decoration: none; pointer-events: auto; }
        .loopmuv__brand:hover { color: var(--accent, #DE4E2B); }
        @media (max-width: 640px) {
          .loopmuv__bar { padding: 16px; font-size: 10px; }
        }
      `}</style>
    </main>);

}
