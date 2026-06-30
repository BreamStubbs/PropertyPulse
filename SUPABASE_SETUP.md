# Connecting PropertyPulse to Supabase (cloud sync)

This wires the app to Supabase so your data **persists and syncs across all your devices**. Until you finish these steps the app keeps working using local browser storage, so nothing breaks midway.

You're already signed in to Supabase with GitHub — great. The whole thing takes about 10 minutes, and every step can be done from a phone or laptop browser.

---

## Step 1 — Create a project

1. Go to **https://supabase.com/dashboard** and click **New project**.
2. Pick your organization, give it a **Name** (e.g. `propertypulse`), and set a **Database Password** (you won't need it for this — just save it somewhere).
3. Choose the region closest to you and click **Create new project**.
4. Wait ~1–2 minutes for it to finish provisioning.

## Step 2 — Create the data table

1. In the project, open the **SQL Editor** (left sidebar, the `</>` icon) → **New query**.
2. Paste this in and click **Run**:

   ```sql
   create table if not exists app_state (
     id          text primary key,
     data        jsonb not null,
     updated_at  timestamptz not null default now()
   );

   grant all on table app_state to anon, authenticated;

   alter table app_state enable row level security;

   drop policy if exists "demo full access" on app_state;
   create policy "demo full access" on app_state for all using (true) with check (true);
   ```

   You should see **"Success. No rows returned."** (This is also saved in the repo at `supabase/migrations/0003_app_state.sql`.)

## Step 3 — Copy your two keys

1. Open **Project Settings** (gear icon, bottom-left) → **API**.
2. Copy these two values:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **Project API keys → `anon` `public`** — a long string starting with `eyJ...`

   > Use the **anon / public** key, not the `service_role` key. The anon key is meant to be used in a browser.

## Step 4 — Add the keys to Vercel

1. Go to **https://vercel.com** → your **property-pulse** project → **Settings** → **Environment Variables**.
2. Add two variables (Environment: leave all of Production/Preview/Development checked):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Project URL from Step 3 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon public key from Step 3 |

3. Save. Then go to the **Deployments** tab → open the latest deployment → **⋯ → Redeploy** (env vars only take effect on a new build).

## Step 5 — Verify it's working

1. Once redeployed, open the app and sign in.
2. Go to **Settings** → scroll to **Demo data**. You should see a green **"Cloud sync on — changes follow you across devices"** badge.
3. Make a change on one device (e.g. create a task as Jordan), then open the site on another device/browser and sign in — your change should be there. (If a device already had the tab open, switch away and back to it to pull the latest.)

That's it — you're synced. 🎉

---

## Running locally with sync (optional)

Create a file named `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

Then `npm run dev`. Local and production will share the same cloud data.

---

## How it works & good-to-knows

- **One synced record.** The app keeps its whole dataset in a single `app_state` row as JSON, loaded on startup, saved (debounced) on every change, and refreshed when you refocus the tab.
- **Reset.** Settings → Demo data → **Reset demo data** restores the original seed everywhere (it overwrites the cloud record too).
- **This is a demo model, not a secure multi-user backend.** Anyone with the public anon key can read/write that record, and saves are last-write-wins, so don't put anything sensitive in it. When you want real per-person logins and database security rules, switch to the full schema (`supabase/migrations/0001_schema.sql` + `0002_rls.sql`) with Supabase Auth — happy to wire that up next.
- **No keys set?** The app automatically falls back to local browser storage, so it always runs.
