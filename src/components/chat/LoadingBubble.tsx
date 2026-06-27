import { useState, useEffect } from "react";

const funMessages = [
  "Reviewing Ravi's background",
  "Checking the best match",
  "Preparing a concise answer",
  "Reading the relevant context",
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
    <div className="flex w-full justify-start">
      <div className="mb-2 flex max-w-[92%] flex-col items-start gap-1 break-words rounded-2xl rounded-bl-md border border-default bg-default px-4 py-3 text-sm text-default shadow-sm sm:max-w-[78%]">
        <div className="flex items-center gap-2">
          <TypingDots />
          <span className="font-semibold">Ravi GPT is responding</span>
        </div>
        <span className="mt-1 min-h-[1.5em] text-xs text-offset transition-all">{funMessages[msgIdx]}</span>
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
