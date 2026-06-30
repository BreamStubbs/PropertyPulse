"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/icons";
import { clsx } from "@/lib/clsx";
import { relativeTime } from "@/lib/format";
import type { Message, Profile } from "@/lib/types";

export function MessageThread({
  messages,
  profilesById,
  currentUserId,
  onSend,
  compact = false,
}: {
  messages: Message[];
  profilesById: Record<string, Profile>;
  currentUserId: string;
  onSend: (body: string) => void;
  compact?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the latest message in view by scrolling the thread's own container —
  // NOT scrollIntoView(), which would also scroll the whole page down to the
  // thread on load (e.g. the dashboard message snippet).
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const send = () => {
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={listRef} className={clsx("flex-1 space-y-4 overflow-y-auto p-4", compact && "max-h-72")}>
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No messages yet. Say hello 👋</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === currentUserId;
            const sender = profilesById[m.sender_id];
            return (
              <div key={m.id} className={clsx("flex items-end gap-2", mine && "flex-row-reverse")}>
                <Avatar name={sender?.full_name ?? "?"} src={sender?.avatar_url} size={32} />
                <div className={clsx("max-w-[78%]", mine && "text-right")}>
                  <div
                    className={clsx(
                      "inline-block rounded-2xl px-3.5 py-2 text-[15px]",
                      mine ? "bg-amber-500 text-white" : "bg-stone-100 text-slate-800",
                    )}
                  >
                    {m.body}
                  </div>
                  <div className="mt-1 text-[12px] text-slate-400">
                    {sender?.full_name?.split(" ")[0]} · {relativeTime(m.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-stone-200 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Type a message…"
          className="min-h-[44px] flex-1 rounded-xl border border-stone-300 bg-white px-3.5 text-[15px] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
        >
          <Icon.Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
