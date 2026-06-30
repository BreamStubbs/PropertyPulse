"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { visibleProperties, visibleTasks, visibleProposals } from "@/lib/queries";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFormModal } from "@/components/property/PropertyFormModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Icon } from "@/components/ui/icons";

export default function PropertiesPage() {
  const { data, currentUser } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const properties = useMemo(
    () => (currentUser ? visibleProperties(data, currentUser) : []),
    [data, currentUser],
  );
  const tasks = currentUser ? visibleTasks(data, currentUser) : [];
  const proposals = currentUser ? visibleProposals(data, currentUser) : [];

  if (!currentUser) return null;
  const isAdmin = currentUser.role === "admin";

  const filtered = properties.filter((p) => {
    const hay = `${p.name} ${p.city} ${p.state} ${p.address_line1}`.toLowerCase();
    return hay.includes(query.toLowerCase());
  });

  return (
    <div>
      <PageHeader
        description="Every property you can access, with quick status at a glance."
        action={
          isAdmin ? (
            <Button onClick={() => setFormOpen(true)}>
              <Icon.Plus className="h-5 w-5" /> New property
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 max-w-md">
        <div className="relative">
          <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city, or address"
            className="pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Icon.Properties className="h-6 w-6" />}
          title={query ? "No matching properties" : "No properties yet"}
          description={
            query
              ? "Try a different search term."
              : isAdmin
                ? "Add the homes you manage to start building your portfolio."
                : "Properties you own or manage will appear here."
          }
          action={!query && isAdmin ? <Button onClick={() => setFormOpen(true)}>Add your first property</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              openTasks={tasks.filter((t) => t.property_id === p.id && t.status !== "Completed").length}
              pendingProposals={proposals.filter((pr) => pr.property_id === p.id && (pr.status === "Pending" || pr.status === "Question")).length}
            />
          ))}
        </div>
      )}

      {isAdmin ? (
        <PropertyFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onCreated={(id) => router.push(`/properties/${id}`)}
        />
      ) : null}
    </div>
  );
}
