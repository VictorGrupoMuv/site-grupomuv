-- Leads do site grupomuv.com.br → caixa da Prospecção.
--
-- Rodar no SQL Editor do Supabase do muv-hub (projeto "Site MUV",
-- ref whflggtiopzzewsouahl), depois do SQL 36. Pode rodar de novo.
-- Este arquivo NÃO foi aplicado por quem abriu o PR. Quem aplica é o Victor.
--
-- Por que uma tabela nova: a tela Prospecção (/equipe/prospeccao) lê a base
-- Notion "Prospecção SDR" (equipe-notion, data source 13889ef2-16b0-46f8-9056-82cc30c3a6fe).
-- Não existe tabela Postgres de prospecção. As colunas pedidas pelo site
-- (telefone, mensagem, página, UTM, data) não cabem nessa base sem criar
-- propriedade no Notion, e o muv-hub não foi alterado.
-- Os leads do site passam a cair aqui. A tela atual só mostra o Notion
-- até o muv-hub passar a ler public.prospeccao.
--
-- Quem grava: a função Netlify salvar-lead, com a service role (ignora RLS).
-- anon não tem grant. authenticated da equipe só lê, via is_equipe().

create table if not exists public.prospeccao (
  id          uuid primary key default gen_random_uuid(),
  nome        text,
  empresa     text,
  email       text,
  fone        text,
  mensagem    text,
  pagina      text not null default '/',
  formulario  text not null,
  origem      text,
  utm         jsonb not null default '{}'::jsonb,
  criado_em   timestamptz not null default now(),
  constraint prospeccao_formulario_ck check (formulario in (
    'orcamento', 'newsletter', 'hub-waitlist', 'hub-cadastro',
    'hub-fundadores', 'hub-checkout', 'lead-primeira-producao', 'lead-diagnostico'
  )),
  constraint prospeccao_contato_ck check (
    nullif(btrim(coalesce(email, '')), '') is not null
    or nullif(btrim(coalesce(fone, '')), '') is not null
  ),
  constraint prospeccao_email_ck check (
    email is null or email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  ),
  constraint prospeccao_fone_ck check (
    fone is null or length(regexp_replace(fone, '\D', '', 'g')) between 10 and 15
  ),
  constraint prospeccao_utm_ck check (jsonb_typeof(utm) = 'object'),
  constraint prospeccao_tamanhos_ck check (
    char_length(coalesce(nome, '')) <= 160
    and char_length(coalesce(empresa, '')) <= 200
    and char_length(coalesce(email, '')) <= 200
    and char_length(coalesce(fone, '')) <= 40
    and char_length(coalesce(mensagem, '')) <= 4000
    and char_length(pagina) <= 300
    and char_length(coalesce(origem, '')) <= 200
  )
);

comment on table public.prospeccao is
  'Leads dos formulários do site. Gravados pela service role (Netlify salvar-lead). A tela Prospecção ainda lê o Notion.';
comment on column public.prospeccao.nome is 'Nome de quem preencheu (name).';
comment on column public.prospeccao.empresa is 'Empresa ou marca (company).';
comment on column public.prospeccao.fone is 'Telefone ou WhatsApp, como a pessoa digitou (phone).';
comment on column public.prospeccao.mensagem is 'Recado, briefing ou oferta (message).';
comment on column public.prospeccao.pagina is 'Página de origem no site (source page), caminho começando com /.';
comment on column public.prospeccao.utm is 'utm_source, utm_medium, utm_campaign, utm_term, utm_content e gclid, quando existirem.';
comment on column public.prospeccao.criado_em is 'created_at definido pelo servidor no insert. O navegador não escolhe esta data.';

create index if not exists prospeccao_criado_idx on public.prospeccao (criado_em desc);
create index if not exists prospeccao_email_idx on public.prospeccao (lower(email)) where email is not null;

alter table public.prospeccao enable row level security;

drop policy if exists "equipe lê prospeccao" on public.prospeccao;
create policy "equipe lê prospeccao"
  on public.prospeccao
  for select
  to authenticated
  using ((select public.is_equipe()));

revoke all on table public.prospeccao from public, anon, authenticated;
grant select on table public.prospeccao to authenticated;
grant select, insert on table public.prospeccao to service_role;

-- Conferir, como equipe logada no SQL Editor (service role vê tudo):
-- select formulario, nome, empresa, email, pagina, utm, criado_em
-- from public.prospeccao order by criado_em desc limit 20;
