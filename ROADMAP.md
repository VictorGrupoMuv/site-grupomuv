# Roadmap — site-grupomuv

Status do projeto, pendências, bugs identificados e backlog de melhorias.

**Última atualização:** 2026-05-28
**URL produção:** https://zesty-lollipop-e19da1.netlify.app
**Repo:** github.com/VictorGrupoMuv/site-grupomuv (privado)

---

## ✅ Concluído

### Infra
- [x] Site unificado em `index.html` único com CSS+JS inline
- [x] Build pipeline (`scripts/unify.py` + `index.template.html`)
- [x] Repo GitHub privado criado
- [x] Deploy contínuo Netlify ↔ GitHub funcionando
- [x] `netlify.toml` com headers de segurança e cache
- [x] `_redirects` pra SPA fallback
- [x] Limpeza de zips antigos e pastas obsoletas
- [x] Backup completo em `_backup_unificacao/2026-05-28/`

### Conteúdo
- [x] 5 cases reais integrados (Adidas, Itaú × África, ISLA/Gatorade, Nissan × Suba, Pop-Comm) com detalhe clicável
- [x] 5 blog posts reais integrados com texto completo
- [x] Componente FAQ com 12 perguntas em acordion
- [x] JSON-LD Organization schema com CNPJ
- [x] Sitemap, robots.txt, manifest, favicons completos

### Ferramentas
- [x] Skill global `MUDAMUV_SITE` pra formular pedidos de ajuste

---

## 🔴 CRÍTICO — Conteúdo falso/placeholder no site (corrigir antes de divulgar)

Esses itens estão no ar agora, com texto incorreto. Cliente acessando pode ver coisa errada.

### 1. Endereço fake na página /#contato
- **Onde:** `pages.jsx` → `function Contato` → sidebar "Estúdio"
- **Hoje:** "Rua Exemplo, 000 / Vila Madalena · São Paulo / SP · 05000-000"
- **Correto:** "Alameda Santos, 211, 15º andar, Sala 1507 — Edif. Paulista Boulevard / São Paulo · SP / 01419-000" (do JSON-LD)
- **Esforço:** 2 min

### 2. Socials sem URL real (Footer + Drawer mobile)
- **Onde:** `components.jsx` → `Footer` + `DRAWER_SOCIALS`
- **Hoje:** `href="#"` em LinkedIn, YouTube, TikTok (Instagram correto)
- **Precisa:** confirmar se existe perfil em cada uma e me passar os URLs (ou remover se não tiver)
- **Esforço:** 5 min após você me passar

### 3. Time da página /#sobre é placeholder
- **Onde:** `pages.jsx` → array `TIME`
- **Hoje:** "Equipe Direção", "Equipe DOP", "Equipe Pós" (genéricos)
- **Precisa:** nomes reais ou foto da equipe ou decidir manter genérico
- **Esforço:** 10 min após você me passar

### 4. Endereço do Estúdio no rodapé
- **Onde:** `components.jsx` → `Footer` → "São Paulo, Brasil"
- **Hoje:** só "São Paulo, Brasil" — OK genérico, mas se quiser endereço completo, atualizar
- **Esforço:** 2 min

### 5. Confirmar números na Home
- **Onde:** `pages.jsx` → `Home` → seção `hero-stats`
- **Hoje:** "+120 produções entregues", "+30 marcas parceiras", "7 dias ciclo médio"
- **Precisa:** confirmar que são reais. Se não, atualizar.
- **Esforço:** 2 min

