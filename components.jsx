// components.jsx
// Componentes compartilhados: Nav, Footer, primitivas, Placeholder, Marquee, BrandStrip.

const { useState, useEffect, useRef } = React;

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
      style={{ aspectRatio: aspect, ...style, borderRadius: "34px 0px 0px", fontSize: "10px", width: "100%", maxWidth: "398px" }}>
      
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
{ id: "faq", label: "FAQ", hideFromHeader: true }];


// Header e Drawer escondem itens marcados hideFromHeader (ex: FAQ vai só no Footer)
const HEADER_ITEMS = NAV_ITEMS.filter((n) => !n.hideFromHeader);
const DRAWER_ITEMS = HEADER_ITEMS.filter((n) => n.id !== "home");
const DRAWER_SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/grupomuv" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "TikTok", href: "#" }];


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
        <a className="nav__logo" onClick={(e) => {e.preventDefault();setCurrent("home");}} href="#" aria-label="Grupo MUV — ir para home">
          <img
            src={isDark ? "/assets/logo-muv-branco.png" : "/assets/logo-horizontal-preto.png"}
            alt="Grupo MUV"
            className="nav__logo-img" />
        </a>
        <ul className="nav__links">
          {HEADER_ITEMS.map((n) =>
          <li key={n.id}>
              <button
              className={`nav__link ${current === n.id ? "nav__link--active" : ""}`}
              onClick={() => setCurrent(n.id)}>

                {n.label}
              </button>
            </li>
          )}
        </ul>
        <button className={`btn ${isDark ? "btn--ghost-dark" : "btn--ink"} nav__cta`} onClick={() => setCurrent("contato")}>
          Falar com a gente <Arrow />
        </button>
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
              <button
                ref={i === 0 ? firstLinkRef : null}
                className={`drawer__link ${current === n.id ? "drawer__link--active" : ""}`}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => go(n.id)}>
                <span className="drawer__link-index">0{i + 1}</span>
                <span className="drawer__link-label">{n.label}</span>
              </button>
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
  const go = (id) => (e) => {e.preventDefault();setCurrent(id);window.scrollTo({ top: 0, behavior: "smooth" });};
  return (
    <footer className="footer">
      <div className="footer__giant" style={{ fontSize: "96px", fontWeight: "200", padding: "0px", margin: "-100px 0px 15px", width: "665px", height: "86px", letterSpacing: "-2px" }}>GRUPO MUV.</div>
      <div className="footer__grid">
        <div>
          <p className="footer__col-title">/ ECOSSISTEMA</p>
          <p style={{ maxWidth: 340, color: "var(--dark-ink-2)", lineHeight: 1.5, marginBottom: 24 }}>
            Produtora audiovisual e hub criativo. Estratégia, produção e conteúdo. <span style={{ color: "var(--dark-ink)" }}>São Paulo, Brasil.</span>
          </p>
          <a className="btn btn--primary" href="#" onClick={go("contato")}>
            Começar um projeto <Arrow />
          </a>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">Navegação</p>
          <ul>
            {NAV_ITEMS.slice(1).filter((n) => !n.hideFromFooter).map((n) =>
            <li key={n.id}><a href="#" onClick={go(n.id)}>{n.label} <ArrowDiag size={10} /></a></li>
            )}
            <li><a href="#" onClick={go("contato")}>Contato <ArrowDiag size={10} /></a></li>
          </ul>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">MUV Hub</p>
          <ul>
            <li><a href="#" onClick={go("hub")}>Overview <ArrowDiag size={10} /></a></li>
            <li><a href="#" onClick={go("hub")}>Locadora <ArrowDiag size={10} /></a></li>
            <li><a href="#" onClick={go("hub")}>Studio <ArrowDiag size={10} /></a></li>
            <li><a href="#" onClick={go("hub")}>Comunidade <ArrowDiag size={10} /></a></li>
          </ul>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">Social</p>
          <ul>
            <li><a href="#">Instagram <ArrowDiag size={10} /></a></li>
            <li><a href="#">LinkedIn <ArrowDiag size={10} /></a></li>
            <li><a href="#">YouTube <ArrowDiag size={10} /></a></li>
            <li><a href="#">TikTok <ArrowDiag size={10} /></a></li>
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
      <div key={i} className="brand-cell">{b}</div>
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
            <span className="brand-marquee__item">{b}</span>
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
        {sub && <p className="body-l" style={{ color: "var(--ink-2)", maxWidth: 640, marginTop: 24 }}>{sub}</p>}
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
Object.assign(window, {
  Arrow, ArrowDiag, Cine, Nav, Footer, Marquee, BrandStrip, BrandMarquee, SectionHead, PageHead, Reveal,
  NAV_ITEMS
});