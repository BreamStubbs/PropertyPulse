-- PropertyPulse Row-Level Security (spec §6)
-- Admins read/write everything; owners read/write rows whose property they own.

alter table profiles enable row level security;
alter table properties enable row level security;
alter table property_owners enable row level security;
alter table property_photos enable row level security;
alter table tasks enable row level security;
alter table task_photos enable row level security;
alter table proposals enable row level security;
alter table proposal_attachments enable row level security;
alter table files enable row level security;
alter table invoices enable row level security;
alter table calendar_events enable row level security;
alter table messages enable row level security;
alter table message_attachments enable row level security;
alter table inspections enable row level security;
alter table notification_preferences enable row level security;
alter table activity_log enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin() returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$ language sql stable;

-- Helper: does the current user own this property?
create or replace function owns_property(pid uuid) returns boolean as $$
  select exists (
    select 1 from property_owners where property_id = pid and owner_id = auth.uid()
  );
$$ language sql stable;

-- ---------- profiles ----------
create policy "users read own profile" on profiles for select using (id = auth.uid() or is_admin());
create policy "users update own profile" on profiles for update using (id = auth.uid());
create policy "admins manage profiles" on profiles for all using (is_admin()) with check (is_admin());

-- ---------- properties ----------
create policy "view properties" on properties for select using (is_admin() or owns_property(id));
create policy "admins write properties" on properties for all using (is_admin()) with check (is_admin());

-- ---------- property_owners ----------
create policy "view ownership" on property_owners for select using (is_admin() or owner_id = auth.uid());
create policy "admins write ownership" on property_owners for all using (is_admin()) with check (is_admin());

-- ---------- property_photos ----------
create policy "view photos" on property_photos for select using (is_admin() or owns_property(property_id));
create policy "admins write photos" on property_photos for all using (is_admin()) with check (is_admin());

-- ---------- tasks ----------
create policy "admins see all tasks" on tasks for select using (is_admin());
create policy "owners see their property tasks" on tasks for select using (owns_property(property_id));
create policy "admins write tasks" on tasks for all using (is_admin()) with check (is_admin());

-- ---------- task_photos ----------
create policy "view task photos" on task_photos for select using (
  is_admin() or exists (select 1 from tasks t where t.id = task_id and owns_property(t.property_id))
);
create policy "admins write task photos" on task_photos for all using (is_admin()) with check (is_admin());

-- ---------- proposals ----------
create policy "owners read their proposals" on proposals for select using (owns_property(property_id));
create policy "owners respond to proposals" on proposals for update using (owns_property(property_id));
create policy "admins manage proposals" on proposals for all using (is_admin()) with check (is_admin());

-- ---------- proposal_attachments ----------
create policy "view proposal attachments" on proposal_attachments for select using (
  is_admin() or exists (select 1 from proposals p where p.id = proposal_id and owns_property(p.property_id))
);
create policy "admins write proposal attachments" on proposal_attachments for all using (is_admin()) with check (is_admin());

-- ---------- files (both roles may upload to their own properties) ----------
create policy "view files" on files for select using (is_admin() or owns_property(property_id));
create policy "upload files" on files for insert with check (is_admin() or owns_property(property_id));
create policy "admins manage files" on files for update using (is_admin());
create policy "admins delete files" on files for delete using (is_admin());

-- ---------- invoices ----------
create policy "view invoices" on invoices for select using (is_admin() or owns_property(property_id));
create policy "admins write invoices" on invoices for all using (is_admin()) with check (is_admin());

-- ---------- calendar_events ----------
create policy "view events" on calendar_events for select using (is_admin() or owns_property(property_id));
create policy "admins write events" on calendar_events for all using (is_admin()) with check (is_admin());

-- ---------- messages (both roles send into threads they're attached to) ----------
create policy "participants read messages" on messages for select using (is_admin() or owns_property(property_id));
create policy "participants send messages" on messages for insert with check (is_admin() or owns_property(property_id));

-- ---------- message_attachments ----------
create policy "view message attachments" on message_attachments for select using (
  is_admin() or exists (select 1 from messages m where m.id = message_id and owns_property(m.property_id))
);
create policy "send message attachments" on message_attachments for insert with check (
  is_admin() or exists (select 1 from messages m where m.id = message_id and owns_property(m.property_id))
);

-- ---------- inspections ----------
create policy "view inspections" on inspections for select using (is_admin() or owns_property(property_id));
create policy "admins write inspections" on inspections for all using (is_admin()) with check (is_admin());

-- ---------- notification_preferences ----------
create policy "manage own prefs" on notification_preferences for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- activity_log ----------
create policy "view activity" on activity_log for select using (is_admin() or owns_property(property_id));
create policy "write activity" on activity_log for insert with check (is_admin() or owns_property(property_id));
