import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from "react";
import {
  applyThemeMode,
  getStoredThemeMode,
  setStoredThemeMode,
  THEME_CHANGE_EVENT,
  type ThemeMode,
} from "../scripts/theme";

const themeOrder: ThemeMode[] = ["system", "light", "dark"];
const BALL_SIZE = 64;
const EDGE_GAP = 16;
const POSITION_KEY = "quickBallPositionV4";

const themeLabels: Record<ThemeMode, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

const navItems = [
  { href: baseUrl || "/", label: "Home", icon: "home" },
  { href: `${baseUrl}/blogs`, label: "Posts", icon: "posts" },
  { href: `${baseUrl}/chat`, label: "Ask Ravi", icon: "chat" },
];

type QuickBallSide = "left" | "right";

interface QuickBallPosition {
  side: QuickBallSide;
  yRatio: number | null;
}

export default function QuickBall() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ThemeMode>("system");
  const [position, setPosition] = useState<QuickBallPosition>({
    side: "right",
    yRatio: null,
  });
  const [dragX, setDragX] = useState<number | null>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    active: false,
    moved: false,
    pointerId: 0,
    startX: 0,
    startY: 0,
    startXPosition: 0,
    startSide: "right" as QuickBallSide,
    startYPosition: 0,
  });
  const suppressClick = useRef(false);

  useEffect(() => {
    const initialMode = getStoredThemeMode();
    setMode(initialMode);
    applyThemeMode(initialMode);

    const viewportHeight = window.innerHeight || 720;
    const storedPosition = parseStoredPosition();
    const defaultTop = viewportHeight - BALL_SIZE - EDGE_GAP;
    setPosition({
      side: storedPosition?.side || "right",
      yRatio:
        storedPosition?.yRatio ??
        pixelsToRatio(defaultTop),
    });
    function handleClick(event: MouseEvent) {
      if (ballRef.current && !ballRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleModeChange(event: Event) {
      const nextMode = (event as CustomEvent<ThemeMode>).detail;
      if (nextMode) {
        setMode(nextMode);
      }
    }

    function handleSystemChange() {
      if (getStoredThemeMode() === "system") {
        applyThemeMode("system");
      }
    }

    function handleResize() {
      setPosition((current) => {
        const next = {
          ...current,
          yRatio: pixelsToRatio(clampY(ratioToPixels(current.yRatio))),
        };
        persistPosition(next);
        return next;
      });
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    document.addEventListener("mousedown", handleClick);
    window.addEventListener(THEME_CHANGE_EVENT, handleModeChange);
    media.addEventListener("change", handleSystemChange);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener(THEME_CHANGE_EVENT, handleModeChange);
      media.removeEventListener("change", handleSystemChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function cycleTheme() {
    const nextMode = themeOrder[(themeOrder.indexOf(mode) + 1) % themeOrder.length];
    setMode(nextMode);
    setStoredThemeMode(nextMode);
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    dragState.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startXPosition: event.currentTarget.getBoundingClientRect().left,
      startSide: position.side,
      startYPosition: event.currentTarget.getBoundingClientRect().top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const state = dragState.current;
    if (!state.active || state.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      state.moved = true;
      setOpen(false);
    }

    const nextX = clampX(state.startXPosition + deltaX);
    const centerX = nextX + BALL_SIZE / 2;
    setDragX(nextX);
    setPosition({
      side: centerX < window.innerWidth / 2 ? "left" : "right",
      yRatio: pixelsToRatio(clampY(state.startYPosition + deltaY)),
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    const state = dragState.current;
    if (!state.active || state.pointerId !== event.pointerId) {
      return;
    }

    const side: QuickBallSide =
      (dragX ?? (position.side === "left" ? EDGE_GAP : window.innerWidth - BALL_SIZE - EDGE_GAP)) +
        BALL_SIZE / 2 <
      window.innerWidth / 2
        ? "left"
        : "right";
    const nextPosition: QuickBallPosition = {
      side,
      yRatio: pixelsToRatio(clampY(ratioToPixels(position.yRatio))),
    };
    dragState.current.active = false;
    setDragX(null);
    setPosition(nextPosition);
    persistPosition(nextPosition);

    if (state.moved) {
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
    }
  }

  function toggleOpen() {
    if (suppressClick.current) {
      return;
    }
    setOpen((value) => !value);
  }

  const yPosition =
    position.yRatio === null
      ? `calc(100dvh - ${BALL_SIZE + EDGE_GAP}px)`
      : `${clampY(ratioToPixels(position.yRatio))}px`;
  const wrapperStyle: CSSProperties = {
    top: yPosition,
    ...(dragX !== null
      ? { left: `${dragX}px` }
      : position.side === "left"
        ? { left: `${EDGE_GAP}px` }
        : { right: `${EDGE_GAP}px` }),
  };
  const openDownward = ratioToPixels(position.yRatio) < 148;
  const radialItems = [
    ...navItems.map((item) => ({ ...item, type: "link" as const })),
    {
      href: "",
      label: `Theme: ${themeLabels[mode]}`,
      icon: mode,
      type: "theme" as const,
    },
  ];

  return (
    <div
      ref={ballRef}
      className="fixed z-[70] h-16 w-16 transition-[left,top] duration-150"
      style={wrapperStyle}
    >
      <div
        className={`absolute inset-0 transition duration-200 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        {radialItems.map((item, index) => {
          const tone =
            item.type === "theme"
              ? "bg-tertiary text-[#010920] hover:bg-primary"
              : "bg-primary text-[#010920] hover:bg-tertiary";
          const className = `absolute flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/50 ${tone} shadow-[0_18px_42px_rgb(1_9_32_/_32%)] ring-2 ring-[#010920]/20 backdrop-blur-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/90 ${
            open ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`;
          const style = getRadialItemStyle(index, position.side, openDownward, open);

          if (item.type === "theme") {
            return (
              <button
                key={item.type}
                type="button"
                data-quick-item="true"
                onClick={cycleTheme}
                className={className}
                style={style}
                aria-label={`${item.label}. Click to switch theme.`}
                title={`${item.label}. Click to switch theme.`}
              >
                <QuickIcon name={item.icon} />
                <span className="sr-only">{item.label}</span>
              </button>
            );
          }

          return (
            <a
              key={item.href}
              href={item.href}
              data-quick-item="true"
              onClick={() => setOpen(false)}
              className={className}
              style={style}
              aria-label={item.label}
              title={item.label}
            >
              <QuickIcon name={item.icon} />
              <span className="sr-only">{item.label}</span>
            </a>
          );
        })}
      </div>

      <button
        type="button"
        aria-label={open ? "Close quick navigation" : "Open quick navigation"}
        aria-expanded={open}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={toggleOpen}
        className="group relative h-16 w-16 touch-none rounded-full border border-default bg-surface/92 text-default shadow-[0_14px_34px_rgb(1_9_32_/_22%)] ring-1 ring-default/20 backdrop-blur-xl transition-colors hover:border-primary hover:bg-default focus:outline-none focus:ring-2 focus:ring-secondary/80"
      >
        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary" />
        <span
          className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-current transition ${
            open ? "-translate-y-1/2 rotate-45" : "-translate-y-[6px]"
          }`}
        />
        <span
          className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-current transition ${
            open ? "-translate-y-1/2 -rotate-45" : "translate-y-[5px]"
          }`}
        />
      </button>
    </div>
  );
}

function clampY(value: number) {
  if (typeof window === "undefined") {
    return value;
  }

  const min = EDGE_GAP;
  const max = Math.max(min, window.innerHeight - BALL_SIZE - EDGE_GAP);
  return Math.min(Math.max(value, min), max);
}

function defaultY() {
  if (typeof window === "undefined") {
    return 720 - BALL_SIZE - EDGE_GAP;
  }

  return window.innerHeight - BALL_SIZE - EDGE_GAP;
}

function ratioToPixels(yRatio: number | null) {
  if (yRatio === null || typeof window === "undefined") {
    return defaultY();
  }

  const range = Math.max(1, window.innerHeight - BALL_SIZE - EDGE_GAP * 2);
  return EDGE_GAP + yRatio * range;
}

function pixelsToRatio(y: number) {
  if (typeof window === "undefined") {
    return 1;
  }

  const range = Math.max(1, window.innerHeight - BALL_SIZE - EDGE_GAP * 2);
  const ratio = (clampY(y) - EDGE_GAP) / range;
  return Math.min(Math.max(ratio, 0), 1);
}

function clampX(value: number) {
  if (typeof window === "undefined") {
    return value;
  }

  return Math.min(
    Math.max(value, EDGE_GAP),
    window.innerWidth - BALL_SIZE - EDGE_GAP,
  );
}

function parseStoredPosition(): QuickBallPosition | null {
  try {
    const raw = window.localStorage.getItem(POSITION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<QuickBallPosition>;
    if (
      (parsed.side === "left" || parsed.side === "right") &&
      typeof parsed.yRatio === "number"
    ) {
      return {
        side: parsed.side,
        yRatio: Math.min(Math.max(parsed.yRatio, 0), 1),
      };
    }
  } catch {
    return null;
  }

  return null;
}

function persistPosition(position: QuickBallPosition) {
  window.localStorage.setItem(POSITION_KEY, JSON.stringify(position));
}

function getRadialItemStyle(
  index: number,
  side: QuickBallSide,
  openDownward: boolean,
  open: boolean,
): CSSProperties {
  const itemSize = 52;
  const center = BALL_SIZE / 2 - itemSize / 2;
  const radius = 116;
  const angles =
    side === "right"
      ? openDownward
        ? [90, 120, 150, 180]
        : [270, 240, 210, 180]
      : openDownward
        ? [90, 60, 30, 0]
        : [270, 300, 330, 0];
  const angle = (angles[index] * Math.PI) / 180;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return {
    left: `${center + x}px`,
    top: `${center + y}px`,
    transitionDelay: open ? `${index * 28}ms` : "0ms",
  };
}

function QuickIcon({ name }: { name: string }) {
  if (name === "home") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 20V9.8L12 3l8 6.8V20h-5v-6H9v6H4Z"
        />
      </svg>
    );
  }

  if (name === "posts") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6 3h10.5L20 6.5V21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm9 1.5V8h3.5L15 4.5ZM8 11h8v2H8v-2Zm0 4h8v2H8v-2Z"
        />
      </svg>
    );
  }

  if (name === "chat") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M5 4h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-5 4v-4.3A3 3 0 0 1 2 14V7a3 3 0 0 1 3-3Zm3 5v2h8V9H8Zm0 4v2h5v-2H8Z"
        />
      </svg>
    );
  }

  if (name === "system") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5v2h3v2H6v-2h3v-2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v9h16V7H4Z"
        />
      </svg>
    );
  }

  if (name === "light") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 4a1 1 0 0 1-1-1V1h2v2a1 1 0 0 1-1 1Zm0 16a1 1 0 0 1 1 1v2h-2v-2a1 1 0 0 1 1-1ZM4 12a1 1 0 0 1-1 1H1v-2h2a1 1 0 0 1 1 1Zm16 0a1 1 0 0 1 1-1h2v2h-2a1 1 0 0 1-1-1ZM5.6 7 4.2 5.6l1.4-1.4L7 5.6 5.6 7Zm12.8 12.8L17 18.4l1.4-1.4 1.4 1.4-1.4 1.4ZM17 5.6l1.4-1.4 1.4 1.4L18.4 7 17 5.6ZM4.2 18.4 5.6 17 7 18.4l-1.4 1.4-1.4-1.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
        />
      </svg>
    );
  }

  if (name === "dark") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20.5 14.2A8.8 8.8 0 0 1 9.8 3.5a1 1 0 0 0-1.2-1.2A10.6 10.6 0 1 0 21.7 15.4a1 1 0 0 0-1.2-1.2ZM12 20a8 8 0 0 1-6.2-13 10.8 10.8 0 0 0 11.2 11.2A8 8 0 0 1 12 20Z"
        />
      </svg>
    );
  }

  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a1 1 0 0 1 1 1v1.1a8 8 0 0 1 6.9 6.9H21a1 1 0 1 1 0 2h-1.1a8 8 0 0 1-6.9 6.9V21a1 1 0 1 1-2 0v-1.1A8 8 0 0 1 4.1 13H3a1 1 0 1 1 0-2h1.1A8 8 0 0 1 11 4.1V3a1 1 0 0 1 1-1Zm0 4a6 6 0 0 0 0 12V6Z"
      />
    </svg>
  );
}
