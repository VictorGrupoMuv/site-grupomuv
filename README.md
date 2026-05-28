# site-grupomuv

Site institucional do **Grupo MUV** — ecossistema criativo de audiovisual, estratégia e conteúdo em São Paulo.

🌐 **Produção:** https://zesty-lollipop-e19da1.netlify.app
📦 **Deploy:** Netlify (deploy contínuo a partir deste repo)

---

## Estrutura

```
.
├── index.html              ← GERADO. Não edite à mão.
├── 404.html
├── politica-privacidade.html
├── termos-de-uso.html
├── _redirects              ← SPA fallback (todas as rotas → index.html)
├── manifest.json
├── robots.txt
├── sitemap.xml
├── og-image.png
├── favicon*.{png,ico}
├── apple-touch-icon.png
├── assets/                 ← logos (PNG)
│
├── styles.css              ← SOURCE — estilos globais
├── components.jsx          ← SOURCE — Nav, Footer, Cine, Arrow, etc.
├── pages.jsx               ← SOURCE — todas as páginas (Home, Trabalhos, Blog, FAQ...)
├── app.jsx                 ← SOURCE — bootstrap React + roteamento por hash
│
└── scripts/
    ├── unify.py            ← Inlina source → index.html
    └── index.template.html ← Template HTML com placeholders
```

### "Source" vs "build output"

O `index.html` é **gerado** pelo `scripts/unify.py` a partir de:
- `scripts/index.template.html` (estrutura HTML + meta tags + cookie banner)
- `styles.css` inlineado em `<style>`
- `components.jsx`, `pages.jsx`, `app.jsx` inlineados em `<script type="text/babel">`

Edite os arquivos source. Rode o script. Commita o `index.html` junto.

---

## Como editar conteúdo

### Trocar um case
Abre `pages.jsx`, procura por `const TRABALHOS = [`. Cada case é um objeto com:
- `slug`, `title` (use `\n` pra quebra de linha), `client`, `tag`, `year`, `category`
- `format`, `team`, `gear` — aparecem na barra de specs
- `summary` — lead da página de detalhe
- `body` — array de `{ h: "Título do bloco", p: "Parágrafo" }`

### Adicionar um blog post
`const POSTS = [` no mesmo arquivo. Mesma estrutura — `body` aceita blocos `{ h: }` (título) e `{ p: }` (parágrafo).

### Editar FAQ
`const FAQ_ITEMS = [`. Cada item: `{ cat: "Categoria", q: "Pergunta", a: "Resposta" }`.

### Mudar estilos
`styles.css`. As variáveis principais ficam em `:root` no topo (cores, fontes, espaçamentos).

---

## Como fazer build

```bash
# Da raiz do projeto:
python3 scripts/unify.py

# Validar sem reescrever:
python3 scripts/unify.py --check
```

Saída: `index.html` regenerado com CSS+JS inline.

---

## Como rodar local

```bash
# Sobe servidor estático na porta 8765
python3 -m http.server 8765 --bind 127.0.0.1
```

Abre http://localhost:8765/ no browser.

> ⚠️ Abrir `index.html` direto via `file://` não funciona — o React carrega de CDN (unpkg) e requer protocolo HTTP.

---

## Como deployar

**Automático:** push pro `main` → Netlify re-deploya em ~30s.

**Manual (fallback):** drag-and-drop da pasta no painel do Netlify.

---

## Stack

- **React 18** (UMD via unpkg CDN)
- **Babel standalone** (compila JSX no browser — não há build step de produção)
- **CSS puro** (sem Tailwind, sem PostCSS)
- **Fontes:** Archivo Black (display), Inter (body) — Google Fonts
- **PWA-ready:** manifest.json + favicons em todos os tamanhos
- **SEO:** JSON-LD Organization schema + OG + Twitter cards + sitemap.xml
- **LGPD:** cookie banner com localStorage consent

---

## Limitações conhecidas

- Babel standalone compila JSX a cada page load (~500KB extra de bundle).
  Aceitável pra um site institucional de 8 páginas, mas se o conteúdo crescer muito, vale migrar pra Vite + pre-build.
- O servidor de preview do Claude Code não tem acesso a CDN externo (sandbox).
  Use `python3 -m http.server` direto pra validação local com renderização completa.

---

## Histórico

- **2026-05-28** — Unificação inicial em single-file index.html. Integração de 5 cases reais (Adidas, Itaú × África / CONVOCASSO, ISLA / Gatorade-Orlando, Nissan × Suba, Pop-Comm), 5 blog posts, componente FAQ com 12 perguntas.
