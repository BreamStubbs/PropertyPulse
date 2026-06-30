import { StatusPill } from "@/components/ui/StatusPill";
import { clsx } from "@/lib/clsx";

// The signature "Estate Plate" (spec §10): a frosted, gradient-overlaid nameplate
// in the bottom-left of every property hero, with the status pill bottom-right.
export function EstatePlate({
  name,
  address,
  status,
  size = "md",
}: {
  name: string;
  address: string;
  status: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/15 to-transparent" />
      <div className="relative flex items-end justify-between gap-3 p-4 sm:p-5">
        <div className="max-w-[75%] rounded-xl bg-white/10 px-3 py-2 backdrop-blur-md ring-1 ring-white/15">
          <h3
            className={clsx(
              "font-display leading-tight text-white drop-shadow",
              size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-xl",
            )}
          >
            {name}
          </h3>
          <p className={clsx("text-white/85", size === "lg" ? "text-sm" : "text-[13px]")}>{address}</p>
        </div>
        <StatusPill status={status} size={size === "sm" ? "sm" : "md"} className="shadow-sm" />
      </div>
    </div>
  );
}
