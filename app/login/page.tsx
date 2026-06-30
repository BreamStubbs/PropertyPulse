"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/icons";

export default function LoginPage() {
  const { data, currentUser, hydrated, login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && currentUser) router.replace("/dashboard");
  }, [hydrated, currentUser, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = data.profiles.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
    if (!match) {
      setError("No account found for that email. Try one of the demo accounts below.");
      return;
    }
    login(match.id);
    router.replace("/dashboard");
  };

  const quickLogin = (id: string) => {
    login(id);
    router.replace("/dashboard");
  };

  const admin = data.profiles.find((p) => p.role === "admin");
  const owners = data.profiles.filter((p) => p.role === "owner");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel */}
      <div className="relative hidden flex-1 overflow-hidden bg-slate-900 lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/cypress/1200/1600"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500">
              <Icon.Pin className="h-6 w-6 text-white" />
            </span>
            <span className="font-display text-2xl">PropertyPulse</span>
          </div>
          <div className="max-w-md">
            <h1 className="font-display text-4xl leading-tight text-white">
              One calm place for every property you own or manage.
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Tasks, proposals, files, invoices, calendar, and messages — organized per property, in plain language.
            </p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-stone-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500">
              <Icon.Pin className="h-6 w-6 text-white" />
            </span>
            <span className="font-display text-2xl text-slate-900">PropertyPulse</span>
          </div>

          <h2 className="font-display text-3xl text-slate-900">Welcome back</h2>
          <p className="mt-1 text-[15px] text-slate-500">Sign in to your owner portal.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@email.com"
                autoComplete="email"
              />
            </Field>
            <Field label="Password" hint="Demo accounts accept any password.">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <Button type="submit" size="lg" className="w-full">
              Sign in
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-sm text-slate-400">
            <span className="h-px flex-1 bg-stone-200" />
            or jump in as a demo account
            <span className="h-px flex-1 bg-stone-200" />
          </div>

          <div className="space-y-2">
            {admin ? (
              <DemoAccount profile={admin} subtitle="Property Manager — sees the whole portfolio" onClick={() => quickLogin(admin.id)} />
            ) : null}
            {owners.map((o) => (
              <DemoAccount
                key={o.id}
                profile={o}
                subtitle="Owner — sees only their own property"
                onClick={() => quickLogin(o.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoAccount({
  profile,
  subtitle,
  onClick,
}: {
  profile: { id: string; full_name: string; avatar_url?: string; role: string };
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-left transition-colors hover:border-amber-300 hover:bg-amber-50/40 min-h-[44px]"
    >
      <Avatar name={profile.full_name} src={profile.avatar_url} size={40} />
      <div className="min-w-0">
        <div className="truncate font-medium text-slate-900">{profile.full_name}</div>
        <div className="truncate text-[13px] text-slate-500">{subtitle}</div>
      </div>
      <span
        className={`ml-auto rounded-full px-2 py-0.5 text-[12px] font-medium ${
          profile.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
        }`}
      >
        {profile.role}
      </span>
    </button>
  );
}
