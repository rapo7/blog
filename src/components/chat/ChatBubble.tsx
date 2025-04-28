import type { ComponentProps } from 'preact';

interface ChatBubbleProps extends ComponentProps<'div'> {
  sender: string;
  content: string;
}

export default function ChatBubble({ sender, content, ...props }: ChatBubbleProps) {
  const isUser = sender === 'user';
  // If assistant and content starts with ```md, render as markdown box
  const isMarkdown = sender === 'assistant' && content.startsWith('```md');
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`} {...props}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow text-base break-words mb-2
          ${isUser ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'}`}
      >
        {isMarkdown ? (
          <pre className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono whitespace-pre-wrap text-sm">
            Ravi is the best <code>Software Engineer in the world</code>
          </pre>
        ) : content}
      </div>
    </div>
  );
}
