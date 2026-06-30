// Pure selectors over AppData. These mirror the access rules enforced by RLS in
// supabase/migrations/0002_rls.sql: admins see everything; owners see only the
// properties linked to them via property_owners.
import { TODAY } from "./store";
import type {
  ActivityEntry,
  AppData,
  CalendarEvent,
  FileRecord,
  Inspection,
  Invoice,
  Message,
  Profile,
  Property,
  PropertyPhoto,
  Proposal,
  Task,
} from "./types";

export function ownedPropertyIds(data: AppData, userId: string): string[] {
  return data.property_owners.filter((po) => po.owner_id === userId).map((po) => po.property_id);
}

export function visibleProperties(data: AppData, user: Profile): Property[] {
  if (user.role === "admin") return data.properties;
  const ids = new Set(ownedPropertyIds(data, user.id));
  return data.properties.filter((p) => ids.has(p.id));
}

export function canSeeProperty(data: AppData, user: Profile, propertyId: string): boolean {
  if (user.role === "admin") return true;
  return ownedPropertyIds(data, user.id).includes(propertyId);
}

function scopeByProperty<T extends { property_id: string }>(rows: T[], data: AppData, user: Profile): T[] {
  if (user.role === "admin") return rows;
  const ids = new Set(ownedPropertyIds(data, user.id));
  return rows.filter((r) => ids.has(r.property_id));
}

export const visibleTasks = (data: AppData, user: Profile): Task[] => scopeByProperty(data.tasks, data, user);
export const visibleProposals = (data: AppData, user: Profile): Proposal[] => scopeByProperty(data.proposals, data, user);
export const visibleFiles = (data: AppData, user: Profile): FileRecord[] => scopeByProperty(data.files, data, user);
export const visibleEvents = (data: AppData, user: Profile): CalendarEvent[] => scopeByProperty(data.calendar_events, data, user);
export const visibleMessages = (data: AppData, user: Profile): Message[] => scopeByProperty(data.messages, data, user);
export const visibleInspections = (data: AppData, user: Profile): Inspection[] => scopeByProperty(data.inspections, data, user);
export const visibleActivity = (data: AppData, user: Profile): ActivityEntry[] => scopeByProperty(data.activity_log, data, user);

export function visibleInvoices(data: AppData, user: Profile): Invoice[] {
  return scopeByProperty(data.invoices, data, user).map(withDerivedInvoiceStatus);
}

// Spec §8.5: unpaid invoices past their due date are treated as Overdue (check-on-read).
export function withDerivedInvoiceStatus(inv: Invoice): Invoice {
  if (inv.status === "Unpaid" && inv.due_date && inv.due_date < TODAY) {
    return { ...inv, status: "Overdue" };
  }
  return inv;
}

export function propertyPhotos(data: AppData, propertyId: string): PropertyPhoto[] {
  return data.property_photos.filter((p) => p.property_id === propertyId);
}

export function propertyOwnersOf(data: AppData, propertyId: string): Profile[] {
  const ownerIds = data.property_owners.filter((po) => po.property_id === propertyId).map((po) => po.owner_id);
  return data.profiles.filter((p) => ownerIds.includes(p.id));
}

export function adminProfile(data: AppData): Profile | undefined {
  return data.profiles.find((p) => p.role === "admin");
}

export function profileById(data: AppData, id?: string | null): Profile | undefined {
  if (!id) return undefined;
  return data.profiles.find((p) => p.id === id);
}

export function propertyById(data: AppData, id: string): Property | undefined {
  return data.properties.find((p) => p.id === id);
}

// Threads available to the user: one per visible property that has activity or
// (for admins) any property at all.
export function messageThreads(data: AppData, user: Profile): { property: Property; messages: Message[]; lastAt: number }[] {
  const props = visibleProperties(data, user);
  return props
    .map((property) => {
      const messages = data.messages
        .filter((m) => m.property_id === property.id)
        .sort((a, b) => a.created_at.localeCompare(b.created_at));
      const lastAt = messages.length ? new Date(messages[messages.length - 1].created_at).getTime() : 0;
      return { property, messages, lastAt };
    })
    .sort((a, b) => b.lastAt - a.lastAt);
}
