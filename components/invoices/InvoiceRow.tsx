"use client";

import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/icons";
import { currency, formatDate } from "@/lib/format";
import type { Invoice } from "@/lib/types";

export function InvoiceRow({ invoice, propertyName }: { invoice: Invoice; propertyName?: string }) {
  const payable = invoice.status !== "Paid";
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap">
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-slate-900">{invoice.title}</div>
        <div className="truncate text-[13px] text-slate-500">
          {propertyName ? `${propertyName} · ` : ""}
          Issued {formatDate(invoice.issued_at)} · Due {formatDate(invoice.due_date)}
        </div>
      </div>
      <div className="font-display text-lg text-slate-900">{currency(invoice.amount)}</div>
      <div className="w-28 shrink-0">
        <StatusPill status={invoice.status} />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => alert(`Downloading invoice “${invoice.title}” (demo placeholder).`)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-stone-100"
          aria-label="Download invoice"
        >
          <Icon.Download className="h-5 w-5" />
        </button>
        {payable ? (
          <button
            disabled
            title="Online payments coming soon"
            className="cursor-not-allowed rounded-lg border border-stone-200 px-3 py-2 text-[13px] font-medium text-slate-400"
          >
            Pay now — soon
          </button>
        ) : null}
      </div>
    </div>
  );
}
