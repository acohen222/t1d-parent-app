-- T1D Parent Copilot — Supabase Schema
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor > New Query)
-- Requires: Supabase Auth enabled, RLS enabled on all tables

-- ─────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- USERS
-- Extends Supabase auth.users with app-level profile data.
-- ─────────────────────────────────────────
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  display_name text,
  created_at  timestamptz default now() not null
);

alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- CHILDREN
-- One user can manage multiple children.
-- ─────────────────────────────────────────
create table if not exists public.children (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  name           text not null,
  dob            date,
  diagnosis_date date,
  created_at     timestamptz default now() not null,
  updated_at     timestamptz default now() not null
);

alter table public.children enable row level security;

create policy "Parents can manage their children"
  on public.children for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- CHILD SETTINGS
-- Device info, target ranges, treatment defaults.
-- ─────────────────────────────────────────
create table if not exists public.child_settings (
  id                    uuid primary key default gen_random_uuid(),
  child_id              uuid not null unique references public.children(id) on delete cascade,
  target_range_low      int  not null default 70,   -- mg/dL
  target_range_high     int  not null default 180,  -- mg/dL
  high_threshold        int  not null default 250,  -- mg/dL — "act now" high
  low_threshold         int  not null default 70,   -- mg/dL — "act now" low
  pump_type             text,                        -- e.g. "Omnipod 5", "Tandem t:slim"
  cgm_type              text,                        -- e.g. "Dexcom G7", "Libre 3"
  insulin_type          text,                        -- e.g. "Humalog", "NovoLog"
  low_treatment_grams   int  not null default 15,   -- fast carbs grams for lows
  low_treatment_type    text default 'juice box',   -- e.g. "glucose tabs", "juice box"
  site_change_days      int  not null default 3,    -- pump site rotation interval
  updated_at            timestamptz default now() not null
);

alter table public.child_settings enable row level security;

create policy "Parents can manage child settings"
  on public.child_settings for all
  using (
    exists (
      select 1 from public.children c
      where c.id = child_settings.child_id and c.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- EVENT LOGS
-- Quick-log entries: meal, exercise, illness, etc.
-- ─────────────────────────────────────────
create type public.event_category as enum (
  'meal',
  'exercise',
  'illness',
  'stress',
  'site_change',
  'medication',
  'high_bg',
  'low_bg',
  'low_treatment',
  'other'
);

create table if not exists public.event_logs (
  id          uuid primary key default gen_random_uuid(),
  child_id    uuid not null references public.children(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  category    public.event_category not null,
  note        text,
  blood_sugar int,    -- mg/dL, optional snapshot
  logged_at   timestamptz default now() not null
);

alter table public.event_logs enable row level security;

create policy "Parents can manage event logs"
  on public.event_logs for all using (auth.uid() = user_id);

-- Index for pattern queries (last 7 days by child)
create index if not exists event_logs_child_time
  on public.event_logs(child_id, logged_at desc);

-- ─────────────────────────────────────────
-- CAREGIVER GUIDES
-- Printable emergency reference for non-parent caregivers.
-- ─────────────────────────────────────────
create table if not exists public.caregiver_guides (
  id                       uuid primary key default gen_random_uuid(),
  child_id                 uuid not null unique references public.children(id) on delete cascade,
  -- Emergency contacts
  emergency_contact1_name  text,
  emergency_contact1_phone text,
  emergency_contact1_rel   text,  -- "Mom", "Dad", "Grandma"
  emergency_contact2_name  text,
  emergency_contact2_phone text,
  emergency_contact2_rel   text,
  doctor_name              text,
  doctor_phone             text,
  -- Protocol steps (free text, parent-authored)
  low_bg_symptoms          text,  -- "shaky, pale, confused, sweaty"
  low_treatment_steps      text,  -- plain steps for giving fast carbs
  high_bg_steps            text,  -- what to do / when to call
  pump_cgm_notes           text,  -- device-specific notes
  when_to_call_parent      text,  -- specific triggers to reach parent immediately
  school_notes             text,  -- nurse/teacher specific instructions
  updated_at               timestamptz default now() not null
);

alter table public.caregiver_guides enable row level security;

create policy "Parents can manage caregiver guides"
  on public.caregiver_guides for all
  using (
    exists (
      select 1 from public.children c
      where c.id = caregiver_guides.child_id and c.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- AI CONVERSATIONS
-- Persisted chat history per user (not per child — questions may be general).
-- ─────────────────────────────────────────
create table if not exists public.ai_conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  child_id   uuid references public.children(id) on delete set null,
  -- JSONB array of {role: "user"|"assistant", content: string}
  messages   jsonb not null default '[]'::jsonb,
  -- Optional title auto-generated from first user message
  title      text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.ai_conversations enable row level security;

create policy "Users can manage own conversations"
  on public.ai_conversations for all using (auth.uid() = user_id);

-- Index for listing conversations by user (most recent first)
create index if not exists ai_conversations_user_time
  on public.ai_conversations(user_id, updated_at desc);

-- ─────────────────────────────────────────
-- UPDATED_AT TRIGGER (reusable)
-- ─────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_children_updated_at
  before update on public.children
  for each row execute procedure public.set_updated_at();

create trigger set_child_settings_updated_at
  before update on public.child_settings
  for each row execute procedure public.set_updated_at();

create trigger set_caregiver_guides_updated_at
  before update on public.caregiver_guides
  for each row execute procedure public.set_updated_at();

create trigger set_ai_conversations_updated_at
  before update on public.ai_conversations
  for each row execute procedure public.set_updated_at();
