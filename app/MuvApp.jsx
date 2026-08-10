"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTina, tinaField } from "tinacms/dist/react";
import { trackAnalytics } from "./GoogleAnalytics";
import _services from "../content/services.json";
const SERVICOS = _services.items;
import _process from "../content/process.json";
const PROCESSO = _process.items;
import _works from "../content/works.json";
const TRABALHOS = _works.items;
import _team from "../content/team.json";
const TIME = _team.items;
import _posts from "../content/posts.json";
const POSTS = _posts.items;
import _brands from "../content/brands.json";
const BRANDS = _brands.items;
const BRAND_LOGOS = {"Meta": "/assets/brands/meta.png", "Corona": "/assets/brands/corona-extra.png", "Ambev": "/assets/brands/ambev.png", "Adidas": "/assets/brands/adidas.png", "Volvo": "/assets/brands/volvo.png", "Heinz": "/assets/brands/heinz.png", "Burger King": "/assets/brands/burger-king.png", "Nissan": "/assets/brands/nissan.png", "Spotify": "/assets/brands/spotify.png", "Too Faced": "/assets/brands/too-faced.png", "Brastemp": "/assets/brands/brastemp.png", "Consul": "/assets/brands/consul.png", "Itaú": "/assets/brands/itau.png", "Lollapalooza": "/assets/brands/lollapalooza.png", "Primavera Sound": "/assets/brands/primavera-sound.png", "Numanice": "/assets/brands/numanice.png", "Stock Car": "/assets/brands/stock-car.png", "Kings League": "/assets/brands/kings-league.png"};
import _marquee from "../content/marquee.json";
import _settings from "../content/settings.json";
import _home from "../content/home.json";
const SETTINGS = _settings;
const MARQUEE_WORDS = _marquee.items;
import _faq from "../content/faq.json";
const FAQ_ITEMS = _faq.items;

// ===== components =====
// components.jsx
// Componentes compartilhados: Nav, Footer, primitivas, Placeholder, Marquee, BrandStrip.

// ───── Arrow icons ───────────────────────────────────────────────────────────
function Arrow({ size = 14 }) {
  return (
    <svg className="arrow" width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>);

}
function ArrowDiag({ size = 14 }) {
  return (
    <svg className="arrow" width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>);

}

