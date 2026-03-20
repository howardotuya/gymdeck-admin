"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

type ThemeMode = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme-preference";
const MODES: ThemeMode[] = ["system", "light", "dark"];

function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "system";
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerTheme(): ResolvedTheme {
  return "light";
}

function subscribeSystemTheme(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function syncTheme(mode: ThemeMode, resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.setAttribute("data-theme-mode", mode);
  root.setAttribute("data-theme", resolved);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => getStoredMode());
  const systemTheme = useSyncExternalStore<ResolvedTheme>(
    subscribeSystemTheme,
    getSystemTheme,
    getServerTheme
  );
  const resolvedTheme: ResolvedTheme =
    mode === "dark" ? "dark" : mode === "light" ? "light" : systemTheme;

  useEffect(() => {
    syncTheme(mode, resolvedTheme);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, resolvedTheme]);

  const onToggle = useCallback(() => {
    const currentIndex = MODES.indexOf(mode);
    const nextMode = MODES[(currentIndex + 1) % MODES.length];
    setMode(nextMode);
  }, [mode]);

  const buttonLabel = useMemo(() => {
    if (mode === "system") {
      return `Theme: System (${resolvedTheme})`;
    }
    return `Theme: ${mode[0].toUpperCase()}${mode.slice(1)}`;
  }, [mode, resolvedTheme]);

  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-border-soft bg-bg-surface px-4 py-2 text-[12px] font-semibold text-text-primary shadow-sm transition-colors hover:bg-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/40"
      aria-label={`Toggle theme mode. Current mode is ${mode}`}
      title="Cycle theme: system, light, dark"
    >
      <span
        aria-hidden="true"
        className="size-2 rounded-full bg-brand-primary"
      />
      {buttonLabel}
    </button>
  );
}
