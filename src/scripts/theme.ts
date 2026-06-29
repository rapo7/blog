export type ThemeMode = "system" | "light" | "dark";
export type ThemeFamily = "neo" | "anthropic" | "openai" | "wise" | "jake";

export const THEME_MODE_KEY = "themeMode";
export const THEME_FAMILY_KEY = "themeFamily";
export const THEME_FAMILY_SESSION_KEY = "themeFamilySession";
export const THEME_CHANGE_EVENT = "theme-mode-change";
export const THEME_FAMILY_CHANGE_EVENT = "theme-family-change";

const SVG_NS = "http://www.w3.org/2000/svg";
const THEME_MORPH_DURATION = 540;
const THEME_MORPH_FADE_START = 0.84;

type ThemeMorphColors = {
  accent: string;
  background: string;
  surface: string;
};

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export function isThemeFamily(value: string | null): value is ThemeFamily {
  return value === "neo" || value === "anthropic" || value === "openai" || value === "wise" || value === "jake";
}

export function pickRandomThemeFamily(): ThemeFamily {
  const families: ThemeFamily[] = ["neo", "anthropic", "openai", "wise", "jake"];

  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return families[values[0] % families.length] ?? "neo";
  }

  return families[Math.floor(Math.random() * families.length)] ?? "neo";
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
  if (isThemeFamily(storedFamily)) {
    window.sessionStorage.setItem(THEME_FAMILY_SESSION_KEY, storedFamily);
    return storedFamily;
  }

  const sessionFamily = window.sessionStorage.getItem(THEME_FAMILY_SESSION_KEY);
  if (isThemeFamily(sessionFamily)) {
    return sessionFamily;
  }

  const nextFamily = pickRandomThemeFamily();
  window.sessionStorage.setItem(THEME_FAMILY_SESSION_KEY, nextFamily);
  return nextFamily;
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

function getThemeMorphColors(): ThemeMorphColors {
  const styles = getComputedStyle(document.documentElement);

  return {
    accent: styles.getPropertyValue("--color-primary").trim() || "#9bdc28",
    background: styles.getPropertyValue("--color-background").trim() || "#ffffff",
    surface: styles.getPropertyValue("--color-surface").trim() || "#f8faf4",
  };
}

function buildMorphPath(topY: number, controlY: number) {
  return `M 0 100 V ${topY.toFixed(2)} Q 50 ${controlY.toFixed(2)} 100 ${topY.toFixed(2)} V 100 z`;
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function easeOutQuart(amount: number) {
  return 1 - Math.pow(1 - amount, 4);
}

function easeInOutSine(amount: number) {
  return -(Math.cos(Math.PI * amount) - 1) / 2;
}

function createThemeMorphOverlay(colors: ThemeMorphColors) {
  document.querySelectorAll(".theme-morph-overlay").forEach((element) => element.remove());

  const overlay = document.createElement("div");
  overlay.className = "theme-morph-overlay";
  overlay.setAttribute("aria-hidden", "true");

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "theme-morph-overlay__svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");

  const defs = document.createElementNS(SVG_NS, "defs");
  const gradient = document.createElementNS(SVG_NS, "linearGradient");
  const gradientId = `theme-morph-${Date.now().toString(36)}`;
  gradient.setAttribute("id", gradientId);
  gradient.setAttribute("x1", "0");
  gradient.setAttribute("y1", "0");
  gradient.setAttribute("x2", "100");
  gradient.setAttribute("y2", "100");
  gradient.setAttribute("gradientUnits", "userSpaceOnUse");

  [
    ["0", colors.background],
    ["0.58", colors.surface],
    ["1", colors.accent],
  ].forEach(([offset, color]) => {
    const stop = document.createElementNS(SVG_NS, "stop");
    stop.setAttribute("offset", offset);
    stop.setAttribute("stop-color", color);
    gradient.append(stop);
  });

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("class", "theme-morph-overlay__path");
  path.setAttribute("fill", `url(#${gradientId})`);
  path.setAttribute("stroke", `url(#${gradientId})`);
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("vector-effect", "non-scaling-stroke");
  path.setAttribute("d", buildMorphPath(0, 0));

  defs.append(gradient);
  svg.append(defs, path);
  overlay.append(svg);
  document.body.append(overlay);

  return { overlay, path };
}

function animateThemeMorph(applyTheme: () => void) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    applyTheme();
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !document.body) {
    applyTheme();
    return;
  }

  const colors = getThemeMorphColors();
  const { overlay, path } = createThemeMorphOverlay(colors);
  document.documentElement.classList.add("theme-morphing");

  requestAnimationFrame(() => {
    applyTheme();

    const startedAt = performance.now();
    const render = (now: number) => {
      const progress = Math.min((now - startedAt) / THEME_MORPH_DURATION, 1);
      const reveal = easeOutQuart(progress);
      const topY = lerp(0, 104, reveal);
      const waveLift = Math.sin(progress * Math.PI) * 18;
      const controlY = lerp(-8, 108, easeInOutSine(progress)) - waveLift;

      path.setAttribute("d", buildMorphPath(topY, controlY));
      overlay.style.opacity = progress > THEME_MORPH_FADE_START
        ? `${1 - (progress - THEME_MORPH_FADE_START) / (1 - THEME_MORPH_FADE_START)}`
        : "1";

      if (progress < 1) {
        requestAnimationFrame(render);
        return;
      }

      overlay.remove();
      document.documentElement.classList.remove("theme-morphing");
    };

    requestAnimationFrame(render);
  });
}

export function setStoredThemeMode(mode: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_MODE_KEY, mode);
  window.localStorage.setItem("theme", mode === "system" ? resolveThemeMode(mode) : mode);
  animateThemeMorph(() => {
    applyThemeMode(mode);
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: mode }));
  });
}

export function setStoredThemeFamily(family: ThemeFamily) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_FAMILY_KEY, family);
  window.sessionStorage.setItem(THEME_FAMILY_SESSION_KEY, family);
  animateThemeMorph(() => {
    applyThemeMode(getStoredThemeMode(), family);
    window.dispatchEvent(new CustomEvent(THEME_FAMILY_CHANGE_EVENT, { detail: family }));
  });
}
