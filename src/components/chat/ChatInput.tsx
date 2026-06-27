import { useState } from 'react';

interface Props {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState('');

  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (value.trim()) {
      onSend(value);
      setValue('');
    }
  }

  return (

    <form className="mx-auto flex w-full items-center gap-1.5 rounded-[28px] border border-default bg-surface p-1.5 shadow-[0_14px_45px_rgb(1_9_32_/_14%)] sm:gap-2 sm:rounded-full sm:p-2" onSubmit={(e) => handleSend(e)}>
      <a
        href="/blog/"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-default bg-default px-0 text-sm font-semibold text-default transition hover:bg-primary hover:text-[#010920] sm:px-3"
        aria-label="Back to homepage"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </a>
      <input
        type="text"
        value={value}
        onChange={e => setValue((e.target as HTMLInputElement).value)}
        placeholder="Ask Ravi..."
        aria-label="Type your message"
        className="min-w-0 flex-1 rounded-full border border-default bg-default px-3 py-3 text-base text-default placeholder:text-offset focus:outline-none focus:ring-2 focus:ring-secondary/70 sm:px-4 sm:text-sm"
      />
      <button
        type="submit"
        aria-label="Send message"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#010920] bg-primary px-0 py-2 font-black text-[#010920] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-secondary/70 dark:border-primary sm:px-4"
      >
        <span className="text-lg">↑</span>
      </button>
    </form>
  );
}
