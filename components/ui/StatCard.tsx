import Link from "next/link";
import { clsx } from "@/lib/clsx";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  href,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  href?: string;
  tone?: "neutral" | "amber" | "rose" | "emerald" | "sky";
}) {
  const toneRing: Record<string, string> = {
    neutral: "text-slate-500 bg-slate-100",
    amber: "text-amber-600 bg-amber-50",
    rose: "text-rose-600 bg-rose-50",
    emerald: "text-emerald-600 bg-emerald-50",
    sky: "text-sky-600 bg-sky-50",
  };

  const inner = (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
      {icon ? (
        <span className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11", toneRing[tone])}>
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <div className="font-display text-xl leading-none text-slate-900 sm:text-2xl">{value}</div>
        <div className="mt-1 text-sm leading-snug text-slate-500">{label}</div>
      </div>
    </div>
  );

  const base = "block rounded-2xl border border-stone-200 bg-white p-4 shadow-card transition-colors sm:p-5";
  if (href) {
    return (
      <Link href={href} className={clsx(base, "hover:border-amber-300 hover:bg-amber-50/30")}>
        {inner}
      </Link>
    );
  }
  return <div className={base}>{inner}</div>;
}
