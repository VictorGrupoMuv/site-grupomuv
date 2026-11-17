# Site MUV — versão Next.js (migração para TinaCMS)

Migração do site (antes: JSX + Babel no navegador via unify.py) para **Next.js 14**.
Visual 100% idêntico ao atual, verificado por screenshots.

## Estrutura
- `app/MuvApp.jsx` — o site inteiro (components + pages + app portados, "use client").
- `app/layout.js` — head, fontes, meta, JSON-LD (Victor França).
- `app/WhatsappCookie.jsx` — botão WhatsApp + banner LGPD.
- `app/globals.css` — estilos (styles.css + inline do template).
- `content/*.json` — CONTEÚDO EDITÁVEL extraído do código: services, process, works, team, posts, brands, marquee, faq.
- `public/` — logos, favicons, og, manifest.

## Rodar localmente
```
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
```

## Próximos passos (fazer junto)
1. TinaCMS: reestruturar `content/` em 1 arquivo por item + `tina/config.ts` (coleções/campos) + /admin.
2. Conta TinaCloud (a que deu tela branca — fazer DEPOIS do Tina no repo).
3. Entregar numa BRANCH (não tocar no site no ar) + trocar build da Netlify (unify.py -> next) + validar.

## Design System rodada 03 (17/11/2026) · aprovado em preview, não publicado
- Branch local `design-system-rodada03` (sem commit, sem push). O `main` não foi tocado. Publicar = Victor revisar, dar commit, merge no `main` e push.
- Fonte: artifact "Grupo MUV" (Design System). Componentes usados no site: `app/ds/MuvDS.jsx` + `app/ds/ds.css`. Camada de fundação para todas as páginas: `app/ds/site.css` (entra depois do `globals.css`).
- Home refeita na composição HomeV2 (aprovada pelo Victor em 17/11). Títulos em caixa normal aprovados.
- Site inteiro: foco com `focus-ring`, verde ácido fora do site claro, laranja só em pontos (cartões de /servicos, abas, FAQ, números do /sobre, manifesto), canto assinatura só em case, serviço e formulário, reserva do Hub e fechamento do serviço em papel quente, rodapé com colunas abertas no desktop, nav clara em /hub, 404 clara, menu do celular e cookies nos tokens, códigos decorativos e placeholder do estúdio removidos, travessões trocados em JSX, `content/*.json` e metadados, telefone com espaço.
- Pop-up de lead: agora só abre depois da decisão de cookies e de 50% de rolagem (antes: 8 s ou 40%). WhatsApp flutuante em tinta, 48px, some com modal aberto e em /loopingmuv.
- Textos novos para o Victor conferir: frase revelada da home; títulos "O que chega na sua mão." (/servicos) e "O lugar, sem render." (/hub), que substituem a fórmula banida "não é X, é Y"; etiqueta "+30 marcas" no topo.
- Celular (17/11/2026): as 16 páginas internas conferidas em 390px, sem vazamento horizontal. Corrigido: nome e cliente do case sempre visíveis no toque (antes dependiam de hover), cartões de case da página de serviço sem fundo escuro, rótulos duplicados em /sobre e /blog, travessões em /contato, /trabalhos e faixas de orçamento, rótulos de campo com 11px. Capturas em `MUV-COWORK/SITE/_preview-site-rodada03/*-celular.jpg`.
- Ficou como está no celular: /eventos tem três quadros de case sem imagem (Rock in Rio e Ribeirão Preto), WhatsApp aparece duas vezes em /contato, índices decorativos de 9px em alguns cartões.
- Pop-up de lead (17/11/2026, pedido do Victor): a oferta virou "10% na sua primeira produção com a MUV" (começou em 20%, o Victor baixou para 10% no mesmo dia) e capta nome, e-mail e WhatsApp. Formulário Netlify novo `lead-primeira-producao` em `public/__forms.html` (o antigo `lead-diagnostico` ficou declarado). Chave nova no navegador (`muv-lead-popup-10`) para quem fechou o antigo ver a oferta. A linha "Válido para novos clientes, no primeiro projeto fechado" é sugestão do Claude, a confirmar. Atenção: o Playbook de Precificação (regra 7) diz que o preço de venda é o piso; falta o Victor definir como os 10% convivem com isso. Depois de publicar, ativar a notificação por e-mail do formulário novo no painel Netlify.
- Pendências: conferir movimento em tela (seções que sobem, trilho, hover dos cases); conferir a home com conteúdo vindo do TinaCloud; títulos de página (metaTitle) mudaram de travessão para dois pontos, vale acompanhar no Search Console; o que a auditoria pede e não entrou: contato com `<form>` real, um só estilo de campo, FAQ único, hero do Hub, post com Prose, limpeza do CSS morto.
- Preview local: `npx next dev -p 3111` e abrir http://localhost:3111. Capturas em `MUV-COWORK/SITE/_preview-home-rodada03/` e `_preview-site-rodada03/`.
