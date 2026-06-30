"use client";

import { useState } from "react";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { currency, formatDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Proposal } from "@/lib/types";

export function ProposalCard({
  proposal,
  propertyName,
  canRespond,
}: {
  proposal: Proposal;
  propertyName?: string;
  canRespond: boolean;
}) {
  const { respondProposal } = useStore();
  const [asking, setAsking] = useState(false);
  const [question, setQuestion] = useState("");

  const open = proposal.status === "Pending" || proposal.status === "Question";

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl text-slate-900">{proposal.title}</h3>
          <p className="mt-0.5 text-sm text-slate-500">
            {propertyName ? `${propertyName} · ` : ""}
            {proposal.vendor_name ?? "Vendor TBD"}
          </p>
        </div>
        <StatusPill status={proposal.status} />
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl text-slate-900">{currency(proposal.estimated_cost)}</span>
        <span className="text-sm text-slate-500">estimated</span>
      </div>

      {proposal.description ? <p className="mt-3 text-[15px] text-slate-600">{proposal.description}</p> : null}

      {proposal.owner_response ? (
        <div className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50/60 px-4 py-3">
          <p className="text-[13px] font-medium uppercase tracking-wide text-amber-700">Owner response</p>
          <p className="mt-1 text-[15px] text-slate-700">“{proposal.owner_response}”</p>
          {proposal.responded_at ? (
            <p className="mt-1 text-[13px] text-slate-400">{formatDate(proposal.responded_at)}</p>
          ) : null}
        </div>
      ) : null}

      {canRespond && open ? (
        <div className="mt-4 border-t border-stone-200 pt-4">
          {!asking ? (
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => respondProposal(proposal.id, "Approved", "Approved.")}>Approve</Button>
              <Button variant="danger" onClick={() => respondProposal(proposal.id, "Declined", "Declined.")}>
                Decline
              </Button>
              <Button variant="secondary" onClick={() => setAsking(true)}>
                Ask a question
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to ask your property manager?"
                autoFocus
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    if (!question.trim()) return;
                    respondProposal(proposal.id, "Question", question.trim());
                    setAsking(false);
                    setQuestion("");
                  }}
                  disabled={!question.trim()}
                >
                  Send question
                </Button>
                <Button variant="ghost" onClick={() => setAsking(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
