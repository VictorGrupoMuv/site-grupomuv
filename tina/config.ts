import { defineConfig } from "tinacms";

const branch = process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.HEAD || "main";

// helpers de campos
const S = (name: string, label: string, ui: any = {}) => ({ type: "string" as const, name, label, ...ui });

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "", // preenchido pelo TinaCloud depois
  token: process.env.TINA_TOKEN || "",                    // idem
  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "assets", publicFolder: "public" } },
  schema: {
    collections: [
      {
        name: "home", label: "Home (textos)", path: "content", format: "json",
        match: { include: "home" }, ui: { allowedActions: { create:false, delete:false }, router: () => "/" },
        fields: [
          S("heroEyebrow","Hero — sobrelinha"),
          S("heroTitle1","Hero — titulo linha 1"), S("heroTitle2","Hero — titulo linha 2"), S("heroAccent","Hero — palavra destaque"),
          S("heroSub","Hero — subtitulo",{ui:{component:"textarea"}}),
          S("srvEyebrow","Servicos — sobrelinha"), S("srvTitle","Servicos — titulo"), S("srvSub","Servicos — sub",{ui:{component:"textarea"}}),
          S("prcEyebrow","Processo — sobrelinha"), S("prcTitle","Processo — titulo",{ui:{component:"textarea"}}), S("prcSub","Processo — sub",{ui:{component:"textarea"}}),
          S("trbEyebrow","Trabalhos — sobrelinha"), S("trbTitle","Trabalhos — titulo"), S("trbSub","Trabalhos — sub",{ui:{component:"textarea"}}),
          S("mrcEyebrow","Marcas — sobrelinha"), S("mrcTitle","Marcas — titulo"),
          S("hubEyebrow","Hub — sobrelinha"), S("hubAccent","Hub — palavra destaque"), S("hubTagline","Hub — frase"), S("hubBody","Hub — texto",{ui:{component:"textarea"}}),
          S("blgEyebrow","Blog — sobrelinha"), S("blgTitle","Blog — titulo"), S("blgSub","Blog — sub",{ui:{component:"textarea"}}),
        ],
      },
      {
        name: "services", label: "Serviços · Pilares", path: "content", format: "json",
        match: { include: "services" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [{
          type: "object", name: "items", label: "Pilares", list: true,
          ui: { itemProps: (i: any) => ({ label: i?.title || i?.tag }) },
          fields: [ S("num","Número"), S("tag","Tag"), S("title","Título",{ui:{component:"textarea"}}), S("desc","Descrição",{ui:{component:"textarea"}}),
            { type:"string", name:"items", label:"O que entra no escopo", list:true } ],
        }],
      },
      {
        name: "process", label: "Processo · Etapas", path: "content", format: "json",
        match: { include: "process" }, ui: { allowedActions: { create:false, delete:false } },
        fields: [{ type:"object", name:"items", label:"Etapas", list:true,
          ui:{ itemProps:(i:any)=>({label:i?.title})},
          fields:[ S("num","Número"), S("title","Título"), S("desc","Descrição",{ui:{component:"textarea"}}), S("deliverables","Entregáveis") ] }],
      },
      {
        name: "works", label: "Trabalhos · Cases", path: "content", format: "json",
        match: { include: "works" },
        fields: [{ type:"object", name:"items", label:"Cases", list:true,
          ui:{ itemProps:(i:any)=>({label:(i?.title||"").replace(/\n/g," ")})},
          fields:[ S("slug","Slug"), S("title","Título",{ui:{component:"textarea"}}), S("client","Cliente"), S("tag","Tag"), S("year","Ano"),
            S("category","Categoria"), S("format","Formato"), S("team","Equipe",{ui:{component:"textarea"}}), S("gear","Equipamento",{ui:{component:"textarea"}}),
            S("summary","Resumo",{ui:{component:"textarea"}}),
            S("still","Foto de capa (caminho)"), S("video","Vídeo de preview (caminho)"), S("poster","Poster do vídeo (caminho)"), S("vimeoId","ID do Vimeo (opcional — quando preenchido, substitui o vídeo local)"),
            { type:"object", name:"body", label:"Corpo (seções)", list:true, ui:{itemProps:(b:any)=>({label:b?.h||"Parágrafo"})},
              fields:[ S("h","Título da seção"), S("p","Parágrafo",{ui:{component:"textarea"}}) ] } ] }],
      },
      {
        name: "team", label: "Equipe", path: "content", format: "json",
        match: { include: "team" },
        fields: [{ type:"object", name:"items", label:"Membros", list:true, ui:{itemProps:(i:any)=>({label:i?.name})},
          fields:[ S("name","Nome"), S("role","Função"), S("short","Descrição curta") ] }],
      },
      {
        name: "posts", label: "Blog · Posts", path: "content", format: "json",
        match: { include: "posts" },
        fields: [{ type:"object", name:"items", label:"Posts", list:true, ui:{itemProps:(i:any)=>({label:i?.title})},
          fields:[ S("slug","Slug"), S("date","Data"), S("title","Título",{ui:{component:"textarea"}}), S("excerpt","Resumo",{ui:{component:"textarea"}}),
            S("read","Tempo de leitura"), S("category","Categoria"),
            { type:"object", name:"body", label:"Corpo", list:true, ui:{itemProps:(b:any)=>({label:b?.h||"Parágrafo"})},
              fields:[ S("h","Título da seção"), S("p","Parágrafo",{ui:{component:"textarea"}}) ] } ] }],
      },
      {
        name: "faq", label: "FAQ", path: "content", format: "json",
        match: { include: "faq" },
        fields: [{ type:"object", name:"items", label:"Perguntas", list:true, ui:{itemProps:(i:any)=>({label:i?.q})},
          fields:[ S("cat","Categoria"), S("q","Pergunta",{ui:{component:"textarea"}}), S("a","Resposta",{ui:{component:"textarea"}}) ] }],
      },
      {
        name: "brands", label: "Marcas", path: "content", format: "json",
        match: { include: "brands" }, ui:{ allowedActions:{create:false,delete:false} },
        fields: [{ type:"string", name:"items", label:"Marcas (nomes)", list:true }],
      },
      {
        name: "settings", label: "Configuracoes do Site", path: "content", format: "json",
        match: { include: "settings" },
        ui: { global: true, allowedActions: { create:false, delete:false } },
        fields: [
          { type:"string",  name:"accentColor",  label:"Cor de destaque (principal)", ui:{ component:"color" } },
          { type:"string",  name:"accent2Color", label:"Cor secundaria (azul)",       ui:{ component:"color" } },
          { type:"boolean", name:"showMarcas",   label:"Mostrar secao 'Marcas' (home)" },
          { type:"boolean", name:"showHub",      label:"Mostrar secao 'MUV Hub' (home)" },
          { type:"boolean", name:"showBlog",     label:"Mostrar secao 'Blog' (home)" },
          { type:"boolean", name:"showStats",     label:"Home: mostrar Numeros/estatisticas" },
          { type:"boolean", name:"showMarquee",   label:"Home: mostrar Esteira de palavras" },
          { type:"boolean", name:"showManifesto", label:"Home: mostrar Manifesto" },
          { type:"boolean", name:"showServicos",  label:"Home: mostrar secao Servicos" },
          { type:"boolean", name:"showProcesso",  label:"Home: mostrar secao Processo" },
          { type:"boolean", name:"showTrabalhos", label:"Home: mostrar secao Cases" },
          { type:"boolean", name:"showCTA",       label:"Home: mostrar Chamada final (CTA)" },
          { type:"boolean", name:"navServicos",   label:"Menu/Pagina: Servicos" },
          { type:"boolean", name:"navProcesso",   label:"Menu/Pagina: Processo" },
          { type:"boolean", name:"navTrabalhos",  label:"Menu/Pagina: Trabalhos" },
          { type:"boolean", name:"navSobre",      label:"Menu/Pagina: Sobre" },
          { type:"boolean", name:"navHub",        label:"Menu/Pagina: MUV Hub" },
          { type:"boolean", name:"navBlog",       label:"Menu/Pagina: Blog" },
        ],
      },
      {
        name: "marquee", label: "Palavras (esteira)", path: "content", format: "json",
        match: { include: "marquee" }, ui:{ allowedActions:{create:false,delete:false} },
        fields: [{ type:"string", name:"items", label:"Palavras", list:true }],
      },
    ],
  },
});
