import { useState } from 'preact/hooks';

interface Props {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState('');

  function handleSend(e: Event) {
    e.preventDefault();
    if (value.trim()) {
      onSend(value);
      setValue('');
    }
  }

  return (

    <form className="flex items-center gap-2 px-2 sm:px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 fixed bottom-0 left-0 right-0 max-w-xl mx-auto w-full" onSubmit={(e) => handleSend(e)}>
      <a
        href="/blog/"
        className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition text-sm"
        style={{ minWidth: 'fit-content' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="16" stroke-dashoffset="16" d="M4.5 21.5h15"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0" /></path><path stroke-dasharray="16" stroke-dashoffset="16" d="M4.5 21.5v-13.5M19.5 21.5v-13.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="16;0" /></path><path stroke-dasharray="28" stroke-dashoffset="28" d="M2 10l10 -8l10 8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="28;0" /></path><path stroke-dasharray="24" stroke-dashoffset="24" d="M9.5 21.5v-9h5v9"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.4s" values="24;0" /></path></g></svg>
      </a>
      <input
        type="text"
        value={value}
        onChange={e => setValue((e.target as HTMLInputElement).value)}
        placeholder="Ask me anything about Ravi Teja Rapolu..."
        aria-label="Type your message"
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/60 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <button
        type="submit"
        aria-label="Send message"
        className="ml-2 bg-blue-400/30 hover:bg-blue-700/70 text-white px-4 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/70"
      >
        <span className="text-lg">↑</span>
      </button>
    </form>
  );
}
