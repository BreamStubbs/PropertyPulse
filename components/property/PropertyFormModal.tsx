"use client";

import { useMemo, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/icons";
import { useStore, type PropertyInput } from "@/lib/store";
import { fileToGalleryDataUrl } from "@/lib/image";
import { clsx } from "@/lib/clsx";
import type { Property, PropertyStatus, PropertyType } from "@/lib/types";

const TYPES: PropertyType[] = ["Short-Term Rental", "Vacant Home", "Owner-Occupied"];
const STATUSES: PropertyStatus[] = ["Active Rental", "Occupied", "Vacant", "Under Maintenance"];

export function PropertyFormModal({
  open,
  onClose,
  property,
  onCreated,
  onDeleted,
}: {
  open: boolean;
  onClose: () => void;
  property?: Property;
  onCreated?: (id: string) => void;
  onDeleted?: () => void;
}) {
  const { data, addProperty, updateProperty, deleteProperty, addOwner } = useStore();
  const editing = Boolean(property);

  const initialOwnerIds = useMemo(
    () => (property ? data.property_owners.filter((po) => po.property_id === property.id).map((po) => po.owner_id) : []),
    [property, data.property_owners],
  );

  const [name, setName] = useState(property?.name ?? "");
  const [line1, setLine1] = useState(property?.address_line1 ?? "");
  const [city, setCity] = useState(property?.city ?? "");
  const [stateField, setStateField] = useState(property?.state ?? "");
  const [zip, setZip] = useState(property?.zip ?? "");
  const [type, setType] = useState<PropertyType>(property?.property_type ?? "Short-Term Rental");
  const [status, setStatus] = useState<PropertyStatus>(property?.status ?? "Active Rental");
  const [beds, setBeds] = useState(property?.beds?.toString() ?? "");
  const [baths, setBaths] = useState(property?.baths?.toString() ?? "");
  const [sqft, setSqft] = useState(property?.sqft?.toString() ?? "");
  const [notes, setNotes] = useState(property?.notes ?? "");
  const [hero, setHero] = useState(property?.hero_image_url ?? "");
  const [ownerIds, setOwnerIds] = useState<string[]>(initialOwnerIds);

  const [heroBusy, setHeroBusy] = useState(false);
  const [error, setError] = useState("");
  const heroInput = useRef<HTMLInputElement>(null);

  const [showAddOwner, setShowAddOwner] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const owners = data.profiles.filter((p) => p.role === "owner");

  const onHeroPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setHeroBusy(true);
    try {
      setHero(await fileToGalleryDataUrl(file, 1600));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't read that image.");
    } finally {
      setHeroBusy(false);
    }
  };

  const toggleOwner = (id: string) =>
    setOwnerIds((prev) => (prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]));

  const addNewOwner = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const id = addOwner({ full_name: newName.trim(), email: newEmail.trim() });
    setOwnerIds((prev) => [...prev, id]);
    setNewName("");
    setNewEmail("");
    setShowAddOwner(false);
  };

  const submit = () => {
    if (!name.trim()) {
      setError("Please give the property a name.");
      return;
    }
    const input: PropertyInput = {
      name: name.trim(),
      address_line1: line1.trim(),
      city: city.trim(),
      state: stateField.trim(),
      zip: zip.trim(),
      property_type: type,
      status,
      beds: beds ? parseInt(beds, 10) : undefined,
      baths: baths ? parseFloat(baths) : undefined,
      sqft: sqft ? parseInt(sqft, 10) : undefined,
      notes: notes.trim() || undefined,
      hero_image_url: hero || undefined,
    };
    if (editing && property) {
      updateProperty(property.id, input, ownerIds);
      onClose();
    } else {
      const id = addProperty({ ...input, ownerIds });
      onClose();
      onCreated?.(id);
    }
  };

  const remove = () => {
    if (!property) return;
    if (confirm(`Delete “${property.name}” and all of its tasks, files, invoices, and messages? This can’t be undone.`)) {
      deleteProperty(property.id);
      onClose();
      onDeleted?.();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit property" : "Add a property"}
      footer={
        <>
          {editing ? (
            <Button variant="danger" onClick={remove} className="mr-auto">
              Delete
            </Button>
          ) : null}
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim() || heroBusy}>
            {editing ? "Save changes" : "Add property"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Hero photo */}
        <Field label="Hero photo">
          {hero ? (
            <div className="relative overflow-hidden rounded-xl border border-stone-200 dark:border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero} alt="Hero" className="aspect-[2/1] w-full object-cover" />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => heroInput.current?.click()}
                  className="rounded-lg bg-slate-900/70 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-900/85"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => setHero("")}
                  className="rounded-lg bg-slate-900/70 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => heroInput.current?.click()}
              className="flex min-h-[120px] w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center text-slate-500 hover:border-amber-400 hover:bg-amber-50/40 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-amber-500/50 dark:hover:bg-amber-500/10"
            >
              <Icon.Plus className="h-6 w-6" />
              <span className="text-[15px] font-medium">{heroBusy ? "Processing…" : "Add a hero photo"}</span>
              <span className="text-[13px]">Optional — we’ll use a placeholder if you skip it</span>
            </button>
          )}
          <input ref={heroInput} type="file" accept="image/*" className="hidden" onChange={onHeroPick} />
        </Field>

        <Field label="Property name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. The Cypress House" />
        </Field>

        <Field label="Street address">
          <Input value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="214 Cypress Point Ln" />
        </Field>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="col-span-2">
            <Field label="City">
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Sarasota" />
            </Field>
          </div>
          <Field label="State">
            <Input value={stateField} onChange={(e) => setStateField(e.target.value)} placeholder="FL" />
          </Field>
          <Field label="ZIP">
            <Input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="34236" />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as PropertyType)}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as PropertyStatus)}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Beds">
            <Input type="number" min="0" value={beds} onChange={(e) => setBeds(e.target.value)} placeholder="4" />
          </Field>
          <Field label="Baths">
            <Input type="number" min="0" step="0.5" value={baths} onChange={(e) => setBaths(e.target.value)} placeholder="3" />
          </Field>
          <Field label="Sq ft">
            <Input type="number" min="0" value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="2400" />
          </Field>
        </div>

        <Field label="Notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Gate codes, vendor schedules, anything useful." />
        </Field>

        {/* Owners */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Owners</span>
          <div className="space-y-2">
            {owners.length === 0 ? (
              <p className="text-[13px] text-slate-500 dark:text-slate-400">No owners yet — add one below.</p>
            ) : (
              owners.map((o) => {
                const checked = ownerIds.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleOwner(o.id)}
                    className={clsx(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
                      checked
                        ? "border-amber-400 bg-amber-50/60 dark:border-amber-500/50 dark:bg-amber-500/10"
                        : "border-stone-200 hover:bg-stone-50 dark:border-slate-800 dark:hover:bg-slate-800/60",
                    )}
                  >
                    <Avatar name={o.full_name} src={o.avatar_url} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium text-slate-900 dark:text-slate-100">{o.full_name}</span>
                      <span className="block truncate text-[13px] text-slate-500 dark:text-slate-400">{o.email}</span>
                    </span>
                    <span
                      className={clsx(
                        "flex h-5 w-5 items-center justify-center rounded-md border",
                        checked ? "border-amber-500 bg-amber-500 text-white" : "border-stone-300 dark:border-slate-600",
                      )}
                    >
                      {checked ? <Icon.Check className="h-3.5 w-3.5" /> : null}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {showAddOwner ? (
            <div className="mt-3 space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Owner name" />
                <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="owner@email.com" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addNewOwner} disabled={!newName.trim() || !newEmail.trim()}>
                  Add owner
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddOwner(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddOwner(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              <Icon.Plus className="h-4 w-4" /> Add a new owner
            </button>
          )}
        </div>

        {error ? <p className="text-[13px] text-rose-600 dark:text-rose-400">{error}</p> : null}
      </div>
    </Modal>
  );
}
