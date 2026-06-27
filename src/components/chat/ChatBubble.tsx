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
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
      {...props}
    >
      {isUser ? (
        <div
          className={
            isOpenAI
              ? 'mb-2 max-w-[92%] break-words rounded-2xl rounded-br-md border border-white/10 bg-[#2f2f2f] px-4 py-3 text-sm font-medium leading-6 text-[#f4f4f4] shadow-sm sm:max-w-[78%]'
              : 'mb-2 max-w-[92%] break-words rounded-2xl rounded-br-md border border-[#d97745]/35 bg-[#d97745] px-4 py-3 text-sm font-semibold leading-6 text-[#1f1f1d] shadow-sm sm:max-w-[78%]'
          }
        >
          <div>{content}</div>
        </div>
      ) : (
        <div
          className={
            isOpenAI
              ? 'my-2 w-full rounded-2xl border border-white/10 bg-[#181818] p-4 text-[#ececec] shadow-sm sm:my-3 sm:p-5'
              : 'my-2 w-full rounded-2xl border border-zinc-700 bg-[#30302E] p-4 text-[#d7d2c8] shadow-sm sm:my-3 sm:p-5'
          }
        >
          <AssistantMarkdown content={content} />
        </div>
      )}
    </div>
  );
}
