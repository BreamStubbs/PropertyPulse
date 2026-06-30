import Link from "next/link";
import { EstatePlate } from "./EstatePlate";
import { Icon } from "@/components/ui/icons";
import type { Property } from "@/lib/types";

export function PropertyCard({
  property,
  openTasks,
  pendingProposals,
  compact = false,
}: {
  property: Property;
  openTasks?: number;
  pendingProposals?: number;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <div className={`relative w-full overflow-hidden ${compact ? "aspect-[16/9]" : "aspect-[3/2]"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.hero_image_url}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <EstatePlate
          name={property.name}
          address={`${property.address_line1}, ${property.city}, ${property.state}`}
          status={property.status}
          size={compact ? "sm" : "md"}
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1">
            <Icon.Bed className="h-4 w-4 text-slate-400" /> {property.beds ?? "—"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon.Bath className="h-4 w-4 text-slate-400" /> {property.baths ?? "—"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon.Ruler className="h-4 w-4 text-slate-400" />{" "}
            {property.sqft ? property.sqft.toLocaleString() : "—"} sqft
          </span>
        </div>
        <div className="flex items-center gap-2">
          {openTasks ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[13px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/25">
              {openTasks} open
            </span>
          ) : null}
          {pendingProposals ? (
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[13px] font-medium text-sky-700 ring-1 ring-inset ring-sky-600/20 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-400/25">
              {pendingProposals} proposal{pendingProposals > 1 ? "s" : ""}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
