"use client";

import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "@/components/icons";
import {
  getResolvedTheme,
  getServerTheme,
  getStoredThemeMode,
  getSystemTheme,
  subscribeSystemTheme,
  syncTheme,
  THEME_MODES,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "./theme";

const THEME_LABELS: Record<ThemeMode, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const THEME_ICONS = {
  system: MonitorIcon,
  light: SunIcon,
  dark: MoonIcon,
} satisfies Record<ThemeMode, typeof MonitorIcon>;

type ThemeToggleProps = {
  className?: string;
  labelMode?: "responsive" | "always" | "hidden";
};

export function ThemeToggle({
  className,
  labelMode = "responsive",
}: ThemeToggleProps) {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [mode, setMode] = useState<ThemeMode>(() => getStoredThemeMode());
  const systemTheme = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemTheme,
    getServerTheme,
  );
  const resolvedTheme = getResolvedTheme(mode, systemTheme);

  useEffect(() => {
    syncTheme(mode, resolvedTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode, resolvedTheme]);

  const handleToggle = useCallback(() => {
    const currentIndex = THEME_MODES.indexOf(mode);
    const nextMode = THEME_MODES[(currentIndex + 1) % THEME_MODES.length];
    setMode(nextMode);
  }, [mode]);

  const themeLabel = useMemo(() => {
    if (!isHydrated) {
      return "Theme";
    }

    return THEME_LABELS[mode];
  }, [isHydrated, mode]);

  const buttonTitle = useMemo(() => {
    if (!isHydrated) {
      return "Cycle theme: system, light, dark";
    }

    if (mode === "system") {
      return `Theme: System (${resolvedTheme}). Click to cycle system, light, dark.`;
    }

    return `Theme: ${THEME_LABELS[mode]}. Click to cycle system, light, dark.`;
  }, [isHydrated, mode, resolvedTheme]);

  const iconMode = isHydrated ? mode : "system";
  const ThemeIcon = THEME_ICONS[iconMode];

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={buttonTitle}
      title={buttonTitle}
      className={clsx(
        "inline-flex h-11 items-center gap-2 rounded-full border border-border-soft bg-bg-surface px-3 text-text-secondary transition-colors hover:border-border-strong hover:bg-bg-control hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/20",
        className,
      )}
    >
      <span
        className={clsx(
          "inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-soft bg-bg-control",
          isHydrated && mode === "light" && "border-border-brand bg-bg-brand-soft text-text-brand",
          isHydrated && mode === "dark" && "border-transparent bg-bg-brand-strong text-text-inverse",
          isHydrated && mode === "system" && "border-transparent bg-bg-action-soft text-text-secondary",
        )}
      >
        <ThemeIcon size={15} />
      </span>
      {labelMode === "hidden" ? null : (
        <span
          className={clsx(
            "text-[13px] font-medium text-text-primary",
            labelMode === "responsive" && "hidden sm:inline",
          )}
        >
          {themeLabel}
        </span>
      )}
    </button>
  );
}
