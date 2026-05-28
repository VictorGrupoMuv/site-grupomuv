// app.jsx — Grupo MUV site (production)
// Tweaks baked in: Archivo Black display · Inter body · orange accent · regular density.

const { useState, useEffect } = React;

const DISPLAY_FONT = `"Archivo Black", "Anton", system-ui, sans-serif`;
const BODY_FONT    = `"Inter", "Helvetica Neue", system-ui, sans-serif`;

const DARK_NAV_PAGES = new Set(["hub"]);

function App() {
  const [current, _setCurrent] = useState(() => {
    const hash = (window.location.hash || "").replace("#", "");
    return hash && NAV_ITEMS.find((n) => n.id === hash) ? hash : "home";
  });
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  const setCurrent = (id) => {
    _setCurrent(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Bake design tokens into :root once
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-density", "regular");
    root.style.setProperty("--font-display", DISPLAY_FONT);
    root.style.setProperty("--font-body",    BODY_FONT);
    root.style.setProperty("--accent",       "#DE4E2B");
    root.style.setProperty("--accent-2",     "#1B57AD");
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

  // Hash listener for back/forward navigation
  useEffect(() => {
    const onHash = () => {
      const h = (window.location.hash || "").replace("#", "");
      if (h && h !== current) _setCurrent(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
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
      <Page setCurrent={setCurrent} density="regular" />
      <Footer setCurrent={setCurrent} />
    </React.Fragment>
  );
}

// Defer mount para depois de todos os scripts text/babel terem sido compilados+executados.
// Resolve race condition transitória entre Babel standalone e a ordem de execução das tags JSX.
setTimeout(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}, 0);
