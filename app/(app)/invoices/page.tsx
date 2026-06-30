"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { visibleInvoices, visibleProperties } from "@/lib/queries";
import { InvoiceRow } from "@/components/invoices/InvoiceRow";
import { NewInvoiceModal } from "@/components/invoices/NewInvoiceModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/icons";
import { currency } from "@/lib/format";

export default function InvoicesPage() {
  const { data, currentUser } = useStore();
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const properties = useMemo(() => (currentUser ? visibleProperties(data, currentUser) : []), [data, currentUser]);
  const invoices = currentUser ? visibleInvoices(data, currentUser) : [];
  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";
  const propName = (id: string) => properties.find((p) => p.id === id)?.name;

  const filtered = invoices
    .filter((i) => propertyFilter === "all" || i.property_id === propertyFilter)
    .sort((a, b) => (b.issued_at ?? "").localeCompare(a.issued_at ?? ""));

  const outstanding = filtered.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const overdue = filtered.filter((i) => i.status === "Overdue").length;
  const paidTotal = filtered.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <PageHeader
        description="Track invoices per property. Online payment is coming soon."
        action={
          isAdmin ? (
            <Button onClick={() => setModalOpen(true)}>
              <Icon.Plus className="h-5 w-5" /> New invoice
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total outstanding" value={currency(outstanding)} icon={<Icon.Invoices className="h-5 w-5" />} tone="amber" />
        <StatCard label="Overdue invoices" value={overdue} icon={<Icon.Clock className="h-5 w-5" />} tone="rose" />
        <StatCard label="Paid to date" value={currency(paidTotal)} icon={<Icon.Check className="h-5 w-5" />} tone="emerald" />
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Icon.Invoices className="h-6 w-6" />}
          title="No invoices"
          description={isAdmin ? "Create an invoice to bill an owner for services." : "Invoices from your manager will appear here."}
          action={isAdmin ? <Button onClick={() => setModalOpen(true)}>New invoice</Button> : undefined}
        />
      ) : (
        <div className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card">
          {filtered.map((i) => (
            <InvoiceRow key={i.id} invoice={i} propertyName={propName(i.property_id)} />
          ))}
        </div>
      )}

      <NewInvoiceModal open={modalOpen} onClose={() => setModalOpen(false)} properties={properties} />
    </div>
  );
}
