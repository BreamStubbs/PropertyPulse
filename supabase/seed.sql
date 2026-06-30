-- PropertyPulse seed data (spec §12)
-- Run after the migrations. Profiles assume matching auth.users rows exist.

-- Profiles
insert into profiles (id, full_name, email, phone, role) values
  ('00000000-0000-0000-0000-000000000001','Jordan Reyes','jordan@propertypulse.com','(941) 555-0148','admin'),
  ('00000000-0000-0000-0000-000000000002','Linda Whitfield','linda.whitfield@email.com','(617) 555-0119','owner'),
  ('00000000-0000-0000-0000-000000000003','Marcus Tran','marcus.tran@email.com','(843) 555-0173','owner'),
  ('00000000-0000-0000-0000-000000000004','Priya Anand','priya.anand@email.com','(239) 555-0162','owner'),
  ('00000000-0000-0000-0000-000000000005','Robert Caldwell','rob.caldwell@email.com','(262) 555-0184','owner');

-- Properties
insert into properties (id, name, address_line1, city, state, zip, property_type, status, beds, baths, sqft, notes, hero_image_url) values
  ('10000000-0000-0000-0000-000000000001','The Cypress House','214 Cypress Point Ln','Sarasota','FL','34236','Short-Term Rental','Active Rental',4,3,2400,'Gate code 4471. Pool service every Mon/Thu.','https://picsum.photos/seed/cypress/1200/800'),
  ('10000000-0000-0000-0000-000000000002','Magnolia Cottage','88 Magnolia Ave','Charleston','SC','29401','Vacant Home','Vacant',3,2,1850,'Monthly drive-by + interior walkthroughs while listed.','https://picsum.photos/seed/magnolia/1200/800'),
  ('10000000-0000-0000-0000-000000000003','Harbor View Residence','1209 Harbor View Dr','Sarasota','FL','34236','Owner-Occupied','Occupied',5,4,3100,'Owner in residence Nov–Apr.','https://picsum.photos/seed/harbor/1200/800'),
  ('10000000-0000-0000-0000-000000000004','Pinehurst Villa','562 Pinehurst Ct','Naples','FL','34102','Short-Term Rental','Active Rental',3,3,2200,'Cleaning crew: Coastal Turnovers.','https://picsum.photos/seed/pinehurst/1200/800'),
  ('10000000-0000-0000-0000-000000000005','Birchwood Lake House','77 Birchwood Trail','Lake Geneva','WI','53147','Vacant Home','Under Maintenance',4,3,2700,'Winterization scheduled each October.','https://picsum.photos/seed/birchwood/1200/800');

-- Ownership (Linda owns two properties; the rest own one each)
insert into property_owners (property_id, owner_id) values
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003'),
  ('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000004'),
  ('10000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000005');

-- Property photos
insert into property_photos (property_id, url, caption) values
  ('10000000-0000-0000-0000-000000000001','https://picsum.photos/seed/cypress1/800/600','Front exterior'),
  ('10000000-0000-0000-0000-000000000001','https://picsum.photos/seed/cypress2/800/600','Pool & lanai'),
  ('10000000-0000-0000-0000-000000000001','https://picsum.photos/seed/cypress3/800/600','Great room'),
  ('10000000-0000-0000-0000-000000000001','https://picsum.photos/seed/cypress4/800/600','Primary suite'),
  ('10000000-0000-0000-0000-000000000002','https://picsum.photos/seed/magnolia1/800/600','Curb appeal'),
  ('10000000-0000-0000-0000-000000000002','https://picsum.photos/seed/magnolia2/800/600','Kitchen'),
  ('10000000-0000-0000-0000-000000000003','https://picsum.photos/seed/harbor1/800/600','Water frontage'),
  ('10000000-0000-0000-0000-000000000004','https://picsum.photos/seed/pinehurst1/800/600','Villa entrance'),
  ('10000000-0000-0000-0000-000000000005','https://picsum.photos/seed/birchwood1/800/600','Lakeside deck');

-- Tasks
insert into tasks (property_id, title, description, priority, status, due_date, assigned_to, completed_at) values
  ('10000000-0000-0000-0000-000000000001','Replace pool pump motor','Pump grinding during AC cycling test; replacement ordered.','High','In Progress','2026-07-01','Sarasota Pool Pros', null),
  ('10000000-0000-0000-0000-000000000001','Deep clean before July 4th guests','Full turnover clean ahead of holiday-week reservation.','High','To Do','2026-07-02','Coastal Turnovers', null),
  ('10000000-0000-0000-0000-000000000001','Patch drywall in guest bathroom','Small impact crack, patched and primed.','Low','Completed','2026-06-20','Dave M. — Handyman', now()),
  ('10000000-0000-0000-0000-000000000002','Investigate water stain on hallway ceiling','Likely roof flashing near chimney.','High','In Progress','2026-07-01','Charleston Property Solutions', null),
  ('10000000-0000-0000-0000-000000000004','Hot tub jets not heating properly','Heater element appears to be failing.','High','In Progress','2026-07-03','Naples Spa Service', null);

