# PropertyPulse

A premium property-management **owner portal** for property managers, vacant-home owners, and short-term-rental owners. Built to the MVP build specification — one place per property for tasks, proposals, files, invoices, a shared calendar, and per-property messaging.

> Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. You'll land on the login screen.

### Demo accounts

No setup or credentials needed — the running app is seeded with the sample data from the spec. On the login screen, use the **"jump in as a demo account"** shortcuts, or type any of these emails with **any password**:

| Account | Role | Sees |
|---|---|---|
| `jordan@propertypulse.com` | Property Manager (admin) | The whole portfolio of 5 properties |
| `linda.whitfield@email.com` | Owner | The Cypress House + Harbor View (2 properties → tabs) |
| `marcus.tran@email.com` | Owner | Magnolia Cottage |
| `priya.anand@email.com` | Owner | Pinehurst Villa |
| `rob.caldwell@email.com` | Owner | Birchwood Lake House |

Log in as Jordan to create tasks/proposals/invoices/events, then log in as an owner to approve a proposal, send a message, and confirm owners only ever see their own data.

---

## Architecture & the data layer

The spec recommends **Supabase** (Postgres + Auth + Storage + RLS). This repo ships both halves so it runs standalone today and is ready to wire to a real backend:

1. **A runnable client-side store** (`lib/store.tsx`) — a React Context + reducer seeded from `lib/seed.ts` and persisted to `localStorage`. This makes every workflow (create task → advance status, send proposal → owner responds, upload file, send message, add calendar event) fully interactive with **no backend or env vars**. Mock auth selects a seeded profile.

2. **The real Supabase backend artifacts**, ready to apply:
   - `supabase/migrations/0001_schema.sql` — the full schema (spec §5)
   - `supabase/migrations/0002_rls.sql` — Row-Level Security policies (spec §6)
   - `supabase/seed.sql` — seed data (spec §12), identical to `lib/seed.ts`

Role scoping in the running app is enforced in `lib/queries.ts`, which mirrors the RLS rules exactly (admins see everything; owners see only properties linked via `property_owners`).

### Why mock data instead of live Supabase?

This build environment can't provision a Supabase project or hold its secrets, so wiring directly to a live instance wasn't possible here. The mock store keeps the app demoable end-to-end while keeping the swap small and well-defined.

### Swapping in Supabase

1. Create a Supabase project; run the two migrations then `seed.sql` (create matching `auth.users` rows for the seeded profile IDs first).
2. Create storage buckets: `property-photos`, `documents`, `message-attachments`.
3. Add `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`).
4. Replace the `localStorage` reads/writes in `lib/store.tsx` with Supabase client queries; the mutation function signatures and the `lib/queries.ts` selectors map 1:1 onto Supabase calls.

---

## What's implemented (spec §9)

- **Login** — email/password against seeded accounts + one-tap demo personas, role-aware redirect.
- **Dashboard** — admin portfolio view (KPIs, status breakdown, property grid, activity feed) and owner per-property view (hero, stat tiles, recent updates, photos, upcoming events, message snippet with quick-reply). Property switcher tabs when an owner has more than one property.
- **Properties** — searchable list of accessible properties with the signature **Estate Plate** hero overlay.
- **Property detail** — tabbed: Overview (editable notes for admins, contact card), Gallery, Maintenance (completed work + inspections), Work, Files, Invoices, Calendar.
- **Tasks** — three-column board (To Do / In Progress / Completed), property filter, one-tap status advance for admins, read-only for owners.
- **Proposals** — cards with prominent cost; owners can Approve / Decline / Ask a question; responses shown as quoted callouts; activity logged.
- **Files** — search, property + category filters, category-grouped list, upload (placeholder storage).
- **Invoices** — outstanding / overdue / paid summary tiles, status pills, disabled "Pay now — soon" Stripe placeholder, overdue auto-derived on read.
- **Calendar** — month grid color-coded by event type, day panel, "Connect Airbnb/VRBO — soon" banner, admins add events.
- **Messages** — per-property threads, role-aware counterparties, composer; reused on the dashboard snippet.
- **Settings** — profile, notification toggles, admin Team/Integrations vs owner My-Properties/Manager-contact, reset-demo control.

## Design system (spec §10)

- Fraunces (display serif) for property names/titles, Inter for everything else, via `next/font`.
- Tailwind tokens: slate-900 ink, stone-50 surface, amber-500 accent, with emerald/amber/rose/sky/violet status tones.
- The **Estate Plate** — frosted gradient nameplate on every property hero (`components/property/EstatePlate.tsx`).
- Accessibility: ≥44px tap targets, visible keyboard focus rings, status = color **and** label, plain-language copy, empty states with a next action, mobile-responsive with a collapsible sidebar.

## Project structure

```
app/(app)/…          role-aware app shell + the nine pages + property detail
components/ui         Button, Card, Modal, StatusPill, StatCard, Field, Toggle, EmptyState, Avatar, icons
components/property   PropertyCard, EstatePlate
components/{tasks,proposals,files,invoices,calendar,messages}
lib                   types, seed, store, queries, format, clsx
supabase              migrations (schema + RLS) and seed.sql
```

## Notes

- File "uploads" and downloads, and "Pay now," are intentionally placeholders (the spec scopes real storage/Stripe to future work).
- Demo data lives in `localStorage`; **Settings → Reset demo data** restores the original seed.
