"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { visibleFiles, visibleProperties } from "@/lib/queries";
import { FileGroup } from "@/components/files/FileList";
import { NewFileModal } from "@/components/files/NewFileModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/icons";
import { clsx } from "@/lib/clsx";
import type { FileCategory, Profile } from "@/lib/types";

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

export default function FilesPage() {
  const { data, currentUser } = useStore();
  const [query, setQuery] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [category, setCategory] = useState<FileCategory | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);

  const properties = useMemo(() => (currentUser ? visibleProperties(data, currentUser) : []), [data, currentUser]);
  const files = currentUser ? visibleFiles(data, currentUser) : [];
  if (!currentUser) return null;

  const uploaders: Record<string, Profile> = Object.fromEntries(data.profiles.map((p) => [p.id, p]));

  const filtered = files
    .filter((f) => propertyFilter === "all" || f.property_id === propertyFilter)
    .filter((f) => category === "all" || f.category === category)
    .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  const grouped = CATEGORIES.map((c) => ({ category: c, files: filtered.filter((f) => f.category === c) })).filter(
    (g) => g.files.length > 0,
  );

  return (
    <div>
      <PageHeader
        description="Insurance, warranties, permits and other documents — organized per property."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Icon.Plus className="h-5 w-5" /> Upload file
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[12rem] flex-1">
          <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files" className="pl-10" />
        </div>
        <Select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="max-w-xs" aria-label="Filter by property">
          <option value="all">All properties</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={clsx(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors min-h-[36px]",
              category === c
                ? "bg-amber-500 text-white"
                : "bg-white text-slate-600 ring-1 ring-inset ring-stone-200 hover:bg-stone-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800",
            )}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          icon={<Icon.Files className="h-6 w-6" />}
          title="No files found"
          description="Upload insurance policies, warranties, permits and more to keep everything in one place."
          action={<Button onClick={() => setModalOpen(true)}>Upload file</Button>}
        />
      ) : (
        <div className="space-y-5">
          {grouped.map((g) => (
            <FileGroup key={g.category} category={g.category} files={g.files} uploaders={uploaders} />
          ))}
        </div>
      )}

      <NewFileModal open={modalOpen} onClose={() => setModalOpen(false)} properties={properties} />
    </div>
  );
}
