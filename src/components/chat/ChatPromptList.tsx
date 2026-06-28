
import type { ChatPrompt } from './types';
import { BookOpen, BriefcaseBusiness, HeartPulse, Lightbulb, Mail } from 'lucide-react';

interface Props {
  prompts: ChatPrompt[];
  onSelect: (prompt: ChatPrompt) => void;
}

export default function ChatPromptList({ prompts, onSelect }: Props) {
  return (
    <ul className="grid w-full gap-2">
      {prompts.map(prompt => (
        <li key={prompt.id}>
          <button
            type="button"
            className="flex h-full w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#1b1b19] px-4 py-3 text-left text-sm font-semibold leading-6 text-[#ede7dc] transition hover:border-[hsl(var(--accent-brand)_/_0.5)] hover:bg-[#2f2d2a] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-brand)_/_0.6)]"
            onClick={() => onSelect(prompt)}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[hsl(var(--accent-brand)_/_1)]">
              <PromptIcon prompt={prompt} />
            </span>
            <span>{prompt.text}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function PromptIcon({ prompt }: { prompt: ChatPrompt }) {
  const className = 'h-4 w-4';
  if (prompt.text.toLowerCase().includes('contact')) {
    return <Mail className={className} />;
  }

  if (prompt.category === 'Work') {
    return <BriefcaseBusiness className={className} />;
  }

  if (prompt.category === 'Skills') {
    return <Lightbulb className={className} />;
  }

  if (prompt.category === 'Hobbies') {
    return <HeartPulse className={className} />;
  }

  return <BookOpen className={className} />;
}
