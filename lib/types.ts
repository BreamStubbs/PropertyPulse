// PropertyPulse domain types — mirror the Postgres schema in supabase/migrations.

export type Role = "admin" | "owner";

export type PropertyType = "Short-Term Rental" | "Vacant Home" | "Owner-Occupied";
export type PropertyStatus = "Active Rental" | "Occupied" | "Vacant" | "Under Maintenance";
export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "To Do" | "In Progress" | "Completed";
export type ProposalStatus = "Pending" | "Approved" | "Declined" | "Question";
export type InvoiceStatus = "Paid" | "Unpaid" | "Overdue";
export type EventType = "Reservation" | "Owner Stay" | "Maintenance Block" | "Inspection" | "Note";
export type EventSource = "manual" | "airbnb" | "vrbo";
export type InspectionStatus = "Pass" | "Needs Attention";
export type FileCategory =
  | "Insurance"
  | "Warranties"
  | "Invoices"
  | "Permits"
  | "Appliance Manuals"
  | "HOA Documents"
  | "Surveys"
  | "General";
export type EntityType = "task" | "proposal" | "file" | "invoice" | "event" | "message";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: Role;
}

export interface Property {
  id: string;
  name: string;
  address_line1: string;
  city: string;
  state: string;
  zip: string;
  property_type: PropertyType;
  status: PropertyStatus;
  beds?: number;
  baths?: number;
  sqft?: number;
  notes?: string;
  hero_image_url?: string;
}

export interface PropertyOwner {
  property_id: string;
  owner_id: string;
}

export interface PropertyPhoto {
  id: string;
  property_id: string;
  url: string;
  caption?: string;
  taken_at: string;
  uploaded_by?: string;
}

export interface Task {
  id: string;
  property_id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  assigned_to?: string;
  created_by?: string;
  created_at: string;
  completed_at?: string | null;
  photo_url?: string;
}

export interface Proposal {
  id: string;
  property_id: string;
  title: string;
  description?: string;
  vendor_name?: string;
  estimated_cost: number;
  status: ProposalStatus;
  created_by?: string;
  created_at: string;
  owner_response?: string | null;
  responded_by?: string | null;
  responded_at?: string | null;
}

export interface FileRecord {
  id: string;
  property_id: string;
  name: string;
  category: FileCategory;
  file_url: string;
  size_bytes?: number;
  uploaded_by?: string;
  uploaded_at: string;
}

export interface Invoice {
  id: string;
  property_id: string;
  title: string;
  amount: number;
  due_date?: string;
  status: InvoiceStatus;
  issued_at: string;
  pdf_url?: string;
  stripe_payment_intent_id?: string | null;
}

export interface CalendarEvent {
  id: string;
  property_id: string;
  title: string;
  type: EventType;
  start_date: string;
  end_date: string;
  notes?: string;
  source: EventSource;
  external_id?: string | null;
}

export interface Message {
  id: string;
  property_id: string;
  sender_id: string;
  sender_role: Role;
  body: string;
  created_at: string;
}

export interface Inspection {
  id: string;
  property_id: string;
  title: string;
  inspector_name?: string;
  inspection_date: string;
  summary?: string;
  status: InspectionStatus;
  report_file_url?: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  weekly_summary: boolean;
  proposal_alerts: boolean;
}

export interface ActivityEntry {
  id: string;
  property_id: string;
  actor_id?: string;
  entity_type: EntityType;
  entity_id?: string;
  description: string;
  created_at: string;
}

export interface AppData {
  profiles: Profile[];
  properties: Property[];
  property_owners: PropertyOwner[];
  property_photos: PropertyPhoto[];
  tasks: Task[];
  proposals: Proposal[];
  files: FileRecord[];
  invoices: Invoice[];
  calendar_events: CalendarEvent[];
  messages: Message[];
  inspections: Inspection[];
  notification_preferences: NotificationPreferences[];
  activity_log: ActivityEntry[];
}