-- Proposals
insert into proposals (property_id, title, description, vendor_name, estimated_cost, status, owner_response, responded_at) values
  ('10000000-0000-0000-0000-000000000001','Replace Pool Pump Motor','Original 2018 motor beyond economical repair.','Sarasota Pool Pros',1240,'Pending', null, null),
  ('10000000-0000-0000-0000-000000000001','Re-screen Pool Lanai','Full re-screen, 8 panels, storm-rated mesh.','Gulf Coast Screening',2850,'Approved','Approved — please get this scheduled before peak season.', now()),
  ('10000000-0000-0000-0000-000000000002','Repair Roof Flashing Near Chimney','Likely source of the ceiling stain.','Lowcountry Roofing',975,'Question','Is this covered under the roof''s existing warranty?', now()),
  ('10000000-0000-0000-0000-000000000004','New Hot Tub Heater Element','Heater element has failed.','Naples Spa Service',610,'Pending', null, null),
  ('10000000-0000-0000-0000-000000000005','Dock Removal & Winter Storage','Seasonal dock removal and storage.','Birchwood Dock Service',1450,'Declined','Declining this year — we sold the boat.', now());

-- Files
insert into files (property_id, name, category, file_url, size_bytes, uploaded_by) values
  ('10000000-0000-0000-0000-000000000001','Homeowners Insurance Policy 2026.pdf','Insurance','https://example.com/files/insurance-1.pdf',482000,'00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000001','Pool Equipment Warranty.pdf','Warranties','https://example.com/files/warranty-1.pdf',210000,'00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002','HOA Covenants & Restrictions.pdf','HOA Documents','https://example.com/files/hoa-2.pdf',1340000,'00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000003','Dock Permit - City of Sarasota.pdf','Permits','https://example.com/files/permit-3.pdf',95000,'00000000-0000-0000-0000-000000000001');

-- Invoices
insert into invoices (property_id, title, amount, due_date, status, issued_at) values
  ('10000000-0000-0000-0000-000000000001','June Pool Service',180,'2026-06-30','Paid','2026-06-15'),
  ('10000000-0000-0000-0000-000000000001','Property Management Fee — July',450,'2026-08-01','Unpaid','2026-07-01'),
  ('10000000-0000-0000-0000-000000000002','Monthly Vacancy Check — June',120,'2026-06-20','Overdue','2026-06-05'),
  ('10000000-0000-0000-0000-000000000004','Hot Tub Service Visit',165,'2026-07-02','Unpaid','2026-06-22');

-- Calendar events
insert into calendar_events (property_id, title, type, start_date, end_date, notes) values
  ('10000000-0000-0000-0000-000000000001','Guest Stay — Anderson Family','Reservation','2026-07-02','2026-07-09',''),
  ('10000000-0000-0000-0000-000000000001','Pool Pump Replacement','Maintenance Block','2026-07-01','2026-07-01','Sarasota Pool Pros on site.'),
  ('10000000-0000-0000-0000-000000000003','Whitfield Family Visit','Owner Stay','2026-09-20','2026-09-28','Arriving from Boston.'),
  ('10000000-0000-0000-0000-000000000004','Guest Stay — Nguyen Family','Reservation','2026-07-04','2026-07-11','');

-- Messages
insert into messages (property_id, sender_id, sender_role, body) values
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','admin','Hi Linda — quick update, the pool pump is grinding again. I''ve sent a proposal to replace it before the holiday weekend.'),
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','owner','Thanks for catching that early. Approved — let''s get it done before the 4th.'),
  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','admin','Marcus, we noticed a water stain on the hallway ceiling during this month''s walkthrough. Sent a proposal to have the roofer take a look.'),
  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003','owner','Before I approve, can you check whether this is covered under the roof''s transferable warranty?');

-- Inspections
insert into inspections (property_id, title, inspector_name, inspection_date, summary, status) values
  ('10000000-0000-0000-0000-000000000001','Annual Pool Safety Inspection','Sarasota Pool Pros','2026-05-10','Pool barrier and equipment meet code. Pump motor flagged as nearing end of life.','Needs Attention'),
  ('10000000-0000-0000-0000-000000000003','Dock & Seawall Inspection','Sarasota Marine Services','2026-05-22','Structure sound. Railing repainted as a preventative measure.','Pass');

-- Notification preferences (defaults for each profile)
insert into notification_preferences (user_id) values
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000005');
