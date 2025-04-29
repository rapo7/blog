import { useState, useRef, useEffect } from "react";

export default function BlogFAB() {
  const [open, setOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);
  const [isMainHovered, setIsMainHovered] = useState(false);
  const [isEducationHovered, setIsEducationHovered] = useState(false);
  const [isProjectsHovered, setIsProjectsHovered] = useState(false);
  const [isExperienceHovered, setIsExperienceHovered] = useState(false);

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
      className="fixed left-4 z-50 flex flex-col items-end gap-3 bottom-4"
    >
      {/* Expanded FABs */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        {/* Main FAB */}
        <a
          onClick={() => (window.location.href = `${import.meta.env.BASE_URL}`)}
          className="bg-slate-300 dark:bg-zinc-900/95 rounded-full shadow-lg p-2 hover:scale-110 transition relative"
          title="Home"
          onMouseEnter={() => setIsMainHovered(true)}
          onMouseLeave={() => setIsMainHovered(false)}
        >
          {/* SVG Hero Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            viewBox="0 0 16 16"
          >
            <g fill="none">
              <path fill="url(#fluentColorHome160)" d="M6 9h4v5H6z" />
              <path
                fill="url(#fluentColorHome161)"
                d="M8.687 2.273a1 1 0 0 0-1.374 0l-4.844 4.58A1.5 1.5 0 0 0 2 7.943v4.569a1.5 1.5 0 0 0 1.5 1.5h3v-4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v4h3a1.5 1.5 0 0 0 1.5-1.5v-4.57a1.5 1.5 0 0 0-.47-1.09z"
              />
              <path
                fill="url(#fluentColorHome162)"
                fillRule="evenodd"
                d="m8.004 2.636l5.731 5.41a.75.75 0 1 0 1.03-1.091L8.86 1.382a1.25 1.25 0 0 0-1.724.007L1.23 7.059a.75.75 0 0 0 1.038 1.082z"
                clipRule="evenodd"
              />
              <defs>
                <linearGradient
                  id="fluentColorHome160"
                  x1="8"
                  x2="4.796"
                  y1="9"
                  y2="14.698"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#944600" />
                  <stop offset="1" stopColor="#cd8e02" />
                </linearGradient>
                <linearGradient
                  id="fluentColorHome161"
                  x1="3.145"
                  x2="14.93"
                  y1="1.413"
                  y2="10.981"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#ffd394" />
                  <stop offset="1" stopColor="#ffb357" />
                </linearGradient>
                <linearGradient
                  id="fluentColorHome162"
                  x1="10.262"
                  x2="6.945"
                  y1="-.696"
                  y2="7.895"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#ff921f" />
                  <stop offset="1" stopColor="#eb4824" />
                </linearGradient>
              </defs>
            </g>
          </svg>
          {open && isMainHovered && (
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded shadow bg-white dark:bg-zinc-800 text-black dark:text-white whitespace-nowrap z-10">
              Home
            </span>
          )}
        </a>
        {/* Education FAB */}
        <button
          onClick={() =>
            (window.location.href = `${import.meta.env.BASE_URL}/blogs`)
          }
          className="bg-slate-300 dark:bg-zinc-900/95 rounded-full shadow-lg p-2 hover:scale-110 transition relative"
          title="Education"
          onMouseEnter={() => setIsEducationHovered(true)}
          onMouseLeave={() => setIsEducationHovered(false)}
        >
          {/* SVG Education Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            viewBox="0 0 16 16"
          >
            <g fill="none">
              <path
                fill="url(#fluentColorDocumentEdit160)"
                d="M9.5 4.5L8.004 1H4.5A1.5 1.5 0 0 0 3 2.5v11A1.5 1.5 0 0 0 4.5 15h5l3.494-3.494L13 6z"
              />
              <path
                fill="url(#fluentColorDocumentEdit166)"
                fillOpacity="0.5"
                d="M9.5 4.5L8.004 1H4.5A1.5 1.5 0 0 0 3 2.5v11A1.5 1.5 0 0 0 4.5 15h5l3.494-3.494L13 6z"
              />
              <path
                fill="url(#fluentColorDocumentEdit167)"
                fillOpacity="0.5"
                d="M9.5 4.5L8.004 1H4.5A1.5 1.5 0 0 0 3 2.5v11A1.5 1.5 0 0 0 4.5 15h5l3.494-3.494L13 6z"
              />
              <path
                fill="url(#fluentColorDocumentEdit161)"
                d="M8 4.5V1l5 5H9.5A1.5 1.5 0 0 1 8 4.5"
              />
              <path
                fill="url(#fluentColorDocumentEdit162)"
                d="M13.5 9.5h-2.21l-3.241 3.241a2.8 2.8 0 0 0-.549.78V15.5h1.968c.291-.136.558-.323.787-.552l3.245-3.245z"
              />
              <path
                fill="url(#fluentColorDocumentEdit163)"
                d="M7.932 12.866a3.51 3.51 0 0 0 2.197 2.2a2.8 2.8 0 0 1-1.164.612l-1.21.303a.61.61 0 0 1-.74-.739l.303-1.21l.009-.034c.11-.42.318-.808.605-1.132"
              />
              <path
                fill="url(#fluentColorDocumentEdit164)"
                d="M12.336 8.454a1.56 1.56 0 1 1 2.207 2.207l-1.191 1.19l-2.207-2.206z"
              />
              <path
                fill="url(#fluentColorDocumentEdit165)"
                d="m13.185 12.019l.95-.95A3.51 3.51 0 0 1 11.93 8.86l-.95.95a3.51 3.51 0 0 0 2.205 2.209"
              />
              <defs>
                <linearGradient
                  id="fluentColorDocumentEdit160"
                  x1="9.994"
                  x2="11.264"
                  y1="1"
                  y2="12.781"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6ce0ff" />
                  <stop offset="1" stopColor="#4894fe" />
                </linearGradient>
                <linearGradient
                  id="fluentColorDocumentEdit161"
                  x1="10.492"
                  x2="9.242"
                  y1="3.083"
                  y2="5.167"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9ff0f9" />
                  <stop offset="1" stopColor="#b3e0ff" />
                </linearGradient>
                <linearGradient
                  id="fluentColorDocumentEdit162"
                  x1="8.24"
                  x2="11.404"
                  y1="11.601"
                  y2="14.768"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#ffa43d" />
                  <stop offset="1" stopColor="#fb5937" />
                </linearGradient>
                <linearGradient
                  id="fluentColorDocumentEdit163"
                  x1="6.511"
                  x2="8.955"
                  y1="13.555"
                  y2="15.982"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".255" stopColor="#ffd394" />
                  <stop offset="1" stopColor="#ff921f" />
                </linearGradient>
                <linearGradient
                  id="fluentColorDocumentEdit164"
                  x1="14.194"
                  x2="12.773"
                  y1="8.799"
                  y2="10.135"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#f97dbd" />
                  <stop offset="1" stopColor="#dd3ce2" />
                </linearGradient>
                <linearGradient
                  id="fluentColorDocumentEdit165"
                  x1="12.335"
                  x2="10.071"
                  y1="11.308"
                  y2="10.32"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#ff921f" />
                  <stop offset="1" stopColor="#ffe994" />
                </linearGradient>
                <radialGradient
                  id="fluentColorDocumentEdit166"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientTransform="rotate(130.372 6.372 3.818)scale(8.35524 4.87457)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".362" stopColor="#4a43cb" />
                  <stop offset="1" stopColor="#4a43cb" stopOpacity="0" />
                </radialGradient>
                <radialGradient
                  id="fluentColorDocumentEdit167"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientTransform="matrix(-3.5 4 -2.22345 -1.94552 10 14)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".535" stopColor="#4a43cb" />
                  <stop offset="1" stopColor="#4a43cb" stopOpacity="0" />
                </radialGradient>
              </defs>
            </g>
          </svg>
          {open && isEducationHovered && (
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded shadow bg-white dark:bg-zinc-800 text-black dark:text-white whitespace-nowrap z-10">
              Blogs
            </span>
          )}
        </button>
      </div>
      {/* Main FAB */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center text-3xl transition-all duration-200 focus:outline-none"
      >
        {open ? (
          // Close (X) icon
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}><path d="m42 42l-9-9M6 6l9 9zm0 36l9-9M42 6l-9 9z"></path><path fill="currentColor" d="M24 29a5 5 0 1 0 0-10a5 5 0 0 0 0 10"></path></g></svg>
        ) : (
          // Menu icon (joystick)
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM6 15v-2m6 2V9"></path><circle cx={12} cy={6} r={3}></circle></g></svg>
        )}
      </button>
    </div>
  );
}
