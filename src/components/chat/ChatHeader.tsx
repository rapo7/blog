import { useEffect, useRef, useState } from 'react';

export type ChatInterfaceTheme = 'anthropic' | 'openai' | 'wise';

interface Props {
  interfaceTheme: ChatInterfaceTheme;
  onInterfaceThemeChange: (theme: ChatInterfaceTheme) => void;
}

export default function ChatHeader({ interfaceTheme, onInterfaceThemeChange }: Props) {
  const isOpenAI = interfaceTheme === 'openai';
  const nextTheme = isOpenAI ? 'anthropic' : 'openai';
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Ravi GPT');
  const modelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
        setModelOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className={`absolute left-0 right-0 top-0 z-20 px-4 ${isOpenAI ? 'py-3' : 'py-6'}`}>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div
          ref={modelRef}
          className="relative"
        >
        <button
          type="button"
          className={
            isOpenAI
              ? 'flex h-9 items-center gap-3 rounded-full text-sm font-semibold text-[#f4f4f4] transition hover:text-white focus:outline-none focus:ring-0'
              : 'flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#d7d2c8] shadow-[0_12px_30px_rgb(0_0_0_/_18%)] backdrop-blur transition hover:border-[hsl(var(--accent-brand)_/_0.5)] hover:text-[#f3eee5]'
          }
          aria-label={isOpenAI ? 'Choose chat model' : 'Back to site'}
          title={isOpenAI ? 'Choose chat model' : 'Back to site'}
          onClick={() => {
            if (isOpenAI) {
              setModelOpen((value) => !value);
              return;
            }

            window.location.href = '/blog/';
          }}
        >
          <svg className={isOpenAI ? 'h-5 w-5' : 'h-6 w-6'} viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 7h16v2H4V7Zm0 4h16v2H4v-2Zm0 4h10v2H4v-2Z"
            />
          </svg>
          {isOpenAI && (
            <span className="inline-flex items-center gap-1">
              {selectedModel}
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" aria-hidden="true">
                <path fill="currentColor" d="m5 7 5 5 5-5H5Z" />
              </svg>
            </span>
          )}
        </button>
        {isOpenAI && modelOpen && (
          <div className="absolute left-0 top-11 z-30 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#2f2f2f] p-1.5 text-[#f4f4f4] shadow-[0_18px_48px_rgb(0_0_0_/_45%)]">
            {[
              ['Ravi GPT', 'Best for general questions'],
              ['Portfolio', 'Projects, work, and background'],
              ['Quick', 'Short answers'],
            ].map(([name, description]) => (
              <button
                key={name}
                type="button"
                className={`flex w-full items-start justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-white/10 ${
                  selectedModel === name ? 'bg-white/10' : ''
                }`}
                onClick={() => {
                  setSelectedModel(name);
                  setModelOpen(false);
                }}
              >
                <span>
                  <span className="block text-sm font-semibold">{name}</span>
                  <span className="block text-xs text-[#b4b4b4]">{description}</span>
                </span>
                {selectedModel === name && (
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#f4f4f4]" />
                )}
              </button>
            ))}
          </div>
        )}
        </div>
        <button
          type="button"
          className={
            isOpenAI
              ? 'rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#ececec] focus:outline-none focus:ring-0'
              : 'flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#d7d2c8] shadow-[0_12px_30px_rgb(0_0_0_/_18%)] backdrop-blur transition hover:border-[hsl(var(--accent-brand)_/_0.5)] hover:text-[#f3eee5]'
          }
          onClick={() => onInterfaceThemeChange(nextTheme)}
          aria-label={`Switch to ${isOpenAI ? 'Anthropic' : 'OpenAI'} theme`}
          title={`Switch to ${isOpenAI ? 'Anthropic' : 'OpenAI'} theme`}
        >
          {isOpenAI ? (
            'Claude'
          ) : (
            <svg className="h-7 w-7" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3a5 5 0 0 0-5 5v8.5c0 .9 1 1.5 1.8.9l1.2-.9 1.3 1a1.2 1.2 0 0 0 1.4 0l1.3-1 1.2.9c.8.6 1.8 0 1.8-.9V8a5 5 0 0 0-5-5Zm-2 7.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
