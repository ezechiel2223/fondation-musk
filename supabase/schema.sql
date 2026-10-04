-- ============================================================================
--  Fondation Musk — Schéma de la base de données Supabase
--  ---------------------------------------------------------------------------
--  À copier/coller dans Supabase : Dashboard > SQL Editor > New query > Run.
--  Le script est « idempotent » : vous pouvez le relancer sans risque.
-- ============================================================================

-- gen_random_uuid() est natif depuis PostgreSQL 13 (version utilisée par
-- Supabase) : aucune extension n'est nécessaire.

-- ---------------------------------------------------------------------------
-- Table des demandes de financement
-- ---------------------------------------------------------------------------
create table if not exists public.applications (
  id                 uuid primary key default gen_random_uuid(),
  reference          text,
  created_at         timestamptz not null default now(),
  full_name          text not null,
  email              text not null,
  phone              text,
  whatsapp           text not null,
  country            text not null,
  city               text,
  project_title      text not null,
  project_sector     text,
  project_description text not null,
  amount_requested   numeric(14, 2) not null,
  currency           text not null default 'USD',
  timeline           text,
  status             text not null default 'pending'
                       check (status in ('pending', 'approved', 'rejected')),
  progress           integer not null default 0,
  admin_note         text
);

-- Si la table existait déjà avant l'ajout de la référence, on la crée ici.
alter table public.applications add column if not exists reference text;

-- Barre de progression du dossier (0 à 100), pilotée depuis l'espace admin.
alter table public.applications add column if not exists progress integer not null default 0;

alter table public.applications drop constraint if exists applications_progress_check;
alter table public.applications add constraint applications_progress_check
  check (progress between 0 and 100);

create index if not exists applications_created_at_idx
  on public.applications (created_at desc);

create index if not exists applications_status_idx
  on public.applications (status);

create index if not exists applications_reference_idx
  on public.applications (reference);

-- ---------------------------------------------------------------------------
-- Sécurité : Row Level Security
-- ---------------------------------------------------------------------------
alter table public.applications enable row level security;

-- 1) Le formulaire public peut toujours CRÉER une demande.
drop policy if exists "public can insert applications" on public.applications;
create policy "public can insert applications"
  on public.applications
  for insert
  to anon
  with check (true);

-- ===========================================================================
--  MODE PROTOTYPE (activé par défaut) — l'espace /admin fonctionne tout de
--  suite avec la clé "anon".
--
--  ⚠️  ATTENTION : la clé anon est publique. Ces deux règles permettent à
--  quiconque possède cette clé de LIRE et MODIFIER toutes les demandes.
--  Acceptable pour tester, à désactiver avant la mise en production réelle.
-- ===========================================================================
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

-- ===========================================================================
--  MODE SÉCURISÉ (à activer en production)
--  Exécutez les lignes ci-dessous pour retirer les accès anon, puis connectez
--  l'espace /admin avec Supabase Auth (signInWithPassword) au lieu du code.
-- ===========================================================================
-- drop policy if exists "anon can read applications"   on public.applications;
-- drop policy if exists "anon can update applications" on public.applications;

drop policy if exists "authenticated can read applications" on public.applications;
create policy "authenticated can read applications"
  on public.applications
  for select
  to authenticated
  using (true);

drop policy if exists "authenticated can update applications" on public.applications;
create policy "authenticated can update applications"
  on public.applications
  for update
  to authenticated
  using (true)
  with check (true);

-- ===========================================================================
--  RÉGLAGES DU SITE (image du promoteur, etc.)
-- ===========================================================================
create table if not exists public.site_settings (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Lecture publique : le site a besoin de connaître l'image du promoteur.
drop policy if exists "public can read settings" on public.site_settings;
create policy "public can read settings"
  on public.site_settings
  for select
  to anon
  using (true);

-- Écriture (mode prototype) : permet à l'espace /admin de sauvegarder.
drop policy if exists "anon can insert settings" on public.site_settings;
create policy "anon can insert settings"
  on public.site_settings
  for insert
  to anon
  with check (true);

drop policy if exists "anon can update settings" on public.site_settings;
create policy "anon can update settings"
  on public.site_settings
  for update
  to anon
  using (true)
  with check (true);

-- ===========================================================================
--  STOCKAGE DES IMAGES (Supabase Storage)
--  Bucket public « media » : accueille la photo du promoteur téléversée
--  depuis l'espace /admin.
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "public read media" on storage.objects;
create policy "public read media"
  on storage.objects
  for select
  to public
  using (bucket_id = 'media');

drop policy if exists "anon upload media" on storage.objects;
create policy "anon upload media"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'media');

drop policy if exists "anon update media" on storage.objects;
create policy "anon update media"
  on storage.objects
  for update
  to anon
  using (bucket_id = 'media');

