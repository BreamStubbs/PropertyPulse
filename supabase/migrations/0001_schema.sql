-- PropertyPulse schema (spec §5)
-- Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES — one row per authenticated user, role-aware
-- ============================================================
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  email         text not null,
  phone         text,
  avatar_url    text,
  role          text not null check (role in ('admin','owner')),
  created_at    timestamptz not null default now()
);

-- ============================================================
-- PROPERTIES
-- ============================================================
create table properties (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  address_line1   text not null,
  city            text not null,
  state           text not null,
  zip             text not null,
  property_type   text not null check (property_type in ('Short-Term Rental','Vacant Home','Owner-Occupied')),
  status          text not null check (status in ('Active Rental','Occupied','Vacant','Under Maintenance')),
  beds            int,
  baths           numeric(3,1),
  sqft            int,
  notes           text,
  hero_image_url  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Many-to-many: a property can have multiple owners, an owner multiple properties
create table property_owners (
  property_id   uuid not null references properties(id) on delete cascade,
  owner_id      uuid not null references profiles(id) on delete cascade,
  primary key (property_id, owner_id)
);

create table property_photos (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid not null references properties(id) on delete cascade,
  url           text not null,
  caption       text,
  taken_at      date not null default current_date,
  uploaded_by   uuid references profiles(id),
  created_at    timestamptz not null default now()
);

-- ============================================================
-- TASKS
-- ============================================================
create table tasks (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid not null references properties(id) on delete cascade,
  title         text not null,
  description   text,
  priority      text not null check (priority in ('Low','Medium','High')) default 'Medium',
  status        text not null check (status in ('To Do','In Progress','Completed')) default 'To Do',
  due_date      date,
  assigned_to   text,
  created_by    uuid references profiles(id),
  created_at    timestamptz not null default now(),
  completed_at  timestamptz
);

create table task_photos (
  id            uuid primary key default gen_random_uuid(),
  task_id       uuid not null references tasks(id) on delete cascade,
  url           text not null,
  uploaded_at   timestamptz not null default now()
);

-- ============================================================
-- PROPOSALS
-- ============================================================
create table proposals (
  id                uuid primary key default gen_random_uuid(),
  property_id       uuid not null references properties(id) on delete cascade,
  title             text not null,
  description       text,
  vendor_name       text,
  estimated_cost    numeric(10,2) not null,
  status            text not null check (status in ('Pending','Approved','Declined','Question')) default 'Pending',
  created_by        uuid references profiles(id),
  created_at        timestamptz not null default now(),
  owner_response    text,
  responded_by      uuid references profiles(id),
  responded_at      timestamptz
);

create table proposal_attachments (
  id            uuid primary key default gen_random_uuid(),
  proposal_id   uuid not null references proposals(id) on delete cascade,
  url           text not null,
  file_name     text,
  uploaded_at   timestamptz not null default now()
);

-- ============================================================
-- FILES (documents & general files; photos live in property_photos)
-- ============================================================
create table files (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid not null references properties(id) on delete cascade,
  name          text not null,
  category      text not null check (category in
                  ('Insurance','Warranties','Invoices','Permits','Appliance Manuals','HOA Documents','Surveys','General')),
  file_url      text not null,
  size_bytes    bigint,
  uploaded_by   uuid references profiles(id),
  uploaded_at   timestamptz not null default now()
);

-- ============================================================
-- INVOICES (Stripe-ready, not wired up in MVP)
-- ============================================================
create table invoices (
  id                          uuid primary key default gen_random_uuid(),
  property_id                 uuid not null references properties(id) on delete cascade,
  title                       text not null,
  amount                      numeric(10,2) not null,
  due_date                    date,
  status                      text not null check (status in ('Paid','Unpaid','Overdue')) default 'Unpaid',
  issued_at                   date not null default current_date,
  pdf_url                     text,
  stripe_payment_intent_id    text,
  created_by                  uuid references profiles(id),
  created_at                  timestamptz not null default now()
);

-- ============================================================
-- CALENDAR EVENTS (manual + future Airbnb/VRBO sync)
-- ============================================================
create table calendar_events (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid not null references properties(id) on delete cascade,
  title         text not null,
  type          text not null check (type in ('Reservation','Owner Stay','Maintenance Block','Inspection','Note')),
  start_date    date not null,
  end_date      date not null,
  notes         text,
  source        text not null default 'manual' check (source in ('manual','airbnb','vrbo')),
  external_id   text,
  created_by    uuid references profiles(id),
  created_at    timestamptz not null default now()
);

-- ============================================================
-- MESSAGES (one thread per property)
-- ============================================================
create table messages (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid not null references properties(id) on delete cascade,
  sender_id     uuid not null references profiles(id),
  sender_role   text not null check (sender_role in ('admin','owner')),
  body          text not null,
  created_at    timestamptz not null default now()
);

create table message_attachments (
  id            uuid primary key default gen_random_uuid(),
  message_id    uuid not null references messages(id) on delete cascade,
  url           text not null,
  file_name     text,
  uploaded_at   timestamptz not null default now()
);

-- ============================================================
-- INSPECTIONS
-- ============================================================
create table inspections (
  id              uuid primary key default gen_random_uuid(),
  property_id     uuid not null references properties(id) on delete cascade,
  title           text not null,
  inspector_name  text,
  inspection_date date not null,
  summary         text,
  status          text not null check (status in ('Pass','Needs Attention')),
  report_file_url text,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- NOTIFICATION PREFERENCES
-- ============================================================
create table notification_preferences (
  user_id           uuid primary key references profiles(id) on delete cascade,
  email_enabled     boolean not null default true,
  sms_enabled       boolean not null default false,
  weekly_summary    boolean not null default true,
  proposal_alerts   boolean not null default true
);

-- ============================================================
-- ACTIVITY LOG
-- ============================================================
create table activity_log (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid not null references properties(id) on delete cascade,
  actor_id      uuid references profiles(id),
  entity_type   text not null check (entity_type in ('task','proposal','file','invoice','event','message')),
  entity_id     uuid,
  description   text not null,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_tasks_property on tasks(property_id);
create index idx_tasks_status on tasks(status);
create index idx_proposals_property on proposals(property_id);
create index idx_proposals_status on proposals(status);
create index idx_files_property on files(property_id);
create index idx_invoices_property on invoices(property_id);
create index idx_invoices_status on invoices(status);
create index idx_events_property on calendar_events(property_id);
create index idx_events_dates on calendar_events(start_date, end_date);
create index idx_messages_property on messages(property_id, created_at);
create index idx_activity_property on activity_log(property_id, created_at);
