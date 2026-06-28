import { useEffect, useState } from 'react';
import type { ChatInterfaceTheme } from './types';

interface LoadingBubbleProps {
  interfaceTheme: ChatInterfaceTheme;
  siteTheme?: 'dark' | 'light';
}

export default function LoadingBubble({
  interfaceTheme,
  siteTheme = 'dark',
}: LoadingBubbleProps) {
  return (
    <div className="flex w-full justify-start">
      {interfaceTheme === 'openai'
        ? <OpenAILoading siteTheme={siteTheme} />
        : <AnthropicLoading siteTheme={siteTheme} />}
    </div>
  );
}

function OpenAILoading({ siteTheme = 'dark' }: { siteTheme: 'dark' | 'light' }) {
  const gradientClass = siteTheme === 'dark'
    ? 'bg-[linear-gradient(90deg,#8a8a8a_0%,#f4f4f4_38%,#8a8a8a_76%)]'
    : 'bg-[linear-gradient(90deg,#64748b_0%,var(--color-text)_38%,#64748b_76%)]';

  return (
    <div className="mb-2 w-full px-1 py-2 text-sm sm:px-2">
      <style>{`
        @keyframes ravi-openai-shimmer {
          0% { background-position: 140% 50%; }
          100% { background-position: -40% 50%; }
        }
      `}</style>
      <span
        className={`block ${gradientClass} bg-[length:220%_100%] bg-clip-text text-sm font-semibold text-transparent`}
        style={{ animation: 'ravi-openai-shimmer 1.45s ease-in-out infinite' }}
      >
        Ravi GPT is thinking
      </span>
    </div>
  );
}

function AnthropicLoading({ siteTheme = 'dark' }: { siteTheme: 'dark' | 'light' }) {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDotCount((current) => (current % 3) + 1);
    }, 420);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className={
      siteTheme === 'dark'
        ? 'mb-2 flex w-full items-center gap-3 break-words px-1 py-2 text-sm text-[var(--color-text)] sm:px-2'
        : 'mb-2 flex w-full items-center gap-3 break-words px-1 py-2 text-sm text-[var(--color-text)] sm:px-2'
    }
    >
      <style>{`
        @keyframes ravi-anthropic-bloom {
          0%, 100% { transform: scale(0.78) rotate(0deg); opacity: 0.72; }
          45% { transform: scale(1.08) rotate(10deg); opacity: 1; }
          70% { transform: scale(0.92) rotate(18deg); opacity: 0.9; }
        }
      `}</style>
      <span
        className={siteTheme === 'dark' ? 'flex h-8 w-8 shrink-0 items-center justify-center text-[var(--color-primary)]' : 'flex h-8 w-8 shrink-0 items-center justify-center text-[var(--color-text)]'}
        style={{ animation: 'ravi-anthropic-bloom 1.45s ease-in-out infinite' }}
      >
        <AnthropicBurst />
      </span>
      <span className="font-semibold">
        Cooking<span className="inline-block min-w-[1.5em] text-left">{'.'.repeat(dotCount)}</span>
      </span>
    </div>
  );
}

function AnthropicBurst() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
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
