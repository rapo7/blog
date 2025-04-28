import { useState } from 'preact/hooks';
import ChatHeader from './ChatHeader';
import ChatCategorySelector from './ChatCategorySelector';
import ChatPromptList from './ChatPromptList';
import ChatInput from './ChatInput';
import type { ChatCategory, ChatPrompt, ChatMessage } from './types';

const promptData: Record<ChatCategory, ChatPrompt[]> = {
  Create: [
    { id: 'create-1', text: 'Write a short story about a robot discovering emotions' },
    { id: 'create-2', text: 'Help me outline a sci-fi novel set in a post-apocalyptic world' },
    { id: 'create-3', text: 'Create a character profile for a complex villain with sympathetic motives' },
    { id: 'create-4', text: 'Give me 5 creative writing prompts for flash fiction' },
  ],
  Explore: [
    { id: 'explore-1', text: 'How does AI work?' },
    { id: 'explore-2', text: 'Are black holes real?' },
    { id: 'explore-3', text: 'How many Rs are in the word "strawberry"?' },
    { id: 'explore-4', text: 'What is the meaning of life?' },
  ],
  Code: [],
  Learn: [],
};

export default function ChatContainer() {
  const [category, setCategory] = useState<ChatCategory>('Explore');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  function handlePromptSelect(prompt: ChatPrompt) {
    setMessages(msgs => [
      ...msgs,
      { id: `user-${Date.now()}`, sender: 'user', content: prompt.text },
    ]);
    // Here you would trigger assistant response logic
  }

  function handleSend(message: string) {
    setMessages(msgs => [
      ...msgs,
      { id: `user-${Date.now()}`, sender: 'user', content: message },
    ]);
    // Here you would trigger assistant response logic
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex flex-col items-center px-2 sm:px-0">
      <div className="w-full max-w-xl mx-auto bg-inherit rounded-xl shadow-lg mt-4 sm:mt-10 mb-24 sm:mb-28 px-2 sm:px-6 pt-2 pb-8 flex flex-col">
        <ChatHeader />
        <ChatCategorySelector selected={category} onSelect={setCategory} />
        <ChatPromptList prompts={promptData[category]} onSelect={handlePromptSelect} />
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
