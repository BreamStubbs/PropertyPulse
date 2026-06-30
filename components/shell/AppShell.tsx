"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { NAV_ITEMS } from "./nav";
import { Icon } from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useStore } from "@/lib/store";

export function AppShell({ children }: { children: ReactNode }) {
  const { currentUser, hydrated, logout } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !currentUser) router.replace("/login");
  }, [hydrated, currentUser, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 text-slate-400 dark:bg-slate-950 dark:text-slate-500">
        Loading…
      </div>
    );
  }

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const title = NAV_ITEMS.find((i) => pathname === i.href || pathname.startsWith(i.href + "/"))?.label ?? "PropertyPulse";

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <Sidebar user={currentUser} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80%]">
            <Sidebar user={currentUser} onNavigate={() => setMobileOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-stone-200 bg-stone-50/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 hover:bg-stone-200 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          >
            <Icon.Menu className="h-6 w-6" />
          </button>
          <h1 className="font-display text-2xl text-slate-900 dark:text-slate-100">{title}</h1>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">{currentUser.full_name}</span>
              <span className="block text-[13px] capitalize text-slate-500 dark:text-slate-400">
                {currentUser.role === "admin" ? "Property Manager" : "Owner"}
              </span>
            </span>
            <Avatar name={currentUser.full_name} src={currentUser.avatar_url} size={40} />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
