"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { useStore } from "@/lib/store";
import type { FileCategory, Property } from "@/lib/types";

const CATEGORIES: FileCategory[] = [
  "Insurance",
  "Warranties",
  "Invoices",
  "Permits",
  "Appliance Manuals",
  "HOA Documents",
  "Surveys",
  "General",
];

export function NewFileModal({
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
  const { addFile } = useStore();
  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? properties[0]?.id ?? "");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FileCategory>("General");

  const submit = () => {
    if (!name.trim() || !propertyId) return;
    const finalName = name.trim().match(/\.[a-z0-9]+$/i) ? name.trim() : `${name.trim()}.pdf`;
    addFile({ property_id: propertyId, name: finalName, category });
    setName("");
    setCategory("General");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Upload file"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim()}>
            Upload
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
        <Field label="File name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Roof Warranty 2026.pdf" />
        </Field>
        <Field label="Category">
          <Select value={category} onChange={(e) => setCategory(e.target.value as FileCategory)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center text-sm text-slate-500">
          File picker is a placeholder in this demo — files are recorded without uploading binary content.
          <br />
          Wire this to Supabase Storage to store the real file (see README).
        </div>
      </div>
    </Modal>
  );
}
