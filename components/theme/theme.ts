export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme-preference";
export const THEME_MODES: ThemeMode[] = ["system", "light", "dark"];

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(storedMode) ? storedMode : "system";
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getServerTheme(): ResolvedTheme {
  return "light";
}

export function getResolvedTheme(
  mode: ThemeMode,
  systemTheme: ResolvedTheme,
): ResolvedTheme {
  return mode === "system" ? systemTheme : mode;
}

export function subscribeSystemTheme(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

export function syncTheme(mode: ThemeMode, resolvedTheme: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.setAttribute("data-theme-mode", mode);
  root.setAttribute("data-theme", resolvedTheme);
  root.style.colorScheme = resolvedTheme;
}

export function getThemeInitializationScript() {
  return `
    (function () {
      var storageKey = "${THEME_STORAGE_KEY}";
      var root = document.documentElement;
      var storedMode = window.localStorage.getItem(storageKey);
      var mode =
        storedMode === "light" || storedMode === "dark" || storedMode === "system"
          ? storedMode
          : "system";
      var resolvedTheme =
        mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : mode === "system"
            ? "light"
            : mode;

      root.setAttribute("data-theme-mode", mode);
      root.setAttribute("data-theme", resolvedTheme);
      root.style.colorScheme = resolvedTheme;
    })();
  `;
}
