"use client";

import { useMemo, useState } from "react";
import { clsx } from "@/lib/clsx";
import { Icon } from "@/components/ui/icons";
import type { CalendarEvent, EventType } from "@/lib/types";

const EVENT_TONE: Record<EventType, string> = {
  Reservation: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-500/20 dark:text-sky-200 dark:border-sky-500/30",
  "Owner Stay": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/30",
  "Maintenance Block": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/30",
  Inspection: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-500/20 dark:text-violet-200 dark:border-violet-500/30",
  Note: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700/50 dark:text-slate-200 dark:border-slate-600",
};

const LEGEND: EventType[] = ["Reservation", "Owner Stay", "Maintenance Block", "Inspection", "Note"];

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function eventsOnDay(events: CalendarEvent[], key: string): CalendarEvent[] {
  return events.filter((e) => key >= e.start_date && key <= e.end_date);
}

export function MonthCalendar({
  events,
  initialDate,
  onSelectDay,
}: {
  events: CalendarEvent[];
  initialDate?: Date;
  onSelectDay?: (key: string, dayEvents: CalendarEvent[]) => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const base = initialDate ?? new Date("2026-07-01T00:00:00");
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);

  const weeks = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay()); // back to Sunday
    const grid: Date[][] = [];
    const day = new Date(start);
    for (let w = 0; w < 6; w++) {
      const row: Date[] = [];
      for (let d = 0; d < 7; d++) {
        row.push(new Date(day));
        day.setDate(day.getDate() + 1);
      }
      grid.push(row);
    }
    return grid;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const monthIndex = cursor.getMonth();

  const selectDay = (d: Date) => {
    const key = toKey(d);
    setSelected(key);
    onSelectDay?.(key, eventsOnDay(events, key));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 dark:border-slate-800">
        <h3 className="font-display text-xl text-slate-900 dark:text-slate-100">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-stone-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Previous month"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => setCursor(new Date(2026, 6, 1))}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-stone-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Today
          </button>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-stone-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Next month"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50 text-center text-[13px] font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {weeks.flat().map((d, i) => {
          const key = toKey(d);
          const inMonth = d.getMonth() === monthIndex;
          const dayEvents = eventsOnDay(events, key);
          const isToday = key === "2026-06-30";
          return (
            <button
              key={i}
              onClick={() => selectDay(d)}
              className={clsx(
                "min-h-[84px] border-b border-r border-stone-100 p-1.5 text-left align-top transition-colors hover:bg-amber-50/40 dark:border-slate-800 dark:hover:bg-amber-500/10",
                !inMonth && "bg-stone-50/60 text-slate-300 dark:bg-slate-800/40 dark:text-slate-600",
                selected === key && "bg-amber-50 ring-1 ring-inset ring-amber-300 dark:bg-amber-500/10 dark:ring-amber-500/40",
              )}
            >
              <span
                className={clsx(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-[13px]",
                  isToday
                    ? "bg-amber-500 font-semibold text-white"
                    : inMonth
                      ? "text-slate-700 dark:text-slate-200"
                      : "text-slate-300 dark:text-slate-600",
                )}
              >
                {d.getDate()}
              </span>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    className={clsx("truncate rounded border px-1 py-0.5 text-[11px] leading-tight", EVENT_TONE[e.type])}
                    title={e.title}
                  >
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 2 ? (
                  <div className="px-1 text-[11px] text-slate-400 dark:text-slate-500">+{dayEvents.length - 2} more</div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-stone-200 px-4 py-3 dark:border-slate-800">
        {LEGEND.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5 text-[13px] text-slate-600 dark:text-slate-300">
            <span className={clsx("h-3 w-3 rounded border", EVENT_TONE[t])} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AgendaList({ events }: { events: CalendarEvent[] }) {
  const sorted = [...events].sort((a, b) => a.start_date.localeCompare(b.start_date));
  return (
    <div className="space-y-2">
      {sorted.map((e) => (
        <div key={e.id} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <span className={clsx("h-10 w-1.5 rounded-full", EVENT_TONE[e.type])} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-medium text-slate-900 dark:text-slate-100">{e.title}</div>
            <div className="truncate text-[13px] text-slate-500 dark:text-slate-400">
              {e.type} · {e.start_date}
              {e.end_date !== e.start_date ? ` – ${e.end_date}` : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { EVENT_TONE };
export function CalendarIconLabel() {
  return <Icon.Calendar className="h-5 w-5" />;
}
