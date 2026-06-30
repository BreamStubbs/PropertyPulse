"use client";

import { useEffect, useState } from "react";
import { clsx } from "@/lib/clsx";
import { getMode, setMode, type ThemeMode } from "@/lib/theme";

const OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function AppearanceControl() {
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    setModeState(getMode());
    const onChange = () => setModeState(getMode());
    window.addEventListener("themechange", onChange);
    return () => window.removeEventListener("themechange", onChange);
  }, []);

  return (
    <div className="inline-flex rounded-xl border border-stone-200 bg-stone-50 p-1 dark:border-slate-700 dark:bg-slate-800">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => {
            setMode(o.value);
            setModeState(o.value);
          }}
          aria-pressed={mode === o.value}
          className={clsx(
            "min-h-[40px] rounded-lg px-4 text-sm font-medium transition-colors",
            mode === o.value
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
