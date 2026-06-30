"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useStore } from "@/lib/store";
import type { Property } from "@/lib/types";

export function NewProposalModal({
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
  const { addProposal } = useStore();
  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? properties[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [vendor, setVendor] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setTitle("");
    setVendor("");
    setCost("");
    setDescription("");
  };

  const submit = () => {
    const amount = parseFloat(cost);
    if (!title.trim() || !propertyId || Number.isNaN(amount)) return;
    addProposal({
      property_id: propertyId,
      title: title.trim(),
      vendor_name: vendor.trim() || undefined,
      estimated_cost: amount,
      description: description.trim() || undefined,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New proposal"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!title.trim() || !cost}>
            Send to owner
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
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Replace water heater" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Vendor">
            <Input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. Gulf Coast Plumbing" />
          </Field>
          <Field label="Estimated cost (USD)">
            <Input type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" />
          </Field>
        </div>
        <Field label="Description">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain the work and why it's needed." />
        </Field>
      </div>
    </Modal>
  );
}
