"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { messageThreads, propertyOwnersOf, adminProfile } from "@/lib/queries";
import { MessageThread } from "./MessageThread";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/icons";
import { clsx } from "@/lib/clsx";
import { relativeTime } from "@/lib/format";
import type { Profile } from "@/lib/types";

export function MessagesView({ initialPropertyId }: { initialPropertyId?: string }) {
  const { data, currentUser, sendMessage } = useStore();
  const router = useRouter();
  const threads = useMemo(() => (currentUser ? messageThreads(data, currentUser) : []), [data, currentUser]);
  const [selectedId, setSelectedId] = useState<string | undefined>(initialPropertyId ?? threads[0]?.property.id);

  if (!currentUser) return null;

  const profilesById: Record<string, Profile> = Object.fromEntries(data.profiles.map((p) => [p.id, p]));
  const active = threads.find((t) => t.property.id === selectedId) ?? threads[0];

  if (threads.length === 0) {
    return (
      <EmptyState
        icon={<Icon.Messages className="h-6 w-6" />}
        title="No conversations yet"
        description="Messages are organized per property. Start a conversation from any property thread."
      />
    );
  }

  // Counterparty label: admin sees owner names; owner sees their manager.
  const counterpartyFor = (propertyId: string): string => {
    if (currentUser.role === "admin") {
      const owners = propertyOwnersOf(data, propertyId);
      return owners.map((o) => o.full_name).join(", ") || "Owner";
    }
    return adminProfile(data)?.full_name ?? "Property Manager";
  };

  return (
    <div className="grid h-[calc(100vh-9rem)] grid-cols-1 gap-4 lg:grid-cols-[20rem_1fr]">
      {/* Thread list */}
      <div className="hidden flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card lg:flex">
        <div className="border-b border-stone-200 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Conversations
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map((t) => {
            const last = t.messages[t.messages.length - 1];
            return (
              <button
                key={t.property.id}
                onClick={() => {
                  setSelectedId(t.property.id);
                  router.replace(`/messages/${t.property.id}`);
                }}
                className={clsx(
                  "flex w-full items-center gap-3 border-b border-stone-100 px-4 py-3 text-left transition-colors hover:bg-stone-50",
                  active?.property.id === t.property.id && "bg-amber-50",
                )}
              >
                <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.property.hero_image_url} alt="" className="h-full w-full object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-medium text-slate-900">{t.property.name}</div>
                  <div className="truncate text-[13px] text-slate-500">{counterpartyFor(t.property.id)}</div>
                  {last ? <div className="truncate text-[13px] text-slate-400">{last.body}</div> : null}
                </div>
                {last ? <span className="shrink-0 text-[12px] text-slate-400">{relativeTime(last.created_at)}</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active thread */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card">
        {active ? (
          <>
            <div className="flex items-center gap-3 border-b border-stone-200 px-4 py-3">
              <Avatar name={active.property.name} src={active.property.hero_image_url} size={40} className="rounded-xl" />
              <div className="min-w-0">
                <div className="truncate font-display text-lg text-slate-900">{active.property.name}</div>
                <div className="truncate text-[13px] text-slate-500">{counterpartyFor(active.property.id)}</div>
              </div>
              {/* Mobile thread switcher */}
              <select
                value={active.property.id}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  router.replace(`/messages/${e.target.value}`);
                }}
                className="ml-auto rounded-lg border border-stone-300 px-2 py-1.5 text-sm lg:hidden"
                aria-label="Switch conversation"
              >
                {threads.map((t) => (
                  <option key={t.property.id} value={t.property.id}>
                    {t.property.name}
                  </option>
                ))}
              </select>
            </div>
            <MessageThread
              messages={active.messages}
              profilesById={profilesById}
              currentUserId={currentUser.id}
              onSend={(body) => sendMessage(active.property.id, body)}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
