import { ClaudeChatInput } from '@/components/ui/claude-style-ai-input';
import type { ChatInputSuggestion } from '@/components/ui/claude-style-ai-input';

interface Props {
  onSend: (message: string) => void;
  suggestions?: ChatInputSuggestion[];
}

const models = [
  {
    id: 'ravi-gpt',
    name: 'Ravi GPT',
    description: 'Answers from Ravi Teja Rapolu context',
    badge: 'Live',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Focused on projects, work, and background',
  },
  {
    id: 'quick',
    name: 'Quick',
    description: 'Shorter responses for fast browsing',
  },
];

export default function ChatInput({ onSend, suggestions = [] }: Props) {
  return (
    <ClaudeChatInput
      onSendMessage={(message) => onSend(message)}
      placeholder="Ask Ravi anything"
      maxFiles={10}
      maxFileSize={10 * 1024 * 1024}
      models={models}
      defaultModel="ravi-gpt"
      suggestions={suggestions}
    />
  );
}
