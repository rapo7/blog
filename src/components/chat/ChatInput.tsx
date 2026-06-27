import { ClaudeChatInput } from '@/components/ui/claude-style-ai-input';
import type { ChatInputSuggestion } from '@/components/ui/claude-style-ai-input';
import type { ChatInterfaceTheme } from './types';

interface Props {
  onSend: (message: string) => void;
  suggestions?: ChatInputSuggestion[];
  interfaceTheme?: ChatInterfaceTheme;
  onInterfaceThemeChange?: (theme: ChatInterfaceTheme) => void;
  onFocusChange?: (isFocused: boolean) => void;
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

export default function ChatInput({
  onSend,
  suggestions = [],
  interfaceTheme = 'anthropic',
  onInterfaceThemeChange,
  onFocusChange,
}: Props) {
  return (
    <ClaudeChatInput
      onSendMessage={(message) => onSend(message)}
      placeholder={interfaceTheme === 'openai' ? 'Message Ravi GPT' : 'Ask Ravi anything'}
      maxFiles={10}
      maxFileSize={10 * 1024 * 1024}
      models={models}
      defaultModel="ravi-gpt"
      suggestions={suggestions}
      variant={interfaceTheme}
      onVariantChange={onInterfaceThemeChange}
      onFocusChange={onFocusChange}
    />
  );
}
