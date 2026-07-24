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
