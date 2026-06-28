import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AssistantMarkdownProps {
  content: string;
}

export default function AssistantMarkdown({ content }: AssistantMarkdownProps) {
  return (
    <div className="ravi-assistant-markdown prose prose-sm max-w-none w-full prose-p:leading-7 sm:prose-base">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
