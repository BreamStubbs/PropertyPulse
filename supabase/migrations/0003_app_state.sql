-- Simple cloud-sync backend (see SUPABASE_SETUP.md).
--
-- The app stores its entire dataset as one JSON row. This is intentionally
-- simple: it gives cross-device persistence without per-user auth. It is a
-- DEMO model — the public anon key can read/write this row, so don't store
-- anything sensitive. For real multi-user security, use the per-table schema
-- in 0001_schema.sql + 0002_rls.sql with Supabase Auth instead.

create table if not exists app_state (
  id          text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

-- Allow the browser (anon) and signed-in users to read/write the demo record.
grant all on table app_state to anon, authenticated;

alter table app_state enable row level security;

drop policy if exists "demo full access" on app_state;
create policy "demo full access" on app_state for all using (true) with check (true);
