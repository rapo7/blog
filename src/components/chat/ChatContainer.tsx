import { useState, useRef, useEffect } from 'react';
import ChatInput from './ChatInput';
import ChatBubble from './ChatBubble';
import LoadingBubble from './LoadingBubble';
import type { ChatCategory, ChatPrompt, ChatMessage, ChatInterfaceTheme } from './types';

const promptData: Record<ChatCategory, ChatPrompt[]> = {
  "Basic": [
    { id: "basic-1", text: "What is your educational background?" },
    { id: "basic-2", text: "How did you get started in software engineering?" },
    { id: "basic-3", text: "What programming languages do you know?" },
    { id: "basic-4", text: "What are your strongest technical skills?" },
    { id: "basic-5", text: "How to contact you?" },
  ],
  "Work": [
    { id: "work-1", text: "Where are you currently working?" },
    { id: "work-2", text: "What companies have you worked for?" },
    { id: "work-3", text: "What was your most challenging project?" },
    { id: "work-4", text: "What was your Current project?" },
    { id: "work-5", text: "What is your leadership experience?" },
  ],
  "Skills": [
    { id: "skills-1", text: "Tell me about your software engineering experience." },
    { id: "skills-2", text: "What industries have you worked in?" },
    { id: "skills-3", text: "What are your most impressive projects?" },
    { id: "skills-4", text: "Do you have any open source contributions?" },
    { id: "skills-5", text: "What technologies do you use in your projects?" },
  ],
  "Hobbies": [
    { id: "hobbies-1", text: "What are your hobbies?" },
    { id: "hobbies-2", text: "What do you like to do outside of work?" },
    { id: "hobbies-3", text: "What project are you most proud of?" },
    { id: "hobbies-4", text: "What are you learning right now?" },
    { id: "hobbies-5", text: "Can you share your GitHub?" },
  ],
};

const allPrompts = Object.entries(promptData).flatMap(([category, prompts]) =>
  prompts.map((prompt) => ({
    ...prompt,
    category: category as ChatCategory,
  })),
);

const emptyStatePhrases = [
  'Up late, Ravi?',
  'Ask something about Ravi?',
  'Ask Ravi a question?',
  'Ready to interrogate Ravi?',
  'What should we ask Ravi?',
  'Curious about Ravi?',
  'What is Ravi building?',
  'Need Ravi context?',
  'Looking for the real Ravi?',
  'What should Ravi explain?',
  'Interview Ravi for a minute?',
  'Ask Ravi about work?',
  'Ask Ravi about the weird stuff?',
  'What makes Ravi useful?',
  'Ravi, in one question?',
  'What is Ravi good at?',
  'Want the Ravi rundown?',
  'Ask the Ravi file?',
  'What has Ravi shipped?',
  'What is Ravi learning?',
  'What would Ravi say?',
  'Need a Ravi signal?',
  'Start with Ravi?',
];

const CHAT_INTERFACE_KEY = 'raviChatInterfaceTheme';

