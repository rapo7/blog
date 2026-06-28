import {
  BriefcaseBusiness,
  Check,
  Home,
  MessageCircle,
  Monitor,
  Moon,
  Newspaper,
  Sun,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  applyThemeMode,
  getStoredThemeFamily,
  getStoredThemeMode,
  setStoredThemeFamily,
  setStoredThemeMode,
  THEME_CHANGE_EVENT,
  THEME_FAMILY_CHANGE_EVENT,
  type ThemeFamily,
  type ThemeMode,
} from "../scripts/theme";

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

const navItems = [
  { href: baseUrl || "/", label: "Home", icon: Home, match: "home" },
  { href: `${baseUrl}/blogs`, label: "Posts", icon: Newspaper, match: "blogs" },
  { href: `${baseUrl}/#portfolio`, label: "Work", icon: BriefcaseBusiness, match: "work" },
];

const themeOptions: Array<{ value: ThemeFamily; label: string; description: string }> = [
  { value: "neo", label: "Neo", description: "Current portfolio style" },
  { value: "anthropic", label: "Anthropic", description: "Warm, quiet canvas" },
  { value: "openai", label: "OpenAI", description: "Neutral, minimal surfaces" },
];

const modeOptions: Array<{ value: ThemeMode; label: string }> = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const themeLabels: Record<ThemeFamily, string> = {
  neo: "Neo",
  anthropic: "Anthropic",
  openai: "OpenAI",
};

const modeLabels: Record<ThemeMode, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

