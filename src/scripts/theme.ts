export type ThemeMode = "system" | "light" | "dark";

export const THEME_MODE_KEY = "themeMode";
export const THEME_CHANGE_EVENT = "theme-mode-change";

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedMode = window.localStorage.getItem(THEME_MODE_KEY);
  if (isThemeMode(storedMode)) {
    return storedMode;
  }

  const legacyTheme = window.localStorage.getItem("theme");
  return legacyTheme === "light" || legacyTheme === "dark"
    ? legacyTheme
    : "system";
}

export function resolveThemeMode(mode: ThemeMode): "light" | "dark" {
  if (mode !== "system" || typeof window === "undefined") {
    return mode === "dark" ? "dark" : "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyThemeMode(mode: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = resolveThemeMode(mode);
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themeMode = mode;
}

export function setStoredThemeMode(mode: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_MODE_KEY, mode);
  window.localStorage.setItem("theme", mode === "system" ? resolveThemeMode(mode) : mode);
  applyThemeMode(mode);
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: mode }));
}
