import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center">
      {icon ? (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-slate-400">
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-lg text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-[15px] text-slate-500">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
