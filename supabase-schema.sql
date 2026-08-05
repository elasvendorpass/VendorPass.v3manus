-- =============================================================
-- ELAS VendorPass™ v3 — Supabase Schema
-- Execute este SQL no Editor SQL do seu projeto Supabase
-- =============================================================

-- Habilitar extensões necessárias
create extension if not exists "uuid-ossp";

-- =============================================================
-- 1. PERFIS DE USUÁRIA (users)
-- Cada usuária (lead ou cliente) tem um perfil
-- =============================================================
create table if not exists public.users (
  id              uuid primary key default uuid_generate_v4(),
  email           varchar(320) unique not null,
  name            varchar(200),
  company_name    varchar(200),       -- Nome fantasia da empresa
  cnpj            varchar(18),        -- CNPJ sem formatação
  status          varchar(20) not null default 'lead'
                    check (status in ('lead', 'cliente', 'inativo')),
  phone           varchar(20),
  state           varchar(2),         -- UF
  city            varchar(100),
  sector          varchar(100),       -- Setor de atuação
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

comment on table public.users is 'Perfis de usuárias (leads e clientes)';

-- =============================================================
-- 2. DIAGNÓSTICOS (diagnoses)
-- Cada resposta ao questionário multi-step
-- =============================================================
create table if not exists public.diagnoses (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references public.users(id) on delete cascade,
  
  -- Dados coletados por dimensão (0-100 cada)
  score_financas       int check (score_financas between 0 and 100),
  score_processos      int check (score_processos between 0 and 100),
  score_vendas         int check (score_vendas between 0 and 100),
  score_digital        int check (score_digital between 0 and 100),
  score_institucional  int check (score_institucional between 0 and 100),
  
  -- Score geral ponderado
  score_total          int check (score_total between 0 and 100),
  
  -- Arquétipo classificado
  archetype            varchar(20)
                         check (archetype in (
                           'semente', 'raiz', 'crescimento', 'escala', 'colheita'
                         )),
  
  -- JSON bruto das respostas (para reprocessamento futuro)
  raw_answers          jsonb,
  
  -- Metadados
  version              int default 1,
  completed_at         timestamptz,
  created_at           timestamptz default now()
);

comment on table public.diagnoses is 'Respostas ao diagnóstico multi-step';

-- =============================================================
-- 3. VENDOR SCORE (vendor_scores)
-- Histórico de scores ao longo do tempo (evolução)
-- =============================================================
create table if not exists public.vendor_scores (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references public.users(id) on delete cascade,
  diagnosis_id    uuid references public.diagnoses(id) on delete cascade,
  
  -- 5 dimensões com pesos configuráveis
  financas         jsonb,  -- { "score": 72, "weight": 0.20, "gaps": [...], "summary": "..." }
  processos        jsonb,
  vendas           jsonb,
  digital          jsonb,
  institucional    jsonb,
  
  -- Score geral e metadados
  score_total      int check (score_total between 0 and 100),
  weights          jsonb,  -- { "financas": 0.20, "processos": 0.25, ... }
  archetype        varchar(20),
  summary          text,   -- Resumo gerado pela IA
  improvement_plan text,   -- Plano de evolução gerado pela IA
  
  created_at       timestamptz default now()
);

comment on table public.vendor_scores is 'Scores detalhados com gaps e plano de evolução';

-- =============================================================
-- 4. TRILHA VENDÓR (trilha_progress)
-- Progresso na Trilha VendorPass™ (5 arquétipos)
-- =============================================================
create table if not exists public.trilha_progress (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references public.users(id) on delete cascade,
  
  -- Arquétipo atual
  current_archetype  varchar(20)
                       check (current_archetype in (
                         'semente', 'raiz', 'crescimento', 'escala', 'colheita'
                       )),
  
  -- XP total acumulado
  total_xp           int default 0,
  
  -- Progresso por nível (etapas concluídas)
  semente_completed  boolean default false,
  raiz_completed     boolean default false,
  crescimento_completed boolean default false,
  escala_completed   boolean default false,
  colheita_completed boolean default false,
  
  -- Streak (dias consecutivos de atividade)
  streak_days        int default 0,
  last_active_at     timestamptz,
  
  -- Certificados emitidos
  certificates       jsonb default '[]'::jsonb,
  
  updated_at         timestamptz default now(),
  created_at         timestamptz default now()
);

comment on table public.trilha_progress is 'Progresso na Trilha VendorPass™ com XP e certificados';

-- =============================================================
-- 5. MATCH ENGINE (matches)
-- Oportunidades sugeridas pela Match Engine™
-- =============================================================
create table if not exists public.matches (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references public.users(id) on delete cascade,
  
  -- Dados da oportunidade
  company_name     varchar(200),
  opportunity_type varchar(50),
  description      text,
  match_score      int check (match_score between 0 and 100),
  requirements     jsonb,  -- { "min_score": 60, "sectors": [...], "location": "..." }
  
  -- Status
  status           varchar(20) default 'pending'
                     check (status in ('pending', 'accepted', 'rejected', 'in_progress', 'completed')),
  
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

comment on table public.matches is 'Oportunidades sugeridas pela Match Engine™';

-- =============================================================
-- 6. VENDOR KIT (vendor_kit_items)
-- Recursos, templates e materiais do Vendor Kit™
-- =============================================================
create table if not exists public.vendor_kit_items (
  id              uuid primary key default uuid_generate_v4(),
  
  title            varchar(200) not null,
  description      text,
  category         varchar(50),  -- "template", "guia", "checklist", "video"
  archetype        varchar(20),  -- arquétipo-alvo (ou null = geral)
  file_url         text,
  content_json     jsonb,        -- Conteúdo estruturado
  is_premium       boolean default true,
  
  created_at       timestamptz default now()
);

comment on table public.vendor_kit_items is 'Recursos e materiais do Vendor Kit™';

-- =============================================================
-- 7. IMPACTO & SUPPLY DIVERSITY (impact_metrics)
-- Dados agregados institucionais
-- =============================================================
create table if not exists public.impact_metrics (
  id              uuid primary key default uuid_generate_v4(),
  
  period           varchar(20),   -- "2026-Q3", "2026-H2"
  total_vendors    int default 0,
  total_vendors_female int default 0,
  avg_score        decimal(5,2) default 0,
  certifications_issued int default 0,
  matches_made     int default 0,
  sectors_breakdown jsonb,         -- { "tecnologia": 30, "servicos": 25, ... }
  states_breakdown  jsonb,         -- { "SP": 40, "RJ": 20, ... }
  
  created_at       timestamptz default now()
);

comment on table public.impact_metrics is 'Métricas agregadas de impacto e Supply Diversity';

-- =============================================================
-- 8. TRILHA — ETAPAS (trilha_steps)
-- Definição das etapas dentro de cada arquétipo
-- =============================================================
create table if not exists public.trilha_steps (
  id              uuid primary key default uuid_generate_v4(),
  
  archetype        varchar(20) not null
                     check (archetype in (
                       'semente', 'raiz', 'crescimento', 'escala', 'colheita'
                     )),
  step_number      int not null,
  title            varchar(200) not null,
  description      text,
  xp_reward        int default 10,
  content_json     jsonb,        -- Conteúdo do passo
  is_completed     boolean default false,
  
  unique(archetype, step_number)
);

comment on table public.trilha_steps is 'Definição das etapas da Trilha por arquétipo';

-- =============================================================
-- ÍNDICES
-- =============================================================
create index idx_users_email on public.users(email);
create index idx_users_status on public.users(status);
create index idx_diagnoses_user_id on public.diagnoses(user_id);
create index idx_diagnoses_archetype on public.diagnoses(archetype);
create index idx_vendor_scores_user_id on public.vendor_scores(user_id);
create index idx_trilha_progress_user_id on public.trilha_progress(user_id);
create index idx_matches_user_id on public.matches(user_id);
create index idx_matches_status on public.matches(status);
create index idx_trilha_steps_archetype on public.trilha_steps(archetype);
create index idx_impact_metrics_period on public.impact_metrics(period);

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- Habilita proteção de acesso em todas as tabelas
-- =============================================================
alter table public.users enable row level security;
alter table public.diagnoses enable row level security;
alter table public.vendor_scores enable row level security;
alter table public.trilha_progress enable row level security;
alter table public.matches enable row level security;
alter table public.vendor_kit_items enable row level security;
alter table public.impact_metrics enable row level security;
alter table public.trilha_steps enable row level security;

-- Usuárias só podem ver/editar seus próprios dados
create policy "users_can_view_own_profile" on public.users
  for select using (auth.uid()::text = id::text or email = auth.jwt() ->> 'email');

create policy "diagnoses_user_access" on public.diagnoses
  for all using (auth.uid()::text = user_id::text);

create policy "vendor_scores_user_access" on public.vendor_scores
  for all using (auth.uid()::text = user_id::text);

create policy "trilha_progress_user_access" on public.trilha_progress
  for all using (auth.uid()::text = user_id::text);

create policy "matches_user_access" on public.matches
  for all using (auth.uid()::text = user_id::text);

-- Vendor Kit é leitura pública (todos podem ver os recursos)
create policy "vendor_kit_public_read" on public.vendor_kit_items
  for select using (true);

-- Métricas de impacto são leitura pública (dados agregados)
create policy "impact_metrics_public_read" on public.impact_metrics
  for select using (true);

-- Etapas da trilha são leitura pública
create policy "trilha_steps_public_read" on public.trilha_steps
  for select using (true);

-- =============================================================
-- TRIGGER: atualizar updated_at automaticamente
-- =============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users
  for each row execute procedure update_updated_at_column();

create trigger trilha_progress_updated_at before update on public.trilha_progress
  for each row execute procedure update_updated_at_column();

create trigger matches_updated_at before update on public.matches
  for each row execute procedure update_updated_at_column();
