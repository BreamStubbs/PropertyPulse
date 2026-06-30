import { clsx } from "@/lib/clsx";

type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "violet";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  danger: "bg-rose-50 text-rose-700 ring-rose-600/20",
  info: "bg-sky-50 text-sky-700 ring-sky-600/20",
  neutral: "bg-slate-100 text-slate-700 ring-slate-600/15",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
};

// Maps every status string in the schema to a tone. Color is never the only
// signal — the label text is always rendered alongside it (spec §10).
const STATUS_TONE: Record<string, Tone> = {
  // property status
  "Active Rental": "info",
  Occupied: "success",
  Vacant: "neutral",
  "Under Maintenance": "warning",
  // task status
  "To Do": "neutral",
  "In Progress": "warning",
  Completed: "success",
  // task priority
  Low: "neutral",
  Medium: "info",
  High: "danger",
  // proposal status
  Pending: "warning",
  Approved: "success",
  Declined: "danger",
  Question: "info",
  // invoice status
  Paid: "success",
  Unpaid: "warning",
  Overdue: "danger",
  // event type
  Reservation: "info",
  "Owner Stay": "success",
  "Maintenance Block": "warning",
  Inspection: "violet",
  Note: "neutral",
  // inspection status
  Pass: "success",
  "Needs Attention": "warning",
};

export function StatusPill({
  status,
  className,
  size = "md",
}: {
  status: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const tone = STATUS_TONE[status] ?? "neutral";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[13px]" : "px-2.5 py-1 text-sm",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", DOT[tone])} aria-hidden />
      {status}
    </span>
  );
}

const DOT: Record<Tone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
  neutral: "bg-slate-400",
  violet: "bg-violet-500",
};
