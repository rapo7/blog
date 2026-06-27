
import type { ChatPrompt } from './types';

interface Props {
  prompts: ChatPrompt[];
  onSelect: (prompt: ChatPrompt) => void;
}

export default function ChatPromptList({ prompts, onSelect }: Props) {
  return (
    <ul className="mx-auto mb-8 grid w-full max-w-md gap-2 px-0 sm:mb-10 sm:max-w-2xl sm:grid-cols-2 sm:gap-3 sm:px-2">
      {prompts.map(prompt => (
        <li key={prompt.id}>
          <button
            type="button"
            className="h-full w-full rounded-2xl border border-default bg-default px-4 py-4 text-left text-sm font-semibold leading-6 text-default shadow-sm transition hover:-translate-y-0.5 hover:border-[#010920] hover:bg-primary hover:text-[#010920] focus:outline-none focus:ring-2 focus:ring-secondary/70 dark:hover:border-primary sm:px-5"
            onClick={() => onSelect(prompt)}
          >
            {prompt.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
