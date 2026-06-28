export type ThemeMode = "system" | "light" | "dark";
export type ThemeFamily = "neo" | "anthropic" | "openai";

export const THEME_MODE_KEY = "themeMode";
export const THEME_FAMILY_KEY = "themeFamily";
export const THEME_CHANGE_EVENT = "theme-mode-change";
export const THEME_FAMILY_CHANGE_EVENT = "theme-family-change";

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export function isThemeFamily(value: string | null): value is ThemeFamily {
  return value === "neo" || value === "anthropic" || value === "openai";
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

export function getStoredThemeFamily(): ThemeFamily {
  if (typeof window === "undefined") {
    return "neo";
  }

  const storedFamily = window.localStorage.getItem(THEME_FAMILY_KEY);
  return isThemeFamily(storedFamily) ? storedFamily : "neo";
}

export function resolveThemeMode(mode: ThemeMode): "light" | "dark" {
  if (mode !== "system" || typeof window === "undefined") {
    return mode === "dark" ? "dark" : "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyThemeMode(mode: ThemeMode, family = getStoredThemeFamily()) {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = resolveThemeMode(mode);
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.themeFamily = family;
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

export function setStoredThemeFamily(family: ThemeFamily) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_FAMILY_KEY, family);
  applyThemeMode(getStoredThemeMode(), family);
  window.dispatchEvent(new CustomEvent(THEME_FAMILY_CHANGE_EVENT, { detail: family }));
}
