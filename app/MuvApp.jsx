"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

// ───── Cinematic placeholder ─────────────────────────────────────────────────
function Cine({ label = "PLACEHOLDER", aspect = "16/9", code = "001", variant = "default", play = false, center, style, className = "" }) {
  const variantClass = variant === "dark" ? "cine--dark" : variant === "accent" ? "cine--accent" : "";
  return (
    <div
      className={`cine ${variantClass} ${className}`}
      style={{ aspectRatio: aspect, ...style, fontSize: "10px", width: "100%" }}>
      
      <span className="cine__corner" style={{ position: "absolute", top: 16, left: 16 }}>// {code}</span>
      <span className="cine__corner" style={{ position: "absolute", top: 16, right: 16 }}>{aspect.replace("/", ":")}</span>
      {play ?
      <div className="cine__play">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </div> :
      center ?
      <span className="cine__center">{center}</span> :
      null}
      <span className="cine__label">{label}</span>
      <span className="cine__corner">REC ●</span>
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


// Header e Drawer escondem itens marcados hideFromHeader (ex: FAQ vai só no Footer)
const HEADER_ITEMS = NAV_ITEMS.filter((n) => !n.hideFromHeader);
const DRAWER_ITEMS = HEADER_ITEMS.filter((n) => n.id !== "home");
// Só entram redes com URL real: href="#" lê como "empresa desativada".
const DRAWER_SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/grupomuv" },
  { label: "WhatsApp", href: "https://wa.me/message/D6LG7EUSTIR7C1" }];


function Nav({ current, setCurrent, isDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const firstLinkRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("drawer-active");
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    const focusTimer = setTimeout(() => {
      if (firstLinkRef.current) firstLinkRef.current.focus();
    }, 350);
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove("drawer-active");
      window.removeEventListener("keydown", onKey);
      clearTimeout(focusTimer);
    };
  }, [menuOpen]);

  const go = (id) => { setMenuOpen(false); setCurrent(id); };

  return (
    <React.Fragment>
      <nav className={`nav ${isDark ? "nav--dark" : ""} ${menuOpen ? "nav--open" : ""}`}>
        <a className="nav__logo" onClick={(e) => {e.preventDefault();setCurrent("home");}} href="/" aria-label="Grupo MUV — ir para home">
          <img
            src={isDark ? "/assets/logo-muv-branco.png" : "/assets/logo-horizontal-preto.png"}
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
              onClick={(e) => {e.preventDefault();setCurrent(n.id);}}>
                {n.label}
              </a>
            </li>
          )}
        </ul>
        <a href={ROUTES.contato} className={`btn ${isDark ? "btn--ghost-dark" : "btn--ink"} nav__cta`} onClick={(e) => {e.preventDefault();setCurrent("contato");}}>
          Falar com a gente <Arrow />
        </a>
        <button
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
                onClick={(e) => {e.preventDefault();go(n.id);}}>
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
  const go = (id) => (e) => {e.preventDefault();setCurrent(id);};
  return (
    <footer className="footer">
      <div className="footer__giant">GRUPO MUV.</div>
      <div className="footer__grid">
        <div>
          <p className="footer__col-title">/ ECOSSISTEMA</p>
          <p style={{ maxWidth: 340, color: "var(--dark-ink-2)", lineHeight: 1.5, marginBottom: 24 }}>
            Produtora audiovisual e hub criativo. Estratégia, produção e conteúdo. <span style={{ color: "var(--dark-ink)" }}>São Paulo, Brasil.</span>
          </p>
          <a className="btn btn--primary" href={ROUTES.contato} onClick={go("contato")}>
            Começar um projeto <Arrow />
          </a>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">Navegação</p>
          <ul>
            {NAV_ITEMS.slice(1).filter((n) => !n.hideFromFooter).map((n) =>
            <li key={n.id}><a href={ROUTES[n.id]} onClick={go(n.id)}>{n.label} <ArrowDiag size={10} /></a></li>
            )}
            <li><a href={ROUTES.contato} onClick={go("contato")}>Contato <ArrowDiag size={10} /></a></li>
          </ul>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">MUV Hub</p>
          <ul>
            <li><a href={ROUTES["hub"]} onClick={go("hub")}>Overview <ArrowDiag size={10} /></a></li>
            <li><a href={ROUTES["hub-locadora"]} onClick={go("hub-locadora")}>Locadora <ArrowDiag size={10} /></a></li>
            <li><a href={ROUTES["hub-studio"]} onClick={go("hub-studio")}>Studio <ArrowDiag size={10} /></a></li>
            <li><a href={ROUTES["hub-comunidade"]} onClick={go("hub-comunidade")}>Comunidade <ArrowDiag size={10} /></a></li>
            <li><a href={ROUTES["hub-cowork"]} onClick={go("hub-cowork")}>Cowork <ArrowDiag size={10} /></a></li>
          </ul>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">Social</p>
          <ul>
            <li><a href="https://instagram.com/grupomuv" target="_blank" rel="noopener noreferrer">Instagram <ArrowDiag size={10} /></a></li>
            <li><a href="https://wa.me/message/D6LG7EUSTIR7C1" target="_blank" rel="noopener noreferrer">WhatsApp <ArrowDiag size={10} /></a></li>
            <li><a href="mailto:contato@grupomuv.com.br">E-mail <ArrowDiag size={10} /></a></li>
            <li><a href="/politica-privacidade.html">Privacidade <ArrowDiag size={10} /></a></li>
            <li><a href="/termos-de-uso.html">Termos de uso <ArrowDiag size={10} /></a></li>
          </ul>
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
  return (
    <div className={`brand-marquee ${dark ? "brand-marquee--dark" : ""}`}>
      <div className="brand-marquee__track">
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
function SectionHead({ eyebrow, title, sub, num }) {
  return (
    <div className="section-head">
      <div>
        {num && <p className="mono" style={{ color: "var(--ink-3)", marginBottom: 12 }}>// {num}</p>}
        <p className="eyebrow eyebrow-dot">{eyebrow}</p>
      </div>
      <div>
        <h2 className="h1 section-head__title" style={{ margin: 0 }}>{title}</h2>
        {sub && <p className="body-l section-head__sub" style={{ maxWidth: 640, marginTop: 24 }}>{sub}</p>}
      </div>
    </div>);

}

// ───── Page Head ─────────────────────────────────────────────────────────────
function PageHead({ crumb, title, lead, accent, meta, compact }) {
  // Suporta quebra de linha via "\n" no título, mantendo a destaque do accent.
  const renderLineWithAccent = (line, key) => {
    if (!accent || !line.includes(accent)) return <span key={key}>{line}</span>;
    const [before, after] = line.split(accent);
    return (
      <span key={key}>
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
        <h1 className={`page-head__title ${compact ? "page-head__title--compact" : ""}`}>{titleNode}</h1>
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
// ───── Showreel BG, placeholder cinematográfico com cenas em loop ───────────
const SHOWREEL_SCENES = [
{ label: "INT. SET · MARCA DE MODA", code: "01/06", grad: "radial-gradient(ellipse at 35% 60%, rgba(222,78,43,0.55), transparent 55%), radial-gradient(ellipse at 75% 30%, rgba(27,87,173,0.25), transparent 60%), linear-gradient(135deg, #2a1410 0%, #1B1B1F 60%, #0d0d12 100%)" },
{ label: "EXT. NOITE · FESTIVAL", code: "02/06", grad: "radial-gradient(ellipse at 20% 30%, rgba(27,87,173,0.55), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(222,78,43,0.3), transparent 50%), linear-gradient(225deg, #0e1a2a 0%, #1B1B1F 55%, #0d0d12 100%)" },
{ label: "CLOSE · EQUIPAMENTO", code: "03/06", grad: "radial-gradient(ellipse at 60% 50%, rgba(245,240,235,0.18), transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(222,78,43,0.4), transparent 55%), linear-gradient(180deg, #221b18 0%, #1B1B1F 50%, #0d0d12 100%)" },
{ label: "DRONE · CIDADE", code: "04/06", grad: "radial-gradient(ellipse at 50% 30%, rgba(222,78,43,0.42), transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(27,87,173,0.4), transparent 55%), linear-gradient(160deg, #1a1410 0%, #181c28 70%, #0d0d12 100%)" },
{ label: "STUDIO · CICLORAMA", code: "05/06", grad: "radial-gradient(ellipse at 50% 60%, rgba(245,240,235,0.22), transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(222,78,43,0.35), transparent 55%), linear-gradient(200deg, #1b1814 0%, #1B1B1F 60%, #0d0d12 100%)" },
{ label: "INT. CLIENTE · BRIEFING", code: "06/06", grad: "radial-gradient(ellipse at 70% 40%, rgba(27,87,173,0.45), transparent 55%), radial-gradient(ellipse at 25% 70%, rgba(222,78,43,0.35), transparent 55%), linear-gradient(140deg, #14182a 0%, #1B1B1F 60%, #0d0d12 100%)" }];


function ShowreelBG() {
  const [scene, setScene] = useState(0);
  const [tc, setTc] = useState({ m: 0, s: 0, f: 0 });
  useEffect(() => {
    const id = setInterval(() => setScene((s) => (s + 1) % SHOWREEL_SCENES.length), 4200);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setTc((t) => {
        let f = t.f + 1;
        let s = t.s,m = t.m;
        if (f >= 24) {f = 0;s += 1;}
        if (s >= 60) {s = 0;m += 1;}
        if (m >= 99) m = 0;
        return { m, s, f };
      });
    }, 41); // ~24fps
    return () => clearInterval(id);
  }, []);
  const pad = (n, w = 2) => String(n).padStart(w, "0");

  return (
    <div className="showreel">
      {SHOWREEL_SCENES.map((sc, i) =>
      <div key={i} className={`showreel__scene ${i === scene ? "is-on" : ""}`} style={{ background: sc.grad }} />
      )}
      <div className="showreel__bars" />
      <div className="showreel__grain" />
      <div className="showreel__vignette" />
      <div className="showreel__scanlines" />

      {/* HUD */}
      <div className="showreel__hud showreel__hud--tl">
        <span className="showreel__rec"><span className="showreel__rec-dot" /> REC</span>
        <span className="showreel__hud-text">SHOWREEL · MUV · 2026</span>
      </div>
      <div className="showreel__hud showreel__hud--tr">
        <span className="showreel__hud-text">TC {pad(tc.m)}:{pad(tc.s)}:{pad(tc.f)}</span>
        <span className="showreel__hud-text">{SHOWREEL_SCENES[scene].code}</span>
      </div>
      <div className="showreel__hud showreel__hud--bl">
        <span className="showreel__hud-text">{SHOWREEL_SCENES[scene].label}</span>
      </div>
      <div className="showreel__hud showreel__hud--br">
        <span className="showreel__hud-text">SONY FX6 · 4K · 24P</span>
      </div>

      {/* Timeline scrubber */}
      <div className="showreel__timeline">
        <div className="showreel__timeline-fill" style={{ width: `${(scene + 1) / SHOWREEL_SCENES.length * 100}%` }} />
        {SHOWREEL_SCENES.map((_, i) =>
        <span key={i} className="showreel__timeline-mark" style={{ left: `${i / SHOWREEL_SCENES.length * 100}%` }} />
        )}
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

// ═════════════════════════════════════════════════════════════════════════════
// HOME
// ═════════════════════════════════════════════════════════════════════════════
function Home({ setCurrent, density }) {
  const router = useRouter();
  const heroRef = useRef(null);
  const [intro, setIntro] = useState("boot"); // boot → open → title → done

  // Letterbox intro timeline
  useEffect(() => {
    const t1 = setTimeout(() => setIntro("open"), 900); // bars start retracting
    const t2 = setTimeout(() => setIntro("title"), 2000); // headline + meta reveal
    const t3 = setTimeout(() => setIntro("done"), 3600); // everything settled
    return () => {clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  }, []);

  // Hero responde ao SCROLL apenas. (O auto-fade por tempo foi removido:
  // apagava a headline e os CTAs 8s depois do load, mesmo sem o usuário rolar.)
  useEffect(() => {
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
              <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Edição 01 · 2026 · Produtora audiovisual & hub criativo</p>
              <p className="mono" style={{ color: "var(--dark-ink-2)", marginTop: 12 }}>SP · BR · 23.5505° S · 46.6333° W</p>
            </div>
            <p className="mono hero-cine__rec" style={{ color: "var(--dark-ink-2)" }}>REEL 2026, V01 · LIVE</p>
          </div>

          <div className="hero-cine__mid">
            <h1 className="hero-cine__display">
              <span className="reveal-word"><span>Conteúdo</span></span><br />
              <span className="reveal-word"><span style={{ fontFamily: "\"Archivo Black\"", fontStyle: "normal", marginRight: "0.3em" }}>que</span></span>
              <span className="reveal-word"><span className="accent">move.</span></span>
            </h1>
          </div>

          <div className="hero-cine__bottom">
            <p className="hero-cine__sub">
              Produção audiovisual estratégica. Do briefing à entrega, cada frame tem intenção e cada prazo tem compromisso.
            </p>
            <div className="hero-cine__actions">
              <button className="btn btn--primary" onClick={() => setCurrent("contato")}>Começar um projeto <Arrow /></button>
              <button className="btn btn--ghost-dark" onClick={() => setCurrent("trabalhos")}>Ver portfolio <Arrow /></button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="hero-stats">
        <div className="hero-stats__inner">
          <StatCounter prefix="+" target={120} label="Produções entregues" />
          <StatCounter prefix="+" target={30} label="Marcas parceiras" />
          <StatCounter target={7} suffix=" dias" label="Ciclo médio captação, entrega" />
          <StatCounter target={1} pad={2} label="Hub criativo, quatro frentes" accent />
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee items={MARQUEE_WORDS} />

      {/* MANIFESTO */}
      <section className="section" style={{ paddingTop: 41, paddingBottom: 123 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 48, alignItems: "start", fontFamily: "\"Archivo Black\"", fontWeight: "200" }}>
          <div>
            <p className="mono" style={{ color: "var(--ink-3)" }}>// 01</p>
            <p className="eyebrow eyebrow-dot" style={{ marginTop: 12 }}>Manifesto</p>
          </div>
          <p className="manifesto-text manifesto-text--sm" style={{ fontFamily: "\"Archivo Black\"" }}>
            Imagem tem poder quando tem <span style={{ color: "var(--accent)", fontStyle: "normal", fontWeight: 400 }}>direção</span>.<br />
            A gente trabalha na interseção entre <span style={{ color: "var(--accent)", fontStyle: "normal", fontWeight: 400 }}>criatividade</span> e <span className="blue">estratégia</span>,<br />
            porque é lá que o audiovisual gera valor de verdade.
          </p>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="section section--dark" style={{ paddingTop: 112, paddingBottom: 113 }}>
        <SectionHead
          num="02"
          eyebrow="Serviços · 4 pilares"
          title="Estratégia, produção, conteúdo, presença."
          sub="Você não contrata quatro fornecedores. Contrata uma equipe integrada que pensa, produz e entrega com consistência." />
        
        <div className="grid-2">
          {SERVICOS.map((s, i) =>
          <ServiceCardDark key={s.num} {...s} />
          )}
        </div>
        <div style={{ marginTop: 48, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn--ghost-dark" onClick={() => setCurrent("servicos")}>Detalhar serviços <Arrow /></button>
        </div>
      </section>

      {/* PROCESSO (preview clicável) */}
      <section className="section" style={{ paddingTop: 96, paddingBottom: 32 }}>
        <SectionHead
          num="03"
          eyebrow="Processo"
          title={"Da ideia ao master.\nEm seis passos."}
          sub="Sem improviso, sem surpresa no orçamento. Toda etapa tem entregável, prazo e aprovação." />

        <div>
          {PROCESSO.slice(0, 3).map((p) =>
          <StepRow key={p.num} {...p} onClick={() => setCurrent("processo")} linkable />
          )}
          <div className="step"><div className="step__num">···</div><div></div><div></div><div style={{ textAlign: "right" }}><button className="link-arrow" onClick={() => setCurrent("processo")} style={{ background: "transparent", border: 0, padding: 0, font: "inherit" }}>Ver processo completo <Arrow /></button></div></div>
        </div>
      </section>

      {/* TRABALHOS PREVIEW */}
      <section className="section" style={{ paddingTop: 32, paddingBottom: 96 }}>
        <SectionHead
          num="04"
          eyebrow="Trabalhos selecionados"
          title="Cases recentes."
          sub="Recortes de 2024–25. Marcas, eventos e narrativas que a gente ajudou a contar." />
        
        <div className="grid-3">
          {TRABALHOS.slice(0, 3).map((t, i) => <CaseCard key={i} {...t} idx={i} onClick={() => router.push(caseHref(t.slug))} />)}
        </div>
        <div style={{ marginTop: 48, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn--ghost" onClick={() => setCurrent("trabalhos")}>Ver todos os trabalhos <Arrow /></button>
        </div>
      </section>

      {/* MARCAS, esteira */}
      {SETTINGS.showMarcas !== false && (
      <section className="section section--tight">
        <SectionHead num="05" eyebrow="Confiança" title="Marcas que confiam na gente." />
        <BrandMarquee brands={BRANDS} />
        <p className="mono" style={{ marginTop: 24, color: "var(--ink-3)", textAlign: "center" }}>// + 30 marcas · 2019 → 2026</p>
      </section>
      )}

      {/* MUV HUB TEASER */}
      {SETTINGS.showHub !== false && (
      <section className="section section--ink" style={{ position: "relative", overflow: "hidden", paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>06 · Em breve · 2026</p>
            <h2 className="display" style={{ color: "var(--bg)", marginTop: 24, fontSize: "106px", margin: "24px 0 24px", letterSpacing: "-5px", lineHeight: "1" }}>
              MUV <span style={{ color: "var(--accent)" }}>Hub.</span>
            </h2>
            <p style={{ color: "var(--bg)", fontFamily: "\"Archivo Black\"", fontWeight: "100", fontStyle: "normal", letterSpacing: "-1.9px", fontSize: "52px", lineHeight: "1", margin: "0 0 32px" }}>
              Onde a produção acontece. E onde a comunidade se encontra.
            </p>
            <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 24, maxWidth: 480, fontWeight: "100" }}>
              Locadora de equipamentos, reserva de studio, comunidade criativa e cowork
              num só lugar. Exclusivo pra filmmakers, agências e marcas parceiras.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn--primary" onClick={() => setCurrent("hub")}>Conhecer o Hub <Arrow /></button>
              <button className="btn btn--ghost-dark">Entrar na lista <Arrow /></button>
            </div>
          </div>
          <div className="hub-grid">
            <Cine label="LOCADORA · CATÁLOGO" code="HUB.A" variant="dark" aspect="1/1" />
            <Cine label="STUDIO · CICLORAMA" code="HUB.B" variant="accent" aspect="1/1" />
            <Cine label="COMUNIDADE" code="HUB.C" variant="dark" aspect="1/1" />
            <Cine label="COWORK · ESPAÇO" code="HUB.D" variant="accent" aspect="1/1" />
          </div>
        </div>
      </section>
      )}

      {/* BLOG PREVIEW */}
      {SETTINGS.showBlog !== false && (
      <section className="section home-blog-preview" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <SectionHead num="07" eyebrow="Diário MUV" title="Conteúdo sobre conteúdo." sub="Bastidor, ensaio, frameworks. O que a gente aprende, a gente compartilha." />
        <div>
          {POSTS.slice(0, 3).map((p, i) => <PostRow key={i} {...p} onClick={() => router.push(postHref(p.slug))} />)}
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn--ghost" onClick={() => setCurrent("blog")}>Ver todos os posts <Arrow /></button>
        </div>
      </section>
      )}

      {/* CTA FINAL */}
      <HomeCTA setCurrent={setCurrent} />
    </div>);

}

function HomeCTA({ setCurrent }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", type: "", budget: "", brief: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const types = ["Brand Film", "Campanha publicitária", "Cobertura de evento", "Conteúdo social", "Documentário", "Showreel / institucional", "Outro"];
  const budgets = ["R$ 5–10k", "R$ 10–25k", "R$ 25–50k", "R$ 50–100k", "R$ 100k+", "A definir"];
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.type) return;
    if (!consent) {setError("Confirme o aceite da política de privacidade para enviar.");return;}
    setSending(true);setError("");
    try {
      await postToNetlify("orcamento", { ...form, origem: "Home · CTA final" });
      setSent(true);
    } catch (err) {
      setError("Não conseguimos enviar agora. Tenta de novo ou chama no WhatsApp: wa.me/message/D6LG7EUSTIR7C1");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section section--ink home-cta" style={{ paddingTop: 96, paddingBottom: 128 }}>
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
                    <label>Nome <span style={{ color: "var(--accent)" }}>*</span></label>
                    <input placeholder="Seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="field field--solid">
                    <label>Empresa</label>
                    <input placeholder="Nome da empresa" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  </div>
                </div>

                <div className="quote-card__row">
                  <div className="field field--solid">
                    <label>E-mail <span style={{ color: "var(--accent)" }}>*</span></label>
                    <input type="email" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="field field--solid">
                    <label>Telefone <span style={{ color: "var(--accent)" }}>*</span></label>
                    <input placeholder="(11) 99999-9999" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                </div>

                <div className="field field--solid" style={{ marginBottom: 20 }}>
                  <label>Tipo de projeto <span style={{ color: "var(--accent)" }}>*</span></label>
                  <div className="select-wrap">
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required>
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
                    onClick={() => setForm({ ...form, budget: form.budget === b ? "" : b })}>
                    
                        {b}
                      </button>
                  )}
                  </div>
                </div>

                <div className="field field--solid" style={{ marginBottom: 24 }}>
                  <label>Sobre o projeto</label>
                  <textarea
                  rows="4"
                  placeholder="Descreva o que precisa, prazo e detalhes..."
                  value={form.brief}
                  onChange={(e) => setForm({ ...form, brief: e.target.value })} />
                
                </div>

                <label className="quote-card__consent">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>Autorizo o Grupo MUV a usar meus dados para responder este briefing, conforme a <a href="/politica-privacidade.html" target="_blank" rel="noopener noreferrer">política de privacidade</a>.</span>
                </label>

                <button type="submit" className="btn btn--ink quote-submit" disabled={sending}>
                  {sending ? "ENVIANDO…" : "MANDAR BRIEFING"} {!sending && <Arrow />}
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
          <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 32, maxWidth: 420, fontFamily: "Inter", fontWeight: "200" }}>
            Conta o que você quer fazer. A gente volta com diagnóstico, escopo e timeline. Sem proposta genérica.
          </p>
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
      <h3 className="svc__title" style={{ color: "var(--dark-ink)", fontFamily: "\"Archivo Black\"" }}>{title}</h3>
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
      <h3 className="step__title" style={{ fontFamily: "\"Archivo Black\"" }}>{title}</h3>
      <p className="step__desc">{desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <p className="step__deliverables">{deliverables}</p>
        {linkable && <span className="step__arrow">Ver processo <Arrow /></span>}
      </div>
    </div>);

}

function CaseCard({ title, client, tag, year, idx, variant, onClick }) {
  const variants = ["default", "dark", "accent", "default", "dark", "accent"];
  const v = variant || variants[idx % variants.length];
  return (
    <div className="case" role={onClick ? "link" : undefined} tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();onClick();}} : undefined}>
      <div className="case__media" style={{ fontSize: "10px", width: "100%" }}>
        <Cine label={title.toUpperCase()} code={`CASE.${String(idx + 1).padStart(2, "0")}`} aspect="4/3" variant={v} center={v === "accent" ? "▶ PREVIEW" : null} />
      </div>
      <div className="case__meta">
        <div>
          <p className="case__tag">{client}</p>
          <h3 className="case__title">{title}</h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <p className="case__tag">{tag}</p>
          <p className="case__tag" style={{ marginTop: 4 }}>{year}</p>
        </div>
      </div>
    </div>);

}

function PostRow({ date, title, excerpt, read, onClick }) {
  return (
    <article className="post" role={onClick ? "link" : undefined} tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();onClick();}} : undefined}>
      <div className="post__head">
        <h3 className="post__title">{title}</h3>
        <span className="post__date">{date} · {read}</span>
      </div>
      <p className="post__excerpt">{excerpt}</p>
      <span className="link-arrow" style={{ color: "var(--ink-2)" }}>Ler texto <Arrow /></span>
    </article>);

}

// ═════════════════════════════════════════════════════════════════════════════
// SERVIÇOS
// ═════════════════════════════════════════════════════════════════════════════
function Servicos({ setCurrent }) {
  return (
    <div className="page" data-screen-label="Servicos">
      <PageHead crumb="01 · Serviços" title={"Do conceito à plataforma.\nTudo sob uma direção."} lead="Você não contrata quatro fornecedores. Contrata uma equipe integrada que pensa, produz e entrega com consistência." accent="direção" meta="04 frentes · 01 direção" compact />

      <section className="section">
        <div className="svc-stack">
          {SERVICOS.map((s, i) =>
          <div key={s.num} className="svc-row">
              <div className="svc-row__sidebar">
                <p className="mono svc-row__num">// {s.num}</p>
                <span className="pill pill--accent svc-row__pill">{s.tag}</span>
                <h2 className="svc-row__title">{s.title}</h2>
              </div>
              <div className="svc-row__main">
                <Cine label={s.tag.toUpperCase()} code={`SVC.${s.num}`} aspect="16/10" variant={i % 2 === 0 ? "dark" : "default"} />
                <p className="body-l svc-row__desc">{s.desc}</p>
                <p className="eyebrow eyebrow-dot svc-row__scope-label">O que entra no escopo</p>
                <ul className="svc-row__list">
                  {s.items.map((it, k) =>
                <li key={k}>
                      <span className="svc-row__plus">+</span>{it}
                    </li>
                )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section section--ink" style={{ textAlign: "center" }}>
        <h2 className="display" style={{ fontSize: "clamp(40px, 7vw, 120px)" }}>
          Um briefing.<br />
          <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>Uma equipe.</span>
        </h2>
        <button className="btn btn--primary" style={{ marginTop: 48 }} onClick={() => setCurrent("contato")}>Começar um projeto <Arrow /></button>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// PROCESSO
// ═════════════════════════════════════════════════════════════════════════════
function Processo({ setCurrent }) {
  return (
    <div className="page" data-screen-label="Processo">
      <PageHead crumb="02 · Processo" title="Da ideia ao master." lead="Seis passos. Cada um com entregável, prazo e aprovação. Sem improviso, sem surpresa no orçamento, claro do dia zero." accent="master" meta="06 etapas · Workflow MUV" />

      <section className="section">
        <div>
          {PROCESSO.map((p) => <StepRow key={p.num} {...p} />)}
        </div>
      </section>

      <section className="section section--dark">
        <SectionHead num="*" eyebrow="Como medimos" title="Não medimos só o que fica bonito." sub="Imagem bem fotografada é ponto de partida, não de chegada. A gente mede retenção, adequação de plataforma e consistência com o posicionamento da marca." />
        <div className="grid-3">
          <Metric num="01" label="Direção" desc="Cada decisão estética tem motivo estratégico. Não filmamos por filmar." />
          <Metric num="02" label="Prazo" desc="Cronograma respeitado. Atraso é exceção justificada, nunca padrão." />
          <Metric num="03" label="Retenção" desc="Conteúdo entregue pra plataforma certa, no formato certo, na curva certa." />
        </div>
      </section>

      <section className="section" style={{ textAlign: "center" }}>
        <p className="eyebrow eyebrow-dot" style={{ display: "inline-flex" }}>Próximo passo</p>
        <h2 className="h1" style={{ marginTop: 24 }}>Briefa a gente em 5 minutos.</h2>
        <button className="btn btn--ink" style={{ marginTop: 32 }} onClick={() => setCurrent("contato")}>Mandar briefing <Arrow /></button>
      </section>
    </div>);

}

function Metric({ num, label, desc }) {
  return (
    <div style={{ padding: 32, border: "1px solid var(--dark-line)", display: "flex", flexDirection: "column", gap: 16, minHeight: 240 }}>
      <p className="mono" style={{ color: "var(--accent)" }}>// {num}</p>
      <h3 className="h3" style={{ marginTop: "auto" }}>{label}</h3>
      <p style={{ color: "var(--dark-ink-2)", fontSize: 14 }}>{desc}</p>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// TRABALHOS
// ═════════════════════════════════════════════════════════════════════════════
function Trabalhos({ setCurrent, slug = null }) {
  const router = useRouter();
  const [filter, setFilter] = useState("Todos");
  const filters = ["Todos", "Brand film", "Documentário", "Social", "Cobertura"];
  // O case aberto vem da URL (/trabalhos/<slug>/), não de estado local:
  // link compartilhável, botão voltar do navegador correto e página indexável.
  const selected = slug ? TRABALHOS.findIndex((t) => t.slug === slug) : null;
  const openList = () => router.push("/trabalhos/");
  const openCase = (t) => router.push(caseHref(t.slug));

  if (selected !== null && selected >= 0) {
    const t = TRABALHOS[selected];
    return (
      <div className="page" data-screen-label="CaseDetail">
        <article className="case-detail">
          <div className="case-detail__nav">
            <button className="link-arrow link-arrow--back" onClick={openList}>
              <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Arrow /></span> Todos os cases
            </button>
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
            <Cine label={t.title.toUpperCase().replace(/\n/g, " ")} code={`CASE.${String(selected + 1).padStart(2, "0")}`} aspect="16/9" variant="accent" play />
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
              <div key={i} className="case-detail__block">
                <h2 className="case-detail__h2">{b.h}</h2>
                <p className="case-detail__p">{b.p}</p>
              </div>
            )}
          </div>

          <footer className="case-detail__footer">
            <p className="eyebrow eyebrow-dot">Próximo passo</p>
            <h3 className="h2" style={{ marginTop: 16 }}>Briefing parecido no seu radar?</h3>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn--ink" onClick={() => setCurrent("contato")}>Começar um projeto <Arrow /></button>
              <button className="btn btn--ghost" onClick={openList}>Ver outros cases</button>
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
              <article
                key={t.slug}
                className={`work-card work-card--regular work-card--link`}
                role="button"
                tabIndex={0}
                onClick={() => openCase(t)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCase(t); }}}>
                <Cine
                  label={t.title.toUpperCase().replace(/\n/g, " ")}
                  code={`CASE.${String(realIdx + 1).padStart(2, "0")}`}
                  aspect="4/3"
                  variant={realIdx % 4 === 0 ? "accent" : realIdx % 4 === 2 ? "dark" : "default"}
                  play={realIdx % 3 === 0} />
                <div className="work-card__meta">
                  <div className="work-card__left">
                    <p className="case__tag">{t.client}</p>
                    <h3 className="case__title">{t.title}</h3>
                  </div>
                  <div className="work-card__right">
                    <p className="case__tag">{t.tag}</p>
                    <p className="case__tag work-card__year">{t.year}</p>
                  </div>
                </div>
              </article>);
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
          <Cine label="REEL EXTENDED · 03'20" code="REEL.FULL" aspect="16/9" variant="dark" play />
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
      <PageHead crumb="04 · Sobre" title={"Produtora audiovisual.\nEstrutura de hub criativo."} lead="Começamos produzindo pra eventos, marcas em crescimento e artistas independentes. Hoje operamos no nível de exigência dos grandes anunciantes — sem perder o que nos fez começar." accent="hub criativo" meta="Equipe · Manifesto · Pilares" />

      {/* MANIFESTO */}
      <section className="section about-manifesto">
        <div className="about-manifesto__inner">
          <div className="about-manifesto__label">
            <p className="mono" style={{ color: "var(--ink-3)" }}>// MANIFESTO</p>
            <p className="eyebrow eyebrow-dot" style={{ marginTop: 12 }}>O que define a gente</p>
          </div>
          <p className="manifesto-text" style={{ fontFamily: "\"Archivo Black\"" }}>
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
            <Cine label="EQUIPE EM AÇÃO · BACKSTAGE" code="ABOUT.01" aspect="4/3" />
          </div>
          <div className="about-gallery__col">
            <Cine label="STUDIO · INTERIOR" code="ABOUT.02" aspect="1/1" variant="dark" />
            <Cine label="EQUIPAMENTO" code="ABOUT.03" aspect="3/2" variant="accent" />
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
          <div key={i} className="pilar-card">
              <p className="mono pilar-card__num">// 0{i + 1}</p>
              <h3 className="pilar-card__title">{p.tag}.</h3>
              <p className="pilar-card__desc">{p.desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* EQUIPE */}
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

      {/* CTA */}
      <section className="section about-cta">
        <div className="about-cta__inner">
          <p className="eyebrow eyebrow-dot">Quer trabalhar com a gente?</p>
          <h2 className="about-cta__title">O primeiro passo é uma conversa. Sem compromisso, sem proposta padrão.</h2>
          <button className="btn btn--primary" onClick={() => setCurrent("contato")}>Falar com a gente <Arrow /></button>
        </div>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// MUV HUB
// ═════════════════════════════════════════════════════════════════════════════
function MuvHub({ setCurrent }) {
  return (
    <div className="page" data-screen-label="MuvHub">
      <section className="hero" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="hero__top">
          <span className="pill pill--accent pill--dot">Em breve · 2026</span>
          <p className="mono" style={{ color: "var(--ink-3)" }}>// HUB.OVERVIEW</p>
        </div>
        <h1 className="hero__display" style={{ letterSpacing: "0px", textAlign: "left" }}>
          MUV <span className="accent">Hub.</span><br />
          <span className="italic" style={{ fontSize: "145px" }}>Onde a produção acontece.</span>
        </h1>
        <p className="hero__sub" style={{ marginTop: 48 }}>
          Locadora de equipamentos, reserva de studio e comunidade criativa
          num só lugar. Plataforma exclusiva pra filmmakers, agências e marcas parceiras.
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn--primary">Entrar na lista de espera <Arrow /></button>
          <button className="btn btn--ghost" onClick={() => setCurrent("contato")}>Saber mais <Arrow /></button>
        </div>
      </section>

      <section className="section section--ink">
        <SectionHead num="01" eyebrow="Quatro módulos · Uma plataforma" title="Tudo num só endereço." sub="Cada módulo tem página própria com catálogo, especificações e formas de reservar." />
        <div className="grid-2-2">
          <Module tag="LOCADORA" title="Equipamento profissional sob demanda." items={["Sony FX6, FX3", "Drones DJI", "Iluminação completa", "Reserva online", "Retirada na MUV"]} icon="A" onClick={() => setCurrent("hub-locadora")} />
          <Module tag="STUDIO" title="Espaço pra criar, gravar, produzir." items={["Ciclorama", "Iluminação inclusa", "Equipamento básico", "Reserva por turno", "Café & wifi"]} icon="B" onClick={() => setCurrent("hub-studio")} />
          <Module tag="COMUNIDADE" title="Hub criativo de filmmakers e marcas." items={["Feed & networking", "Agenda de eventos", "Conteúdos exclusivos", "Cursos & mentorias", "Conexão com marcas"]} icon="C" onClick={() => setCurrent("hub-comunidade")} />
          <Module tag="COWORK" title="Espaço pra trabalhar entre projetos." items={["Mesas compartilhadas", "Salas de reunião", "Internet 1Gbps", "Café & impressão", "Acesso 24/7"]} icon="D" onClick={() => setCurrent("hub-cowork")} />
        </div>
      </section>

      <section className="section">
        <SectionHead num="02" eyebrow="Como funciona" title="Conta grátis. Acesso instantâneo." sub="Cria sua conta em 30 segundos e já tem acesso ao catálogo, agenda e comunidade." />
        <div className="grid-3">
          {[
          { n: "01", t: "Cadastro", d: "Conta grátis em 30s. Sem cartão, sem compromisso. Filmmakers, agências e marcas." },
          { n: "02", t: "Catálogo & Reserva", d: "Equipamento e studio online. Reserva, contrato digital, retirada na MUV." },
          { n: "03", t: "Comunidade", d: "Feed, eventos, networking, conteúdo educativo. Cresce junto com o hub." }].
          map((s) =>
          <div key={s.n} style={{ padding: "32px 24px", borderTop: "1px solid var(--ink)", minHeight: 240 }}>
              <p className="mono" style={{ color: "var(--accent)" }}>// {s.n}</p>
              <h3 className="h3" style={{ marginTop: 32 }}>{s.t}</h3>
              <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 12 }}>{s.d}</p>
            </div>
          )}
        </div>
      </section>

      <section className="section section--dark" style={{ textAlign: "center", padding: "148px 86px 68px" }}>
        <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)", display: "inline-flex" }}>Lançamento · 2026</p>
        <h2 className="display" style={{ marginTop: 24, fontSize: "clamp(48px, 8vw, 140px)" }}>
          Lista de <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>espera</span><br />prioritária.
        </h2>
        <p className="body-l" style={{ color: "var(--dark-ink-2)", maxWidth: 540, margin: "32px auto 0" }}>
          Quem entra na lista agora tem acesso antecipado, condição de fundador e prioridade na agenda de studio.
        </p>
        <div style={{ marginTop: 48, maxWidth: 480, margin: "48px auto 0", display: "flex", gap: 8 }}>
          <input
            type="email"
            placeholder="seu@email.com"
            style={{ flex: 1, padding: "16px 20px", borderRadius: 999, border: "1px solid var(--dark-line)", background: "rgba(255,255,255,0.04)", color: "var(--dark-ink)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none" }} />
          
          <button className="btn btn--primary">Entrar <Arrow /></button>
        </div>
      </section>
    </div>);

}

// ═════════════════════════════════════════════════════════════════════════════
// HUB · LOCADORA
// ═════════════════════════════════════════════════════════════════════════════
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

      <section className="section section--dark hub-cta">
        <div className="hub-cta__inner">
          <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Próximo projeto</p>
          <h2 className="h1" style={{ marginTop: 16, color: "var(--dark-ink)" }}>
            Precisa de equipamento<br />pra <span style={{ color: "var(--accent)" }}>essa semana?</span>
          </h2>
          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn btn--primary" href="https://wa.me/message/D6LG7EUSTIR7C1" target="_blank" rel="noopener noreferrer">Conferir no WhatsApp <Arrow /></a>
            <button className="btn btn--ghost-dark" onClick={() => setCurrent("contato")}>Briefing completo <Arrow /></button>
          </div>
        </div>
      </section>
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
          <Cine label="CICLORAMA · L-SHAPE" code="STUDIO.01" aspect="16/9" variant="dark" />
          <Cine label="MESA DE PRODUÇÃO" code="STUDIO.02" aspect="4/3" variant="accent" />
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

      <section className="section section--dark hub-cta">
        <div className="hub-cta__inner">
          <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Reservar studio</p>
          <h2 className="h1" style={{ marginTop: 16, color: "var(--dark-ink)" }}>
            Vem ver o espaço<br /><span style={{ color: "var(--accent)" }}>antes de fechar.</span>
          </h2>
          <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 16, maxWidth: 540 }}>
            Agenda uma visita pra ver o ciclorama, conhecer o equipamento incluso e bater papo sobre o projeto. Sem compromisso.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn btn--primary" href="https://wa.me/message/D6LG7EUSTIR7C1" target="_blank" rel="noopener noreferrer">Agendar visita <Arrow /></a>
            <button className="btn btn--ghost-dark" onClick={() => setCurrent("contato")}>Briefing completo <Arrow /></button>
          </div>
        </div>
      </section>
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

      <section className="section section--dark hub-cta">
        <div className="hub-cta__inner">
          <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Lista de espera</p>
          <h2 className="h1" style={{ marginTop: 16, color: "var(--dark-ink)" }}>
            Entra agora,<br /><span style={{ color: "var(--accent)" }}>vira fundador.</span>
          </h2>
          <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 16, maxWidth: 540 }}>
            Quem entra antes do lançamento tem perfil destaque, acesso antecipado às vagas e condição vitalícia de membro fundador.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn btn--primary" href="https://wa.me/message/D6LG7EUSTIR7C1" target="_blank" rel="noopener noreferrer">Entrar na lista <Arrow /></a>
            <button className="btn btn--ghost-dark" onClick={() => setCurrent("contato")}>Saber mais <Arrow /></button>
          </div>
        </div>
      </section>
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
          <Cine label="MESAS COMPARTILHADAS" code="COW.01" aspect="16/9" variant="accent" />
          <Cine label="SALA DE REUNIÃO" code="COW.02" aspect="4/3" />
          <Cine label="LOUNGE & CAFÉ" code="COW.03" aspect="4/3" variant="dark" />
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

      <section className="section section--dark hub-cta">
        <div className="hub-cta__inner">
          <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Experimenta antes</p>
          <h2 className="h1" style={{ marginTop: 16, color: "var(--dark-ink)" }}>
            Primeiro day pass<br />é por <span style={{ color: "var(--accent)" }}>nossa conta.</span>
          </h2>
          <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 16, maxWidth: 540 }}>
            Marca um dia pra trabalhar no espaço, conhecer a galera e sentir o ritmo. Se rolar, a gente fecha plano. Se não, ficou o café.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn btn--primary" href="https://wa.me/message/D6LG7EUSTIR7C1" target="_blank" rel="noopener noreferrer">Reservar day pass <Arrow /></a>
            <button className="btn btn--ghost-dark" onClick={() => setCurrent("contato")}>Saber mais <Arrow /></button>
          </div>
        </div>
      </section>
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
function Blog({ setCurrent, slug = null }) {
  const router = useRouter();
  const selected = slug ? POSTS.findIndex((p) => p.slug === slug) : null;
  const openList = () => router.push("/blog/");
  const openPost = (p) => router.push(postHref(p.slug));

  if (selected !== null && selected >= 0) {
    const post = POSTS[selected];
    return (
      <div className="page" data-screen-label="BlogPost">
        <article className="post-detail">
          <div className="post-detail__nav">
            <button className="link-arrow link-arrow--back" onClick={openList}>
              <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Arrow /></span> Todos os textos
            </button>
          </div>
          <header className="post-detail__head">
            <div className="post-detail__meta">
              <span className="pill pill--accent">{post.category}</span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>{post.date} · {post.read}</span>
            </div>
            <h1 className="post-detail__title">{post.title}</h1>
            <p className="body-l post-detail__lead">{post.excerpt}</p>
          </header>
          <div className="post-detail__hero">
            <Cine label={post.title.toUpperCase()} code={`POST.${String(selected + 1).padStart(2, "0")}`} aspect="16/9" variant={selected % 3 === 0 ? "accent" : selected % 3 === 1 ? "dark" : "default"} />
          </div>
          <div className="post-detail__body">
            {post.body.map((b, i) =>
              b.h ?
                <h2 key={i} className="post-detail__h2">{b.h}</h2> :
                <p key={i} className="post-detail__p">{b.p}</p>
            )}
          </div>
          <footer className="post-detail__footer">
            <p className="eyebrow eyebrow-dot">Próximo passo</p>
            <h3 className="h2" style={{ marginTop: 16 }}>Próximo projeto que pede esse tipo de operação?</h3>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn--ink" onClick={() => setCurrent("contato")}>Falar com a gente <Arrow /></button>
              <button className="btn btn--ghost" onClick={openList}>Ver outros textos</button>
            </div>
          </footer>
        </article>
      </div>);
  }

  const feat = POSTS[0];
  const rest = POSTS.slice(1);
  return (
    <div className="page" data-screen-label="Blog">
      <PageHead crumb="05 · Diário MUV" title="Conteúdo sobre conteúdo." lead="Bastidor, ensaio, frameworks. O que a gente aprende produzindo, a gente compartilha por escrito." accent="conteúdo" meta={`${POSTS.length} textos · Atualizado mensal`} />

      {/* DESTAQUE */}
      <section className="section blog-feature">
        <div className="blog-feature__head">
          <p className="eyebrow eyebrow-dot">Em destaque</p>
          <p className="mono" style={{ color: "var(--ink-3)" }}>// FEAT.01</p>
        </div>
        <div className="blog-feature__grid">
          <div className="blog-feature__media">
            <Cine label={feat.title.toUpperCase()} code="POST.FEAT" aspect="16/9" variant="accent" />
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
          {rest.map((p, i) =>
          <article
            key={i}
            className="blog-row blog-row--link"
            role="button"
            tabIndex={0}
            onClick={() => openPost(p)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPost(p); }}}>
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
            </article>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section section--dark blog-newsletter">
        <div className="blog-newsletter__inner">
          <div>
            <p className="eyebrow eyebrow-dot" style={{ color: "var(--dark-ink-2)" }}>Newsletter</p>
            <h2 className="blog-newsletter__title">Recebe os textos no e-mail.</h2>
            <p className="body-l" style={{ color: "var(--dark-ink-2)", marginTop: 16, maxWidth: 420 }}>1 texto por mês. Sem spam. Cancela quando quiser.</p>
          </div>
          <form className="blog-newsletter__form" onSubmit={async (e) => {
            e.preventDefault();
            const email = new FormData(e.currentTarget).get("email");
            if (!email) return;
            try {await postToNetlify("newsletter", { email });e.currentTarget.reset();alert("Pronto. Você está na lista.");} catch (_) {alert("Não conseguimos inscrever agora. Tenta de novo em instantes.");}
          }}>
            <input type="email" name="email" placeholder="seu@email.com" required />
            <button type="submit" className="btn btn--primary">Assinar <Arrow /></button>
          </form>
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
      await postToNetlify("orcamento", { ...data, scope: data.scope.join(", "), origem: "Página Contato · briefing guiado" });
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64 }}>
          {/* Sidebar */}
          <aside style={{ position: "sticky", top: 120, alignSelf: "start" }}>
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
          <div>
            <div style={{ display: "flex", gap: 24, marginBottom: 48 }}>
              {[1, 2, 3].map((n) =>
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, opacity: step >= n ? 1 : 0.4 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${step >= n ? "var(--accent)" : "var(--line)"}`, background: step > n ? "var(--accent)" : "transparent", color: step > n ? "#fff" : step === n ? "var(--accent)" : "var(--ink-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                    {step > n ? "✓" : n}
                  </span>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>{n === 1 ? "Você" : n === 2 ? "Projeto" : "Briefing"}</span>
                </div>
              )}
            </div>

            {step === 1 &&
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                <div className="field"><label>Seu nome</label><input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} /></div>
                <div className="field"><label>Marca / Empresa</label><input value={data.company} onChange={(e) => setData({ ...data, company: e.target.value })} /></div>
                <div className="field"><label>E-mail</label><input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} /></div>
                <div className="field"><label>Telefone</label><input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} /></div>
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
                  <button key={b} type="button" className={`pill ${data.budget === b ? "pill--accent" : ""}`} style={{ cursor: "pointer", background: data.budget === b ? undefined : "transparent" }} onClick={() => setData({ ...data, budget: b })}>{b}</button>
                  )}
                  </div>
                </div>
                <div className="field" style={{ maxWidth: 360 }}>
                  <label>Prazo desejado</label>
                  <input type="text" placeholder="Ex: até 30 dias" value={data.deadline} onChange={(e) => setData({ ...data, deadline: e.target.value })} />
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
                  <label>Conta um pouco sobre o projeto</label>
                  <textarea
                  placeholder="O que você quer comunicar? Pra quem? Qual o sonho? Quanto mais específico, melhor."
                  value={data.brief}
                  onChange={(e) => setData({ ...data, brief: e.target.value })} />
                
                </div>
                <label className="quote-card__consent">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
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

const DISPLAY_FONT = `"Archivo Black", "Anton", system-ui, sans-serif`;
const BODY_FONT    = `"Inter", "Helvetica Neue", system-ui, sans-serif`;

const DARK_NAV_PAGES = new Set(["hub"]);

function App({ page = "home", slug = null }) {
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
    root.style.setProperty("--accent",       SETTINGS.accentColor  || "#DE4E2B");
    root.style.setProperty("--accent-2",     SETTINGS.accent2Color || "#1B57AD");
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
  if      (current === "servicos")  Page = Servicos;
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
      <Nav current={current} setCurrent={setCurrent} isDark={isDark} />
      <Page setCurrent={setCurrent} density="regular" slug={slug} />
      <Footer setCurrent={setCurrent} />
    </React.Fragment>
  );
}



export default App;
