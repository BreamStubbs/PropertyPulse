import type { ReactNode } from "react";

export function PageHeader({
  description,
  action,
}: {
  description?: string;
  action?: ReactNode;
}) {
  if (!description && !action) return null;
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {description ? <p className="max-w-2xl text-[15px] text-slate-500">{description}</p> : <span />}
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
