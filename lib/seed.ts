// In-memory seed data for the runnable MVP. Mirrors supabase/seed.sql 1:1 so the
// app behaves identically once swapped onto a real Supabase backend.
import type { AppData } from "./types";

const ADMIN = "00000000-0000-0000-0000-000000000001";
const LINDA = "00000000-0000-0000-0000-000000000002";
const MARCUS = "00000000-0000-0000-0000-000000000003";
const PRIYA = "00000000-0000-0000-0000-000000000004";
const ROBERT = "00000000-0000-0000-0000-000000000005";

const P_CYPRESS = "10000000-0000-0000-0000-000000000001";
const P_MAGNOLIA = "10000000-0000-0000-0000-000000000002";
const P_HARBOR = "10000000-0000-0000-0000-000000000003";
const P_PINEHURST = "10000000-0000-0000-0000-000000000004";
const P_BIRCHWOOD = "10000000-0000-0000-0000-000000000005";

const NOW = "2026-06-30T12:00:00.000Z";

export function buildSeed(): AppData {
  return {
    profiles: [
      { id: ADMIN, full_name: "Jordan Reyes", email: "jordan@propertypulse.com", phone: "(941) 555-0148", role: "admin", avatar_url: "https://i.pravatar.cc/120?img=12" },
      { id: LINDA, full_name: "Linda Whitfield", email: "linda.whitfield@email.com", phone: "(617) 555-0119", role: "owner", avatar_url: "https://i.pravatar.cc/120?img=45" },
      { id: MARCUS, full_name: "Marcus Tran", email: "marcus.tran@email.com", phone: "(843) 555-0173", role: "owner", avatar_url: "https://i.pravatar.cc/120?img=33" },
      { id: PRIYA, full_name: "Priya Anand", email: "priya.anand@email.com", phone: "(239) 555-0162", role: "owner", avatar_url: "https://i.pravatar.cc/120?img=27" },
      { id: ROBERT, full_name: "Robert Caldwell", email: "rob.caldwell@email.com", phone: "(262) 555-0184", role: "owner", avatar_url: "https://i.pravatar.cc/120?img=15" },
    ],
    properties: [
      { id: P_CYPRESS, name: "The Cypress House", address_line1: "214 Cypress Point Ln", city: "Sarasota", state: "FL", zip: "34236", property_type: "Short-Term Rental", status: "Active Rental", beds: 4, baths: 3, sqft: 2400, notes: "Gate code 4471. Pool service every Mon/Thu.", hero_image_url: "https://picsum.photos/seed/cypress/1200/800" },
      { id: P_MAGNOLIA, name: "Magnolia Cottage", address_line1: "88 Magnolia Ave", city: "Charleston", state: "SC", zip: "29401", property_type: "Vacant Home", status: "Vacant", beds: 3, baths: 2, sqft: 1850, notes: "Monthly drive-by + interior walkthroughs while listed.", hero_image_url: "https://picsum.photos/seed/magnolia/1200/800" },
      { id: P_HARBOR, name: "Harbor View Residence", address_line1: "1209 Harbor View Dr", city: "Sarasota", state: "FL", zip: "34236", property_type: "Owner-Occupied", status: "Occupied", beds: 5, baths: 4, sqft: 3100, notes: "Owner in residence Nov–Apr.", hero_image_url: "https://picsum.photos/seed/harbor/1200/800" },
      { id: P_PINEHURST, name: "Pinehurst Villa", address_line1: "562 Pinehurst Ct", city: "Naples", state: "FL", zip: "34102", property_type: "Short-Term Rental", status: "Active Rental", beds: 3, baths: 3, sqft: 2200, notes: "Cleaning crew: Coastal Turnovers.", hero_image_url: "https://picsum.photos/seed/pinehurst/1200/800" },
      { id: P_BIRCHWOOD, name: "Birchwood Lake House", address_line1: "77 Birchwood Trail", city: "Lake Geneva", state: "WI", zip: "53147", property_type: "Vacant Home", status: "Under Maintenance", beds: 4, baths: 3, sqft: 2700, notes: "Winterization scheduled each October.", hero_image_url: "https://picsum.photos/seed/birchwood/1200/800" },
    ],
    property_owners: [
      { property_id: P_CYPRESS, owner_id: LINDA },
      { property_id: P_HARBOR, owner_id: LINDA },
      { property_id: P_MAGNOLIA, owner_id: MARCUS },
      { property_id: P_PINEHURST, owner_id: PRIYA },
      { property_id: P_BIRCHWOOD, owner_id: ROBERT },
    ],
    property_photos: [
      { id: "ph-1", property_id: P_CYPRESS, url: "https://picsum.photos/seed/cypress1/800/600", caption: "Front exterior", taken_at: "2026-05-02" },
      { id: "ph-2", property_id: P_CYPRESS, url: "https://picsum.photos/seed/cypress2/800/600", caption: "Pool & lanai", taken_at: "2026-05-02" },
      { id: "ph-3", property_id: P_CYPRESS, url: "https://picsum.photos/seed/cypress3/800/600", caption: "Great room", taken_at: "2026-05-02" },
      { id: "ph-4", property_id: P_CYPRESS, url: "https://picsum.photos/seed/cypress4/800/600", caption: "Primary suite", taken_at: "2026-05-02" },
      { id: "ph-5", property_id: P_MAGNOLIA, url: "https://picsum.photos/seed/magnolia1/800/600", caption: "Curb appeal", taken_at: "2026-06-01" },
      { id: "ph-6", property_id: P_MAGNOLIA, url: "https://picsum.photos/seed/magnolia2/800/600", caption: "Kitchen", taken_at: "2026-06-01" },
      { id: "ph-7", property_id: P_HARBOR, url: "https://picsum.photos/seed/harbor1/800/600", caption: "Water frontage", taken_at: "2026-05-22" },
      { id: "ph-8", property_id: P_PINEHURST, url: "https://picsum.photos/seed/pinehurst1/800/600", caption: "Villa entrance", taken_at: "2026-06-10" },
      { id: "ph-9", property_id: P_BIRCHWOOD, url: "https://picsum.photos/seed/birchwood1/800/600", caption: "Lakeside deck", taken_at: "2026-06-12" },
    ],
    tasks: [
      { id: "t-1", property_id: P_CYPRESS, title: "Replace pool pump motor", description: "Pump grinding during AC cycling test; replacement ordered.", priority: "High", status: "In Progress", due_date: "2026-07-01", assigned_to: "Sarasota Pool Pros", created_by: ADMIN, created_at: "2026-06-22T09:00:00.000Z" },
      { id: "t-2", property_id: P_CYPRESS, title: "Deep clean before July 4th guests", description: "Full turnover clean ahead of holiday-week reservation.", priority: "High", status: "To Do", due_date: "2026-07-02", assigned_to: "Coastal Turnovers", created_by: ADMIN, created_at: "2026-06-24T09:00:00.000Z" },
      { id: "t-3", property_id: P_CYPRESS, title: "Patch drywall in guest bathroom", description: "Small impact crack, patched and primed.", priority: "Low", status: "Completed", due_date: "2026-06-20", assigned_to: "Dave M. — Handyman", created_by: ADMIN, created_at: "2026-06-15T09:00:00.000Z", completed_at: "2026-06-20T15:30:00.000Z" },
      { id: "t-4", property_id: P_MAGNOLIA, title: "Investigate water stain on hallway ceiling", description: "Likely roof flashing near chimney.", priority: "High", status: "In Progress", due_date: "2026-07-01", assigned_to: "Charleston Property Solutions", created_by: ADMIN, created_at: "2026-06-21T09:00:00.000Z" },
      { id: "t-5", property_id: P_PINEHURST, title: "Hot tub jets not heating properly", description: "Heater element appears to be failing.", priority: "High", status: "In Progress", due_date: "2026-07-03", assigned_to: "Naples Spa Service", created_by: ADMIN, created_at: "2026-06-23T09:00:00.000Z" },
    ],
    proposals: [
      { id: "pr-1", property_id: P_CYPRESS, title: "Replace Pool Pump Motor", description: "Original 2018 motor beyond economical repair.", vendor_name: "Sarasota Pool Pros", estimated_cost: 1240, status: "Pending", created_by: ADMIN, created_at: "2026-06-22T10:00:00.000Z" },
      { id: "pr-2", property_id: P_CYPRESS, title: "Re-screen Pool Lanai", description: "Full re-screen, 8 panels, storm-rated mesh.", vendor_name: "Gulf Coast Screening", estimated_cost: 2850, status: "Approved", created_by: ADMIN, created_at: "2026-06-10T10:00:00.000Z", owner_response: "Approved — please get this scheduled before peak season.", responded_by: LINDA, responded_at: "2026-06-11T14:00:00.000Z" },
      { id: "pr-3", property_id: P_MAGNOLIA, title: "Repair Roof Flashing Near Chimney", description: "Likely source of the ceiling stain.", vendor_name: "Lowcountry Roofing", estimated_cost: 975, status: "Question", created_by: ADMIN, created_at: "2026-06-21T10:00:00.000Z", owner_response: "Is this covered under the roof's existing warranty?", responded_by: MARCUS, responded_at: "2026-06-22T08:00:00.000Z" },
      { id: "pr-4", property_id: P_PINEHURST, title: "New Hot Tub Heater Element", description: "Heater element has failed.", vendor_name: "Naples Spa Service", estimated_cost: 610, status: "Pending", created_by: ADMIN, created_at: "2026-06-23T10:00:00.000Z" },
      { id: "pr-5", property_id: P_BIRCHWOOD, title: "Dock Removal & Winter Storage", description: "Seasonal dock removal and storage.", vendor_name: "Birchwood Dock Service", estimated_cost: 1450, status: "Declined", created_by: ADMIN, created_at: "2026-06-05T10:00:00.000Z", owner_response: "Declining this year — we sold the boat.", responded_by: ROBERT, responded_at: "2026-06-06T11:00:00.000Z" },
    ],
    files: [
      { id: "f-1", property_id: P_CYPRESS, name: "Homeowners Insurance Policy 2026.pdf", category: "Insurance", file_url: "https://example.com/files/insurance-1.pdf", size_bytes: 482000, uploaded_by: ADMIN, uploaded_at: "2026-01-15T09:00:00.000Z" },
      { id: "f-2", property_id: P_CYPRESS, name: "Pool Equipment Warranty.pdf", category: "Warranties", file_url: "https://example.com/files/warranty-1.pdf", size_bytes: 210000, uploaded_by: ADMIN, uploaded_at: "2026-02-03T09:00:00.000Z" },
      { id: "f-3", property_id: P_MAGNOLIA, name: "HOA Covenants & Restrictions.pdf", category: "HOA Documents", file_url: "https://example.com/files/hoa-2.pdf", size_bytes: 1340000, uploaded_by: ADMIN, uploaded_at: "2026-03-11T09:00:00.000Z" },
      { id: "f-4", property_id: P_HARBOR, name: "Dock Permit - City of Sarasota.pdf", category: "Permits", file_url: "https://example.com/files/permit-3.pdf", size_bytes: 95000, uploaded_by: ADMIN, uploaded_at: "2026-04-19T09:00:00.000Z" },
    ],
    invoices: [
      { id: "i-1", property_id: P_CYPRESS, title: "June Pool Service", amount: 180, due_date: "2026-06-30", status: "Paid", issued_at: "2026-06-15" },
      { id: "i-2", property_id: P_CYPRESS, title: "Property Management Fee — July", amount: 450, due_date: "2026-08-01", status: "Unpaid", issued_at: "2026-07-01" },
      { id: "i-3", property_id: P_MAGNOLIA, title: "Monthly Vacancy Check — June", amount: 120, due_date: "2026-06-20", status: "Overdue", issued_at: "2026-06-05" },
      { id: "i-4", property_id: P_PINEHURST, title: "Hot Tub Service Visit", amount: 165, due_date: "2026-07-02", status: "Unpaid", issued_at: "2026-06-22" },
    ],
    calendar_events: [
      { id: "e-1", property_id: P_CYPRESS, title: "Guest Stay — Anderson Family", type: "Reservation", start_date: "2026-07-02", end_date: "2026-07-09", notes: "", source: "manual" },
      { id: "e-2", property_id: P_CYPRESS, title: "Pool Pump Replacement", type: "Maintenance Block", start_date: "2026-07-01", end_date: "2026-07-01", notes: "Sarasota Pool Pros on site.", source: "manual" },
      { id: "e-3", property_id: P_HARBOR, title: "Whitfield Family Visit", type: "Owner Stay", start_date: "2026-09-20", end_date: "2026-09-28", notes: "Arriving from Boston.", source: "manual" },
      { id: "e-4", property_id: P_PINEHURST, title: "Guest Stay — Nguyen Family", type: "Reservation", start_date: "2026-07-04", end_date: "2026-07-11", notes: "", source: "manual" },
    ],
    messages: [
      { id: "m-1", property_id: P_CYPRESS, sender_id: ADMIN, sender_role: "admin", body: "Hi Linda — quick update, the pool pump is grinding again. I've sent a proposal to replace it before the holiday weekend.", created_at: "2026-06-22T10:05:00.000Z" },
      { id: "m-2", property_id: P_CYPRESS, sender_id: LINDA, sender_role: "owner", body: "Thanks for catching that early. Approved — let's get it done before the 4th.", created_at: "2026-06-22T12:40:00.000Z" },
      { id: "m-3", property_id: P_MAGNOLIA, sender_id: ADMIN, sender_role: "admin", body: "Marcus, we noticed a water stain on the hallway ceiling during this month's walkthrough. Sent a proposal to have the roofer take a look.", created_at: "2026-06-21T11:00:00.000Z" },
      { id: "m-4", property_id: P_MAGNOLIA, sender_id: MARCUS, sender_role: "owner", body: "Before I approve, can you check whether this is covered under the roof's transferable warranty?", created_at: "2026-06-22T08:05:00.000Z" },
    ],
    inspections: [
      { id: "in-1", property_id: P_CYPRESS, title: "Annual Pool Safety Inspection", inspector_name: "Sarasota Pool Pros", inspection_date: "2026-05-10", summary: "Pool barrier and equipment meet code. Pump motor flagged as nearing end of life.", status: "Needs Attention" },
      { id: "in-2", property_id: P_HARBOR, title: "Dock & Seawall Inspection", inspector_name: "Sarasota Marine Services", inspection_date: "2026-05-22", summary: "Structure sound. Railing repainted as a preventative measure.", status: "Pass" },
    ],
    notification_preferences: [
      { user_id: ADMIN, email_enabled: true, sms_enabled: false, weekly_summary: true, proposal_alerts: true },
      { user_id: LINDA, email_enabled: true, sms_enabled: true, weekly_summary: true, proposal_alerts: true },
      { user_id: MARCUS, email_enabled: true, sms_enabled: false, weekly_summary: true, proposal_alerts: true },
      { user_id: PRIYA, email_enabled: true, sms_enabled: false, weekly_summary: false, proposal_alerts: true },
      { user_id: ROBERT, email_enabled: true, sms_enabled: false, weekly_summary: true, proposal_alerts: false },
    ],
    activity_log: [
      { id: "a-1", property_id: P_CYPRESS, actor_id: ADMIN, entity_type: "proposal", entity_id: "pr-1", description: "Jordan Reyes created proposal “Replace Pool Pump Motor”", created_at: "2026-06-22T10:00:00.000Z" },
      { id: "a-2", property_id: P_CYPRESS, actor_id: LINDA, entity_type: "proposal", entity_id: "pr-2", description: "Linda Whitfield approved “Re-screen Pool Lanai”", created_at: "2026-06-11T14:00:00.000Z" },
      { id: "a-3", property_id: P_CYPRESS, actor_id: ADMIN, entity_type: "task", entity_id: "t-3", description: "Jordan Reyes completed task “Patch drywall in guest bathroom”", created_at: "2026-06-20T15:30:00.000Z" },
      { id: "a-4", property_id: P_MAGNOLIA, actor_id: MARCUS, entity_type: "proposal", entity_id: "pr-3", description: "Marcus Tran asked a question on “Repair Roof Flashing Near Chimney”", created_at: "2026-06-22T08:00:00.000Z" },
      { id: "a-5", property_id: P_PINEHURST, actor_id: ADMIN, entity_type: "task", entity_id: "t-5", description: "Jordan Reyes created task “Hot tub jets not heating properly”", created_at: "2026-06-23T09:00:00.000Z" },
    ],
  };
}

export const SEED_TIMESTAMP = NOW;