export default function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [emptyPhraseIndex, setEmptyPhraseIndex] = useState(0);
  const [interfaceTheme, setInterfaceTheme] = useState<ChatInterfaceTheme>('anthropic');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  useEffect(() => {
    if (messages.length > 1 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (!chatArea) return;
    const chatAreaElement = chatArea;
    function handleScroll() {
      // If scrolled to bottom (or very close), hide button
      const isAtBottom = chatAreaElement.scrollHeight - chatAreaElement.scrollTop - chatAreaElement.clientHeight < 40;
      setShowScrollToBottom(!isAtBottom);
    }
    chatAreaElement.addEventListener('scroll', handleScroll);
    return () => chatAreaElement.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(CHAT_INTERFACE_KEY);
    if (stored === 'anthropic' || stored === 'openai') {
      setInterfaceTheme(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CHAT_INTERFACE_KEY, interfaceTheme);
  }, [interfaceTheme]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setEmptyPhraseIndex((current) => (current + 1) % emptyStatePhrases.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  const handleScrollToBottom = () => {
    const chatArea = chatAreaRef.current;
    if (chatArea) {
      chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
    }
  };

  function handleSend(message: string) {
    setMessages(msgs => [
      ...msgs,
      { id: `user-${Date.now()}`, sender: 'user', content: message },
    ]);
    triggerAssistantResponse(message);
  }
  // Send AI response via API
  async function triggerAssistantResponse(userMessage: string) {
    setLoading(true);
    try {
      const response = await fetch('https://ravitejarapolu6--ravigpt-modal-ravi-gpt.modal.run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }),
      });
      const data = await response.json();
      setMessages(msgs => [
        ...msgs,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          content: data?.response || 'Sorry, no response received.',
        },
      ]);
    } catch (error) {
      setMessages(msgs => [
        ...msgs,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          content: 'Sorry, there was an error getting a response.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const isOpenAI = interfaceTheme === 'openai';
  const rootClassName = isOpenAI
    ? 'relative flex min-h-dvh w-screen flex-col overflow-hidden bg-black text-[#f4f4f4]'
    : 'font-anthropic relative flex min-h-dvh w-screen flex-col overflow-hidden bg-[#1f1f1d] text-[#f4efe7]';
  const mainClassName = isOpenAI
    ? 'mx-auto flex min-h-dvh w-full max-w-3xl flex-1 flex-col px-1.5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6'
    : 'mx-auto flex min-h-dvh w-full max-w-5xl flex-1 flex-col px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6';
  const chatAreaClassName = isOpenAI
    ? 'relative flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-1 py-0 sm:px-5'
    : 'relative flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-1 py-4 sm:px-5';
  const sectionClassName = isOpenAI
    ? 'flex min-h-0 flex-1 flex-col justify-between pt-[5.5rem]'
    : 'flex min-h-0 flex-1 flex-col';



  return (
    <div className={rootClassName}>
      <main className={mainClassName}>
        <section className={sectionClassName}>
          <div
            ref={chatAreaRef}
            className={chatAreaClassName}
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.length === 0 && !loading && (
              <div className={isOpenAI ? 'flex flex-1 items-center justify-center py-8' : 'flex flex-1 items-center justify-center py-8'}>
                <div className="text-center">
                  {!isOpenAI && (
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center text-[#d97745]">
                      <ClaudeBurst />
                    </div>
                  )}
                  <p className={
                    isOpenAI
                      ? 'mx-auto max-w-xs text-[1.75rem] font-semibold leading-[1.08] text-[#f4f4f4] sm:text-4xl'
                      : 'text-[2rem] font-semibold leading-tight text-[#d7d2c8] sm:text-5xl'
                  }>
                    {isOpenAI ? "What's on your mind today?" : emptyStatePhrases[emptyPhraseIndex]}
                  </p>
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <ChatBubble key={msg.id} sender={msg.sender} content={msg.content} />
            ))}
            <div ref={messagesEndRef} />
            {loading && <LoadingBubble />}
          </div>

          {isOpenAI && messages.length === 0 && (
            <p className="mx-auto mb-2 w-[min(21rem,calc(100vw-3rem))] text-center text-[0.68rem] leading-4 text-[#b4b4b4]">
              Ravi GPT can make mistakes. Check important info.
            </p>
          )}
          <div className={isOpenAI ? 'sticky bottom-0 mx-auto w-full max-w-[720px] pb-1' : 'mx-auto w-full max-w-3xl pb-1'}>
            <ChatInput
              onSend={handleSend}
              interfaceTheme={interfaceTheme}
              onInterfaceThemeChange={setInterfaceTheme}
              suggestions={allPrompts.map((prompt) => ({
                id: prompt.id,
                text: prompt.text,
                category: prompt.category,
              }))}
            />
          </div>
        </section>

        {showScrollToBottom && (
          <button
            onClick={handleScrollToBottom}
            className="fixed bottom-24 right-4 z-50 rounded-full border border-[#010920] bg-primary p-3 text-[#010920] shadow-[0_12px_30px_rgb(1_9_32_/_18%)] transition hover:bg-tertiary dark:border-primary sm:bottom-8 sm:right-8"
            aria-label="Scroll to bottom"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </main>
    </div>
  );
}

function ClaudeBurst() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, index) => {
        const angle = (index * 22.5 * Math.PI) / 180;
        const x1 = 32 + Math.cos(angle) * 7;
        const y1 = 32 + Math.sin(angle) * 7;
        const x2 = 32 + Math.cos(angle) * 25;
        const y2 = 32 + Math.sin(angle) * 25;

        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
