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
          className="mb-2 max-w-[92%] break-words rounded-3xl rounded-br-md border border-[#010920] bg-primary px-4 py-3 text-base font-semibold text-[#010920] shadow-[0_10px_28px_rgb(1_9_32_/_12%)] dark:border-primary sm:max-w-[82%]"
        >
          <div>{content}</div>
        </div>
      ) : (
        <div className="my-3 w-full rounded-3xl border border-default bg-default p-4 sm:my-4 sm:p-5">
          <AssistantMarkdown content={content} />
        </div>
      )}
    </div>
  );
}
