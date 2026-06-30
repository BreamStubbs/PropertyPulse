"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { useStore } from "@/lib/store";
import type { Property } from "@/lib/types";

export function NewInvoiceModal({
  open,
  onClose,
  properties,
  defaultPropertyId,
}: {
  open: boolean;
  onClose: () => void;
  properties: Property[];
  defaultPropertyId?: string;
}) {
  const { addInvoice } = useStore();
  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? properties[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const submit = () => {
    const value = parseFloat(amount);
    if (!title.trim() || !propertyId || Number.isNaN(value)) return;
    addInvoice({ property_id: propertyId, title: title.trim(), amount: value, due_date: dueDate || undefined });
    setTitle("");
    setAmount("");
    setDueDate("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New invoice"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!title.trim() || !amount}>
            Create invoice
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {!defaultPropertyId ? (
          <Field label="Property">
            <Select value={propertyId} onChange={(e) => setPropertyId(e.target.value)}>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. August Management Fee" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Amount (USD)">
            <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </Field>
          <Field label="Due date">
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Field>
        </div>
      </div>
    </Modal>
  );
}
