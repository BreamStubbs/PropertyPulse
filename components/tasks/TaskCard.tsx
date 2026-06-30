"use client";

import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";
import { formatDate } from "@/lib/format";
import type { Task } from "@/lib/types";

const ADVANCE_LABEL: Record<string, string> = {
  "To Do": "Start work",
  "In Progress": "Mark complete",
};

export function TaskCard({
  task,
  propertyName,
  canEdit,
  onAdvance,
}: {
  task: Task;
  propertyName?: string;
  canEdit: boolean;
  onAdvance?: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[15px] font-semibold leading-snug text-slate-900">{task.title}</h4>
        <StatusPill status={task.priority} size="sm" />
      </div>
      {propertyName ? <p className="mt-0.5 text-[13px] text-slate-500">{propertyName}</p> : null}
      {task.description ? <p className="mt-2 text-sm text-slate-600">{task.description}</p> : null}

      {task.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={task.photo_url} alt="" className="mt-3 h-28 w-full rounded-lg object-cover" />
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slate-500">
        {task.due_date ? (
          <span className="inline-flex items-center gap-1">
            <Icon.Calendar className="h-4 w-4" /> Due {formatDate(task.due_date)}
          </span>
        ) : null}
        {task.assigned_to ? (
          <span className="inline-flex items-center gap-1">
            <Icon.Tasks className="h-4 w-4" /> {task.assigned_to}
          </span>
        ) : null}
      </div>

      {canEdit && task.status !== "Completed" && onAdvance ? (
        <div className="mt-3">
          <Button size="sm" variant="secondary" onClick={() => onAdvance(task.id)}>
            <Icon.Check className="h-4 w-4" />
            {ADVANCE_LABEL[task.status]}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
