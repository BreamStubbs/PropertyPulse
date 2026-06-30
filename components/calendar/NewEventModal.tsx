"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useStore } from "@/lib/store";
import type { EventType, Property } from "@/lib/types";

const TYPES: EventType[] = ["Reservation", "Owner Stay", "Maintenance Block", "Inspection", "Note"];

export function NewEventModal({
  open,
  onClose,
  properties,
  defaultPropertyId,
  defaultDate,
}: {
  open: boolean;
  onClose: () => void;
  properties: Property[];
  defaultPropertyId?: string;
  defaultDate?: string;
}) {
  const { addEvent } = useStore();
  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? properties[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("Reservation");
  const [start, setStart] = useState(defaultDate ?? "");
  const [end, setEnd] = useState(defaultDate ?? "");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (defaultDate) {
      setStart(defaultDate);
      setEnd(defaultDate);
    }
  }, [defaultDate]);

  const submit = () => {
    if (!title.trim() || !propertyId || !start || !end) return;
    addEvent({
      property_id: propertyId,
      title: title.trim(),
      type,
      start_date: start,
      end_date: end < start ? start : end,
      notes: notes.trim() || undefined,
    });
    setTitle("");
    setNotes("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New calendar event"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!title.trim() || !start || !end}>
            Add event
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
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Guest Stay — Smith Family" />
        </Field>
        <Field label="Type">
          <Select value={type} onChange={(e) => setType(e.target.value as EventType)}>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start date">
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="End date">
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
        </div>
        <Field label="Notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional details" />
        </Field>
      </div>
    </Modal>
  );
}
