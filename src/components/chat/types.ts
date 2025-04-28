export type ChatCategory = 'Create' | 'Explore' | 'Code' | 'Learn';

export interface ChatPrompt {
  id: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
}
