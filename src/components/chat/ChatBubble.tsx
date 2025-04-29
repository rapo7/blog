import type { ComponentProps } from "react";
import AssistantMarkdown from "./AssistantMarkdown";

interface ChatBubbleProps extends ComponentProps<"div"> {
  sender: string;
  content: string;
}

export default function ChatBubble({
  sender,
  content,
  ...props
}: ChatBubbleProps) {
  const isUser = sender === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
      {...props}
    >
      {isUser ? (
        <div
          className={`max-w-[75%] px-4 py-2 rounded-2xl shadow text-base break-words mb-2 bg-blue-600 text-white rounded-br-sm`}
        >
          <div>{content}</div>
        </div>
      ) : (
        <div className="w-full my-4">
          <AssistantMarkdown content={content} />
        </div>
      )}
    </div>
  );
}
