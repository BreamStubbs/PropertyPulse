"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export const THEME_KEY = "propertypulse:theme";

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getStoredTheme(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "dark" || t === "light" ? t : null;
  } catch {
    return null;
  }
}

function currentTheme(): Theme {
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  }
  return "light";
}

export type ThemeMode = "light" | "dark" | "system";

export function getMode(): ThemeMode {
  return getStoredTheme() ?? "system";
}

// Apply an explicit theme or hand control back to the OS ("system").
export function setMode(mode: ThemeMode) {
  if (mode === "system") {
    try {
      localStorage.removeItem(THEME_KEY);
    } catch {
      /* storage unavailable */
    }
    document.documentElement.classList.toggle("dark", systemPrefersDark());
    window.dispatchEvent(new CustomEvent("themechange"));
  } else {
    applyTheme(mode);
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

// Small hook that reflects and controls the document theme. Multiple toggles
// (top bar, settings) stay in sync via the "themechange" event. Initial class
// is set by the inline script in app/layout.tsx to avoid a flash.
export function useTheme(): { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void } {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(currentTheme());
    const onChange = () => setThemeState(currentTheme());
    window.addEventListener("themechange", onChange);
    // Follow system changes only when the user hasn't set an explicit preference.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      if (!getStoredTheme()) applyTheme(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onSystem);
    return () => {
      window.removeEventListener("themechange", onChange);
      mq.removeEventListener("change", onSystem);
    };
  }, []);

  return {
    theme,
    setTheme: (t: Theme) => applyTheme(t),
    toggle: () => applyTheme(currentTheme() === "dark" ? "light" : "dark"),
  };
}
