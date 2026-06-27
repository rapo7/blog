export default function ChatHeader() {
  return (
    <header className="rounded-[22px] border border-default bg-default px-4 py-4 sm:rounded-[24px] sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <a
            href="/blog/"
            className="mb-4 inline-flex rounded-full border border-default bg-surface px-3 py-1.5 text-xs font-semibold text-offset transition hover:bg-primary hover:text-[#010920]"
          >
            Back to site
          </a>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-tertiary sm:text-sm">
            Ravi GPT
          </p>
          <h1 className="mt-2 max-w-2xl text-[2.15rem] font-black leading-[0.95] text-default sm:text-5xl">
            Ask me anything about Ravi
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-offset sm:text-base">
            Choose a topic below or ask a direct question.
          </p>
        </div>
      </div>
    </header>
  );
}
