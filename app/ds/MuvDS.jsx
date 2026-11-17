"use client";
// Design System Grupo MUV · rodada 03 (16/11/2026).
// Porte em módulo dos componentes de components/bundle.js que a home usa.
// O bundle do sistema só existe como script em window.GrupoMUV (lacuna 2 do
// sistema: falta pacote ESM). Quando o pacote existir, este arquivo sai e o
// site importa direto de lá. Mesmas classes muv-* e mesmo comportamento.
import React, { useEffect, useRef, useState } from "react";
import "./ds.css";
import "./site.css";

const cx = (...a) => a.filter(Boolean).join(" ");
const reduced = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Arrow() {
  return <span className="muv-arrow" aria-hidden="true">→</span>;
}

export function Button({ variant = "primary", arrow, className, children, href, ...rest }) {
  const Tag = href ? "a" : "button";
  const props = { ...rest, className: cx("muv-btn", "muv-btn--" + variant, className) };
  if (href) props.href = href;
  else if (!props.type) props.type = "button";
  return <Tag {...props}>{children}{arrow ? <Arrow /> : null}</Tag>;
}

export function LinkArrow({ tone, className, children, ...rest }) {
  return <a {...rest} className={cx("muv-link", tone === "accent" && "muv-link--accent", className)}>{children}<Arrow /></a>;
}

export function Pill({ tone = "neutral", tilt, className, children }) {
  return (
    <span
      className={cx("muv-pill", tone !== "neutral" && "muv-pill--" + tone, tilt != null && "muv-pill--tilt", className)}
      style={tilt != null ? { "--tilt": tilt + "deg" } : undefined}>
      {children}
    </span>
  );
}

export function Eyebrow({ number, dot, className, children, ...rest }) {
  return (
    <span {...rest} className={cx("muv-eyebrow", className)}>
      {number ? <span className="muv-eyebrow__num">{number}</span> : dot ? <span className="muv-eyebrow__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function HeadlineSentence({ level = 1, highlight, className, children, ...rest }) {
  const Tag = "h" + level;
  let body = children;
  if (highlight && typeof children === "string" && children.indexOf(highlight) >= 0) {
    const i = children.indexOf(highlight);
    body = [children.slice(0, i), <em key="e">{highlight}</em>, children.slice(i + highlight.length)];
  }
  return <Tag {...rest} className={cx("muv-h1s", className)}>{body}</Tag>;
}

// Serviços em trilho: o nome ativo preenche e a foto troca em cortina.
// Só roda sozinho quando está na tela (uma coisa se mexendo por tela).
export function ServiceReel({ items = [], interval, onNavigate, className }) {
  const n = items.length;
  const [i, setI] = useState(0);
  const [x, setX] = useState(0);
  const prev = useRef(-1);
  const wrapRef = useRef(null);
  const nameRefs = useRef([]);
  const hold = useRef(false);
  const visible = useRef(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !("IntersectionObserver" in window)) { visible.current = true; return; }
    const io = new IntersectionObserver((es) => { visible.current = es[0].isIntersecting; }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!interval || reduced() || n < 2) return;
    const id = setInterval(() => {
      if (hold.current || !visible.current) return;
      setI((v) => { prev.current = v; return (v + 1) % n; });
    }, interval);
    return () => clearInterval(id);
  }, [n, interval]);

  useEffect(() => {
    const el = nameRefs.current[i];
    if (el) setX(Math.max(0, el.offsetLeft));
  }, [i]);

  const go = (k) => { if (k === i) return; prev.current = i; setI(k); };
  const cur = items[i] || {};
  const pad = (v) => String(v).padStart(2, "0");

  return (
    <section
      className={cx("muv-reel", className)}
      ref={wrapRef}
      onMouseEnter={() => { hold.current = true; }}
      onMouseLeave={() => { hold.current = false; }}
      onFocus={() => { hold.current = true; }}
      onBlur={() => { hold.current = false; }}>
      <div className="muv-reel__track" style={{ transform: `translateX(${-x}px)` }} role="tablist" aria-label="Serviços">
        {items.map((it, k) => (
          <button
            key={k}
            type="button"
            ref={(el) => { nameRefs.current[k] = el; }}
            role="tab"
            aria-selected={k === i}
            className={cx("muv-reel__name", k === i && "is-active")}
            onClick={() => go(k)}>
            {it.name}
          </button>
        ))}
      </div>
      <div className="muv-reel__body">
        <div className="muv-reel__info">
          <span className="muv-reel__num">{(cur.num || pad(i + 1)) + " / " + pad(n)}</span>
          <p className="muv-reel__desc">{cur.desc}</p>
          {cur.href ? (
            <LinkArrow href={cur.href} tone="accent" onClick={onNavigate ? (e) => onNavigate(e, cur.href) : undefined}>
              {cur.cta || "Ver serviço"}
            </LinkArrow>
          ) : null}
        </div>
        <div className="muv-reel__win">
          {items.map((it, k) => it.image ? (
            <img
              key={k}
              src={it.image}
              alt={k === i ? (it.alt || it.name) : ""}
              aria-hidden={k === i ? undefined : "true"}
              loading="lazy"
              decoding="async"
              className={cx(k === i && "is-active", k === prev.current && k !== i && "was-active")} />
          ) : null)}
        </div>
        <div className="muv-reel__dots" aria-hidden="true">
          {items.map((_, k) => <span key={k} className={cx("muv-reel__dot", k === i && "is-active")} />)}
        </div>
      </div>
    </section>
  );
}

