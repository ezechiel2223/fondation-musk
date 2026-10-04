-- ============================================================================
--  Fondation Musk — CORRECTIF de la barre d'avancement
--  ---------------------------------------------------------------------------
--  À exécuter dans Supabase : SQL Editor > New query > coller > Run.
--  Idéal si le pourcentage ne s'enregistre pas (colonne manquante ou droits).
-- ============================================================================

-- 1) La colonne qui stocke le pourcentage d'avancement (0 à 100).
alter table public.applications
  add column if not exists progress integer not null default 0;

alter table public.applications
  drop constraint if exists applications_progress_check;

alter table public.applications
  add constraint applications_progress_check check (progress between 0 and 100);

-- 2) Droits : l'espace /admin doit pouvoir LIRE et MODIFIER les dossiers.
alter table public.applications enable row level security;

drop policy if exists "anon can read applications" on public.applications;
create policy "anon can read applications"
  on public.applications
  for select
  to anon
  using (true);

drop policy if exists "anon can update applications" on public.applications;
create policy "anon can update applications"
  on public.applications
  for update
  to anon
  using (true)
  with check (true);

-- 3) Vérification : doit renvoyer une ligne avec la colonne progress.
select column_name, data_type, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'applications'
order by ordinal_position;
