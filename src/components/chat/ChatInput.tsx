import { ClaudeChatInput } from '@/components/ui/claude-style-ai-input';
import type { ChatModelSelection, ModelOption } from '@/components/ui/claude-style-ai-input';
import type { ChatInterfaceTheme } from './types';

interface Props {
  onSend: (message: string, selection: ChatModelSelection) => void;
  interfaceTheme?: ChatInterfaceTheme;
  onInterfaceThemeChange?: (theme: ChatInterfaceTheme) => void;
  siteTheme?: 'dark' | 'light';
}

const anthropicModels: ModelOption[] = [
  {
    id: 'fable',
    name: 'Ravi Fayble 5',
    description: 'For your toughest challenges',
  },
  {
    id: 'opus',
    name: 'Ravi Ohpus 4.8',
    description: 'For complex tasks',
  },
  {
    id: 'sonnet',
    name: 'Ravi Sonnett 4.6',
    description: 'Most efficient for everyday tasks',
  },
  {
    id: 'haiku',
    name: 'Ravi Hyku 4.5',
    description: 'Fastest effort for quick answers',
  },
];

const openAIModels: ModelOption[] = [
  {
    id: '5.5',
    name: '5.5',
    description: 'Default GPT model family',
  },
  {
    id: '5.4',
    name: '5.4',
    description: 'Strong general responses',
  },
  {
    id: '5.3',
    name: '5.3',
    description: 'Fast instant answers',
  },
  {
    id: 'o3',
    name: 'o3',
    description: 'Medium-effort reasoning',
  },
];

export default function ChatInput({
  onSend,
  interfaceTheme = 'anthropic',
  onInterfaceThemeChange,
  siteTheme = 'dark',
}: Props) {
  const models = interfaceTheme === 'openai' ? openAIModels : anthropicModels;
  const defaultModel = interfaceTheme === 'openai' ? '5.5' : 'opus';

  return (
    <ClaudeChatInput
      onSendMessage={(message, _files, _pastedContent, selection) => onSend(message, selection)}
      placeholder={interfaceTheme === 'openai' ? 'Message Ravi GPT' : 'Ask Ravi anything'}
      maxFiles={10}
      maxFileSize={10 * 1024 * 1024}
      models={models}
      defaultModel={defaultModel}
      siteTheme={siteTheme}
      variant={interfaceTheme}
      onVariantChange={onInterfaceThemeChange}
    />
  );
}