### 6. Confirmar marcas do array BRANDS
- **Onde:** `pages.jsx` → `const BRANDS = [...]`
- **Hoje:** `["NIKE", "RED BULL", "APPLE", "A24", "STINK", "ARC'TERYX", "PUMA", "RIOT", "SPOTIFY", "VANS", "HEINEKEN", "ITAÚ"]`
- **Dúvida:** Algumas (NIKE, APPLE, A24, ARC'TERYX) parecem referências de design, não clientes reais. Quais SÃO clientes de verdade?
- **Esforço:** 5 min após confirmação

### 7. Confirmar link do WhatsApp
- **Onde:** `scripts/index.template.html` (botão flutuante) + `pages.jsx` (CTA do FAQ)
- **Hoje:** `https://wa.me/message/D6LG7EUSTIR7C1`
- **Precisa:** confirmar que é o número/link certo (parece código encurtado do wa.me — abre conversa com algum número)
- **Esforço:** 1 min (você testa abrindo o link)

---

## 🟡 IMPORTANTE — Pendências do plano original + funcionalidade quebrada

### 8. Form de contato não funciona de verdade
- **Onde:** `pages.jsx` → `function Contato` (wizard 3 steps) E `function HomeCTA` (form na home)
- **Hoje:** Ambos só fazem `setSent(true)` — usuário pensa que enviou, mas você não recebe nada
- **Solução:** Conectar pra **Netlify Forms** (grátis, 100 submissions/mês, recebe no email + dashboard). Precisa adicionar `data-netlify="true"` no `<form>` e converter pra HTML form ou usar fetch
- **Esforço:** 30 min
- **Alternativa:** Formspree, EmailJS, ou redirect pro WhatsApp

### 9. Domínio custom `grupomuv.com.br`
- **Hoje:** Só responde em `zesty-lollipop-e19da1.netlify.app`
- **Precisa:** Config no Netlify + DNS no registro.br (ou onde estiver registrado)
- **Esforço:** 10-20 min ativos + 1-24h de propagação DNS
- **Bloqueio:** Você ter acesso ao painel onde o domínio foi registrado

### 10. Newsletter no Blog não funciona
- **Onde:** `pages.jsx` → `function Blog` → seção `blog-newsletter`
- **Hoje:** Form com `onSubmit={(e) => e.preventDefault()}` — sumidouro
- **Solução:** Conectar pra Mailchimp, Substack, Buttondown ou ConvertKit
- **Esforço:** 30 min

### 11. "Lista de espera" do MUV Hub não funciona
- **Onde:** `pages.jsx` → `function MuvHub` → seção "Lançamento · 2026"
- **Hoje:** Input de email sem ação
- **Esforço:** 20 min (mesmo backend da newsletter idealmente)

### 12. Confirmar deploy contínuo realmente funciona
- **O quê:** Fazer um ajuste pequeno, commitar, pushar, e confirmar que Netlify deploya sozinho
- **Por quê:** Antes de você precisar de uma correção urgente
- **Esforço:** 5 min

### 13. Métricas e links de vídeo nos cases (do .md original)
- **Onde:** `pages.jsx` → array `TRABALHOS` → campo `body` de cada case
- **Hoje:** `[MÉTRICA MUV — confirmar com Victor]` e `[URL — confirmar]` foram removidos. Cases têm Cine placeholder em vez de vídeo real
- **Precisa:** Você me passar números (views/alcance/conversão) e links Vimeo/YouTube de cada case
- **Esforço:** 30 min após você me passar

---

## 🟢 NICE-TO-HAVE — Melhorias que valem fazer

### Performance
- [ ] **Pre-build de JSX** (substituir Babel standalone). Hoje carrega ~500KB de Babel toda vez. Solução: Vite ou esbuild → build script que compila JSX antes do deploy
  - Esforço: 4-6h, mas reduz time-to-interactive em ~40%
- [ ] **Lazy load de imagens** abaixo do fold
- [ ] **Code split** por página (não baixar todo o JS na Home)
- [ ] **Font preload** (Archivo Black, Inter weights críticos)
- [ ] Otimizar `og-image.png` (hoje 83KB → meta 30-40KB)

### Acessibilidade
- [ ] **Auditoria Lighthouse + axe-core** completa
- [ ] **Alt text** em todas imagens (hoje tudo é Cine placeholder com label)
- [ ] **Skip nav link** (atalho pra pular pro conteúdo principal)
- [ ] **Contraste WCAG AA** — confirmar todos os textos
- [ ] **Focus visible** consistente em todos botões/links
- [ ] **prefers-reduced-motion** — desligar animações pesadas pra quem pediu
- [ ] **Cookie banner** com keyboard nav completa

### SEO
- [ ] **Meta description por página** (hoje só Home tem)
- [ ] **OG image dinâmico por case/post** (vs fixo único)
- [ ] **BlogPosting JSON-LD schema** por post
- [ ] **Sitemap** com páginas internas (hoje só `/`)
- [ ] **RSS feed** do blog
- [ ] **Canonical URL** por página

### Browser compat
- [ ] **Test Safari** desktop + mobile (iOS)
- [ ] **Test Firefox**
- [ ] **Test Edge**
- [ ] **Test tela <320px** (Galaxy Fold, smartwatch)
- [ ] **Test tela >2K** (4K monitors)

### Monitoramento
- [ ] **Analytics privacy-friendly** — Plausible ($9/mo) ou Umami (self-hosted free) ou GA4
- [ ] **Error tracking** — Sentry free tier
- [ ] **Uptime monitoring** — UptimeRobot free
- [ ] **Web Vitals** dashboard (Search Console)

### Segurança
- [ ] **CSP (Content-Security-Policy) header** no `netlify.toml`
- [ ] **HSTS** preload
- [ ] **Force HTTPS** + decidir entre `www.` ou apex
- [ ] **Branch protection** no `main` (require PR + review)

---

## 🔵 FUTURE — Backlog distante

### Conteúdo
- [ ] **Mais cases** (Lollapalooza, Shell, World Surf League × Corona, Importek mencionados no .md como "ver mais")
- [ ] **Mais blog posts** (calendário editorial)
- [ ] **Showreel real** (substituir os gradientes animados em `SHOWREEL_SCENES`)
- [ ] **Foto da equipe** real em `/#sobre`
- [ ] **Cases stories animados** (vídeo curto contextualizando cada case)

### Features
- [ ] **Filtro funcional na página /#trabalhos** (hoje os chips de filtro funcionam mas só filtram a array TRABALHOS — confirma se a categorização tá certa)
- [ ] **Busca** (Ctrl+K) por blog/case/FAQ
- [ ] **Modo escuro** (dark/light toggle)
- [ ] **Internacionalização** (PT/EN/ES) — Brasil → LatAm/global
- [ ] **MUV Hub completo** (hoje é "Em breve · 2026" placeholder)
- [ ] **Galeria de fotos** dos cases (clicar abre lightbox)
- [ ] **Forms multi-step** com salvamento parcial (UX)
- [ ] **Calendário de disponibilidade** (Cal.com embed ou similar)

### Operacional
- [ ] **Convidar colaboradores** no repo GitHub (designer, agência)
- [ ] **PR template** + **Issue template** no `.github/`
- [ ] **CHANGELOG.md** com versionamento semver
- [ ] **Tag v1.0.0** no estado atual
- [ ] **CI** (GitHub Actions): lint, validação do unify.py, broken links check
- [ ] **Dependabot** (se vier a ter deps)

---

## 🐛 Bugs/Polish que vi mas não consertei

1. **`Cine` componente tem `borderRadius: "34px 0px 0px"` hardcoded** — fica com canto arredondado só no topo-esquerdo. Intencional? Verificar.
2. **Cine `maxWidth: "398px"`** hardcoded — não escala em telas grandes; placeholders ficam pequenos.
3. **HomeCTA tem código duplicado** com o form da página `/#contato` — vale extrair pra componente compartilhado.
4. **`hero-cine__display` tem CSS inline `width: 284px`** — frágil em mobile?
5. **`muv-os/` na raiz** — projeto separado mas não é claro se ainda tá ativo (PREVIEW.html de 22/05).
6. **`Portfolio/` e `Portifolio/`** duplicados no `Documents/MUV/`.
7. **CSS `.cine` com `aspectRatio` inline** mas também `style` no JSX — duplicação.
8. **`<style>` block 2 inline no template** (cookie banner) — vale mover pro `styles.css` ou deixar (pequeno, isolado, OK).
9. **JSON-LD tem `image: logo-horizontal-black.png`** — pode ser que SEO prefira `og-image.png` (1200x630).
10. **`scripts/unify.py` não tem `--watch` mode** — bom adicionar pra DX local (regenera index.html ao salvar arquivo source).

---

## 📋 Ordem sugerida (se eu fosse priorizar)

**Hoje (30 min):**
1. Item 12 — Testar deploy contínuo de verdade

**Esta semana (depende de você me passar dados):**
2. Item 1 — Endereço Contato (eu corrijo agora, 2 min)
3. Item 5 — Números da Home (confirma)
4. Item 7 — Link WhatsApp (confirma)
5. Item 2 — Socials (você me passa, eu coloco)
6. Item 6 — BRANDS reais (você confirma quais)
7. Item 3 — Time real (você decide manter genérico ou colocar nomes)
8. Item 8 — Form de contato (eu conecto Netlify Forms)

**Próximas 2 semanas:**
9. Item 9 — Domínio custom
10. Item 13 — Métricas + vídeos dos cases (depois que tiver)
11. Item 10 + 11 — Newsletter + Lista espera MUV Hub

**Mês que vem:**
12. Performance — pre-build de JSX
13. Acessibilidade — auditoria Lighthouse
14. SEO — meta tags por página, JSON-LD por post

**Sem data:**
15. Demais itens "Nice-to-have" e "Future"

---

## 🤖 Como usar esse roadmap

Quando quiser fazer um item, abra o Claude Code e diga `/MUDAMUV_SITE` ou cole o item daqui. Eu (Claude) leio esse arquivo no contexto, identifico o número, e executo seguindo o workflow estabelecido (editar source → unify → validar → commit → push).

Atualize o status manualmente (marcar `[x]`) quando concluir, ou peça pra mim.
