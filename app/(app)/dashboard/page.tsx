"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  visibleProperties,
  visibleTasks,
  visibleProposals,
  visibleInvoices,
  visibleEvents,
  visibleActivity,
  propertyPhotos,
} from "@/lib/queries";
import { PropertyCard } from "@/components/property/PropertyCard";
import { EstatePlate } from "@/components/property/EstatePlate";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { MessageThread } from "@/components/messages/MessageThread";
import { Icon } from "@/components/ui/icons";
import { clsx } from "@/lib/clsx";
import { formatDate, relativeTime } from "@/lib/format";
import type { Profile, Property } from "@/lib/types";

export default function DashboardPage() {
  const { currentUser } = useStore();
  if (!currentUser) return null;
  return currentUser.role === "admin" ? <AdminDashboard /> : <OwnerDashboard />;
}

/* ----------------------------- Admin ----------------------------- */

function AdminDashboard() {
  const { data, currentUser } = useStore();
  const user = currentUser!;
  const properties = visibleProperties(data, user);
  const tasks = visibleTasks(data, user);
  const proposals = visibleProposals(data, user);
  const invoices = visibleInvoices(data, user);
  const activity = visibleActivity(data, user).slice(0, 8);

  const openTasks = tasks.filter((t) => t.status !== "Completed").length;
  const awaiting = proposals.filter((p) => p.status === "Pending" || p.status === "Question").length;
  const overdue = invoices.filter((i) => i.status === "Overdue").length;

  const statusCounts = properties.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <p className="text-[15px] text-slate-500">
        Welcome back, {user.full_name.split(" ")[0]}. Here’s how your portfolio is doing.
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Properties" value={properties.length} icon={<Icon.Properties className="h-5 w-5" />} href="/properties" />
        <StatCard label="Open tasks" value={openTasks} icon={<Icon.Tasks className="h-5 w-5" />} tone="amber" href="/tasks" />
        <StatCard label="Awaiting owner" value={awaiting} icon={<Icon.Proposals className="h-5 w-5" />} tone="sky" href="/proposals" />
        <StatCard label="Overdue invoices" value={overdue} icon={<Icon.Clock className="h-5 w-5" />} tone="rose" href="/invoices" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl text-slate-900">Portfolio</h2>
            <Link href="/properties" className="text-sm font-medium text-amber-600 hover:text-amber-700">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                compact
                openTasks={tasks.filter((t) => t.property_id === p.id && t.status !== "Completed").length}
                pendingProposals={proposals.filter((pr) => pr.property_id === p.id && (pr.status === "Pending" || pr.status === "Question")).length}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="By status" />
            <CardBody className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusPill status={status} size="sm" />
                  <span className="font-display text-lg text-slate-900">{count}</span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recent activity" />
            <CardBody className="p-0">
              <ActivityFeed activity={activity} profiles={data.profiles} properties={properties} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Owner ----------------------------- */

function OwnerDashboard() {
  const { data, currentUser } = useStore();
  const user = currentUser!;
  const properties = useMemo(() => visibleProperties(data, user), [data, user]);
  const [activeId, setActiveId] = useState(properties[0]?.id);

  if (properties.length === 0) {
    return <p className="text-slate-500">No properties are linked to your account yet.</p>;
  }

  const active = properties.find((p) => p.id === activeId) ?? properties[0];

  return (
    <div className="space-y-6">
      {properties.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {properties.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors min-h-[44px]",
                active.id === p.id ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-inset ring-stone-200 hover:bg-stone-50",
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      ) : null}

      <OwnerPropertyPanel property={active} />
    </div>
  );
}

function OwnerPropertyPanel({ property }: { property: Property }) {
  const { data, currentUser, sendMessage } = useStore();
  const user = currentUser!;

  const tasks = data.tasks.filter((t) => t.property_id === property.id);
  const openTasks = tasks.filter((t) => t.status !== "Completed");
  const completed = tasks.filter((t) => t.status === "Completed");
  const proposals = data.proposals.filter((p) => p.property_id === property.id);
  const pending = proposals.filter((p) => p.status === "Pending" || p.status === "Question");
  const photos = propertyPhotos(data, property.id).slice(0, 4);
  const events = visibleEvents(data, user)
    .filter((e) => e.property_id === property.id && e.end_date >= "2026-06-30")
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .slice(0, 3);
  const activity = data.activity_log
    .filter((a) => a.property_id === property.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 4);
  const messages = data.messages
    .filter((m) => m.property_id === property.id)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  const profilesById: Record<string, Profile> = Object.fromEntries(data.profiles.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Link href={`/properties/${property.id}`} className="relative block aspect-[2/1] w-full overflow-hidden rounded-2xl shadow-card sm:aspect-[5/2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={property.hero_image_url} alt={property.name} className="h-full w-full object-cover" />
        <EstatePlate
          name={property.name}
          address={`${property.address_line1}, ${property.city}, ${property.state}`}
          status={property.status}
          size="lg"
        />
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Open tasks" value={openTasks.length} icon={<Icon.Tasks className="h-5 w-5" />} tone="amber" href="/tasks" />
        <StatCard label="Completed work" value={completed.length} icon={<Icon.Check className="h-5 w-5" />} tone="emerald" href="/tasks" />
        <StatCard label="Pending proposals" value={pending.length} icon={<Icon.Proposals className="h-5 w-5" />} tone="sky" href="/proposals" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Recent updates" />
            <CardBody className="p-0">
              <ActivityFeed activity={activity} profiles={data.profiles} properties={[property]} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Upcoming on the calendar" action={<Link href="/calendar" className="text-sm font-medium text-amber-600">View calendar</Link>} />
            <CardBody className="space-y-3">
              {events.length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming events.</p>
              ) : (
                events.map((e) => (
                  <div key={e.id} className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-900">{e.title}</div>
                      <div className="text-[13px] text-slate-500">
                        {formatDate(e.start_date)}
                        {e.end_date !== e.start_date ? ` – ${formatDate(e.end_date)}` : ""}
                      </div>
                    </div>
                    <StatusPill status={e.type} size="sm" />
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Recent photos" action={<Link href={`/properties/${property.id}`} className="text-sm font-medium text-amber-600">Gallery</Link>} />
            <CardBody>
              {photos.length === 0 ? (
                <p className="text-sm text-slate-500">No photos yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {photos.map((ph) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={ph.id} src={ph.url} alt={ph.caption ?? ""} className="aspect-square w-full rounded-lg object-cover" />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Messages" action={<Link href={`/messages/${property.id}`} className="text-sm font-medium text-amber-600">Open</Link>} />
            <div className="h-80">
              <MessageThread
                messages={messages.slice(-4)}
                profilesById={profilesById}
                currentUserId={user.id}
                onSend={(body) => sendMessage(property.id, body)}
                compact
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Shared ----------------------------- */

function ActivityFeed({
  activity,
  profiles,
  properties,
}: {
  activity: { id: string; actor_id?: string; description: string; created_at: string; property_id: string }[];
  profiles: Profile[];
  properties: Property[];
}) {
  if (activity.length === 0) {
    return <p className="px-5 py-6 text-sm text-slate-500">No recent activity.</p>;
  }
  const propName = (id: string) => properties.find((p) => p.id === id)?.name;
  return (
    <ul className="divide-y divide-stone-100">
      {activity.map((a) => {
        const actor = profiles.find((p) => p.id === a.actor_id);
        return (
          <li key={a.id} className="flex items-start gap-3 px-5 py-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
            <div className="min-w-0">
              <p className="text-[15px] text-slate-700">{a.description}</p>
              <p className="text-[13px] text-slate-400">
                {propName(a.property_id) ? `${propName(a.property_id)} · ` : ""}
                {relativeTime(a.created_at)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
