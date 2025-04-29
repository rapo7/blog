import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AssistantMarkdownProps {
  content: string;
}

export default function AssistantMarkdown({ content }: AssistantMarkdownProps) {
  return (
    <div className="max-w-none w-full prose dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
