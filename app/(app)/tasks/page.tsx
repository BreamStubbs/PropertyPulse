"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { visibleProperties, visibleTasks } from "@/lib/queries";
import { TaskCard } from "@/components/tasks/TaskCard";
import { NewTaskModal } from "@/components/tasks/NewTaskModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/icons";
import type { TaskStatus } from "@/lib/types";

const COLUMNS: TaskStatus[] = ["To Do", "In Progress", "Completed"];

export default function TasksPage() {
  const { data, currentUser, advanceTask } = useStore();
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const properties = useMemo(() => (currentUser ? visibleProperties(data, currentUser) : []), [data, currentUser]);
  const tasks = currentUser ? visibleTasks(data, currentUser) : [];
  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";
  const propName = (id: string) => properties.find((p) => p.id === id)?.name;

  const filtered = tasks.filter((t) => propertyFilter === "all" || t.property_id === propertyFilter);

  return (
    <div>
      <PageHeader
        description={isAdmin ? "Track and advance work across your portfolio." : "Track work happening at your property."}
        action={
          isAdmin ? (
            <Button onClick={() => setModalOpen(true)}>
              <Icon.Plus className="h-5 w-5" /> New task
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 max-w-xs">
        <Select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} aria-label="Filter by property">
          <option value="all">All properties</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Icon.Tasks className="h-6 w-6" />}
          title="No tasks yet"
          description={isAdmin ? "Create your first task to start tracking work." : "When your manager logs work, it will show up here."}
          action={isAdmin ? <Button onClick={() => setModalOpen(true)}>New task</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {COLUMNS.map((col) => {
            const colTasks = filtered.filter((t) => t.status === col);
            return (
              <div key={col} className="rounded-2xl bg-stone-100/70 p-3 dark:bg-slate-900/50">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">{col}</h2>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[13px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colTasks.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      propertyName={propName(t.property_id)}
                      canEdit={isAdmin}
                      onAdvance={advanceTask}
                    />
                  ))}
                  {colTasks.length === 0 ? (
                    <p className="px-1 py-6 text-center text-[13px] text-slate-400 dark:text-slate-500">Nothing here</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NewTaskModal open={modalOpen} onClose={() => setModalOpen(false)} properties={properties} />
    </div>
  );
}
