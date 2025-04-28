import { useState, useRef, useEffect } from "preact/hooks";

interface FooterProps {
  initialPosition?: 'top' | 'bottom';
}

export default function Footer({ initialPosition = 'bottom' }: FooterProps) {
  const [open, setOpen] = useState(false);
  const [isTop, setIsTop] = useState(initialPosition === 'top');
  const fabRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div
      ref={fabRef}
      className={`fixed left-4 z-50 flex flex-col items-end gap-3 ${isTop ? 'top-4' : 'bottom-4'}`}
    >

      {/* Expanded FABs */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <a
          href="/blog/"
          className="bg-slate-300 dark:bg-zinc-900/95 rounded-full shadow-lg p-2 hover:scale-110 transition"
          title="Home"
          rel="noopener noreferrer"
        >
          {/* SVG Home Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 48 48">
            {/* ...SVG paths... */}
            <g fill="none">
              <path fill="url(#fluentColorHome480)" d="M18.067 27h12v16h-12z"></path>
              <path fill="url(#fluentColorHome481)" d="M26.461 7.855a3.78 3.78 0 0 0-4.787 0L8.499 18.597a3.91 3.91 0 0 0-1.432 3.031v17.485C7.067 41.26 8.78 43 10.892 43h8.175V30.5a2.5 2.5 0 0 1 2.5-2.5h5a2.5 2.5 0 0 1 2.5 2.5V43h8.175c2.113 0 3.825-1.74 3.825-3.887V21.628a3.91 3.91 0 0 0-1.43-3.031z"></path>
              <path fill="url(#fluentColorHome482)" fillRule="evenodd" d="m24.068 9.329l-16 13.215a2.054 2.054 0 0 1-2.852-.262a1.956 1.956 0 0 1 .267-2.794L22.28 5.628a2.83 2.83 0 0 1 3.523-.024l16.805 13.588a1.957 1.957 0 0 1 .307 2.79a2.054 2.054 0 0 1-2.848.3z" clipRule="evenodd"></path>
              <defs>
                <linearGradient id="fluentColorHome480" x1={24.067} x2={13.481} y1={27} y2={44.65} gradientUnits="userSpaceOnUse">
                  <stop stopColor="#944600"></stop>
                  <stop offset={1} stopColor="#cd8e02"></stop>
                </linearGradient>
                <linearGradient id="fluentColorHome481" x1={10.313} x2={45.173} y1={5.24} y2={32} gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffd394"></stop>
                  <stop offset={1} stopColor="#ffb357"></stop>
                </linearGradient>
                <linearGradient id="fluentColorHome482" x1={17.817} x2={25.308} y1={0.725} y2={22.452} gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ff921f"></stop>
                  <stop offset={1} stopColor="#eb4824"></stop>
                </linearGradient>
              </defs>
            </g>
          </svg>
        </a>
        <a
          href="https://github.com/rapo7"
          className="bg-slate-300 dark:bg-zinc-900/95 rounded-full shadow-lg p-2 hover:scale-110 transition"
          title="Github"
          rel="noopener noreferrer"
        >
          {/* SVG Github Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 dark:text-white text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/ravi-teja-rapolu-55b184167"
          className="bg-slate-300 dark:bg-zinc-900/95 rounded-full shadow-lg p-2 hover:scale-110 transition"
          title="LinkedIn"
          rel="noopener noreferrer"
        >
          {/* SVG LinkedIn Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.605v5.591z" />
          </svg>
        </a>
        <a
          href="https://bsky.app/profile/ravitejarapo.bsky.social"
          target="_blank"
          className="bg-slate-300 dark:bg-zinc-900/95 rounded-full shadow-lg p-2 hover:scale-110 transition"
          title="Blue Sky Social"
          rel="noopener noreferrer"
        >
          {/* SVG Blue Sky Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 256 226">
            <path
              fill="#1185fe"
              d="M55.491 15.172c29.35 22.035 60.917 66.712 72.509 90.686c11.592-23.974 43.159-68.651 72.509-90.686C221.686-.727 256-13.028 256 26.116c0 7.818-4.482 65.674-7.111 75.068c-9.138 32.654-42.436 40.983-72.057 35.942c51.775 8.812 64.946 38 36.501 67.187c-54.021 55.433-77.644-13.908-83.696-31.676c-1.11-3.257-1.63-4.78-1.637-3.485c-.008-1.296-.527.228-1.637 3.485c-6.052 17.768-29.675 87.11-83.696 31.676c-28.445-29.187-15.274-58.375 36.5-67.187c-29.62 5.041-62.918-3.288-72.056-35.942C4.482 91.79 0 33.934 0 26.116C0-13.028 34.314-.727 55.491 15.172"
            ></path>
          </svg>
        </a>
      </div>
      {/* Main FAB */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center text-3xl transition-all duration-200 focus:outline-none"
      >
        {open ? (
          // Close (X) icon
          <svg
            className="w-6 h-6 transition-transform duration-200"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
            <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : (
          // Contact icon (person)
            <svg
            className="w-6 h-6 transition-transform duration-200"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            >
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M4 20c0-3.314 3.134-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="2" />
            </svg>
        )}
      </button>
    </div>
  );
}
