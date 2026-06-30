"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useStore } from "@/lib/store";
import type { Property, TaskPriority } from "@/lib/types";

export function NewTaskModal({
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
  const { addTask } = useStore();
  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? properties[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setAssignedTo("");
  };

  const submit = () => {
    if (!title.trim() || !propertyId) return;
    addTask({
      property_id: propertyId,
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      due_date: dueDate || undefined,
      assigned_to: assignedTo.trim() || undefined,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New task"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!title.trim() || !propertyId}>
            Create task
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
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Replace HVAC filter" />
        </Field>
        <Field label="Description">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add any detail the vendor or owner should know." />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Priority">
            <Select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Select>
          </Field>
          <Field label="Due date">
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Assigned to" hint="Vendor or team member name">
          <Input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="e.g. Coastal Turnovers" />
        </Field>
      </div>
    </Modal>
  );
}
