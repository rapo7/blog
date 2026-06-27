export type ChatCategory = 'Basic' | 'Work' | 'Skills' | 'Hobbies';

export interface ChatPrompt {
  id: string;
  text: string;
  category?: ChatCategory;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
}
