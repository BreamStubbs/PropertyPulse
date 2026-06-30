"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav";
import { Icon } from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import { clsx } from "@/lib/clsx";
import type { Profile } from "@/lib/types";

export function Sidebar({
  user,
  onNavigate,
  onLogout,
}: {
  user: Profile;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500">
          <Icon.Pin className="h-5 w-5 text-white" />
        </span>
        <span className="font-display text-xl text-white">PropertyPulse</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors min-h-[44px]",
                active ? "bg-amber-500 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              <ItemIcon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar name={user.full_name} src={user.avatar_url} size={40} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-medium text-white">{user.full_name}</div>
            <div className="truncate text-[13px] capitalize text-slate-400">
              {user.role === "admin" ? "Property Manager" : "Owner"}
            </div>
          </div>
          <button
            onClick={onLogout}
            aria-label="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Icon.Logout className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
