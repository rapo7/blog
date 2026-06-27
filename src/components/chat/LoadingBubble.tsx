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
      <div className="mb-2 flex max-w-[92%] flex-col items-start gap-1 break-words rounded-3xl rounded-bl-md border border-default bg-default px-4 py-3 text-base text-default shadow-sm sm:max-w-[82%]">
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
      <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-tertiary" style={{animationDelay: '0ms'}} />
      <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{animationDelay: '150ms'}} />
      <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-secondary" style={{animationDelay: '300ms'}} />
    </span>
  );
}
