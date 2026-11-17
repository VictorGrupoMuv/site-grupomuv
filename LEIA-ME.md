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

## Design System rodada 03 (17/11/2026) · publicado em 17/11/2026 (commit c35b6b9 no main)
- Branch local `design-system-rodada03` (sem commit, sem push). O `main` não foi tocado. Publicar = Victor revisar, dar commit, merge no `main` e push.
- Fonte: artifact "Grupo MUV" (Design System). Componentes usados no site: `app/ds/MuvDS.jsx` + `app/ds/ds.css`. Camada de fundação para todas as páginas: `app/ds/site.css` (entra depois do `globals.css`).
- Home refeita na composição HomeV2 (aprovada pelo Victor em 17/11). Títulos em caixa normal aprovados.
- Site inteiro: foco com `focus-ring`, verde ácido fora do site claro, laranja só em pontos (cartões de /servicos, abas, FAQ, números do /sobre, manifesto), canto assinatura só em case, serviço e formulário, reserva do Hub e fechamento do serviço em papel quente, rodapé com colunas abertas no desktop, nav clara em /hub, 404 clara, menu do celular e cookies nos tokens, códigos decorativos e placeholder do estúdio removidos, travessões trocados em JSX, `content/*.json` e metadados, telefone com espaço.
- Pop-up de lead: agora só abre depois da decisão de cookies e de 50% de rolagem (antes: 8 s ou 40%). WhatsApp flutuante em tinta, 48px, some com modal aberto e em /loopingmuv.
- Textos novos para o Victor conferir: frase revelada da home; títulos "O que chega na sua mão." (/servicos) e "O lugar, sem render." (/hub), que substituem a fórmula banida "não é X, é Y"; etiqueta "+30 marcas" no topo.
- Celular (17/11/2026): as 16 páginas internas conferidas em 390px, sem vazamento horizontal. Corrigido: nome e cliente do case sempre visíveis no toque (antes dependiam de hover), cartões de case da página de serviço sem fundo escuro, rótulos duplicados em /sobre e /blog, travessões em /contato, /trabalhos e faixas de orçamento, rótulos de campo com 11px. Capturas em `MUV-COWORK/SITE/_preview-site-rodada03/*-celular.jpg`.
- Ficou como está no celular: /eventos tem três quadros de case sem imagem (Rock in Rio e Ribeirão Preto), WhatsApp aparece duas vezes em /contato, índices decorativos de 9px em alguns cartões.
- Pop-up de lead (17/11/2026, pedido do Victor): a oferta virou "10% na sua primeira produção com a MUV" (começou em 20%, o Victor baixou para 10% no mesmo dia) e capta nome, e-mail e WhatsApp. Formulário Netlify novo `lead-primeira-producao` em `public/__forms.html` (o antigo `lead-diagnostico` ficou declarado). Chave nova no navegador (`muv-lead-popup-10`) para quem fechou o antigo ver a oferta. A linha "Válido para novos clientes, no primeiro projeto fechado" é sugestão do Claude, a confirmar. Atenção: o Playbook de Precificação (regra 7) diz que o preço de venda é o piso; falta o Victor definir como os 10% convivem com isso. Depois de publicar, ativar a notificação por e-mail do formulário novo no painel Netlify.
- Curadoria de mídia (17/11/2026, levantamento): o acervo no Drive "GRUPO MUV - ACERVO 2022-2025" é quase só estrutura de pastas, projetos do Premiere, RAW e proxies de drone; não há mp4/mov de entrega nem fotos tratadas dos cases. Os finais estão no NAS de mídia e nos HDs, que não estavam montados. Material final disponível hoje: central "SITE MUV — ASSETS" no Drive (demo reel, previews de Itaú, Dolce, Guaraná "V3 Blocos.mov", dois 9x16 da Nissan, capas, fotos do estúdio) e os vídeos publicados no Vimeo. No site, 13 de 15 cases estão sem vídeo e 12 usam miniatura do Vimeo em 1280px puxada de fora; `public/assets/cases/case-04*` (Nissan) existe no repositório e não está ligado no `works.json`.
- Curadoria no NAS (17/11/2026): os finais estão em `User Homes/Mudafilms/GRUPO MUV - ACERVO 2022-2025` no NAS (pastas finalizados, exports, editados e as duas `MUV/Portfolio`). O manifesto do NAS fica em `Mudafilms/_CLAUDE/manifest_NAS_UserHomes_2026-09-22.csv`. Folhas de contato com 25 vídeos candidatos em `MUV-COWORK/SITE/_curadoria-acervo/` (lista com caminhos em `candidatos.tsv`). Já preparado e ligado no `works.json`, sem publicar: prévia de 20s e pôster do Guaraná (`public/assets/cases/case-03.mp4`). Falta o Victor escolher quais candidatos entram e autorizar o uso das marcas.
- Escolha do Victor na curadoria (17/11/2026): cases atuais 01 Guaraná, 02 Nissan, 03 Consul, 04 Shell GP SP, 05 Brastemp Retrô; cases novos 06 Guaraná Trem, 07 Brastemp Casa Cor, 08 Brastemp Camila Pitanga, 09 Shell Convenção Bahia, 10 Shell Stock Car, 19 Elseve, 24 Aperol, 14 El Prat, 15 ELO Salve Rosa, 22 Lollapalooza; bastidor 13 Geyse e 26 Making of. Só 01, 06 e 13 são horizontais. Falta decidir entre cartão horizontal com corte (opção A) e cartão vertical (opção B): comparativo em `_curadoria-acervo/opcao-A-horizontal.jpg` e `opcao-B-vertical.jpg`. Prévias horizontais já geradas em `_curadoria-acervo/prontos/` (Guaraná Trem e Geyse).
- /eventos reduzida (17/11/2026, pedido do Victor, ainda não publicada): ficaram hero com vídeo, marcas, três formatos, formulário e três perguntas. Saíram "Como funciona", "Cases" (tinha quadros vazios), "Para quem é" e o bloco final de WhatsApp. Formulário sem Empresa e Cidade, e-mail opcional (decisão do Claude, a confirmar). FAQ estruturado alinhado às três perguntas visíveis. O pop-up de 10% voltou a aparecer em /eventos. No celular a página caiu de 8.232px para 4.546px.
- Pendências: conferir movimento em tela (seções que sobem, trilho, hover dos cases); conferir a home com conteúdo vindo do TinaCloud; títulos de página (metaTitle) mudaram de travessão para dois pontos, vale acompanhar no Search Console; o que a auditoria pede e não entrou: contato com `<form>` real, um só estilo de campo, FAQ único, hero do Hub, post com Prose, limpeza do CSS morto.
- Preview local: `npx next dev -p 3111` e abrir http://localhost:3111. Capturas em `MUV-COWORK/SITE/_preview-home-rodada03/` e `_preview-site-rodada03/`.
