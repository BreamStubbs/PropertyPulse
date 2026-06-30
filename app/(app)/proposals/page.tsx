"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { visibleProperties, visibleProposals } from "@/lib/queries";
import { ProposalCard } from "@/components/proposals/ProposalCard";
import { NewProposalModal } from "@/components/proposals/NewProposalModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/icons";
import type { ProposalStatus } from "@/lib/types";

const STATUSES: (ProposalStatus | "all")[] = ["all", "Pending", "Question", "Approved", "Declined"];

export default function ProposalsPage() {
  const { data, currentUser } = useStore();
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);

  const properties = useMemo(() => (currentUser ? visibleProperties(data, currentUser) : []), [data, currentUser]);
  const proposals = currentUser ? visibleProposals(data, currentUser) : [];
  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";
  const propName = (id: string) => properties.find((p) => p.id === id)?.name;

  const filtered = proposals
    .filter((p) => propertyFilter === "all" || p.property_id === propertyFilter)
    .filter((p) => statusFilter === "all" || p.status === statusFilter)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <div>
      <PageHeader
        description={
          isAdmin
            ? "Send work proposals to owners and track their responses."
            : "Review work your manager has proposed. Approve, decline, or ask a question."
        }
        action={
          isAdmin ? (
            <Button onClick={() => setModalOpen(true)}>
              <Icon.Plus className="h-5 w-5" /> New proposal
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <Select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="max-w-xs" aria-label="Filter by property">
          <option value="all">All properties</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProposalStatus | "all")}
          className="max-w-[12rem]"
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Icon.Proposals className="h-6 w-6" />}
          title="No proposals"
          description={isAdmin ? "Create a proposal to request owner approval for work." : "Proposals from your manager will appear here for your review."}
          action={isAdmin ? <Button onClick={() => setModalOpen(true)}>New proposal</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filtered.map((p) => (
            <ProposalCard key={p.id} proposal={p} propertyName={propName(p.property_id)} canRespond={!isAdmin} />
          ))}
        </div>
      )}

      <NewProposalModal open={modalOpen} onClose={() => setModalOpen(false)} properties={properties} />
    </div>
  );
}
