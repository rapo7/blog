import { useState } from 'preact/hooks';

interface Props {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState('');

  function handleSend(e: Event) {
    e.preventDefault();
    console.log('Sending message:', value);
    if (value.trim()) {
      onSend(value);
      setValue('');
    }
  }

  return (
    <form className="flex items-center gap-2 px-2 sm:px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 fixed bottom-0 left-0 right-0 max-w-xl mx-auto w-full" onSubmit={(e) => handleSend(e)}>
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
