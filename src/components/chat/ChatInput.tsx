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

    <form className="flex items-center gap-2 px-2 sm:px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 fixed bottom-0 left-0 right-0 max-w-xl mx-auto w-full" onSubmit={(e) => handleSend(e)}>
      <a
        href="/blog/"
        className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition text-sm"
        style={{ minWidth: 'fit-content' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M6 22.879a3 3 0 0 1-3-3v-10q0-.052.005-.1H3c0-.577.229-1.13.636-1.536L9.88 2a3 3 0 0 1 4.242 0l6.243 6.243c.407.407.636.96.636 1.535h-.005q.005.05.005.1v10a3 3 0 0 1-3 3zm6.707-19.465L19 9.707V19.88a1 1 0 0 1-1 1h-3v-5a3 3 0 1 0-6 0v5H6a1 1 0 0 1-1-1V9.707l6.293-6.293a1 1 0 0 1 1.414 0" clipRule="evenodd"></path></svg>
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
