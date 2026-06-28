import type { ComponentProps } from "react";
import AssistantMarkdown from "./AssistantMarkdown";
import type { ChatInterfaceTheme } from './types';

interface ChatBubbleProps extends ComponentProps<"div"> {
  sender: string;
  content: string;
  interfaceTheme: ChatInterfaceTheme;
}

export default function ChatBubble({
  sender,
  content,
  interfaceTheme,
  ...props
}: ChatBubbleProps) {
  const isUser = sender === "user";
  const isOpenAI = interfaceTheme === 'openai';
  const userBubbleClassName = isOpenAI
    ? 'mb-2 max-w-[92%] break-words rounded-3xl rounded-br-lg bg-white px-4 py-3 text-sm font-medium leading-6 text-black shadow-sm sm:max-w-[78%]'
    : 'mb-2 max-w-[92%] break-words rounded-3xl rounded-br-lg border border-white/10 bg-[#2c2b29] px-4 py-3 text-sm font-medium leading-6 text-[#f4efe7] shadow-sm sm:max-w-[78%]';
  const assistantClassName = isOpenAI
    ? 'my-2 w-full max-w-none px-1 py-2 text-[0.96rem] leading-7 text-[#f4f4f4] sm:my-3 sm:px-2'
    : 'my-2 w-full max-w-none px-1 py-2 text-[0.96rem] leading-7 text-[#f4efe7] sm:my-3 sm:px-2';

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
      {...props}
    >
      {isUser ? (
        <div
          className={userBubbleClassName}
        >
          <div>{content}</div>
        </div>
      ) : (
        <div className={assistantClassName}>
          <AssistantMarkdown content={content} />
        </div>
      )}
    </div>
  );
}
