"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  canSeeProperty,
  propertyById,
  propertyPhotos,
  propertyOwnersOf,
  adminProfile,
  withDerivedInvoiceStatus,
} from "@/lib/queries";
import { EstatePlate } from "@/components/property/EstatePlate";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskCard } from "@/components/tasks/TaskCard";
import { NewTaskModal } from "@/components/tasks/NewTaskModal";
import { FileGroup } from "@/components/files/FileList";
import { NewFileModal } from "@/components/files/NewFileModal";
import { InvoiceRow } from "@/components/invoices/InvoiceRow";
import { NewInvoiceModal } from "@/components/invoices/NewInvoiceModal";
import { AgendaList } from "@/components/calendar/MonthCalendar";
import { NewEventModal } from "@/components/calendar/NewEventModal";
import { clsx } from "@/lib/clsx";
import { formatDate } from "@/lib/format";
import type { FileCategory, Profile } from "@/lib/types";

const TABS = ["Overview", "Gallery", "Maintenance", "Work", "Files", "Invoices", "Calendar"] as const;
type Tab = (typeof TABS)[number];

const FILE_CATEGORIES: FileCategory[] = [
  "Insurance",
  "Warranties",
  "Invoices",
  "Permits",
  "Appliance Manuals",
  "HOA Documents",
  "Surveys",
  "General",
];

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, currentUser, advanceTask, updateNotes } = useStore();
  const [tab, setTab] = useState<Tab>("Overview");
  const [taskModal, setTaskModal] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);

  const property = propertyById(data, params.id);
  const isAdmin = currentUser?.role === "admin";
  const [notes, setNotes] = useState(property?.notes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);

  const tasks = useMemo(() => data.tasks.filter((t) => t.property_id === params.id), [data.tasks, params.id]);

  if (!currentUser) return null;
  if (!property || !canSeeProperty(data, currentUser, property.id)) {
    return (
      <EmptyState
        icon={<Icon.Properties className="h-6 w-6" />}
        title="Property not found"
        description="This property doesn’t exist or you don’t have access to it."
        action={<Button onClick={() => router.push("/properties")}>Back to properties</Button>}
      />
    );
  }

  const photos = propertyPhotos(data, property.id);
  const owners = propertyOwnersOf(data, property.id);
  const manager = adminProfile(data);
  const contact: Profile | undefined = isAdmin ? owners[0] : manager;
  const contactLabel = isAdmin ? "Owner" : "Property manager";

  const openWork = tasks.filter((t) => t.status !== "Completed");
  const completedWork = tasks.filter((t) => t.status === "Completed");
  const inspections = data.inspections.filter((i) => i.property_id === property.id);
  const files = data.files.filter((f) => f.property_id === property.id);
  const invoices = data.invoices.filter((i) => i.property_id === property.id).map(withDerivedInvoiceStatus);
  const events = data.calendar_events.filter((e) => e.property_id === property.id);
  const uploaders: Record<string, Profile> = Object.fromEntries(data.profiles.map((p) => [p.id, p]));

  // Maintenance feed: completed tasks + inspections, date-sorted.
  const maintenance = [
    ...completedWork.map((t) => ({
      id: t.id,
      kind: "Work" as const,
      title: t.title,
      date: t.completed_at ?? t.created_at,
      detail: t.assigned_to,
      status: undefined as string | undefined,
    })),
    ...inspections.map((i) => ({
      id: i.id,
      kind: "Inspection" as const,
      title: i.title,
      date: i.inspection_date,
      detail: i.summary,
      status: i.status,
    })),
  ].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <div className="space-y-6">
      <Link href="/properties" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All properties
      </Link>

      {/* Hero */}
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl shadow-card sm:aspect-[5/2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={property.hero_image_url} alt={property.name} className="h-full w-full object-cover" />
        <EstatePlate
          name={property.name}
          address={`${property.address_line1}, ${property.city}, ${property.state} ${property.zip}`}
          status={property.status}
          size="lg"
        />
      </div>

      {/* Quick facts */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-1.5">{property.property_type}</span>
        <span className="inline-flex items-center gap-1.5"><Icon.Bed className="h-5 w-5 text-slate-400" /> {property.beds ?? "—"} beds</span>
        <span className="inline-flex items-center gap-1.5"><Icon.Bath className="h-5 w-5 text-slate-400" /> {property.baths ?? "—"} baths</span>
        <span className="inline-flex items-center gap-1.5"><Icon.Ruler className="h-5 w-5 text-slate-400" /> {property.sqft?.toLocaleString() ?? "—"} sqft</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-stone-200 dark:border-slate-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "whitespace-nowrap border-b-2 px-4 py-2.5 text-[15px] font-medium transition-colors min-h-[44px]",
              tab === t
                ? "border-amber-500 text-slate-900 dark:text-slate-100 dark:text-slate-100"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "Overview" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader title="Property notes" />
              <CardBody>
                {isAdmin ? (
                  <div className="space-y-3">
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                    <Button
                      onClick={() => {
                        updateNotes(property.id, notes);
                        setNotesSaved(true);
                        setTimeout(() => setNotesSaved(false), 1800);
                      }}
                    >
                      {notesSaved ? "Saved ✓" : "Save notes"}
                    </Button>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-[15px] text-slate-700 dark:text-slate-200">{property.notes || "No notes yet."}</p>
                )}
              </CardBody>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader title="Quick stats" />
              <CardBody className="grid grid-cols-2 gap-4">
                <Stat label="Open tasks" value={openWork.length} />
                <Stat label="Completed" value={completedWork.length} />
                <Stat label="Files" value={files.length} />
                <Stat label="Invoices" value={invoices.length} />
              </CardBody>
            </Card>
            {contact ? (
              <Card>
                <CardHeader title={contactLabel} />
                <CardBody>
                  <div className="flex items-center gap-3">
                    <Avatar name={contact.full_name} src={contact.avatar_url} size={48} />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{contact.full_name}</div>
                      <div className="text-[13px] text-slate-500 dark:text-slate-400">{contact.email}</div>
                      {contact.phone ? <div className="text-[13px] text-slate-500 dark:text-slate-400">{contact.phone}</div> : null}
                    </div>
                  </div>
                  <Button variant="secondary" className="mt-4 w-full" onClick={() => router.push(`/messages/${property.id}`)}>
                    <Icon.Messages className="h-4 w-4" /> Message
                  </Button>
                </CardBody>
              </Card>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "Gallery" ? (
        photos.length === 0 ? (
          <EmptyState icon={<Icon.Properties className="h-6 w-6" />} title="No photos yet" description="Photos of this property will appear here." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photos.map((ph) => (
              <figure key={ph.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.url} alt={ph.caption ?? ""} className="aspect-[4/3] w-full object-cover" />
                <figcaption className="flex items-center justify-between px-3 py-2 text-[13px] text-slate-500 dark:text-slate-400">
                  <span className="truncate">{ph.caption}</span>
                  <span>{formatDate(ph.taken_at)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )
      ) : null}

      {tab === "Maintenance" ? (
        maintenance.length === 0 ? (
          <EmptyState icon={<Icon.Tasks className="h-6 w-6" />} title="No maintenance history" description="Completed work and inspection reports will appear here." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
            <ul className="divide-y divide-stone-100 dark:divide-slate-800">
              {maintenance.map((m) => (
                <li key={m.id} className="flex items-start gap-3 px-5 py-4">
                  <span className={clsx("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", m.kind === "Inspection" ? "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300")}>
                    {m.kind === "Inspection" ? <Icon.Proposals className="h-5 w-5" /> : <Icon.Check className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100">{m.title}</span>
                      {m.status ? <StatusPill status={m.status} size="sm" /> : <span className="text-[13px] text-slate-400">{m.kind}</span>}
                    </div>
                    {m.detail ? <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{m.detail}</p> : null}
                    <p className="mt-0.5 text-[13px] text-slate-400">{formatDate(m.date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : null}

      {tab === "Work" ? (
        <div className="space-y-6">
          {isAdmin ? (
            <div className="flex justify-end">
              <Button onClick={() => setTaskModal(true)}>
                <Icon.Plus className="h-5 w-5" /> New task
              </Button>
            </div>
          ) : null}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Open work</h3>
            {openWork.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No open work.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {openWork.map((t) => (
                  <TaskCard key={t.id} task={t} canEdit={isAdmin} onAdvance={advanceTask} />
                ))}
              </div>
            )}
          </section>
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Completed work</h3>
            {completedWork.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No completed work yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {completedWork.map((t) => (
                  <TaskCard key={t.id} task={t} canEdit={isAdmin} onAdvance={advanceTask} />
                ))}
              </div>
            )}
          </section>
        </div>
      ) : null}

      {tab === "Files" ? (
        <div className="space-y-5">
          <div className="flex justify-end">
            <Button onClick={() => setFileModal(true)}>
              <Icon.Plus className="h-5 w-5" /> Upload file
            </Button>
          </div>
          {files.length === 0 ? (
            <EmptyState icon={<Icon.Files className="h-6 w-6" />} title="No files yet" description="Upload documents for this property to keep them in one place." action={<Button onClick={() => setFileModal(true)}>Upload file</Button>} />
          ) : (
            FILE_CATEGORIES.map((c) => {
              const group = files.filter((f) => f.category === c);
              if (group.length === 0) return null;
              return <FileGroup key={c} category={c} files={group} uploaders={uploaders} />;
            })
          )}
        </div>
      ) : null}

      {tab === "Invoices" ? (
        <div className="space-y-5">
          {isAdmin ? (
            <div className="flex justify-end">
              <Button onClick={() => setInvoiceModal(true)}>
                <Icon.Plus className="h-5 w-5" /> New invoice
              </Button>
            </div>
          ) : null}
          {invoices.length === 0 ? (
            <EmptyState icon={<Icon.Invoices className="h-6 w-6" />} title="No invoices" description="Invoices for this property will appear here." />
          ) : (
            <div className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
              {invoices.map((i) => (
                <InvoiceRow key={i.id} invoice={i} />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "Calendar" ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <Link href="/calendar" className="text-sm font-medium text-amber-600 hover:text-amber-700">
              Open full calendar
            </Link>
            {isAdmin ? (
              <Button onClick={() => setEventModal(true)}>
                <Icon.Plus className="h-5 w-5" /> New event
              </Button>
            ) : null}
          </div>
          {events.length === 0 ? (
            <EmptyState icon={<Icon.Calendar className="h-6 w-6" />} title="No events" description="Reservations, owner stays and maintenance blocks will appear here." />
          ) : (
            <AgendaList events={events} />
          )}
        </div>
      ) : null}

      {/* Modals (pre-filled to this property) */}
      <NewTaskModal open={taskModal} onClose={() => setTaskModal(false)} properties={[property]} defaultPropertyId={property.id} />
      <NewFileModal open={fileModal} onClose={() => setFileModal(false)} properties={[property]} defaultPropertyId={property.id} />
      <NewInvoiceModal open={invoiceModal} onClose={() => setInvoiceModal(false)} properties={[property]} defaultPropertyId={property.id} />
      <NewEventModal open={eventModal} onClose={() => setEventModal(false)} properties={[property]} defaultPropertyId={property.id} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-stone-50 p-3 dark:bg-slate-800/50">
      <div className="font-display text-2xl text-slate-900 dark:text-slate-100 dark:text-slate-100">{value}</div>
      <div className="text-[13px] text-slate-500 dark:text-slate-400 dark:text-slate-400">{label}</div>
    </div>
  );
}
