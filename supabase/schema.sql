create extension if not exists "pgcrypto";

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  content text not null default '',
  mood text not null default 'neutral' check (mood in ('great','good','neutral','low','rough')),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;

create policy if not exists "journal_entries_select_own"
on public.journal_entries for select
using (auth.uid() = user_id);

create policy if not exists "journal_entries_insert_own"
on public.journal_entries for insert
with check (auth.uid() = user_id);

create policy if not exists "journal_entries_update_own"
on public.journal_entries for update
using (auth.uid() = user_id);

create policy if not exists "journal_entries_delete_own"
on public.journal_entries for delete
using (auth.uid() = user_id);