const TILTS = [-5, 2, -2.5, 4];
const FRAMES = ["ink", "accent", "blue"];

function CaseStackCard({ it, k, onNavigate }) {
  const videoRef = useRef(null);
  const Tag = it.href ? "a" : "div";
  const props = {
    className: cx("muv-cstack__card", "muv-cstack__card--" + (it.frame || FRAMES[k % 3])),
    style: { "--tilt": (it.tilt != null ? it.tilt : TILTS[k % 4]) + "deg", zIndex: k === 1 ? 2 : 1 },
    onMouseEnter: () => { const v = videoRef.current; if (v && !reduced()) v.play().catch(() => {}); },
    onMouseLeave: () => { const v = videoRef.current; if (v) v.pause(); },
  };
  if (it.href) {
    props.href = it.href;
    if (onNavigate) props.onClick = (e) => onNavigate(e, it.href);
  } else props.tabIndex = 0;
  return (
    <Tag {...props}>
      <div className="muv-cstack__media">
        {it.image ? <img src={it.image} alt={it.alt || ""} loading="lazy" decoding="async" /> : null}
        {it.video ? <video ref={videoRef} src={it.video} muted loop playsInline preload="none" /> : null}
      </div>
      <div className="muv-cstack__meta">
        <h3 className="muv-cstack__title">{it.title}</h3>
        <span className="muv-cstack__client">{it.client}</span>
      </div>
    </Tag>
  );
}

export function CaseStack({ items = [], onNavigate, className }) {
  return (
    <div className={cx("muv-cstack", className)}>
      {items.map((it, k) => <CaseStackCard key={it.href || k} it={it} k={k} onNavigate={onNavigate} />)}
    </div>
  );
}

// Frase que se revela com a rolagem. O scroll manda: nada dispara sozinho.
export function RevealText({ text = "", highlight = "", tag, tagAfter, className }) {
  const words = text.split(" ");
  const hlWords = highlight ? highlight.split(" ") : [];
  let hlStart = -1;
  if (highlight) {
    for (let a = 0; a <= words.length - hlWords.length; a++) {
      if (words.slice(a, a + hlWords.length).join(" ") === highlight) { hlStart = a; break; }
    }
  }
  const [on, setOn] = useState(words.length); // sem JS, a frase aparece inteira
  const ref = useRef(null);

  useEffect(() => {
    if (reduced()) { setOn(words.length); return; }
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      setOn(Math.round(Math.max(0, Math.min(1, prog)) * words.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [text]);

  const out = [];
  words.forEach((w, k) => {
    if (tagAfter != null && tag && k === tagAfter) {
      out.push(<span key="t" className="muv-reveal__tag" aria-hidden="true"><Pill tone="solid" tilt={-6}>{tag}</Pill></span>);
    }
    const isHl = hlStart >= 0 && k >= hlStart && k < hlStart + hlWords.length;
    out.push(<span key={k} aria-hidden="true" className={cx("muv-reveal__w", isHl && "muv-reveal__w--hl", k < on && "is-on")}>{w + " "}</span>);
  });
  return <p className={cx("muv-reveal", className)} ref={ref} aria-label={text}>{out}</p>;
}

// Seção que sobe por cima da anterior. Diferença para o bundle: quando a seção
// é mais alta que a tela, ela rola até o fim antes de prender (top negativo),
// senão a seção seguinte cobriria conteúdo ainda não lido.
export function FlowSection({ tone, minHeight, className, children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      el.style.setProperty("--flow-top", Math.min(0, window.innerHeight - el.offsetHeight) + "px");
    };
    measure();
    const ro = "ResizeObserver" in window ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(el);
    window.addEventListener("resize", measure);
    return () => { if (ro) ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  return (
    <section
      {...rest}
      ref={ref}
      className={cx("muv-flow__sec", tone && tone !== "paper" && "muv-flow__sec--" + tone, className)}
      style={minHeight ? { "--flow-h": minHeight } : undefined}>
      {children}
    </section>
  );
}

export function FlowStack({ className, children }) {
  return <div className={cx("muv-flow", className)}>{children}</div>;
}

// Loop oficial do logo (vídeo do /loopingmuv). Só toca quando está na tela.
export function MuvLoop({ src = "/assets/muv-loop.mp4", poster = "/assets/muv-loop-poster.jpg", label, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced()) { v.pause(); return; }
    if (!("IntersectionObserver" in window)) { v.play().catch(() => {}); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    }, { threshold: 0.05 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <div className={cx("muv-loop", className)} role={label ? "img" : undefined} aria-label={label}>
      <video ref={ref} className="muv-loop__video" src={src} poster={poster} muted loop playsInline preload="metadata" aria-hidden="true" />
    </div>
  );
}
