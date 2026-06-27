import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AssistantMarkdownProps {
  content: string;
}

export default function AssistantMarkdown({ content }: AssistantMarkdownProps) {
  return (
    <div className="prose prose-sm max-w-none w-full prose-headings:text-default prose-p:leading-7 prose-a:text-secondary prose-strong:text-default dark:prose-invert sm:prose-base">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
