// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.HEAD || "main";
var S = (name, label, ui = {}) => ({ type: "string", name, label, ...ui });
var config_default = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  // preenchido pelo TinaCloud depois
  token: process.env.TINA_TOKEN || "",
  // idem
  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "assets", publicFolder: "public" } },
  schema: {
    collections: [
      {
        name: "services",
        label: "Servi\xE7os \xB7 Pilares",
        path: "content",
        format: "json",
        match: { include: "services" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [{
          type: "object",
          name: "items",
          label: "Pilares",
          list: true,
          ui: { itemProps: (i) => ({ label: i?.title || i?.tag }) },
          fields: [
            S("num", "N\xFAmero"),
            S("tag", "Tag"),
            S("title", "T\xEDtulo", { ui: { component: "textarea" } }),
            S("desc", "Descri\xE7\xE3o", { ui: { component: "textarea" } }),
            { type: "string", name: "items", label: "O que entra no escopo", list: true }
          ]
        }]
      },
      {
        name: "process",
        label: "Processo \xB7 Etapas",
        path: "content",
        format: "json",
        match: { include: "process" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [{
          type: "object",
          name: "items",
          label: "Etapas",
          list: true,
          ui: { itemProps: (i) => ({ label: i?.title }) },
          fields: [S("num", "N\xFAmero"), S("title", "T\xEDtulo"), S("desc", "Descri\xE7\xE3o", { ui: { component: "textarea" } }), S("deliverables", "Entreg\xE1veis")]
        }]
      },
      {
        name: "works",
        label: "Trabalhos \xB7 Cases",
        path: "content",
        format: "json",
        match: { include: "works" },
        fields: [{
          type: "object",
          name: "items",
          label: "Cases",
          list: true,
          ui: { itemProps: (i) => ({ label: (i?.title || "").replace(/\n/g, " ") }) },
          fields: [
            S("slug", "Slug"),
            S("title", "T\xEDtulo", { ui: { component: "textarea" } }),
            S("client", "Cliente"),
            S("tag", "Tag"),
            S("year", "Ano"),
            S("category", "Categoria"),
            S("format", "Formato"),
            S("team", "Equipe", { ui: { component: "textarea" } }),
            S("gear", "Equipamento", { ui: { component: "textarea" } }),
            S("summary", "Resumo", { ui: { component: "textarea" } }),
            {
              type: "object",
              name: "body",
              label: "Corpo (se\xE7\xF5es)",
              list: true,
              ui: { itemProps: (b) => ({ label: b?.h || "Par\xE1grafo" }) },
              fields: [S("h", "T\xEDtulo da se\xE7\xE3o"), S("p", "Par\xE1grafo", { ui: { component: "textarea" } })]
            }
          ]
        }]
      },
      {
        name: "team",
        label: "Equipe",
        path: "content",
        format: "json",
        match: { include: "team" },
        fields: [{
          type: "object",
          name: "items",
          label: "Membros",
          list: true,
          ui: { itemProps: (i) => ({ label: i?.name }) },
          fields: [S("name", "Nome"), S("role", "Fun\xE7\xE3o"), S("short", "Descri\xE7\xE3o curta")]
        }]
      },
      {
        name: "posts",
        label: "Blog \xB7 Posts",
        path: "content",
        format: "json",
        match: { include: "posts" },
        fields: [{
          type: "object",
          name: "items",
          label: "Posts",
          list: true,
          ui: { itemProps: (i) => ({ label: i?.title }) },
          fields: [
            S("slug", "Slug"),
            S("date", "Data"),
            S("title", "T\xEDtulo", { ui: { component: "textarea" } }),
            S("excerpt", "Resumo", { ui: { component: "textarea" } }),
            S("read", "Tempo de leitura"),
            S("category", "Categoria"),
            {
              type: "object",
              name: "body",
              label: "Corpo",
              list: true,
              ui: { itemProps: (b) => ({ label: b?.h || "Par\xE1grafo" }) },
              fields: [S("h", "T\xEDtulo da se\xE7\xE3o"), S("p", "Par\xE1grafo", { ui: { component: "textarea" } })]
            }
          ]
        }]
      },
      {
        name: "faq",
        label: "FAQ",
        path: "content",
        format: "json",
        match: { include: "faq" },
        fields: [{
          type: "object",
          name: "items",
          label: "Perguntas",
          list: true,
          ui: { itemProps: (i) => ({ label: i?.q }) },
          fields: [S("cat", "Categoria"), S("q", "Pergunta", { ui: { component: "textarea" } }), S("a", "Resposta", { ui: { component: "textarea" } })]
        }]
      },
      {
        name: "brands",
        label: "Marcas",
        path: "content",
        format: "json",
        match: { include: "brands" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [{ type: "string", name: "items", label: "Marcas", list: true }]
      },
      {
        name: "marquee",
        label: "Palavras (esteira)",
        path: "content",
        format: "json",
        match: { include: "marquee" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [{ type: "string", name: "items", label: "Palavras", list: true }]
      }
    ]
  }
});
export {
  config_default as default
};
