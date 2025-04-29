import { useState, useEffect } from "react";

const funMessages = [
  "Thinking very hard…",
  "Consulting the AI archives…",
  "Did you know? The first chatbot was built in 1966!",
  "Almost ready with your answer…",
  "Fact: AI can write poetry, too!",
  "Analyzing your question…",
  "Fact: The Turing Test was proposed in 1950.",
  "Searching for the best response…"
];

export default function LoadingBubble() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(() => Math.floor(Math.random() * funMessages.length));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start w-full">
      <div className="max-w-[75%] px-4 py-2 rounded-2xl shadow text-base break-words mb-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm flex flex-col gap-1 items-start">
        <div className="flex items-center gap-2">
          <TypingDots />
          <span className="font-medium">rAvI is typing…</span>
        </div>
        <span className="text-xs opacity-80 mt-1 transition-all min-h-[1.5em]">{funMessages[msgIdx]}</span>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center h-4">
      <span className="bg-gray-500 dark:bg-gray-300 rounded-full w-1.5 h-1.5 mx-0.5 animate-bounce" style={{animationDelay: '0ms'}} />
      <span className="bg-gray-500 dark:bg-gray-300 rounded-full w-1.5 h-1.5 mx-0.5 animate-bounce" style={{animationDelay: '150ms'}} />
      <span className="bg-gray-500 dark:bg-gray-300 rounded-full w-1.5 h-1.5 mx-0.5 animate-bounce" style={{animationDelay: '300ms'}} />
    </span>
  );
}