// Monta a URL do player do Vimeo. Aceita "123456789", "123456789/hash"
// ou "123456789?h=hash" — o hash é obrigatório em vídeos não listados.
function vimeoEmbed(raw) {
  const v = String(raw || "").trim()
    .replace(/^https?:\/\/(www\.)?vimeo\.com\//i, "")
    .replace(/^https?:\/\/player\.vimeo\.com\/video\//i, "");
  const id = v.split(/[/?#]/)[0];
  const m = v.match(/(?:[/?#]h=|\/)([0-9a-zA-Z]{6,})/);
  const h = m ? m[1] : "";
  return `https://player.vimeo.com/video/${id}?${h ? `h=${h}&` : ""}dnt=1&title=0&byline=0&portrait=0`;
}

// ───── Cinematic placeholder ─────────────────────────────────────────────────
function Cine({ label = "PLACEHOLDER", aspect = "16/9", code = "001", variant = "default", play = false, center, style, className = "", src = null, video = null, poster = null, vimeoId = null, hideLabel = false, alt = "" }) {
  const variantClass = variant === "dark" ? "cine--dark" : variant === "accent" ? "cine--accent" : "";
  const hasMedia = Boolean(src || video || vimeoId);
  return (
    <div
      className={`cine ${variantClass} ${hasMedia ? "cine--media" : ""} ${video || vimeoId ? "cine--video-slot" : ""} ${className}`}
      style={{ aspectRatio: aspect, ...style, fontSize: "10px", width: "100%" }}>

      {vimeoId ?
      <iframe className="cine__img cine__video" src={vimeoEmbed(vimeoId)}
        title={alt || label} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /> :
      video ?
      <video className="cine__img cine__video" src={video} poster={poster || src || undefined}
        controls playsInline preload="none" /> :
      src ?
      <img className="cine__img" src={src} alt={alt || label} loading="lazy" decoding="async" /> :
      null}
      {hasMedia ? <span className="cine__scrim" aria-hidden="true" /> : null}
      <span className="cine__corner" style={{ position: "absolute", top: 16, left: 16 }}>// {code}</span>
      <span className="cine__corner" style={{ position: "absolute", top: 16, right: 16 }}>{aspect.replace("/", ":")}</span>
      {play && !hasMedia ?
      <div className="cine__play">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </div> :
      center ?
      <span className="cine__center">{center}</span> :
      null}
      {video || vimeoId || hideLabel ? null : <span className="cine__label">{label}</span>}
      {video || vimeoId || hideLabel ? null : <span className="cine__corner">REC ●</span>}
    </div>);

}

// ───── Rotas reais ───────────────────────────────────────────────────────────
// Cada página tem URL própria e HTML pré-renderizado no build.
// Antes tudo vivia em "/" com #hash — o Google lê uma página só, e vazia.
const ROUTES = {
  home: "/",
  servicos: "/servicos/",
  processo: "/processo/",
  trabalhos: "/trabalhos/",
  sobre: "/sobre/",
  hub: "/hub/",
  "hub-locadora": "/hub/locadora/",
  "hub-studio": "/hub/studio/",
  "hub-comunidade": "/hub/comunidade/",
  "hub-cowork": "/hub/cowork/",
  blog: "/blog/",
  faq: "/faq/",
  contato: "/contato/" };

// Cmd/Ctrl/Shift+clique deve abrir em nova aba: nesse caso NÃO chamamos
// preventDefault, deixando o href nativo do <a> agir.
const isModifiedClick = (e) =>
  e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button !== undefined && e.button !== 0);

const caseHref = (slug) => `/trabalhos/${slug}/`;
const postHref = (slug) => `/blog/${slug}/`;

// ───── Envio de formulários (Netlify Forms) ──────────────────────────────────
// Os forms são declarados estaticamente em /public/__forms.html para que o
// Netlify os detecte no build (o app é client-side e não expõe o markup).
// Os leads ficam no painel Netlify > Forms, com notificação por e-mail e CSV.
async function postToNetlify(formName, data) {
  const body = new URLSearchParams({ "form-name": formName, ...data }).toString();
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body });

  if (!res.ok) throw new Error("Falha no envio (" + res.status + ")");
  return true;
}

// ───── Nav ───────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
{ id: "home", label: "Home" },
{ id: "servicos", label: "Serviços" },
{ id: "processo", label: "Processo" },
{ id: "trabalhos", label: "Trabalhos" },
{ id: "sobre", label: "Sobre" },
{ id: "hub", label: "MUV Hub" },
{ id: "hub-locadora", label: "Hub · Locadora", hideFromHeader: true, hideFromFooter: true },
{ id: "hub-studio", label: "Hub · Studio", hideFromHeader: true, hideFromFooter: true },
{ id: "hub-comunidade", label: "Hub · Comunidade", hideFromHeader: true, hideFromFooter: true },
{ id: "hub-cowork", label: "Hub · Cowork", hideFromHeader: true, hideFromFooter: true },
{ id: "blog", label: "Blog" },
{ id: "faq", label: "FAQ", hideFromHeader: true },
{ id: "contato", label: "Contato", hideFromHeader: true }];
const NAV_OFF = { servicos:"navServicos", processo:"navProcesso", trabalhos:"navTrabalhos", sobre:"navSobre", hub:"navHub", blog:"navBlog" };
const navOn = (n) => { const k = NAV_OFF[n.id]; return k ? SETTINGS[k] !== false : true; };


// Header e Drawer escondem itens marcados hideFromHeader (ex: FAQ vai só no Footer)
const HEADER_ITEMS = NAV_ITEMS.filter((n) => !n.hideFromHeader && navOn(n));
const DRAWER_ITEMS = HEADER_ITEMS.filter((n) => n.id !== "home");
// Só entram redes com URL real: href="#" lê como "empresa desativada".
const DRAWER_SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/grupomuv" },
  { label: "WhatsApp", href: "https://wa.me/message/D6LG7EUSTIR7C1" }];


function Nav({ current, setCurrent, isDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const firstLinkRef = useRef(null);
  const menuTriggerRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("drawer-active");
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const drawerItems = Array.from(drawerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      const focusables = [menuTriggerRef.current, ...drawerItems].filter(Boolean);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = setTimeout(() => {
      if (firstLinkRef.current) firstLinkRef.current.focus();
    }, 350);
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove("drawer-active");
      window.removeEventListener("keydown", onKey);
      clearTimeout(focusTimer);
      window.requestAnimationFrame(() => menuTriggerRef.current?.focus());
    };
  }, [menuOpen]);

  const go = (id) => { setMenuOpen(false); setCurrent(id); };

  return (
    <React.Fragment>
      <nav className={`nav ${isDark ? "nav--dark" : ""} ${menuOpen ? "nav--open" : ""}`}>
        <a className="nav__logo" onClick={(e) => {if (isModifiedClick(e)) return;e.preventDefault();setCurrent("home");}} href="/" aria-label="Grupo MUV — ir para home">
          <img
            src={isDark ? "/brand-assets/vectors/muv-horizontal-white.svg" : "/brand-assets/vectors/muv-horizontal-black.svg"}
            alt="Grupo MUV"
            className="nav__logo-img" />
        </a>
        <ul className="nav__links">
          {HEADER_ITEMS.map((n) =>
          <li key={n.id}>
              <a
              href={ROUTES[n.id]}
              className={`nav__link ${current === n.id ? "nav__link--active" : ""}`}
              aria-current={current === n.id ? "page" : undefined}
              onClick={(e) => {if (isModifiedClick(e)) return;e.preventDefault();setCurrent(n.id);}}>
                {n.label}
              </a>
            </li>
          )}
        </ul>
        <a href={ROUTES.contato} className={`btn ${isDark ? "btn--ghost-dark" : "btn--ink"} nav__cta`} onClick={(e) => {if (isModifiedClick(e)) return;e.preventDefault();setCurrent("contato");}}>
          Falar com a gente <Arrow />
        </a>
        <button
          ref={menuTriggerRef}
          className={`nav__burger ${menuOpen ? "nav__burger--open" : ""}`}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="muv-drawer"
          onClick={() => setMenuOpen((v) => !v)}>
          <span className="nav__burger-bar" />
          <span className="nav__burger-bar" />
          <span className="nav__burger-bar" />
        </button>
      </nav>

      <div
        ref={drawerRef}
        id="muv-drawer"
        className={`drawer ${menuOpen ? "drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!menuOpen}>
        <div className="drawer__inner">
          <ul className="drawer__list">
            {DRAWER_ITEMS.map((n, i) =>
            <li key={n.id} className="drawer__item" style={{ "--i": i }}>
              <a
                ref={i === 0 ? firstLinkRef : null}
                href={ROUTES[n.id]}
                className={`drawer__link ${current === n.id ? "drawer__link--active" : ""}`}
                tabIndex={menuOpen ? 0 : -1}
                onClick={(e) => {if (isModifiedClick(e)) return;e.preventDefault();go(n.id);}}>
                <span className="drawer__link-index">0{i + 1}</span>
                <span className="drawer__link-label">{n.label}</span>
              </a>
            </li>
            )}
          </ul>

          <div className="drawer__footer">
            <button
              className="drawer__cta"
              tabIndex={menuOpen ? 0 : -1}
              style={{ "--i": DRAWER_ITEMS.length }}
              onClick={() => go("contato")}>
              <span>Falar com a gente</span>
              <Arrow size={18} />
            </button>

            <ul className="drawer__socials" style={{ "--i": DRAWER_ITEMS.length + 1 }}>
              {DRAWER_SOCIALS.map((s) =>
              <li key={s.label}>
                <a
                  className="drawer__social"
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  tabIndex={menuOpen ? 0 : -1}>
                  {s.label}
                </a>
              </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>);

}

// ───── Footer ────────────────────────────────────────────────────────────────
function Footer({ setCurrent }) {
  const go = (id) => (e) => {if (isModifiedClick(e)) return;e.preventDefault();setCurrent(id);};
  return (
    <footer className="footer">
      <div className="footer__giant">GRUPO MUV.</div>
      <div className="footer__grid">
        <div className="footer__intro">
          <p className="footer__col-title">/ ECOSSISTEMA</p>
          <p style={{ maxWidth: 440, color: "var(--dark-ink-2)", lineHeight: 1.5, marginBottom: 24 }}>
            Produtora audiovisual e hub criativo. Estratégia, produção e conteúdo. <span style={{ color: "var(--dark-ink)" }}>São Paulo, Brasil.</span>
          </p>
          <a className="btn btn--primary" href={ROUTES.contato} onClick={go("contato")}>
            Começar um projeto <Arrow />
          </a>
        </div>
        <div className="footer__accordions">
          <details className="footer__group">
            <summary>Navegação <span aria-hidden="true">+</span></summary>
            <ul>
              {NAV_ITEMS.slice(1).filter((n) => !n.hideFromFooter).map((n) =>
              <li key={n.id}><a href={ROUTES[n.id]} onClick={go(n.id)}>{n.label} <ArrowDiag size={10} /></a></li>
              )}
            </ul>
          </details>
          <details className="footer__group">
            <summary>MUV Hub <span aria-hidden="true">+</span></summary>
            <ul>
              <li><a href={ROUTES["hub"]} onClick={go("hub")}>Overview <ArrowDiag size={10} /></a></li>
              <li><a href={ROUTES["hub-locadora"]} onClick={go("hub-locadora")}>Locadora <ArrowDiag size={10} /></a></li>
              <li><a href={ROUTES["hub-studio"]} onClick={go("hub-studio")}>Studio <ArrowDiag size={10} /></a></li>
              <li><a href={ROUTES["hub-comunidade"]} onClick={go("hub-comunidade")}>Comunidade <ArrowDiag size={10} /></a></li>
              <li><a href={ROUTES["hub-cowork"]} onClick={go("hub-cowork")}>Cowork <ArrowDiag size={10} /></a></li>
            </ul>
          </details>
          <details className="footer__group">
            <summary>Contato e social <span aria-hidden="true">+</span></summary>
            <ul>
              <li><a href="https://instagram.com/grupomuv" target="_blank" rel="noopener noreferrer">Instagram <ArrowDiag size={10} /></a></li>
              <li><a href="https://wa.me/message/D6LG7EUSTIR7C1" target="_blank" rel="noopener noreferrer">WhatsApp <ArrowDiag size={10} /></a></li>
              <li><a href="mailto:contato@grupomuv.com.br">E-mail <ArrowDiag size={10} /></a></li>
              <li><a href="/politica-privacidade.html">Privacidade <ArrowDiag size={10} /></a></li>
              <li><a href="/termos-de-uso.html">Termos de uso <ArrowDiag size={10} /></a></li>
            </ul>
          </details>
        </div>
      </div>
      <div className="footer__bottom">
        <div>© {new Date().getFullYear()} Grupo MUV. Conteúdo que move.</div>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <span>contato@grupomuv.com.br</span>
          <span>+55 11 99108-7786</span>
          <span>São Paulo · SP</span>
        </div>
      </div>
    </footer>);

}

// ───── Marquee ───────────────────────────────────────────────────────────────
function Marquee({ items, dark = false }) {
  return (
    <div className={`marquee ${dark ? "marquee--dark" : ""}`}>
      <div className="marquee__track">
        {[...items, ...items, ...items].map((s, i) =>
        <span key={i} className="marquee__item">{s}</span>
        )}
      </div>
    </div>);

}

// ───── Brand strip ───────────────────────────────────────────────────────────
function BrandStrip({ brands }) {
  return (
    <div className="brands">
      {brands.map((b, i) =>
      <div key={i} className="brand-cell">{BRAND_LOGOS[b] ? <img src={BRAND_LOGOS[b]} alt={b} /> : b}</div>
      )}
    </div>);

}

// ───── Brand Marquee ─────────────────────────────────────────────────────────
function BrandMarquee({ brands, dark = false }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reducedMotion ? 12 : 24;
    let frame = 0;
    let lastTime = 0;
    let offset = 0;
    let segmentWidth = track.scrollWidth / 3;

    const updateSegmentWidth = () => {
      segmentWidth = track.scrollWidth / 3;
    };
    const resizeObserver = typeof ResizeObserver !== "undefined" ?
      new ResizeObserver(updateSegmentWidth) :
      null;
    resizeObserver?.observe(track);

    const move = (time) => {
      if (lastTime) {
        const delta = Math.min(time - lastTime, 64);
        offset -= speed * delta / 1000;
        if (segmentWidth > 0 && -offset >= segmentWidth) offset += segmentWidth;
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
      lastTime = time;
      frame = window.requestAnimationFrame(move);
    };

    frame = window.requestAnimationFrame(move);
    window.addEventListener("resize", updateSegmentWidth);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateSegmentWidth);
      resizeObserver?.disconnect();
    };
  }, [brands]);

  return (
    <div className={`brand-marquee ${dark ? "brand-marquee--dark" : ""}`}>
      <div ref={trackRef} className="brand-marquee__track brand-marquee__track--js">
        {[...brands, ...brands, ...brands].map((b, i) =>
        <React.Fragment key={i}>
            <span className="brand-marquee__item">{BRAND_LOGOS[b] ? <img src={BRAND_LOGOS[b]} alt={b} /> : b}</span>
            <span className="brand-marquee__sep">●</span>
          </React.Fragment>
        )}
      </div>
    </div>);

}

// ───── Section head ──────────────────────────────────────────────────────────
function SectionHead({ eyebrow, title, sub, num, ef, tfld, sf }) {
  return (
    <div className="section-head">
      <div>
        {num && <p className="mono" style={{ color: "var(--ink-3)", marginBottom: 12 }}>// {num}</p>}
        {eyebrow && <p className="eyebrow eyebrow-dot" data-tina-field={ef}>{eyebrow}</p>}
      </div>
      <div>
        <h2 className="h1 section-head__title" style={{ margin: 0 }} data-tina-field={tfld}>{title}</h2>
        {sub && <p className="body-l section-head__sub" style={{ maxWidth: 640, marginTop: 24 }} data-tina-field={sf}>{sub}</p>}
      </div>
    </div>);

}

// ───── Page Head ─────────────────────────────────────────────────────────────
function PageHead({ crumb, title, lead, accent, meta, compact }) {
  // Suporta quebra de linha via "\n" no título, mantendo a destaque do accent.
  const renderLineWithAccent = (line, key) => {
    if (!accent || !line.includes(accent)) return <span className="page-head__line" key={key}>{line}</span>;
    const [before, after] = line.split(accent);
    return (
      <span className="page-head__line" key={key}>
        {before}<span style={{ color: "var(--accent)" }}>{accent}</span>{after}
      </span>);
  };

  const lines = title.split("\n");
  const titleNode = lines.length > 1 ?
    lines.map((line, i) => (
      <React.Fragment key={i}>
        {renderLineWithAccent(line, i)}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    )) :
    renderLineWithAccent(title, 0);

  return (
    <header className="page-head">
      <div className="page-head__top">
        <p className="eyebrow eyebrow-dot page-head__crumb">{crumb}</p>
        <span className="page-head__top-right">{meta || "Ed. 01 · 2026"}</span>
      </div>
      <div className="page-head__body">
        <h1 className={`page-head__title ${compact ? "page-head__title--compact" : ""} ${lines.length > 1 ? "page-head__title--multiline" : ""}`}>{titleNode}</h1>
        <p className="page-head__lead">{lead}</p>
      </div>
    </header>);

}

// ───── Reveal on scroll ──────────────────────────────────────────────────────
function Reveal({ children, delay = 0, as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {setShown(true);io.disconnect();}
    }, { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${shown ? "in" : ""}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>);

}

// ───── Export to window ──────────────────────────────────────────────────────


// ===== pages (code) =====
function ShowreelBG() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  useEffect(() => {
    const startPlayback = () => {
      if (!videoRef.current) return;
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };
    const resumeWhenVisible = () => {
      if (!document.hidden && videoRef.current?.paused) startPlayback();
    };
    startPlayback();
    document.addEventListener("visibilitychange", resumeWhenVisible);
    return () => document.removeEventListener("visibilitychange", resumeWhenVisible);
  }, []);

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="showreel">
      <img
        className="showreel__poster"
        src="/assets/reel-social-poster.jpg"
        alt=""
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        className="showreel__film"
        src="/assets/reel-social.mp4"
        poster="/assets/reel-social-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="showreel__grain" />
      <div className="showreel__vignette" />
      <div className="showreel__scanlines" />

      <div className="showreel__hud showreel__hud--tl">
        <span className="showreel__rec"><span className="showreel__rec-dot" /> REC</span>
        <span className="showreel__hud-text">SHOWREEL · MUV · 2026</span>
      </div>
      <div className="showreel__hud showreel__hud--tr">
        <span className="showreel__hud-text">FILM · 01/01</span>
      </div>
      <div className="showreel__hud showreel__hud--bl">
        <span className="showreel__hud-text">IDENTIDADE EM MOVIMENTO</span>
      </div>
      <div className="showreel__hud showreel__hud--br">
        <button
          type="button"
          className="showreel__control"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pausar reel" : "Reproduzir reel"}
          aria-pressed={!isPlaying}
        >
          {isPlaying ? "PAUSAR" : "REPRODUZIR"}
        </button>
      </div>
    </div>);

}

// ───── StatCounter ─ count-up animado quando entra no viewport ──────────────
function StatCounter({ target, prefix = "", suffix = "", pad = 0, label, accent = false }) {
  const ref = useRef(null);
  const [value, setValue] = useState(1);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current || started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    // Anima 1 → target em ~1.6s, easing easeOutCubic pra desacelerar no fim
    const duration = Math.min(1600, 600 + target * 8);
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.max(1, Math.round(1 + (target - 1) * eased));
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target]);

  const displayValue = pad > 0 ? String(value).padStart(pad, "0") : String(value);

  return (
    <div className="stat" ref={ref}>
      <span className="stat__num" style={accent ? { color: "var(--accent)" } : undefined}>
        {prefix}{displayValue}{suffix}
      </span>
      <span className="stat__label">{label}</span>
    </div>);
}

function ManifestoReader() {
  const sectionRef = useRef(null);
  const [activeGroup, setActiveGroup] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !sectionRef.current) return undefined;
    let frame;
    const update = () => {
      frame = undefined;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      const nextGroup = Math.min(2, Math.floor(progress * 3));
      setActiveGroup((group) => group === nextGroup ? group : nextGroup);
    };
    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const phrases = ["Imagem", "com direção", "gera valor real."];

  return (
    <section className="muv-reader" ref={sectionRef} aria-labelledby="manifesto-home">
      <div className="muv-reader__stage">
        <p className="eyebrow eyebrow-dot">Manifesto</p>
        <p className="mono muv-reader__counter" aria-hidden="true">0{activeGroup + 1} / 03</p>
        <h2 id="manifesto-home" className="muv-reader__statement" aria-label="Imagem com direção gera valor real.">
          {phrases.map((phrase, index) => (
            <span
              className={`muv-reader__phrase ${index <= activeGroup ? "is-visible" : ""} ${activeGroup === index ? "is-active" : ""}`}
              aria-hidden={index > activeGroup}
              key={phrase}>
              {phrase}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}

function ProcessRail({ items, onOpen, actionLabel = "Ver processo completo", headingLevel = 3 }) {
  const [openIndex, setOpenIndex] = useState(null);
  const Heading = `h${headingLevel}`;

  return (
    <div className="process-rail">
      <ol className="process-rail__track">
        {items.map((item, index) => (
          <li
            className={`process-rail__chapter ${openIndex === index ? "is-open" : ""}`}
            key={item.num}>
            <Heading className="process-rail__heading">
              <button
                type="button"
                className="process-rail__toggle"
                aria-expanded={openIndex === index}
                aria-controls={`process-detail-${item.num}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.title}</span>
                <span className="process-rail__toggle-mark" aria-hidden="true">+</span>
              </button>
            </Heading>
            <div
              className="process-rail__details"
              id={`process-detail-${item.num}`}
              aria-hidden={openIndex !== index}>
              <p>{item.desc}</p>
              <div className="process-rail__deliverable">
                <span className="mono">ENTREGÁVEL</span>
                <strong>{item.deliverables}</strong>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="process-rail__footer">
        <button className="btn btn--ghost" type="button" onClick={onOpen}>{actionLabel} <Arrow /></button>
      </div>
    </div>
  );
}

function ServiceRail({ items, onContact }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="service-rail">
      <ol className="service-rail__track">
        {items.map((service, index) => (
          <li className={`service-rail__card ${openIndex === index ? "is-open" : ""}`} key={service.num}>
            <h2 className="service-rail__heading">
              <button
                type="button"
                className="service-rail__toggle"
                aria-expanded={openIndex === index}
                aria-controls={`service-detail-${service.num}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                <span>{service.tag}</span>
                <span className="service-rail__toggle-mark" aria-hidden="true">+</span>
              </button>
            </h2>
            <div
              className="service-rail__details"
              id={`service-detail-${service.num}`}
              aria-hidden={openIndex !== index}>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <ul className="service-rail__scope">
                {service.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <div className="service-rail__footer">
        <p>Estratégia, produção, conteúdo e presença sob a mesma direção.</p>
        <button className="btn btn--primary" type="button" onClick={onContact}>Começar um projeto <Arrow /></button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HOME
// ═════════════════════════════════════════════════════════════════════════════
function Home({ setCurrent, density, content }) {
  const router = useRouter();
  const H = content?.home || _home;
  const SRV = content?.services?.items || SERVICOS;
  const PRC = content?.process?.items || PROCESSO;
  const TRB = content?.works?.items || TRABALHOS;
  const PST = content?.posts?.items || POSTS;
  const BRN = content?.brands?.items || BRANDS;
  const MQ = content?.marquee?.items || MARQUEE_WORDS;
  const CASE_SLOTS = Array.from({ length: 3 }, (_, index) => TRB[index] || {
    title: "Novo case",
    client: "Em preparação",
    tag: "PRÓXIMA HISTÓRIA",
    year: "2026",
    placeholder: true
  });
  const tf = (o, f) => (content && o) ? tinaField(o, f) : undefined;
  const heroRef = useRef(null);
  const [intro, setIntro] = useState("boot"); // boot → open → title → done

  // Letterbox intro timeline
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntro("done");
      return;
    }
    if (window.sessionStorage.getItem("muv-intro-seen")) {
      setIntro("done");
      return;
    }
    window.sessionStorage.setItem("muv-intro-seen", "1");
    const t1 = setTimeout(() => setIntro("open"), 120);
    const t2 = setTimeout(() => setIntro("title"), 480);
    const t3 = setTimeout(() => setIntro("done"), 950);
    return () => {clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  }, []);

  // Hero responde ao SCROLL apenas. (O auto-fade por tempo foi removido:
  // apagava a headline e os CTAs 8s depois do load, mesmo sem o usuário rolar.)
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      if (heroRef.current) {
        heroRef.current.style.opacity = "1";
        heroRef.current.style.transform = "none";
      }
      return;
    }
    const apply = (t) => {
      if (!heroRef.current) return;
      heroRef.current.style.opacity = String(Math.max(0.35, 1 - t));
      heroRef.current.style.transform = `translateY(${-t * 32}px)`;
    };

    const onScroll = () => {
      const h = window.innerHeight;
      apply(Math.max(0, Math.min(1, window.scrollY / (h * 0.55))));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page page--no-top" data-screen-label="Home">
      {/* HERO CINEMÁTICO, letterbox intro + showreel + headline reveal */}
      <section className={`hero-cine intro-${intro}`}>
        <div className="hero-cine__media">
          <ShowreelBG />
        </div>
        <div className="hero-cine__scrim" />

        {/* Title card que aparece durante o boot */}
        <div className="hero-cine__bootcard">
          <p className="mono">GRUPO MUV</p>
          <p className="mono hero-cine__bootcard-meta">EDIÇÃO 01 · 2026 · PRODUTORA & HUB CRIATIVO</p>
        </div>

        {/* Letterbox bars */}
        <div className="hero-cine__bar hero-cine__bar--top" aria-hidden="true" />
        <div className="hero-cine__bar hero-cine__bar--bot" aria-hidden="true" />

        <div className="hero-cine__content" ref={heroRef}>
          <div className="hero-cine__top">
            <div>
              <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }} data-tina-field={tf(H,'heroEyebrow')}>{H.heroEyebrow}</p>
              <p className="mono" style={{ color: "var(--dark-ink-2)", marginTop: 12 }}>SP · BR · 23.5505° S · 46.6333° W</p>
            </div>
            <p className="mono hero-cine__rec" style={{ color: "var(--dark-ink-2)" }}>REEL 2026, V01 · LIVE</p>
          </div>

          <div className="hero-cine__mid">
            <h1 className="hero-cine__display">
              <span className="reveal-word"><span data-tina-field={tf(H,'heroTitle1')}>{H.heroTitle1}</span></span><br />
              <span className="reveal-word"><span style={{ fontFamily: "var(--font-display)", fontStyle: "normal", marginRight: "0.3em" }} data-tina-field={tf(H,'heroTitle2')}>{H.heroTitle2}</span></span>{" "}
              <span className="reveal-word"><span className="accent" data-tina-field={tf(H,'heroAccent')}>{H.heroAccent}</span></span>
            </h1>
          </div>

          <div className="hero-cine__bottom">
            <p className="hero-cine__sub" data-tina-field={tf(H,'heroSub')}>{H.heroSub}</p>
            <div className="hero-cine__actions">
              <button className="btn btn--primary" onClick={() => setCurrent("contato")}>Começar um projeto <Arrow /></button>
              <button className="btn btn--ghost-dark" onClick={() => setCurrent("trabalhos")}>Ver portfolio <Arrow /></button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      {SETTINGS.showStats !== false && (
      <section className="hero-stats">
        <div className="hero-stats__inner">
          <StatCounter prefix="+" target={120} label="Produções entregues" />
          <StatCounter prefix="+" target={30} label="Marcas parceiras" />
          <StatCounter target={7} suffix=" dias" label="Ciclo médio captação, entrega" />
          <StatCounter target={1} pad={2} label="Hub criativo, quatro frentes" accent />
        </div>
      </section>
      )}

      {/* MARQUEE */}
      {SETTINGS.showMarquee !== false && <Marquee items={MQ} />}

      {/* MANIFESTO */}
      {SETTINGS.showManifesto !== false && (
      <ManifestoReader />
      )}

      {/* TRABALHOS · prova antes da lista de capacidades */}
      {SETTINGS.showTrabalhos !== false && (
      <section className="section home-cases" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <SectionHead num="02" eyebrow={H.trbEyebrow} title={H.trbTitle} sub={H.trbSub} ef={tf(H,'trbEyebrow')} tfld={tf(H,'trbTitle')} sf={tf(H,'trbSub')} />
        <div className="grid-3">
          {CASE_SLOTS.map((t, i) => (
            <CaseCard
              key={t.slug || `case-slot-${i}`}
              {...t}
              idx={i}
              compactReveal
              onClick={t.slug ? () => router.push(caseHref(t.slug)) : undefined}
            />
          ))}
        </div>
        <div style={{ marginTop: 48, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn--ghost" onClick={() => setCurrent("trabalhos")}>Ver todos os trabalhos <Arrow /></button>
        </div>
      </section>
      )}

      {/* SERVIÇOS */}
      {SETTINGS.showServicos !== false && (
      <section className="section home-capabilities">
        <SectionHead num="03" eyebrow={H.srvEyebrow} title={H.srvTitle} sub={H.srvSub} ef={tf(H,'srvEyebrow')} tfld={tf(H,'srvTitle')} sf={tf(H,'srvSub')} />

        <div className="home-capabilities__grid">
          {SRV.map((s) =>
          <article className="home-capability" key={s.num} tabIndex={0} aria-label={`${s.tag}: ${s.title}`}>
            <div className="home-capability__meta">
              <span className="mono">// {s.num}</span>
            </div>
            <h3>{s.tag}</h3>
            <div className="home-capability__details">
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
              <p className="mono home-capability__items">{s.items.join(" · ")}</p>
            </div>
          </article>
          )}
        </div>
        <div className="home-capabilities__footer">
          <a className="btn btn--ghost" href={ROUTES.servicos} onClick={(e) => {if (isModifiedClick(e)) return;e.preventDefault();setCurrent("servicos");}}>Detalhar serviços <Arrow /></a>
        </div>
      </section>
      )}

      {/* PROCESSO (preview clicável) */}
      {SETTINGS.showProcesso !== false && (
      <section className="section home-process" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <SectionHead num="04" eyebrow={H.prcEyebrow} title={H.prcTitle} sub={H.prcSub} ef={tf(H,'prcEyebrow')} tfld={tf(H,'prcTitle')} sf={tf(H,'prcSub')} />
        <ProcessRail items={PRC} onOpen={() => setCurrent("processo")} />
      </section>
      )}

      {/* BLOG PREVIEW */}
      {SETTINGS.showBlog !== false && (
      <section className="section home-blog-preview" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <SectionHead num="07" eyebrow={H.blgEyebrow} title={H.blgTitle} sub={H.blgSub} ef={tf(H,'blgEyebrow')} tfld={tf(H,'blgTitle')} sf={tf(H,'blgSub')} />
        <div>
          {PST.slice(0, 3).map((p, i) => <PostRow key={i} {...p} onClick={() => router.push(postHref(p.slug))} />)}
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn--ghost" onClick={() => setCurrent("blog")}>Ver todos os posts <Arrow /></button>
        </div>
      </section>
      )}

      {/* CTA FINAL */}
      {SETTINGS.showCTA !== false && (
        <HomeCTA
          setCurrent={setCurrent}
          brands={BRN}
          showBrands={SETTINGS.showMarcas !== false}
        />
      )}

      {/* MUV HUB TEASER */}
      {SETTINGS.showHub !== false && (
      <section className="section section--ink home-hub">
        <div className="home-hub__bridge">
          <span className="mono">Do briefing para a produção</span>
          <span aria-hidden="true">↓</span>
          <span className="mono">e da produção para a comunidade</span>
        </div>
        <div className="home-hub__layout">
          <div className="home-hub__copy">
            <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }} data-tina-field={tf(H,'hubEyebrow')}>{H.hubEyebrow}</p>
            <h2 className="display home-hub__title">
              MUV <span style={{ color: "var(--accent)" }} data-tina-field={tf(H,'hubAccent')}>{H.hubAccent}</span>
            </h2>
            <p className="home-hub__tagline" data-tina-field={tf(H,'hubTagline')}>{H.hubTagline}</p>
            <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 24, maxWidth: 480 }} data-tina-field={tf(H,'hubBody')}>{H.hubBody}</p>
            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn--primary" href={ROUTES.hub} onClick={(e) => {if (isModifiedClick(e)) return;e.preventDefault();setCurrent("hub");}}>Conhecer o Hub <Arrow /></a>
              <a className="btn btn--ghost-dark" href={ROUTES.hub} onClick={(e) => {if (isModifiedClick(e)) return;e.preventDefault();setCurrent("hub");}}>Entrar na lista <Arrow /></a>
            </div>
          </div>
          <div className="hub-grid">
            <Cine src="/assets/hub/hub-a.jpg" alt="Equipamento de produção organizado: câmeras, lentes, drone e acessórios" label="LOCADORA · CATÁLOGO" code="HUB.A" variant="dark" aspect="1/1" />
            <Cine src="/assets/hub/hub-b.jpg" alt="Ciclorama do estúdio MUV com softbox montado" label="STUDIO · CICLORAMA" code="HUB.B" variant="accent" aspect="1/1" />
            <Cine src="/assets/hub/hub-c.jpg" alt="Espaço de trabalho da MUV em uso, com pessoas circulando" label="COMUNIDADE" code="HUB.C" variant="dark" aspect="1/1" />
            <Cine src="/assets/hub/hub-d.jpg" alt="Área de cowork da MUV com estações de trabalho e TV de parede" label="COWORK · ESPAÇO" code="HUB.D" variant="accent" aspect="1/1" />
          </div>
        </div>
      </section>
      )}
    </div>);

}

function HomeCTA({ setCurrent, brands = BRANDS, showBrands = true }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", type: "", budget: "", brief: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const types = ["Brand Film", "Campanha publicitária", "Cobertura de evento", "Conteúdo social", "Documentário", "Showreel / institucional", "Outro"];
  const budgets = ["R$ 5–10k", "R$ 10–25k", "R$ 25–50k", "R$ 50–100k", "R$ 100k+", "A definir"];
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    if (!consent) {setError("Confirme o aceite da política de privacidade para enviar.");return;}
    setSending(true);setError("");
    try {
      await postToNetlify("orcamento", { ...form, origem: "Home · CTA final", "aceite-privacidade": `sim · ${new Date().toISOString()}` });
      trackAnalytics("generate_lead", {
        form_name: "orcamento_home",
        project_type: form.type || "nao_informado",
        budget_range: form.budget || "nao_informado",
      });
      setSent(true);
    } catch (err) {
      setError("Não conseguimos enviar agora. Tenta de novo ou chama no WhatsApp: wa.me/message/D6LG7EUSTIR7C1");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section section--ink home-cta" style={{ paddingTop: 64, paddingBottom: 84 }}>
      <div className="home-cta__grid">
        {/* LEFT: form card */}
        <div className="home-cta__form">
          <div className="quote-card">
            {sent ?
            <div style={{ padding: "24px 0" }}>
                <p className="eyebrow eyebrow-dot" style={{ color: "var(--accent)" }}>Recebido ✓</p>
                <h3 className="h3" style={{ marginTop: 16 }}>Obrigado, {form.name.split(" ")[0] || "parceiro"}.</h3>
                <p className="body" style={{ color: "var(--ink-2)", marginTop: 16, lineHeight: 1.55 }}>
                  A gente vai ler com atenção e volta com diagnóstico, escopo e timeline. Enquanto isso, dá uma olhada nos trabalhos recentes.
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                  <button className="btn btn--ink" onClick={() => setCurrent("trabalhos")}>Ver portfolio <Arrow /></button>
                  <button className="btn btn--ghost" onClick={() => {setSent(false);setForm({ name: "", company: "", email: "", phone: "", type: "", budget: "", brief: "" });}}>Novo orçamento</button>
                </div>
              </div> :

            <form onSubmit={submit}>
                <h3 className="quote-card__title">Solicite um orçamento</h3>
                <p className="quote-card__sub">Campos com <span style={{ color: "var(--accent)" }}>*</span> são obrigatórios</p>

                <div className="quote-card__row">
                  <div className="field field--solid">
                    <label htmlFor="quote-name">Nome <span style={{ color: "var(--accent)" }}>*</span></label>
                    <input id="quote-name" name="name" autoComplete="name" placeholder="Seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="field field--solid">
                    <label htmlFor="quote-company">Empresa</label>
                    <input id="quote-company" name="company" autoComplete="organization" placeholder="Nome da empresa" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  </div>
                </div>

                <div className="quote-card__row">
                  <div className="field field--solid">
                    <label htmlFor="quote-email">E-mail <span style={{ color: "var(--accent)" }}>*</span></label>
                    <input id="quote-email" name="email" type="email" autoComplete="email" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="field field--solid">
                    <label htmlFor="quote-phone">Telefone <span style={{ color: "var(--accent)" }}>*</span></label>
                    <input id="quote-phone" name="phone" type="tel" autoComplete="tel" placeholder="(11) 99999-9999" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                </div>

                <details className="quote-card__details">
                  <summary className="quote-card__details-summary">
                    <span>
                      <strong>Briefing completo</strong>
                      <small>Opcional · acrescente contexto ao pedido</small>
                    </span>
                    <svg className="quote-card__details-arrow" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path d="M4 9h10M10.5 5.5 14 9l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>

                  <div className="quote-card__details-body">
                    <div className="field field--solid" style={{ marginBottom: 20 }}>
                      <label htmlFor="quote-type">Tipo de projeto</label>
                      <div className="select-wrap">
                        <select id="quote-type" name="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                          <option value="">Selecione</option>
                          {types.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <svg className="select-chev" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>

                    <div className="field field--solid" style={{ marginBottom: 20 }}>
                      <label>Faixa de investimento</label>
                      <div className="budget-grid">
                        {budgets.map((b) =>
                      <button
                        key={b}
                        type="button"
                        className={`budget-chip ${form.budget === b ? "budget-chip--on" : ""}`}
                        aria-pressed={form.budget === b}
                        onClick={() => setForm({ ...form, budget: form.budget === b ? "" : b })}>

                            {b}
                          </button>
                      )}
                      </div>
                    </div>

                    <div className="field field--solid" style={{ marginBottom: 8 }}>
                      <label htmlFor="quote-brief">Sobre o projeto</label>
                      <textarea
                      id="quote-brief"
                      name="brief"
                      rows="4"
                      placeholder="Descreva o que precisa, prazo e detalhes..."
                      value={form.brief}
                      onChange={(e) => setForm({ ...form, brief: e.target.value })} />
                    
                    </div>
                  </div>
                </details>

                <label className="quote-card__consent" htmlFor="quote-consent">
                  <input id="quote-consent" name="privacy-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>Autorizo o Grupo MUV a usar meus dados para responder este briefing, conforme a <a href="/politica-privacidade.html" target="_blank" rel="noopener noreferrer">política de privacidade</a>.</span>
                </label>

                <button type="submit" className="btn btn--ink quote-submit" disabled={sending}>
                  {sending ? "ENVIANDO…" : "COMEÇAR CONVERSA"} {!sending && <Arrow />}
                </button>
                {error && <p className="quote-card__error" role="alert">{error}</p>}
                <p className="quote-card__disclaimer">Seus dados não serão compartilhados com terceiros.</p>
              </form>
            }
          </div>
        </div>

        {/* RIGHT: manchete + CTAs */}
        <div className="home-cta__hero">
          <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Próximo passo</p>
          <h2 className="display" style={{ marginTop: 32, color: "var(--dark-ink)", fontSize: "67px" }}>
            Cada projeto<br />começa com <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>escuta.</span>
          </h2>
          <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 32, maxWidth: 420 }}>
            Conta o que você quer fazer. A gente volta com diagnóstico, escopo e timeline. Sem proposta genérica.
          </p>
          <ol className="home-cta__steps" aria-label="O que acontece depois do briefing">
            <li><span>01</span><strong>Leitura</strong><small>A gente entende contexto e objetivo.</small></li>
            <li><span>02</span><strong>Diagnóstico</strong><small>Você recebe caminho, escopo e prioridades.</small></li>
            <li><span>03</span><strong>Próximo passo</strong><small>Alinhamos timeline e formato de produção.</small></li>
          </ol>
          <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn--ghost-dark" onClick={() => setCurrent("trabalhos")}>Ver portfolio <Arrow /></button>
            <button className="btn btn--ghost-dark" onClick={() => setCurrent("contato")}>Briefing completo <Arrow /></button>
          </div>
          <div className="home-cta__contact">
            <a href="mailto:contato@grupomuv.com.br" className="home-cta__contact-item">
              <span className="mono" style={{ color: "var(--dark-ink-2)" }}>E-mail</span>
              <span>contato@grupomuv.com.br</span>
            </a>
            <a href="tel:+5511991087786" className="home-cta__contact-item">
              <span className="mono" style={{ color: "var(--dark-ink-2)" }}>Telefone</span>
              <span>+55 11 99108-7786</span>
            </a>
            <div className="home-cta__contact-item">
              <span className="mono" style={{ color: "var(--dark-ink-2)" }}>Estúdio</span>
              <span>São Paulo · SP</span>
            </div>
          </div>
        </div>
      </div>
      {showBrands && (
        <div className="home-cta__proof" aria-label="Marcas que já trabalharam com o Grupo MUV">
          <BrandMarquee brands={brands} />
          <p className="mono">// +30 marcas · 2019—2026</p>
        </div>
      )}
    </section>);

}

function ServiceCardDark({ num, tag, title, desc, items }) {
  return (
    <div className="svc" style={{ background: "rgba(255,255,255,0.02)", borderColor: "var(--dark-line)", color: "var(--dark-ink)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="svc__num" style={{ color: "var(--accent)" }}>// {num}</span>
        <span className="pill pill--accent">{tag}</span>
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark-ink-2)" }}>
        {items.join(" · ")}
      </p>
      <h3 className="svc__title" style={{ color: "var(--dark-ink)", fontFamily: "var(--font-display)" }}>{title}</h3>
      <p className="svc__desc" style={{ color: "var(--dark-ink-2)" }}>{desc}</p>
    </div>);

}

function StepRow({ num, title, desc, deliverables, onClick, linkable }) {
  return (
    <div
      className={`step ${linkable ? "step--link" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();onClick();}} : undefined}>
      
      <div className="step__num">{num}</div>
      <h3 className="step__title" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
      <p className="step__desc">{desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <p className="step__deliverables">{deliverables}</p>
        {linkable && <span className="step__arrow">Ver processo <Arrow /></span>}
      </div>
    </div>);

}

function CaseCard({ title, client, tag, year, idx, variant, onClick, still, video, poster, slug, placeholder = false, compactReveal = false, headingLevel = 3 }) {
  const videoRef = useRef(null);
  const [isTouched, setIsTouched] = useState(false);
  const TitleTag = `h${headingLevel}`;
  const variants = ["default", "dark", "accent", "default", "dark", "accent"];
  const v = variant || variants[idx % variants.length];
  const playPreview = () => {
    if (!videoRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    videoRef.current.play().catch(() => undefined);
  };
  const stopPreview = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };
  const href = slug ? caseHref(slug) : undefined;
  const CardTag = href ? "a" : "article";
  const activateCard = (event) => {
    const isCoarsePointer = compactReveal && window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isCoarsePointer && !isTouched) {
      event.preventDefault();
      setIsTouched(true);
      return;
    }
    if (onClick) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <CardTag
      className={`case case--preview ${placeholder ? "case--placeholder" : ""} ${isTouched ? "is-touched" : ""}`}
      href={href}
      onClick={href || onClick ? activateCard : undefined}
      onMouseEnter={playPreview}
      onMouseLeave={stopPreview}
      onFocus={playPreview}
      onBlur={() => { stopPreview(); setIsTouched(false); }}>
      <div className={`case__media case__media--${v}`} style={{ fontSize: "10px", width: "100%" }}>
        {still ? <img className="case__still" src={still} alt={`${title.replace(/\n/g, " ")} — ${client}`} loading="lazy" decoding="async" /> : null}
        {video ? (
          <video
            ref={videoRef}
            className="case__preview-video"
            src={video}
            poster={poster || still}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : null}
        <span className="case__frame-code mono">// CASE.{String(idx + 1).padStart(2, "0")}</span>
        <span className="case__frame-state mono">{placeholder ? "SLOT · ABERTO" : video ? "HOVER · FILM" : "STILL · FRAME"}</span>
        <span className="case__preview-cta">{placeholder ? "Case em preparação" : "Ver mais"} {!placeholder && <Arrow />}</span>
      </div>
      <div className="case__meta">
        <div>
          <p className="case__tag">{client}</p>
          <TitleTag className="case__title">{title}</TitleTag>
        </div>
        <div style={{ textAlign: "right" }}>
          <p className="case__tag">{tag}</p>
          <p className="case__tag" style={{ marginTop: 4 }}>{year}</p>
        </div>
        <span className="case__more">{placeholder ? "Espaço reservado" : "Ver mais"} {!placeholder && <Arrow />}</span>
      </div>
    </CardTag>);

}

function PostRow({ date, title, excerpt, read, slug, onClick }) {
  const href = slug ? postHref(slug) : undefined;
  const Tag = href ? "a" : "article";
  return (
    <Tag className="post" href={href}
      onClick={href || onClick ? (e) => {if (isModifiedClick(e)) return;if (onClick) {e.preventDefault();onClick();}} : undefined}>
      <div className="post__head">
        <h3 className="post__title">{title}</h3>
        <span className="post__date">{date} · {read}</span>
      </div>
      <p className="post__excerpt">{excerpt}</p>
      <span className="link-arrow" style={{ color: "var(--ink-2)" }}>Ler texto <Arrow /></span>
    </Tag>);

}

// ═════════════════════════════════════════════════════════════════════════════
// SERVIÇOS
// ═════════════════════════════════════════════════════════════════════════════
function Servicos({ setCurrent }) {
  return (
    <div className="page" data-screen-label="Servicos">
      <PageHead crumb="01 · Serviços e Processo" title={"O que fazemos.\nComo entregamos."} lead="Estratégia, produção, conteúdo e presença conduzidos pela mesma equipe, do briefing ao master." accent="entregamos" meta="04 pilares · 06 etapas" compact />

      <section className="section services-horizontal" id="pilares">
        <SectionHead eyebrow="Quatro pilares" title={"Uma direção.\nQuatro frentes."} sub="Abra cada pilar para entender o que entra no escopo e como ele se conecta ao projeto." />
        <ServiceRail items={SERVICOS} onContact={() => setCurrent("contato")} />
      </section>

      <section className="section process-horizontal" id="processo">
        <SectionHead eyebrow="Como entregamos" title="Da ideia ao master." sub="Seis etapas com escopo, aprovação e entregável claros. Abra uma etapa para ver os detalhes." />
        <ProcessRail items={PROCESSO} onOpen={() => setCurrent("contato")} actionLabel="Começar um projeto" headingLevel={2} />
      </section>

      <section className="section process-principles">
        <SectionHead title="O que orienta o trabalho? Direção, prazo e retenção." />
        <div className="grid-3">
          <Metric num="01" label="Direção" desc="Cada decisão estética responde a um objetivo de comunicação." />
          <Metric num="02" label="Prazo" desc="Cronograma, aprovação e responsabilidade claros desde o início." />
          <Metric num="03" label="Retenção" desc="Conteúdo pensado para a plataforma, o formato e a audiência." />
        </div>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// PROCESSO
// ═════════════════════════════════════════════════════════════════════════════
function Processo({ setCurrent }) {
  return <Servicos setCurrent={setCurrent} />;

}

function Metric({ num, label, desc }) {
  return (
    <div className="process-principle">
      <p className="mono">// {num}</p>
      <h3 className="h3">{label}</h3>
      <p>{desc}</p>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// TRABALHOS
// ═════════════════════════════════════════════════════════════════════════════
function Trabalhos({ setCurrent, slug = null }) {
  const router = useRouter();
  const [filter, setFilter] = useState("Todos");
  // Chips derivados do conteúdo: categoria sem nenhum case nunca aparece como filtro vazio.
  const filters = ["Todos", ...Array.from(new Set(TRABALHOS.map((t) => t.category).filter(Boolean)))];
  // O case aberto vem da URL (/trabalhos/<slug>/), não de estado local:
  // link compartilhável, botão voltar do navegador correto e página indexável.
  const selected = slug ? TRABALHOS.findIndex((t) => t.slug === slug) : null;
  const openList = () => router.push("/trabalhos/");
  const openCase = (t) => router.push(caseHref(t.slug));

  if (selected !== null && selected >= 0) {
    const t = TRABALHOS[selected];
    const heroVertical = t.ratio ? t.ratio === "9/16" : Boolean(t.vimeoId);
    return (
      <div className="page" data-screen-label="CaseDetail">
        <article className="case-detail">
          <div className="case-detail__nav">
            <a className="link-arrow link-arrow--back" href="/trabalhos/" onClick={(e) => {e.preventDefault();openList();}}>
              <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Arrow /></span> Todos os cases
            </a>
          </div>
          <header className="case-detail__head">
            <div className="case-detail__meta">
              <span className="pill pill--accent">{t.category}</span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>{t.year} · {t.tag}</span>
            </div>
            <p className="case-detail__client mono">{t.client}</p>
            <h1 className="case-detail__title">{t.title}</h1>
            <p className="body-l case-detail__lead">{t.summary}</p>
          </header>
          <div className="case-detail__hero">
            <div style={heroVertical ? { maxWidth: 440, margin: "0 auto" } : undefined}>
              <Cine vimeoId={t.vimeoId} video={t.vimeoId ? null : t.video} poster={t.poster} src={t.still} alt={`${t.title.replace(/\n/g, " ")} — ${t.client}`} label={t.title.toUpperCase().replace(/\n/g, " ")} code={`CASE.${String(selected + 1).padStart(2, "0")}`} aspect={heroVertical ? "9/16" : "16/9"} variant="accent" play />
            </div>
          </div>

          <section className="case-detail__specs">
            <div className="case-detail__spec">
              <p className="mono case-detail__spec-label">// FORMATO</p>
              <p>{t.format}</p>
            </div>
            <div className="case-detail__spec">
              <p className="mono case-detail__spec-label">// EQUIPE</p>
              <p>{t.team}</p>
            </div>
            <div className="case-detail__spec">
              <p className="mono case-detail__spec-label">// EQUIPAMENTO</p>
              <p>{t.gear}</p>
            </div>
          </section>

          <div className="case-detail__body">
            {t.body.map((b, i) =>
              <div key={i} className={`case-detail__block ${b.h.toLowerCase().includes("resultado") ? "case-detail__block--result" : ""}`}>
                <h2 className="case-detail__h2">{b.h}</h2>
                <p className="case-detail__p">{b.p}</p>
              </div>
            )}
          </div>

          <footer className="case-detail__footer">
            <p className="eyebrow eyebrow-dot">Próximo passo</p>
            <h3 className="h2" style={{ marginTop: 16 }}>Briefing parecido no seu radar?</h3>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn--ink" href={ROUTES.contato} onClick={(e) => {if (isModifiedClick(e)) return;e.preventDefault();setCurrent("contato");}}>Começar um projeto <Arrow /></a>
              <a className="btn btn--ghost" href="/trabalhos/" onClick={(e) => {e.preventDefault();openList();}}>Ver outros cases</a>
            </div>
          </footer>
        </article>
      </div>);
  }

  const filtered = filter === "Todos" ? TRABALHOS : TRABALHOS.filter((t) => t.category === filter);

  return (
    <div className="page" data-screen-label="Trabalhos">
      <PageHead crumb="03 · Trabalhos" title="Cases selecionados." lead="Produções de 2023 a 2026. Cada case tem uma marca, um contexto e uma decisão criativa que a gente pode explicar." accent="Cases" meta={`${TRABALHOS.length} projetos · 2023–2026`} />

      <div className="works-filter">
        <div className="works-filter__inner">
          <div className="works-filter__chips">
            {filters.map((f) =>
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pill ${filter === f ? "pill--accent" : ""}`}
              aria-pressed={filter === f}
              style={{ cursor: "pointer", background: filter === f ? undefined : "transparent" }}>

                {f}
              </button>
            )}
          </div>
          <p className="mono works-filter__count">{filtered.length} resultado{filtered.length === 1 ? "" : "s"}</p>
        </div>
      </div>

      <section className="section works-grid-section">
        <div className="works-grid">
          {filtered.map((t, i) => {
            const realIdx = TRABALHOS.indexOf(t);
            return (
              <CaseCard
                key={t.slug}
                {...t}
                idx={realIdx}
                compactReveal
                headingLevel={2}
                onClick={() => openCase(t)}
              />);
          })}
        </div>
      </section>

      <section className="section section--ink works-reel">
        <div className="works-reel__head">
          <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Quer ver mais?</p>
          <h2 className="display works-reel__title">
            Showreel<br /><span style={{ color: "var(--accent)" }}>completo.</span>
          </h2>
        </div>
        <div className="works-reel__media">
          <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <Cine
              video="/assets/reel-social.mp4"
              poster="/assets/reel-social-poster.jpg"
              label="REEL SOCIAL · 00'30"
              code="REEL.FULL" aspect="9/16" variant="dark" />
          </div>
        </div>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// SOBRE
// ═════════════════════════════════════════════════════════════════════════════
function Sobre({ setCurrent }) {
  return (
    <div className="page" data-screen-label="Sobre">
      <PageHead
        crumb="04 · Sobre"
        title={"Produtora audiovisual.\nEstrutura de hub criativo."}
        lead={"Começamos produzindo para eventos, marcas em crescimento e artistas independentes.\nHoje operamos no nível de exigência dos grandes anunciantes, sem perder o que nos fez começar."}
        accent="hub criativo"
        meta="Equipe · Manifesto · Pilares"
      />

      <section className="about-proof" aria-label="Números e estrutura do Grupo MUV">
        <div><strong>+120</strong><span>produções entregues</span></div>
        <div><strong>+30</strong><span>marcas parceiras</span></div>
        <div><strong>4</strong><span>capacidades integradas</span></div>
        <div><strong>SP</strong><span>produtora + hub criativo</span></div>
      </section>

      {/* MANIFESTO */}
      <section className="section about-manifesto">
        <div className="about-manifesto__inner">
          <div className="about-manifesto__label">
            <p className="mono" style={{ color: "var(--ink-3)" }}>// MANIFESTO</p>
            <p className="eyebrow eyebrow-dot" style={{ marginTop: 12 }}>O que define a gente</p>
          </div>
          <p className="manifesto-text" style={{ fontFamily: "var(--font-display)" }}>
            Criatividade com <span style={{ color: "var(--accent)", fontStyle: "normal", fontWeight: 400 }}>direção.</span><br />
            Estética com <span style={{ color: "var(--accent)", fontStyle: "normal", fontWeight: 400 }}>propósito.</span><br />
            <span className="blue">Conteúdo</span> que <span style={{ color: "var(--accent)", fontStyle: "normal", fontWeight: 400 }}>move.</span>
          </p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section section--tight about-gallery">
        <div className="about-gallery__grid">
          <div className="about-gallery__main">
            <Cine src="/assets/about/about-01.jpg" alt="Equipe da MUV em set: operador de câmera em primeiro plano e Nissan iluminado ao fundo" label="EQUIPE EM AÇÃO · BACKSTAGE" code="ABOUT.01" aspect="16/9" />
          </div>
          <div className="about-gallery__col">
            <Cine src="/assets/about/about-02.jpg" alt="Interior do estúdio MUV: ciclorama montado, mesas de trabalho e área de convivência" label="STUDIO · INTERIOR" code="ABOUT.02" aspect="16/9" variant="dark" />
            <Cine src="/assets/about/about-03.jpg" alt="Montagem de um refletor Amaran 300c no tripé durante preparação de set" label="EQUIPAMENTO" code="ABOUT.03" aspect="16/9" variant="accent" />
          </div>
        </div>
        <div className="about-gallery__caption">
          <p className="mono">Backstage · Studio · Equipamento</p>
          <p className="mono">São Paulo · 2025</p>
        </div>
      </section>

      {/* PILARES */}
      <section className="section about-pilares">
        <SectionHead num="01" eyebrow="Pilares" title="O que move a gente." />
        <div className="about-pilares__grid">
          {[
          { tag: "Direção", desc: "Toda decisão criativa tem motivação estratégica. Cada escolha de enquadramento, luz e ritmo responde a um objetivo de comunicação." },
          { tag: "Excelência", desc: "Padrão de imagem e som no nível de produções internacionais de referência. Sem concessão técnica, independente do escopo." },
          { tag: "Método", desc: "Processo documentado, com aprovação em cada fase. Clareza de escopo do briefing até a entrega do master." },
          { tag: "Precisão", desc: "Entrega no formato certo, no prazo acordado, sem revisão desnecessária. O processo existe pra isso não depender de sorte." }].
          map((p, i) =>
          <article key={i} className="pilar-card" tabIndex={0}>
              <p className="mono pilar-card__num">// 0{i + 1}</p>
              <h3 className="pilar-card__title">{p.tag}.</h3>
              <p className="pilar-card__desc">{p.desc}</p>
            </article>
          )}
        </div>
      </section>

      <section className="section about-hub" id="hub">
        <SectionHead
          eyebrow="MUV Hub"
          title="Estrutura para produzir."
          sub="Locadora, studio, comunidade e espaço de trabalho conectados à operação audiovisual da MUV."
        />
        <HubAccessGrid setCurrent={setCurrent} />
      </section>

      {/* EQUIPE */}
      {SETTINGS.showTeam !== false && (
      <section className="section section--dark about-team">
        <SectionHead num="02" eyebrow="Equipe" title="Quem faz acontecer." sub="Direção criativa, captação, pós e estratégia. Uma equipe sênior, integrada do briefing à entrega." />
        <div className="team">
          {TIME.map((t, i) =>
          <div key={i} className="team__card">
              <Cine label={t.role.toUpperCase()} code={`TEAM.${String(i + 1).padStart(2, "0")}`} aspect="4/5" variant={i % 2 === 0 ? "dark" : "default"} />
              <p className="team__role" style={{ color: "var(--dark-ink-2)" }}>{t.role}</p>
              <h3 className="team__name" style={{ color: "var(--dark-ink)" }}>{t.name}</h3>
              <p style={{ color: "var(--dark-ink-2)", fontSize: 13 }}>{t.short}</p>
            </div>
          )}
        </div>
      </section>
      )}

      {/* CTA */}
      <section className="section about-cta">
        <div className="about-cta__inner">
          <p className="eyebrow eyebrow-dot">Quer trabalhar com a gente?</p>
          <h2 className="about-cta__title">{"O primeiro passo é uma conversa.\nSem compromisso, sem proposta padrão."}</h2>
          <button className="btn btn--primary" onClick={() => setCurrent("contato")}>Falar com a gente <Arrow /></button>
        </div>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// MUV HUB
// ═════════════════════════════════════════════════════════════════════════════
const HUB_ACCESS = [
  { id: "hub-locadora", code: "01", title: "Locadora", note: "Equipamento" },
  { id: "hub-studio", code: "02", title: "Studio", note: "Criação e produção" },
  { id: "hub-comunidade", code: "03", title: "Comunidade", note: "Hub criativo" },
  { id: "hub-cowork", code: "04", title: "Cowork", note: "Espaço de trabalho" }
];

function HubAccessGrid({ setCurrent }) {
  return (
    <div className="hub-access-grid">
      {HUB_ACCESS.map((item) => (
        <a
          key={item.id}
          className="hub-access-card"
          href={ROUTES[item.id]}
          onClick={(event) => { event.preventDefault(); setCurrent(item.id); }}>
          <span className="mono">{item.code}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.note}</p>
          </div>
          <Arrow />
        </a>
      ))}
    </div>
  );
}

function MuvHub({ setCurrent }) {
  return (
    <div className="page" data-screen-label="MuvHub">
      <section className="hero hub-overview-hero" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="hero__top">
          <span className="pill pill--accent pill--dot">Em breve · 2026</span>
          <p className="mono" style={{ color: "var(--ink-3)" }}>// HUB.OVERVIEW</p>
        </div>
        <h1 className="hero__display hub-overview-hero__title">
          MUV <span className="accent">Hub.</span>{" "}
          <span className="italic hub-overview-hero__line">Onde a produção acontece.</span>
        </h1>
        <p className="hero__sub" style={{ marginTop: 48 }}>
          Locadora de equipamentos, reserva de studio e comunidade criativa
          num só lugar. Plataforma exclusiva pra filmmakers, agências e marcas parceiras.
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn btn--primary" href="#hub-waitlist">Entrar na lista de espera <Arrow /></a>
          <button className="btn btn--ghost" onClick={() => setCurrent("contato")}>Saber mais <Arrow /></button>
        </div>
      </section>

      <section className="section hub-overview-access">
        <SectionHead eyebrow="Quatro acessos" title="Escolha o que precisa." sub="Cada área tem uma página própria com contexto, estrutura e formas de acesso." />
        <HubAccessGrid setCurrent={setCurrent} />
      </section>

      <HubEmailCapture
        id="hub-waitlist"
        eyebrow="Lançamento · 2026"
        title="Lista de espera"
        accent="prioritária."
        body="Quem entra na lista agora tem acesso antecipado, condição de fundador e prioridade na agenda de studio."
        source="MUV Hub"
      />
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// HUB · LOCADORA
// ═════════════════════════════════════════════════════════════════════════════
function HubEmailCapture({ eyebrow, title, accent, body, source, id }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const inputId = `hub-email-${source.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-")}`;

  const submit = async (event) => {
    event.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      await postToNetlify("hub-waitlist", { email, origem: `Hub · ${source}` });
      trackAnalytics("sign_up", {
        method: "hub_waitlist",
        signup_source: source,
      });
      setEmail("");
      setStatus("sent");
    } catch (_) {
      setStatus("error");
    }
  };

  return (
    <section id={id} className="section section--dark hub-cta hub-email-capture">
      <div className="hub-cta__inner">
        <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>{eyebrow}</p>
        <h2 className="h1 hub-email-capture__title">
          {title} <span>{accent}</span>
        </h2>
        <p className="body-l hub-email-capture__body">{body}</p>
        {status === "sent" ? (
          <div className="hub-email-capture__success" role="status">
            <span aria-hidden="true">✓</span>
            <p>E-mail recebido. Avisaremos você primeiro.</p>
            <button type="button" className="btn btn--ghost-dark" onClick={() => setStatus("idle")}>Cadastrar outro e-mail</button>
          </div>
        ) : (
          <form className="hub-email-capture__form" onSubmit={submit}>
            <label className="sr-only" htmlFor={inputId}>Seu e-mail</label>
            <input
              id={inputId}
              name="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
              {status === "sending" ? "Enviando…" : "Quero receber"} {status !== "sending" && <Arrow />}
            </button>
          </form>
        )}
        {status === "error" && <p className="hub-email-capture__error" role="alert">Não foi possível cadastrar agora. Tente novamente em instantes.</p>}
        <p className="mono hub-email-capture__privacy">SEM SPAM · APENAS NOVIDADES DO MUV HUB</p>
      </div>
    </section>
  );
}

const LOCADORA_CATEGORIAS = [
  {
    cat: "Câmeras",
    code: "CAM",
    items: ["Sony FX6 — cinema 4K", "Sony FX3 — full-frame 4K", "Sony A7CII — compacta full-frame", "Sony A7 IV — híbrida foto/vídeo", "Sony A73 — segunda câmera"]
  },
  {
    cat: "Lentes",
    code: "LENS",
    items: ["Sony GMaster 16-35 f/2.8", "Sony GMaster 24-70 f/2.8", "Sony GMaster 70-200 f/2.8", "Sony FE 200-600", "Cine 7Artisans T2 35/50/85mm", "Laowa 10mm ultra wide"]
  },
  {
    cat: "Drones & FPV",
    code: "DRONE",
    items: ["DJI Mini 4 Pro — aéreo urbano", "DJI Avata — FPV cinemático", "DJI Mavic 3 Pro — pacote completo", "Avata Goggles 2 + RC Motion 2"]
  },
  {
    cat: "Iluminação",
    code: "LIGHT",
    items: ["Aputure Amaran F22c — painel flexível", "Aputure Amaran F21c", "Aputure T2C tube light", "Aputure 600D — chave principal", "Flash Godox AD200/AD400"]
  },
  {
    cat: "Áudio",
    code: "SOUND",
    items: ["Rode VideoMic NTG", "Rode Wireless Pro", "Hollyland Lark150 — lapela", "Mixer Zoom F3", "Boom pole + cabos XLR"]
  },
  {
    cat: "Estabilização & rigging",
    code: "GRIP",
    items: ["DJI Ronin RS3 Mini", "Zhiyun Weebill-S", "Glidecam HD-2000", "Tripés Manfrotto vídeo", "Monopés, easyrigs, follow focus"]
  }
];

function HubLocadora({ setCurrent }) {
  return (
    <div className="page" data-screen-label="HubLocadora">
      <div className="hub-sub__nav">
        <button className="link-arrow link-arrow--back" onClick={() => { setCurrent("hub"); window.scrollTo({ top: 0, behavior: "instant" }); }}>
          <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Arrow /></span> Voltar pro Hub
        </button>
      </div>
      <PageHead crumb="06.A · Hub Locadora" title={"Equipamento profissional\nsob demanda."} lead="Câmeras Sony cinema, lentes GMaster, drones DJI, iluminação Aputure, áudio Hollyland. Reserva online, contrato digital, retirada no estúdio em São Paulo." accent="profissional" meta="6 categorias · +60 itens · Reserva online" compact />

      <section className="section hub-locadora-cat">
        <SectionHead num="01" eyebrow="Catálogo" title="O que tem na locadora." sub="Lista parcial — peça por WhatsApp o que não encontrar aqui que a gente confere disponibilidade." />
        <div className="hub-cat-grid">
          {LOCADORA_CATEGORIAS.map((c) =>
            <div key={c.code} className="hub-cat-card">
              <div className="hub-cat-card__head">
                <span className="mono" style={{ color: "var(--accent)" }}>// {c.code}</span>
                <h3 className="hub-cat-card__title">{c.cat}</h3>
              </div>
              <ul className="hub-cat-card__list">
                {c.items.map((it, i) => <li key={i}>{it}</li>)}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="section section--ink">
        <SectionHead num="02" eyebrow="Como funciona" title="Reservar é simples." />
        <div className="grid-3 hub-process">
          {[
            { n: "01", t: "Confere disponibilidade", d: "Manda mensagem com data, equipamento e duração. A gente responde em ≤ 1 dia útil com orçamento + disponibilidade." },
            { n: "02", t: "Confirma com contrato digital", d: "Contrato curto, transparente. Sinal de 50% via PIX confirma a reserva." },
            { n: "03", t: "Retira no estúdio", d: "Alameda Santos 211, sala 1507. Checklist de saída assinado. Devolução no horário combinado." }
          ].map((s) =>
            <div key={s.n} className="hub-process__step">
              <p className="mono" style={{ color: "var(--accent)" }}>// {s.n}</p>
              <h3 className="h3">{s.t}</h3>
              <p>{s.d}</p>
            </div>
          )}
        </div>
      </section>

      <HubEmailCapture
        eyebrow="Lista de interesse"
        title="Catálogo e disponibilidade"
        accent="direto no seu e-mail."
        body="Cadastre seu e-mail para receber a abertura das reservas, novidades do catálogo e condições da locadora."
        source="Locadora"
      />
    </div>);
}

// ═════════════════════════════════════════════════════════════════════════════
// HUB · STUDIO
// ═════════════════════════════════════════════════════════════════════════════
const STUDIO_SPECS = [
  { label: "Área útil", value: "60 m²" },
  { label: "Pé direito", value: "3,2 m" },
  { label: "Ciclorama", value: "L-shape branco infinito" },
  { label: "Iluminação inclusa", value: "Aputure 600D + 2x Amaran F22c" },
  { label: "Tomadas", value: "16 pontos · 110V/220V" },
  { label: "Climatização", value: "Ar central · controle por turno" },
  { label: "Internet", value: "1 Gbps cabo + Wi-Fi 6" },
  { label: "Áudio", value: "Tratamento acústico básico" }
];

function HubStudio({ setCurrent }) {
  return (
    <div className="page" data-screen-label="HubStudio">
      <div className="hub-sub__nav">
        <button className="link-arrow link-arrow--back" onClick={() => { setCurrent("hub"); window.scrollTo({ top: 0, behavior: "instant" }); }}>
          <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Arrow /></span> Voltar pro Hub
        </button>
      </div>
      <PageHead crumb="06.B · Hub Studio" title={"Espaço pronto\npra produzir."} lead="60m² com ciclorama, iluminação profissional inclusa e equipamento básico de captação. Reserva por turno (4h) ou diária. Localização central em São Paulo." accent="produzir" meta="60 m² · Ciclorama L-shape · Reserva por turno" compact />

      <section className="section">
        <SectionHead num="01" eyebrow="Estúdio em fotos" title="Como é o espaço." />
        <div className="hub-studio-gallery">
          <Cine src="/assets/hub/studio-01.jpg" alt="Ciclorama L-shape do estúdio MUV, com softbox montado" label="CICLORAMA · L-SHAPE" code="STUDIO.01" aspect="16/9" variant="dark" />
          <Cine src="/assets/hub/studio-02.jpg" alt="Equipamento de produção organizado: câmeras, lentes, drone e iluminação" label="EQUIPAMENTO EM BANCADA" code="STUDIO.02" aspect="16/9" variant="accent" />
          <Cine label="ILUMINAÇÃO MONTADA" code="STUDIO.03" aspect="4/3" />
        </div>
      </section>

      <section className="section section--ink">
        <SectionHead num="02" eyebrow="Especificações" title="O que vem incluso." />
        <div className="hub-specs">
          {STUDIO_SPECS.map((s, i) =>
            <div key={i} className="hub-specs__row">
              <span className="mono hub-specs__label">// {s.label}</span>
              <span className="hub-specs__value">{s.value}</span>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <SectionHead num="03" eyebrow="Reserva" title="Por turno ou diária." sub="Turno de 4h, diária de 8h. Equipamento extra (drones, gimbals, áudio especial) pode ser somado da locadora no mesmo contrato." />
        <div className="grid-3 hub-plans">
          {[
            { n: "01", t: "Turno", d: "4 horas corridas. Inclui ciclorama, iluminação base, ar e internet.", price: "Sob consulta" },
            { n: "02", t: "Diária", d: "8 horas + 1 turno de cortesia pra montagem/desmontagem.", price: "Desconto vs turno" },
            { n: "03", t: "Pacote semanal", d: "5 diárias seguidas com desconto progressivo. Ideal pra séries.", price: "Sob proposta" }
          ].map((p) =>
            <div key={p.n} className="hub-plan-card">
              <p className="mono" style={{ color: "var(--accent)" }}>// {p.n}</p>
              <h3 className="h3" style={{ marginTop: 16 }}>{p.t}</h3>
              <p style={{ color: "var(--ink-2)", marginTop: 8 }}>{p.d}</p>
              <p className="hub-plan-card__price">{p.price}</p>
            </div>
          )}
        </div>
      </section>

      <HubEmailCapture
        eyebrow="Agenda do studio"
        title="Visitas e reservas"
        accent="quando abrirem."
        body="Cadastre seu e-mail para receber primeiro a agenda de visitas, turnos disponíveis e novidades do studio."
        source="Studio"
      />
    </div>);
}

// ═════════════════════════════════════════════════════════════════════════════
// HUB · COMUNIDADE
// ═════════════════════════════════════════════════════════════════════════════
function HubComunidade({ setCurrent }) {
  return (
    <div className="page" data-screen-label="HubComunidade">
      <div className="hub-sub__nav">
        <button className="link-arrow link-arrow--back" onClick={() => { setCurrent("hub"); window.scrollTo({ top: 0, behavior: "instant" }); }}>
          <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Arrow /></span> Voltar pro Hub
        </button>
      </div>
      <PageHead crumb="06.C · Hub Comunidade" title={"Filmmakers, marcas\ne cultura."} lead="Hub criativo pra quem produz audiovisual e quem precisa contratar. Feed de oportunidades, agenda de eventos, conteúdo educativo e conexão direta entre criadores e marcas parceiras." accent="cultura" meta="Em construção · Lançamento 2026" compact />

      <section className="section">
        <SectionHead num="01" eyebrow="O que tem na comunidade" title="Quatro camadas vivas." sub="Cresce com quem entra. Quanto mais gente certa, mais útil pra todo mundo." />
        <div className="grid-2-2">
          <div className="hub-comm-card">
            <p className="mono" style={{ color: "var(--accent)" }}>// FEED</p>
            <h3 className="h3" style={{ marginTop: 12 }}>Oportunidades & vagas</h3>
            <p style={{ color: "var(--ink-2)", marginTop: 8 }}>
              Marcas e produtoras parceiras postam projetos abertos, vagas pontuais e captações com data marcada. Filmmakers respondem com portfolio.
            </p>
          </div>
          <div className="hub-comm-card">
            <p className="mono" style={{ color: "var(--accent)" }}>// AGENDA</p>
            <h3 className="h3" style={{ marginTop: 12 }}>Eventos & encontros</h3>
            <p style={{ color: "var(--ink-2)", marginTop: 8 }}>
              Mostras, screenings, painéis de discussão, sessões de portfolio review. Presencial em SP e online pro Brasil inteiro.
            </p>
          </div>
          <div className="hub-comm-card">
            <p className="mono" style={{ color: "var(--accent)" }}>// CONTEÚDO</p>
            <h3 className="h3" style={{ marginTop: 12 }}>Cursos & ensaios</h3>
            <p style={{ color: "var(--ink-2)", marginTop: 8 }}>
              Conteúdo educativo curto e denso. Direção, fotografia, edição, color, produção. Quem ensina é quem entrega projeto de verdade.
            </p>
          </div>
          <div className="hub-comm-card">
            <p className="mono" style={{ color: "var(--accent)" }}>// REDE</p>
            <h3 className="h3" style={{ marginTop: 12 }}>Networking direto</h3>
            <p style={{ color: "var(--ink-2)", marginTop: 8 }}>
              Perfil curado, portfolio visível, mensagem direta. Sem intermediário, sem agência cobrando 30% no meio.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <SectionHead num="02" eyebrow="Pra quem é" title="Três tipos de membro." />
        <div className="grid-3 hub-members">
          {[
            { tag: "FILMMAKERS", desc: "DOP, editor, color, diretor, produtor. Quem cria. Conta gratuita com portfolio público e acesso ao feed de oportunidades." },
            { tag: "MARCAS", desc: "Marcas e produtoras que contratam recorrente. Conta pro acessa filtros avançados, posta vagas e mensagem direta." },
            { tag: "AGÊNCIAS", desc: "Casas de criação que distribuem briefings. Acesso intermediário com posting limitado e visibilidade pro time." }
          ].map((m, i) =>
            <div key={i} style={{ padding: "32px 24px", borderTop: "1px solid rgba(245,240,235,0.1)" }}>
              <p className="mono" style={{ color: "var(--accent)" }}>// 0{i + 1}</p>
              <h3 className="h3" style={{ marginTop: 24 }}>{m.tag}</h3>
              <p style={{ color: "var(--dark-ink-2)", marginTop: 12, fontSize: 14 }}>{m.desc}</p>
            </div>
          )}
        </div>
      </section>

      <HubEmailCapture
        eyebrow="Lista de espera"
        title="Entre antes"
        accent="do lançamento."
        body="Cadastre seu e-mail para receber acesso antecipado, novidades da comunidade e oportunidades para membros fundadores."
        source="Comunidade"
      />
    </div>);
}

// ═════════════════════════════════════════════════════════════════════════════
// HUB · COWORK
// ═════════════════════════════════════════════════════════════════════════════
const COWORK_BENEFITS = [
  { label: "Mesas compartilhadas", value: "12 estações ergonômicas + monitores externos por demanda" },
  { label: "Salas de reunião", value: "2 salas privativas (4 e 8 pessoas) com TV + videoconferência" },
  { label: "Internet", value: "1 Gbps cabo · Wi-Fi 6 dedicado · backup 4G" },
  { label: "Café & impressão", value: "Café espresso, máquina de chá, impressora A3 colorida inclusa" },
  { label: "Acesso", value: "24/7 com chave digital · sem horário de portaria" },
  { label: "Lockers", value: "Armário individual com chave inteligente" }
];

function HubCowork({ setCurrent }) {
  return (
    <div className="page" data-screen-label="HubCowork">
      <div className="hub-sub__nav">
        <button className="link-arrow link-arrow--back" onClick={() => { setCurrent("hub"); window.scrollTo({ top: 0, behavior: "instant" }); }}>
          <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Arrow /></span> Voltar pro Hub
        </button>
      </div>
      <PageHead crumb="06.D · Hub Cowork" title={"Espaço pra editar,\nplanejar, trabalhar."} lead="Coworking criativo dentro do estúdio. Mesa, internet rápida, café decente e gente boa por perto. Diária, mensal ou pacote por turno." accent="trabalhar" meta="12 mesas · 2 salas · Acesso 24/7" compact />

      <section className="section">
        <SectionHead num="01" eyebrow="O espaço" title="Como é o cowork." />
        <div className="hub-studio-gallery">
          <Cine src="/assets/hub/cow-01.jpg" alt="Mesas compartilhadas do cowork MUV em uso" label="MESAS COMPARTILHADAS" code="COW.01" aspect="16/9" variant="accent" />
          <Cine src="/assets/hub/cow-02.jpg" alt="Sala de reunião do cowork MUV" label="SALA DE REUNIÃO" code="COW.02" aspect="4/3" />
          <Cine src="/assets/hub/cow-03.jpg" alt="Área de convivência do cowork MUV" label="LOUNGE & CAFÉ" code="COW.03" aspect="4/3" variant="dark" />
        </div>
      </section>

      <section className="section section--ink">
        <SectionHead num="02" eyebrow="O que tá incluso" title="Sem letra miúda." />
        <div className="hub-specs">
          {COWORK_BENEFITS.map((b, i) =>
            <div key={i} className="hub-specs__row">
              <span className="mono hub-specs__label">// {b.label}</span>
              <span className="hub-specs__value">{b.value}</span>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <SectionHead num="03" eyebrow="Planos" title="Conforme você usa." />
        <div className="grid-3 hub-plans">
          {[
            { n: "01", t: "Day pass", d: "Um dia, sem compromisso. Mesa, café, internet, acesso ao lounge.", price: "R$ 80 / dia" },
            { n: "02", t: "Mensal flex", d: "10 diárias no mês pra usar quando precisar. Salas de reunião por demanda.", price: "R$ 580 / mês" },
            { n: "03", t: "Mensal fixo", d: "Mesa garantida, acesso 24/7, locker individual, 8h grátis em salas.", price: "R$ 980 / mês" }
          ].map((p) =>
            <div key={p.n} className="hub-plan-card">
              <p className="mono" style={{ color: "var(--accent)" }}>// {p.n}</p>
              <h3 className="h3" style={{ marginTop: 16 }}>{p.t}</h3>
              <p style={{ color: "var(--ink-2)", marginTop: 8 }}>{p.d}</p>
              <p className="hub-plan-card__price">{p.price}</p>
            </div>
          )}
        </div>
      </section>

      <HubEmailCapture
        eyebrow="Novidades do cowork"
        title="Day pass e planos"
        accent="assim que abrirem."
        body="Cadastre seu e-mail para receber a abertura da agenda, condições dos planos e convites para conhecer o espaço."
        source="Cowork"
      />
    </div>);
}

function Module({ tag, title, items, icon, onClick }) {
  const clickable = typeof onClick === "function";
  return (
    <div
      className={`module ${clickable ? "module--link" : ""}`}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={clickable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }} : undefined}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="module__icon">{icon}</div>
        <span className="pill pill--accent" style={{ background: "transparent", borderColor: "rgba(222,78,43,0.4)" }}>{tag}</span>
      </div>
      <h3 className="module__title">{title}</h3>
      <ul className="module__features">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
      {clickable && <span className="module__cta">Ver módulo <Arrow /></span>}
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// BLOG
// ═════════════════════════════════════════════════════════════════════════════
function BlogNewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const submit = async (event) => {
    event.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      await postToNetlify("newsletter", { email });
      trackAnalytics("sign_up", {
        method: "newsletter",
        signup_source: "blog",
      });
      setEmail("");
      setStatus("sent");
    } catch (_) {
      setStatus("error");
    }
  };

  return (
    <div className="blog-newsletter__capture">
      <form className="blog-newsletter__form" onSubmit={submit}>
        <label className="sr-only" htmlFor="blog-newsletter-email">Seu e-mail</label>
        <input
          id="blog-newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : "Assinar"} {status !== "sending" && <Arrow />}
        </button>
      </form>
      {status === "sent" && <p className="blog-newsletter__feedback" role="status">Pronto. Você está na lista.</p>}
      {status === "error" && <p className="blog-newsletter__feedback blog-newsletter__feedback--error" role="alert">Não conseguimos inscrever agora. Tente novamente em instantes.</p>}
    </div>
  );
}

function Blog({ setCurrent, slug = null }) {
  const router = useRouter();
  const [visiblePosts, setVisiblePosts] = useState(3);
  const selected = slug ? POSTS.findIndex((p) => p.slug === slug) : null;
  const openList = () => router.push("/blog/");
  const openPost = (p) => router.push(postHref(p.slug));

  if (selected !== null && selected >= 0) {
    const post = POSTS[selected];
    return (
      <div className="page" data-screen-label="BlogPost">
        <article className="post-detail">
          <div className="post-detail__nav">
            <a className="link-arrow link-arrow--back" href="/blog/" onClick={(e) => {e.preventDefault();openList();}}>
              <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Arrow /></span> Todos os textos
            </a>
          </div>
          <header className="post-detail__head">
            <div className="post-detail__meta">
              <span className="pill pill--accent">{post.category}</span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>{post.date} · {post.read}</span>
            </div>
            <h1 className="post-detail__title">{post.title}</h1>
            <p className="body-l post-detail__lead">{post.excerpt}</p>
            <div className="post-detail__byline">
              <span>Por Grupo MUV · Equipe editorial</span>
              <span>Prática de produção audiovisual em São Paulo</span>
            </div>
          </header>
          <div className="post-detail__hero">
            <Cine src={post.cover} hideLabel={Boolean(post.cover)} alt={post.coverAlt || post.title} label={post.title.toUpperCase()} code={`POST.${String(selected + 1).padStart(2, "0")}`} aspect="16/9" variant={selected % 3 === 0 ? "accent" : selected % 3 === 1 ? "dark" : "default"} />
          </div>
          <nav className="post-detail__toc" aria-label="Neste artigo">
            <p className="eyebrow eyebrow-dot">Neste artigo</p>
            <ol>
              {post.body.map((b, i) => b.h ? <li key={i}><a href={`#secao-${i}`}>{b.h}</a></li> : null)}
            </ol>
          </nav>
          <div className="post-detail__body">
            {post.body.map((b, i) =>
              b.h ?
                <h2 key={i} id={`secao-${i}`} className="post-detail__h2">{b.h}</h2> :
                <p key={i} className="post-detail__p">{b.p}</p>
            )}
          </div>
          <footer className="post-detail__footer">
            <p className="eyebrow eyebrow-dot">Próximo passo</p>
            <h3 className="h2" style={{ marginTop: 16 }}>Próximo projeto que pede esse tipo de operação?</h3>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn--ink" href={ROUTES.contato} onClick={(e) => {if (isModifiedClick(e)) return;e.preventDefault();setCurrent("contato");}}>Falar com a gente <Arrow /></a>
              <a className="btn btn--ghost" href="/blog/" onClick={(e) => {e.preventDefault();openList();}}>Ver outros textos</a>
            </div>
          </footer>
        </article>
      </div>);
  }

  const feat = POSTS[0];
  const rest = POSTS.slice(1);
  const visibleRest = rest.slice(0, visiblePosts);
  const hasMorePosts = visiblePosts < rest.length;
  return (
    <div className="page" data-screen-label="Blog">
      <PageHead crumb="05 · Diário MUV" title="Conteúdo sobre conteúdo." lead="Bastidores, ensaios, frameworks. O que a gente aprende produzindo, a gente compartilha por escrito." accent="conteúdo" meta={`${POSTS.length} textos · Atualizado mensal`} />

      {/* DESTAQUE */}
      <section className="section blog-feature">
        <div className="blog-feature__head">
          <p className="eyebrow eyebrow-dot">Em destaque</p>
          <p className="mono" style={{ color: "var(--ink-3)" }}>// FEAT.01</p>
        </div>
        <div className="blog-feature__grid">
          <div className="blog-feature__media">
            <Cine src={feat.cover} hideLabel={Boolean(feat.cover)} alt={feat.coverAlt || feat.title} label={feat.title.toUpperCase()} code="POST.FEAT" aspect="16/9" variant="accent" />
          </div>
          <div className="blog-feature__body">
            <div className="blog-feature__meta">
              <span className="pill pill--accent">{feat.category}</span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>{feat.date} · {feat.read}</span>
            </div>
            <h2 className="blog-feature__title">{feat.title}</h2>
            <p className="body-l blog-feature__excerpt">{feat.excerpt}</p>
            <button className="btn btn--ink" onClick={() => openPost(POSTS[0])}>Ler texto completo <Arrow /></button>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="section blog-list">
        <div className="blog-list__head">
          <p className="eyebrow eyebrow-dot">Todos os textos</p>
          <p className="mono" style={{ color: "var(--ink-3)" }}>{rest.length} publicações</p>
        </div>
        <div className="blog-list__rows">
          {visibleRest.map((p, i) =>
          <a
            key={i}
            className="blog-row blog-row--link"
            href={postHref(p.slug)}
            onClick={(e) => { if (isModifiedClick(e)) return; e.preventDefault(); openPost(p); }}>
              <div className="blog-row__num">{String(i + 2).padStart(2, "0")}</div>
              <div className="blog-row__cat"><span className="pill">{p.category}</span></div>
              <h3 className="blog-row__title">{p.title}</h3>
              <div className="blog-row__meta">
                <p className="mono">{p.date}</p>
                <p className="mono">{p.read}</p>
              </div>
              <div className="blog-row__cta">
                <span className="link-arrow">Ler <Arrow /></span>
              </div>
            </a>
          )}
        </div>
        {hasMorePosts && (
          <div className="blog-list__more">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setVisiblePosts((count) => Math.min(count + 3, rest.length))}>
              Ver outras matérias <Arrow />
            </button>
          </div>
        )}
      </section>

      {/* NEWSLETTER */}
      <section className="section section--dark blog-newsletter">
        <div className="blog-newsletter__inner">
          <div>
            <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Newsletter</p>
            <h2 className="blog-newsletter__title">Recebe os textos no e-mail.</h2>
            <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 16, maxWidth: 420 }}>1 texto por mês. Sem spam. Cancela quando quiser.</p>
          </div>
          <BlogNewsletterForm />
        </div>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// CONTATO
// ═════════════════════════════════════════════════════════════════════════════
function Contato({ setCurrent }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: "", company: "", email: "", phone: "", scope: [], budget: "", deadline: "", brief: "" });
  const SCOPES = ["Brand Film", "Campanha", "Cobertura de Evento", "Conteúdo Social", "Documentário", "Showreel"];
  const BUDGETS = ["< R$30k", "R$30k – 80k", "R$80k – 200k", "+ R$200k"];

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const submit = async () => {
    if (!consent) {setError("Confirme o aceite da política de privacidade para enviar.");return;}
    setSending(true);setError("");
    try {
      await postToNetlify("orcamento", { ...data, scope: data.scope.join(", "), origem: "Página Contato · briefing guiado", "aceite-privacidade": `sim · ${new Date().toISOString()}` });
      trackAnalytics("generate_lead", {
        form_name: "orcamento_contato",
        project_scope: data.scope.join("|") || "nao_informado",
        budget_range: data.budget || "nao_informado",
      });
      setStep(4);
    } catch (err) {
      setError("Não conseguimos enviar agora. Tenta de novo ou chama no WhatsApp: wa.me/message/D6LG7EUSTIR7C1");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page" data-screen-label="Contato">
      <PageHead crumb="06 · Contato" title="A gente lê todo briefing." lead="Conta o que você quer fazer. A gente volta com diagnóstico, próximo passo e timeline. Sem proposta genérica." accent="briefing" meta="Briefing · Diagnóstico · Escopo" />

      <section className="section">
        <div className="contact-layout">
          {/* Sidebar */}
          <aside className="contact-sidebar">
            <p className="eyebrow eyebrow-dot">Direto</p>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <li><a className="link-arrow" href="mailto:contato@grupomuv.com.br">contato@grupomuv.com.br <Arrow /></a></li>
              <li><a className="link-arrow" href="tel:+5511991087786">+55 11 99108-7786 <Arrow /></a></li>
              <li><a className="link-arrow" href="https://wa.me/message/D6LG7EUSTIR7C1" target="_blank" rel="noopener noreferrer">WhatsApp <ArrowDiag /></a></li>
            </ul>

            <p className="eyebrow eyebrow-dot" style={{ marginTop: 48 }}>Estúdio</p>
            <p style={{ marginTop: 16, color: "var(--ink-2)", lineHeight: 1.6 }}>
              Alameda Santos, 211 · Sala 1507<br />
              Edif. Paulista Boulevard · São Paulo<br />
              SP · 01419-000
            </p>

            <p className="eyebrow eyebrow-dot" style={{ marginTop: 48 }}>Horário</p>
            <p style={{ marginTop: 16, color: "var(--ink-2)" }}>Seg–Sex · 10h–19h<br />Em dia de set: agenda 24/7</p>

            <p className="eyebrow eyebrow-dot" style={{ marginTop: 48 }}>Social</p>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><a className="link-arrow" href="https://instagram.com/grupomuv" target="_blank" rel="noopener noreferrer">Instagram <ArrowDiag size={10} /></a></li>
              <li><a className="link-arrow" href="https://wa.me/message/D6LG7EUSTIR7C1" target="_blank" rel="noopener noreferrer">WhatsApp <ArrowDiag size={10} /></a></li>
            </ul>
          </aside>

          {/* Form */}
          <div className="contact-form">
            <div className="contact-progress">
              {[1, 2, 3].map((n) =>
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, opacity: step >= n ? 1 : 0.4 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${step >= n ? "var(--accent-text)" : "var(--line)"}`, background: step > n ? "var(--accent-text)" : "transparent", color: step > n ? "#fff" : step === n ? "var(--accent-text)" : "var(--ink-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                    {step > n ? "✓" : n}
                  </span>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>{n === 1 ? "Você" : n === 2 ? "Projeto" : "Briefing"}</span>
                </div>
              )}
            </div>

            {step === 1 &&
            <div className="contact-fields-grid">
                <div className="field"><label htmlFor="contact-name">Seu nome</label><input id="contact-name" name="name" autoComplete="name" required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} /></div>
                <div className="field"><label htmlFor="contact-company">Marca / Empresa</label><input id="contact-company" name="company" autoComplete="organization" value={data.company} onChange={(e) => setData({ ...data, company: e.target.value })} /></div>
                <div className="field"><label htmlFor="contact-email">E-mail</label><input id="contact-email" name="email" type="email" autoComplete="email" required value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} /></div>
                <div className="field"><label htmlFor="contact-phone">Telefone</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} /></div>
                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                  <button className="btn btn--primary" onClick={() => setStep(2)} disabled={!data.name || !data.email}>Próximo <Arrow /></button>
                </div>
              </div>
            }

            {step === 2 &&
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <p className="eyebrow eyebrow-dot">O que você precisa? (Pode marcar mais de um)</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                    {SCOPES.map((s) =>
                  <button
                    key={s}
                    type="button"
                    className={`pill ${data.scope.includes(s) ? "pill--accent" : ""}`}
                    aria-pressed={data.scope.includes(s)}
                    style={{ cursor: "pointer", background: data.scope.includes(s) ? undefined : "transparent" }}
                    onClick={() => setData({ ...data, scope: data.scope.includes(s) ? data.scope.filter((x) => x !== s) : [...data.scope, s] })}>
                    
                        {s}
                      </button>
                  )}
                  </div>
                </div>
                <div>
                  <p className="eyebrow eyebrow-dot">Faixa de investimento</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                    {BUDGETS.map((b) =>
                  <button key={b} type="button" className={`pill ${data.budget === b ? "pill--accent" : ""}`} aria-pressed={data.budget === b} style={{ cursor: "pointer", background: data.budget === b ? undefined : "transparent" }} onClick={() => setData({ ...data, budget: b })}>{b}</button>
                  )}
                  </div>
                </div>
                <div className="field" style={{ maxWidth: 360 }}>
                  <label htmlFor="contact-deadline">Prazo desejado</label>
                  <input id="contact-deadline" name="deadline" type="text" placeholder="Ex: até 30 dias" value={data.deadline} onChange={(e) => setData({ ...data, deadline: e.target.value })} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button className="btn btn--ghost" onClick={() => setStep(1)}>← Voltar</button>
                  <button className="btn btn--primary" onClick={() => setStep(3)} disabled={!data.scope.length}>Próximo <Arrow /></button>
                </div>
              </div>
            }

            {step === 3 &&
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div className="field">
                  <label htmlFor="contact-brief">Conta um pouco sobre o projeto</label>
                  <textarea
                  id="contact-brief"
                  name="brief"
                  placeholder="O que você quer comunicar? Pra quem? Qual o sonho? Quanto mais específico, melhor."
                  value={data.brief}
                  onChange={(e) => setData({ ...data, brief: e.target.value })} />
                
                </div>
                <label className="quote-card__consent" htmlFor="contact-consent">
                  <input id="contact-consent" name="privacy-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>Autorizo o Grupo MUV a usar meus dados para responder este briefing, conforme a <a href="/politica-privacidade.html" target="_blank" rel="noopener noreferrer">política de privacidade</a>.</span>
                </label>
                {error && <p className="quote-card__error" role="alert">{error}</p>}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button className="btn btn--ghost" onClick={() => setStep(2)}>← Voltar</button>
                  <button className="btn btn--primary" onClick={submit} disabled={!data.brief.trim() || sending}>{sending ? "Enviando…" : "Enviar briefing"} {!sending && <Arrow />}</button>
                </div>
              </div>
            }

            {step === 4 &&
            <div style={{ padding: "64px 0" }}>
                <p className="eyebrow eyebrow-dot" style={{ color: "var(--accent)" }}>Recebido</p>
                <h2 className="h1" style={{ marginTop: 24 }}>Obrigado, {data.name.split(" ")[0] || "parceiro"}.</h2>
                <p className="body-l" style={{ color: "var(--ink-2)", marginTop: 24, maxWidth: 540 }}>
                  A gente vai ler com atenção e volta com diagnóstico, próximo passo e timeline.
                  Enquanto isso, dá uma olhada nos cases mais recentes.
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
                  <button className="btn btn--ink" onClick={() => setCurrent("trabalhos")}>Ver portfolio <Arrow /></button>
                  <button className="btn btn--ghost" onClick={() => {setStep(1);setData({ name: "", company: "", email: "", phone: "", scope: [], budget: "", deadline: "", brief: "" });}}>Novo briefing</button>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// FAQ
// ═════════════════════════════════════════════════════════════════════════════
function Faq({ setCurrent }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="page" data-screen-label="FAQ">
      <PageHead crumb="07 · FAQ" title="Perguntas que clientes fazem antes de fechar." lead="Prazos, orçamento, equipamento, direitos, NF. Respostas diretas, sem rodeio. Se sua dúvida não tá aqui, manda mensagem no WhatsApp no rodapé." accent="fechar" meta={`${FAQ_ITEMS.length} perguntas · Atualizado 2026`} />

      <section className="section faq-section">
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
                <button
                  type="button"
                  className="faq-item__head"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="faq-item__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="faq-item__cat">
                    <span className="pill">{item.cat}</span>
                  </span>
                  <span className="faq-item__q">{item.q}</span>
                  <span className="faq-item__chev" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-item__body">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section section--ink faq-cta">
        <div className="faq-cta__inner">
          <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Não achou sua dúvida?</p>
          <h2 className="h1" style={{ marginTop: 24, color: "var(--dark-ink)" }}>
            A gente responde<br />no <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>mesmo dia útil.</span>
          </h2>
          <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 24, maxWidth: 540 }}>
            Provavelmente sua dúvida tá no nível mais específico, orçamento de um projeto real, equipamento pra uma necessidade exata, alinhamento de prazo apertado. Esse tipo de coisa a gente resolve em conversa.
          </p>
          <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn btn--primary" href="https://wa.me/message/D6LG7EUSTIR7C1" target="_blank" rel="noopener noreferrer">WhatsApp <Arrow /></a>
            <button className="btn btn--ghost-dark" onClick={() => setCurrent("contato")}>Briefing completo <Arrow /></button>
          </div>
        </div>
      </section>
    </div>);

}

// ───── Export ────────────────────────────────────────────────────────────────
// (o Object.assign(window, ...) legado do unify.py foi removido: quebrava o
//  pré-render no servidor, que é justamente o que faz o Google enxergar o site)

// ===== app =====
// app.jsx — Grupo MUV site (production)
// Tweaks baked in: Archivo Black display · Inter body · orange accent · regular density.

const DISPLAY_FONT = `"Archivo Black", "Arial Black", sans-serif`;
const BODY_FONT    = `"Inter", Arial, sans-serif`;

const DARK_NAV_PAGES = new Set(["hub"]);

function HomeLive({ tina, setCurrent }) {
  const home     = useTina(tina.home).data.home;
  const services = useTina(tina.services).data.services;
  const process  = useTina(tina.process).data.process;
  const works    = useTina(tina.works).data.works;
  const posts    = useTina(tina.posts).data.posts;
  const brands   = useTina(tina.brands).data.brands;
  const marquee  = useTina(tina.marquee).data.marquee;
  return <Home setCurrent={setCurrent} density="regular" content={{ home, services, process, works, posts, brands, marquee }} />;
}

function SiteProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    const update = () => {
      if (!barRef.current) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <span className="site-progress" ref={barRef} aria-hidden="true" />;
}

function MotionController({ pageKey }) {
  useEffect(() => {
    const root = document.documentElement;
    const main = document.getElementById("main-content");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealNodes = Array.from(document.querySelectorAll(
      ".page-head, .page > .section, .hero-stats, .home-capabilities, .home-cta, .home-hub, .case-detail__head, .post-detail__head"
    ));
    // A seção conduz a entrada. Cards e controles permanecem estáveis para
    // preservar leitura, leveza e previsibilidade durante a rolagem.
    const staggerNodes = [];

    revealNodes.forEach((node) => node.setAttribute("data-muv-reveal", ""));
    staggerNodes.forEach((node, index) => {
      node.setAttribute("data-muv-reveal", "");
      node.style.setProperty("--muv-reveal-index", String(index % 6));
    });

    if (main && !reduced) {
      main.classList.remove("muv-page-enter");
      window.requestAnimationFrame(() => main.classList.add("muv-page-enter"));
    }
    root.classList.add("muv-motion-ready");
    if (reduced || !("IntersectionObserver" in window)) {
      revealNodes.concat(staggerNodes).forEach((node) => node.classList.add("is-inview"));
      return () => main?.classList.remove("muv-page-enter");
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

    revealNodes.concat(staggerNodes).forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      main?.classList.remove("muv-page-enter");
    };
  }, [pageKey]);

  return null;
}

function App({ page = "home", slug = null, tina = null }) {
  const current = page;
  const router = useRouter();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  // Navegação = mudança de URL de verdade (histórico, compartilhável, indexável)
  const setCurrent = (id) => {
    router.push(ROUTES[id] || "/");
  };

  // Bake design tokens into :root once
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-density", "regular");
    root.style.setProperty("--font-display", DISPLAY_FONT);
    root.style.setProperty("--font-body",    BODY_FONT);
    root.style.setProperty("--accent",       SETTINGS.accentColor  || "#F04A24");
    root.style.setProperty("--accent-2",     SETTINGS.accent2Color || "#2457D6");
  }, []);

  // Detect scroll past hero on Home for dynamic nav theming
  useEffect(() => {
    if (current !== "home") { setScrolledPastHero(true); return; }
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [current]);

  const isDark = DARK_NAV_PAGES.has(current) || (current === "home" && !scrolledPastHero);

  let Page = Home;
  const _navKey = NAV_OFF[current] || (String(current).startsWith("hub") ? "navHub" : null);
  if (_navKey && SETTINGS[_navKey] === false) Page = Home;
  else if (current === "servicos")  Page = Servicos;
  else if (current === "processo")  Page = Processo;
  else if (current === "trabalhos") Page = Trabalhos;
  else if (current === "sobre")     Page = Sobre;
  else if (current === "hub")             Page = MuvHub;
  else if (current === "hub-locadora")    Page = HubLocadora;
  else if (current === "hub-studio")      Page = HubStudio;
  else if (current === "hub-comunidade")  Page = HubComunidade;
  else if (current === "hub-cowork")      Page = HubCowork;
  else if (current === "blog")            Page = Blog;
  else if (current === "faq")             Page = Faq;
  else if (current === "contato")         Page = Contato;

  return (
    <React.Fragment>
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <SiteProgress />
      <MotionController pageKey={`${current}:${slug || ""}`} />
      <Nav current={current} setCurrent={setCurrent} isDark={isDark} />
      <main id="main-content" tabIndex="-1">
        {current === "home" && tina
          ? <HomeLive tina={tina} setCurrent={setCurrent} />
          : <Page setCurrent={setCurrent} density="regular" slug={slug} />}
      </main>
      <Footer setCurrent={setCurrent} />
    </React.Fragment>
  );
}



export default App;
