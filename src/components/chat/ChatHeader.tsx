export default function ChatHeader() {
  return (
    <header className="absolute left-0 right-0 top-0 z-20 px-5 py-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <a
          href="/blog/"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#d7d2c8] shadow-[0_12px_30px_rgb(0_0_0_/_18%)] backdrop-blur transition hover:border-[#d97745]/50 hover:text-[#f3eee5]"
          aria-label="Back to site"
          title="Back to site"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 7h16v2H4V7Zm0 4h16v2H4v-2Zm0 4h10v2H4v-2Z"
            />
          </svg>
        </a>
        <a
          href="/blog/"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#d7d2c8] shadow-[0_12px_30px_rgb(0_0_0_/_18%)] backdrop-blur transition hover:border-[#d97745]/50 hover:text-[#f3eee5]"
          aria-label="Ravi portfolio"
          title="Ravi portfolio"
        >
          <svg className="h-7 w-7" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3a5 5 0 0 0-5 5v8.5c0 .9 1 1.5 1.8.9l1.2-.9 1.3 1a1.2 1.2 0 0 0 1.4 0l1.3-1 1.2.9c.8.6 1.8 0 1.8-.9V8a5 5 0 0 0-5-5Zm-2 7.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"
            />
          </svg>
        </a>
      </div>
    </header>
  );
}
