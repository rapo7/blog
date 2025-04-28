
import type { ChatPrompt } from './types';

interface Props {
  prompts: ChatPrompt[];
  onSelect: (prompt: ChatPrompt) => void;
}

export default function ChatPromptList({ prompts, onSelect }: Props) {
  return (
    <ul className="space-y-2 mb-10 max-w-xl mx-auto">
      {prompts.map(prompt => (
        <li key={prompt.id}>
          <button
            type="button"
            className="w-full text-left px-5 py-3 rounded-lg bg-white dark:bg-gray-900 border 
            border-gray-200 dark:border-gray-800 shadow-sm hover:bg-blue-50 hover:text-blue-700
            dark:hover:bg-blue-900 dark:text-blue-300 dark:hover:text-blue-200 transition-colors focus:outline-none 
            focus:ring-2 focus:ring-blue-400/70"
            onClick={() => onSelect(prompt)}
          >
            {prompt.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
