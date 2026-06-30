"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { visibleEvents, visibleProperties } from "@/lib/queries";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { NewEventModal } from "@/components/calendar/NewEventModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/icons";
import { formatDate } from "@/lib/format";
import type { CalendarEvent } from "@/lib/types";

export default function CalendarPage() {
  const { data, currentUser } = useStore();
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [selectedDay, setSelectedDay] = useState<{ key: string; events: CalendarEvent[] } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const properties = useMemo(() => (currentUser ? visibleProperties(data, currentUser) : []), [data, currentUser]);
  const events = currentUser ? visibleEvents(data, currentUser) : [];
  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";
  const propName = (id: string) => properties.find((p) => p.id === id)?.name;
  const filtered = events.filter((e) => propertyFilter === "all" || e.property_id === propertyFilter);

  return (
    <div>
      <PageHeader
        description="Reservations, owner stays, maintenance blocks and more — color-coded by type."
        action={
          isAdmin ? (
            <Button onClick={() => setModalOpen(true)}>
              <Icon.Plus className="h-5 w-5" /> New event
            </Button>
          ) : undefined
        }
      />

      {/* Future integration placeholder banner (spec §9.8) */}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 dark:border-sky-500/30 dark:bg-sky-500/10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
            <Icon.Sparkle className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">Connect your Airbnb or VRBO calendar</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Auto-sync reservations from your listing’s calendar feed — coming soon.</p>
          </div>
        </div>
        <button
          disabled
          className="cursor-not-allowed rounded-xl border border-sky-300 bg-white px-4 py-2 text-sm font-medium text-sky-400 dark:border-sky-500/30 dark:bg-slate-900 dark:text-sky-500/70"
        >
          Connect — soon
        </button>
      </div>

      <div className="mb-4 max-w-xs">
        <Select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} aria-label="Filter by property">
          <option value="all">All properties</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </div>

      <MonthCalendar events={filtered} onSelectDay={(key, dayEvents) => setSelectedDay({ key, events: dayEvents })} />

      {selectedDay ? (
        <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-slate-900 dark:text-slate-100">{formatDate(selectedDay.key)}</h3>
            {isAdmin ? (
              <Button size="sm" variant="secondary" onClick={() => setModalOpen(true)}>
                <Icon.Plus className="h-4 w-4" /> Add to this day
              </Button>
            ) : null}
          </div>
          {selectedDay.events.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No events on this day.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {selectedDay.events.map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{e.title}</div>
                    <div className="text-[13px] text-slate-500 dark:text-slate-400">
                      {propName(e.property_id)} · {formatDate(e.start_date)}
                      {e.end_date !== e.start_date ? ` – ${formatDate(e.end_date)}` : ""}
                    </div>
                    {e.notes ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{e.notes}</p> : null}
                  </div>
                  <StatusPill status={e.type} size="sm" />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      <NewEventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        properties={properties}
        defaultDate={selectedDay?.key}
      />
    </div>
  );
}