export default function SiteNav() {
  const [path, setPath] = useState("");
  const [mode, setMode] = useState<ThemeMode>("system");
  const [family, setFamily] = useState<ThemeFamily>("neo");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMode = getStoredThemeMode();
    const initialFamily = getStoredThemeFamily();
    setMode(initialMode);
    setFamily(initialFamily);
    applyThemeMode(initialMode, initialFamily);
    syncPath();

    function syncPath() {
      setPath(window.location.pathname + window.location.hash);
    }

    function handleThemeChange(event: Event) {
      const nextMode = (event as CustomEvent<ThemeMode>).detail;
      if (nextMode) {
        setMode(nextMode);
      }
    }

    function handleThemeFamilyChange(event: Event) {
      const nextFamily = (event as CustomEvent<ThemeFamily>).detail;
      if (nextFamily) {
        setFamily(nextFamily);
      }
    }

    function handleSystemChange() {
      if (getStoredThemeMode() === "system") {
        applyThemeMode("system", getStoredThemeFamily());
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsThemeMenuOpen(false);
      }
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.addEventListener(THEME_FAMILY_CHANGE_EVENT, handleThemeFamilyChange);
    window.addEventListener("popstate", syncPath);
    window.addEventListener("hashchange", syncPath);
    document.addEventListener("astro:page-load", syncPath);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    media.addEventListener("change", handleSystemChange);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener(THEME_FAMILY_CHANGE_EVENT, handleThemeFamilyChange);
      window.removeEventListener("popstate", syncPath);
      window.removeEventListener("hashchange", syncPath);
      document.removeEventListener("astro:page-load", syncPath);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      media.removeEventListener("change", handleSystemChange);
    };
  }, []);

  function handleNavigate(nextHref: string) {
    try {
      const url = new URL(nextHref, window.location.origin);
      setPath(url.pathname + url.hash);
    } catch {
      setPath(nextHref);
    }
  }

  function chooseFamily(nextFamily: ThemeFamily) {
    setFamily(nextFamily);
    setStoredThemeFamily(nextFamily);
    setIsThemeMenuOpen(false);
  }

  function chooseMode(nextMode: ThemeMode) {
    setMode(nextMode);
    setStoredThemeMode(nextMode);
    setIsThemeMenuOpen(false);
  }

  const isChatActive = path === `${baseUrl}/chat` || path === `${baseUrl}/chat/`;

  return (
    <header className="fixed inset-x-0 top-0 z-[65] px-3 pt-[calc(0.75rem+env(safe-area-inset-top))] pointer-events-none">
      <nav
        className="mx-auto flex w-full max-w-4xl items-center justify-between gap-2 rounded-full border border-default bg-surface/92 px-2 py-2 text-default shadow-[var(--shadow-nav)] ring-1 ring-default/15 backdrop-blur-xl pointer-events-auto"
        aria-label="Primary navigation"
      >
        <a
          href={baseUrl || "/"}
          onClick={() => handleNavigate(baseUrl || "/")}
          className="flex h-10 shrink-0 items-center rounded-full px-3 text-base font-black tracking-tight text-default transition-colors hover:bg-offset focus:outline-none focus:ring-2 focus:ring-secondary/70"
          aria-label="Ravi home"
        >
          Ravi<span className="text-secondary">.</span>
        </a>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.match === "home"
                ? path === `${baseUrl}/` || path === baseUrl || path === "/"
                : item.match === "blogs"
                  ? path.startsWith(`${baseUrl}/blogs`)
                  : path.includes("#portfolio");

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => handleNavigate(item.href)}
                aria-current={active ? "page" : undefined}
                className={`flex h-10 min-w-10 items-center justify-center gap-2 rounded-full px-2.5 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/70 sm:px-4 ${
                  active
                    ? "bg-offset text-default"
                    : "text-offset hover:bg-offset hover:text-default"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </a>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsThemeMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-offset transition-colors hover:bg-offset hover:text-default focus:outline-none focus:ring-2 focus:ring-secondary/70"
              aria-label={`Theme: ${themeLabels[family]}, ${modeLabels[mode]}. Open theme menu.`}
              title={`${themeLabels[family]} / ${modeLabels[mode]}`}
              aria-haspopup="menu"
              aria-expanded={isThemeMenuOpen}
            >
              <ThemeFamilyIcon family={family} />
            </button>

            {isThemeMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-12 w-72 rounded-2xl border border-default bg-surface p-2 text-default shadow-[var(--shadow-menu)]"
              >
                <div className="px-3 pb-2 pt-2 text-xs font-bold uppercase tracking-wide text-offset">
                  Theme
                </div>
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={family === option.value}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-offset focus:outline-none focus:ring-2 focus:ring-secondary/70"
                    onClick={() => chooseFamily(option.value)}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-offset text-default">
                      <ThemeFamilyIcon family={option.value} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-black">{option.label}</span>
                      <span className="block text-xs font-semibold text-offset">{option.description}</span>
                    </span>
                    {family === option.value && <Check className="h-4 w-4 text-secondary" aria-hidden="true" />}
                  </button>
                ))}

                <div className="mx-3 my-2 border-t border-default" />
                <div className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wide text-offset">
                  Mode
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {modeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={mode === option.value}
                      className={`flex h-10 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-black transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/70 ${
                        mode === option.value
                          ? "bg-default text-background"
                          : "text-offset hover:bg-offset hover:text-default"
                      }`}
                      onClick={() => chooseMode(option.value)}
                    >
                      <ThemeModeIcon mode={option.value} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a
            href={`${baseUrl}/chat`}
            onClick={() => handleNavigate(`${baseUrl}/chat`)}
            aria-current={isChatActive ? "page" : undefined}
            className={`flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-black transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/70 ${
              isChatActive
                ? "bg-tertiary text-default"
                : "bg-primary text-default hover:bg-tertiary"
            }`}
          >
            <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
            <span>Chat</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

function ThemeFamilyIcon({ family }: { family: ThemeFamily }) {
  const color = themeLogoColors[family];

  if (family === "anthropic") {
    return <AnthropicThemeLogo className="h-[18px] w-[18px]" color={color} />;
  }

  if (family === "openai") {
    return <OpenAIThemeLogo className="h-[18px] w-[18px]" color={color} />;
  }

  return <NeoThemeLogo className="h-[18px] w-[18px]" color={color} />;
}

const themeLogoColors: Record<ThemeFamily, string> = {
  neo: "#9bdc28",
  anthropic: "#d97852",
  openai: "#10a37f",
};

function AnthropicThemeLogo({ className, color }: { className: string; color: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ color }} aria-hidden="true">
      {Array.from({ length: 16 }).map((_, index) => {
        const angle = (index * 22.5 * Math.PI) / 180;
        const x1 = 32 + Math.cos(angle) * 7;
        const y1 = 32 + Math.sin(angle) * 7;
        const x2 = 32 + Math.cos(angle) * 25;
        const y2 = 32 + Math.sin(angle) * 25;

        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function OpenAIThemeLogo({ className, color }: { className: string; color: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ color }} fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 8.6c4.1 0 7.5 2.6 8.8 6.2 3.8-.5 7.7 1.3 9.8 4.9 2.1 3.6 1.6 7.8-.7 10.9 2.4 3.1 2.8 7.3.8 10.9-2.1 3.6-5.9 5.5-9.8 5-1.4 3.6-4.8 6.1-8.9 6.1s-7.5-2.5-8.9-6.1c-3.8.5-7.7-1.4-9.8-5-2.1-3.6-1.6-7.8.8-10.9-2.4-3.1-2.8-7.3-.7-10.9 2.1-3.6 5.9-5.4 9.8-4.9C24.5 11.2 27.9 8.6 32 8.6Z" />
        <path d="M40.8 14.8 25.7 23.5a8.3 8.3 0 0 0-4.1 7.2v15.8" />
        <path d="M49.9 30.6 34.8 21.9a8.3 8.3 0 0 0-8.2 0L12.9 29.8" />
        <path d="M40.9 46.5V29.1a8.3 8.3 0 0 0-4.1-7.2L23.2 14" />
        <path d="M23.2 46.5 38.3 37.8a8.3 8.3 0 0 0 4.1-7.2V14.8" />
        <path d="M14.1 30.6 29.2 39.3a8.3 8.3 0 0 0 8.2 0l13.7-7.9" />
        <path d="M23.1 14.8v17.4a8.3 8.3 0 0 0 4.1 7.2l13.6 7.9" />
      </g>
    </svg>
  );
}

function NeoThemeLogo({ className, color }: { className: string; color: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ color }} fill="none" aria-hidden="true">
      <path
        d="M14 46V18l18 28 18-28v28"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThemeModeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === "light") {
    return <Sun className="h-3.5 w-3.5" aria-hidden="true" />;
  }

  if (mode === "dark") {
    return <Moon className="h-3.5 w-3.5" aria-hidden="true" />;
  }

  return <Monitor className="h-3.5 w-3.5" aria-hidden="true" />;
}
