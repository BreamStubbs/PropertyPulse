"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { adminProfile, propertyOwnersOf, visibleProperties } from "@/lib/queries";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Avatar } from "@/components/ui/Avatar";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";

const INTEGRATIONS = [
  { name: "Airbnb", desc: "Sync reservations from your listing calendar." },
  { name: "VRBO", desc: "Sync reservations from your listing calendar." },
  { name: "Stripe", desc: "Accept online invoice payments from owners." },
];

export default function SettingsPage() {
  const { data, currentUser, updateProfile, updatePrefs, resetDemo } = useStore();
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;
  const isAdmin = currentUser.role === "admin";
  const prefs =
    data.notification_preferences.find((p) => p.user_id === currentUser.id) ?? {
      user_id: currentUser.id,
      email_enabled: true,
      sms_enabled: false,
      weekly_summary: true,
      proposal_alerts: true,
    };
  const myProperties = visibleProperties(data, currentUser);
  const manager = adminProfile(data);

  return (
    <div className="space-y-6">
      <PageHeader description="Manage your profile, notifications, and account preferences." />

      {/* Profile */}
      <Card>
        <CardHeader title="Profile" subtitle="Your personal details" />
        <CardBody>
          <div className="mb-5 flex items-center gap-4">
            <Avatar name={currentUser.full_name} src={currentUser.avatar_url} size={64} />
            <div>
              <div className="font-display text-xl text-slate-900">{currentUser.full_name}</div>
              <div className="text-sm capitalize text-slate-500">
                {isAdmin ? "Property Manager" : "Owner"}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <Input
                defaultValue={currentUser.full_name}
                onChange={(e) => updateProfile({ full_name: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <Input defaultValue={currentUser.email} onChange={(e) => updateProfile({ email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input defaultValue={currentUser.phone ?? ""} onChange={(e) => updateProfile({ phone: e.target.value })} />
            </Field>
          </div>
          <div className="mt-5">
            <Button
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 1800);
              }}
            >
              {saved ? "Saved ✓" : "Save changes"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader title="Notifications" subtitle="Choose how we keep you in the loop" />
        <CardBody className="divide-y divide-stone-100 py-0">
          <Toggle label="Email notifications" description="Receive updates by email." checked={prefs.email_enabled} onChange={(v) => updatePrefs({ email_enabled: v })} />
          <Toggle label="SMS notifications" description="Receive text-message alerts." checked={prefs.sms_enabled} onChange={(v) => updatePrefs({ sms_enabled: v })} />
          <Toggle label="Weekly summary" description="A digest of activity across your properties." checked={prefs.weekly_summary} onChange={(v) => updatePrefs({ weekly_summary: v })} />
          <Toggle label="Proposal alerts" description="Get notified when a new proposal needs your review." checked={prefs.proposal_alerts} onChange={(v) => updatePrefs({ proposal_alerts: v })} />
        </CardBody>
      </Card>

      {/* Role-specific */}
      {isAdmin ? (
        <>
          <Card>
            <CardHeader title="Team members" subtitle="People who help manage your portfolio" />
            <CardBody>
              <div className="flex items-center gap-3">
                <Avatar name={currentUser.full_name} src={currentUser.avatar_url} size={40} />
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{currentUser.full_name}</div>
                  <div className="text-[13px] text-slate-500">{currentUser.email} · Owner / Admin</div>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[12px] font-medium text-amber-700">You</span>
              </div>
              <Button variant="secondary" className="mt-4" onClick={() => alert("Invite teammate — coming soon.")}>
                Invite teammate
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Integrations" subtitle="Connect external services" />
            <CardBody className="space-y-3">
              {INTEGRATIONS.map((i) => (
                <div key={i.name} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 px-4 py-3">
                  <div>
                    <div className="font-medium text-slate-900">{i.name}</div>
                    <div className="text-[13px] text-slate-500">{i.desc}</div>
                  </div>
                  <span className="flex items-center gap-2 text-[13px] text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-slate-300" /> Not connected
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <CardHeader title="My properties" subtitle="Properties linked to your account" />
            <CardBody className="space-y-3">
              {myProperties.map((p) => (
                <Link
                  key={p.id}
                  href={`/properties/${p.id}`}
                  className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 transition-colors hover:bg-stone-50"
                >
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.hero_image_url} alt="" className="h-full w-full object-cover" />
                  </span>
                  <div>
                    <div className="font-medium text-slate-900">{p.name}</div>
                    <div className="text-[13px] text-slate-500">{p.address_line1}, {p.city}, {p.state}</div>
                  </div>
                </Link>
              ))}
            </CardBody>
          </Card>

          {manager ? (
            <Card>
              <CardHeader title="Your property manager" subtitle="Who to reach for anything" />
              <CardBody>
                <div className="flex items-center gap-4">
                  <Avatar name={manager.full_name} src={manager.avatar_url} size={56} />
                  <div>
                    <div className="font-display text-lg text-slate-900">{manager.full_name}</div>
                    <div className="text-sm text-slate-500">{manager.email}</div>
                    {manager.phone ? <div className="text-sm text-slate-500">{manager.phone}</div> : null}
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : null}
        </>
      )}

      {/* Demo controls */}
      <Card>
        <CardHeader title="Demo data" subtitle="This MVP stores data in your browser." />
        <CardBody>
          <p className="text-sm text-slate-500">
            All changes you make are saved locally in this browser. Reset to restore the original seed data.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => {
              if (confirm("Reset all demo data to its original state?")) resetDemo();
            }}
          >
            Reset demo data
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
