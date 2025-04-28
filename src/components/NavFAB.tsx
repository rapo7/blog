import { useState, useRef, useEffect } from "preact/hooks";

export default function NavFAB() {
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
        <button
          onClick={() => document.getElementById('hero').scrollIntoView()}
          className="bg-slate-300 dark:bg-zinc-900/95 rounded-full shadow-lg p-2 hover:scale-110 transition relative"
          title="Home"
          onMouseEnter={() => setIsMainHovered(true)}
          onMouseLeave={() => setIsMainHovered(false)}
        >
          {/* SVG Hero Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24"><g fill="none"><path fill="url(#fluentColorPersonStarburst240)" d="M9.84 2.034q.168.058.329.136l1.283.632a1.25 1.25 0 0 0 1.104 0l1.283-.632a2.75 2.75 0 0 1 3.681 1.253l.074.162l.063.167l.46 1.353c.125.368.414.656.781.781l1.354.46a2.75 2.75 0 0 1 1.581 3.819l-.631 1.283a1.25 1.25 0 0 0 0 1.104l.631 1.283a2.75 2.75 0 0 1-1.581 3.818l-1.354.46a1.25 1.25 0 0 0-.78.781l-.461 1.354a2.75 2.75 0 0 1-3.818 1.581l-1.283-.631a1.25 1.25 0 0 0-1.104 0l-1.283.631a2.75 2.75 0 0 1-3.818-1.581l-.46-1.354a1.25 1.25 0 0 0-.782-.78l-1.353-.461a2.75 2.75 0 0 1-1.582-3.818l.632-1.283a1.25 1.25 0 0 0 0-1.104l-.632-1.283a2.75 2.75 0 0 1 1.582-3.818l1.353-.46a1.25 1.25 0 0 0 .781-.782l.46-1.353a2.75 2.75 0 0 1 3.49-1.718" /><path fill="url(#fluentColorPersonStarburst241)" fill-opacity="0.7" d="M9.84 2.034q.168.058.329.136l1.283.632a1.25 1.25 0 0 0 1.104 0l1.283-.632a2.75 2.75 0 0 1 3.681 1.253l.074.162l.063.167l.46 1.353c.125.368.414.656.781.781l1.354.46a2.75 2.75 0 0 1 1.581 3.819l-.631 1.283a1.25 1.25 0 0 0 0 1.104l.631 1.283a2.75 2.75 0 0 1-1.581 3.818l-1.354.46a1.25 1.25 0 0 0-.78.781l-.461 1.354a2.75 2.75 0 0 1-3.818 1.581l-1.283-.631a1.25 1.25 0 0 0-1.104 0l-1.283.631a2.75 2.75 0 0 1-3.818-1.581l-.46-1.354a1.25 1.25 0 0 0-.782-.78l-1.353-.461a2.75 2.75 0 0 1-1.582-3.818l.632-1.283a1.25 1.25 0 0 0 0-1.104l-.632-1.283a2.75 2.75 0 0 1 1.582-3.818l1.353-.46a1.25 1.25 0 0 0 .781-.782l.46-1.353a2.75 2.75 0 0 1 3.49-1.718" /><path fill="url(#fluentColorPersonStarburst242)" fill-opacity="0.9" d="M12 5.965a2.414 2.414 0 1 0 0 4.828a2.414 2.414 0 0 0 0-4.828M15.017 12H8.982c-1 0-1.81.81-1.81 1.81c0 1.347.554 2.427 1.463 3.156c.895.719 2.094 1.069 3.365 1.069c1.27 0 2.47-.35 3.365-1.069c.909-.73 1.463-1.809 1.463-3.156c0-1-.81-1.81-1.81-1.81" /><defs><linearGradient id="fluentColorPersonStarburst240" x1="5.262" x2="15.375" y1=".763" y2="23.236" gradientUnits="userSpaceOnUse"><stop stop-color="#1ec8b0" /><stop offset="1" stop-color="#2764e7" /></linearGradient><linearGradient id="fluentColorPersonStarburst241" x1="15.134" x2="19.142" y1="4.371" y2="24.288" gradientUnits="userSpaceOnUse"><stop offset=".533" stop-color="#ff6ce8" stop-opacity="0" /><stop offset="1" stop-color="#ff6ce8" /></linearGradient><linearGradient id="fluentColorPersonStarburst242" x1="19.246" x2="-1.946" y1="28.381" y2="-2.712" gradientUnits="userSpaceOnUse"><stop stop-color="#9deaff" /><stop offset="1" stop-color="#fff" /></linearGradient></defs></g></svg>
          {open && isMainHovered && (
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded shadow bg-white dark:bg-zinc-800 text-black dark:text-white whitespace-nowrap z-10">
              Main
            </span>
          )}
        </button>
        {/* Education FAB */}
        <button
          onClick={() => document.getElementById('education').scrollIntoView()}
          className="bg-slate-300 dark:bg-zinc-900/95 rounded-full shadow-lg p-2 hover:scale-110 transition relative"
          title="Education"
          onMouseEnter={() => setIsEducationHovered(true)}
          onMouseLeave={() => setIsEducationHovered(false)}
        >
          {/* SVG Education Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 16 16" > <g fill="none"><path fill="url(#fluentColorBook160)" d="M3.5 12.5h9.313s-.313.5-.313 1s.313 1 .313 1H5A1.5 1.5 0 0 1 3.5 13z" /><path fill="url(#fluentColorBook161)" d="M11 1H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7.5a.5.5 0 0 0 0-1H5a1 1 0 0 1-1-1v-.003h8.5a.5.5 0 0 0 .5-.5V3a2 2 0 0 0-2-2" /><path fill="url(#fluentColorBook162)" d="M6 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" /><defs><linearGradient id="fluentColorBook160" x1="9.5" x2="9.5" y1="14" y2="12" gradientUnits="userSpaceOnUse"><stop stop-color="#9deaff" /><stop offset=".716" stop-color="#58aafe" /></linearGradient><linearGradient id="fluentColorBook161" x1="6.45" x2="8.851" y1="3.619" y2="18.621" gradientUnits="userSpaceOnUse"><stop stop-color="#20ac9d" /><stop offset="1" stop-color="#2052cb" /></linearGradient><linearGradient id="fluentColorBook162" x1="7.069" x2="10.777" y1="2.485" y2="7.099" gradientUnits="userSpaceOnUse"><stop stop-color="#9ff0f9" /><stop offset="1" stop-color="#6ce0ff" /></linearGradient></defs></g></svg>
          {open && isEducationHovered && (
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded shadow bg-white dark:bg-zinc-800 text-black dark:text-white whitespace-nowrap z-10">
              Education
            </span>
          )}
        </button>
        {/* Projects FAB */}
        <button
          onClick={() => document.getElementById('portfolio').scrollIntoView()}
          className="bg-slate-300 dark:bg-zinc-900/95 rounded-full shadow-lg p-2 hover:scale-110 transition relative"
          title="Projects"
          onMouseEnter={() => setIsProjectsHovered(true)}
          onMouseLeave={() => setIsProjectsHovered(false)}
        >
          {/* SVG Projects Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 16 16"><g fill="none"><path fill="url(#fluentColorLightbulbFilament166)" d="M8.762 13.998a1.38 1.38 0 0 0 1.254-1.042l.724-3.026a.15.15 0 0 1 .044-.075c1.136-1.048 1.717-2.223 1.717-3.505c0-2.403-2.015-4.352-4.501-4.352S3.499 3.947 3.499 6.35c0 1.282.58 2.457 1.717 3.505q.034.032.045.075l.722 3.025l.028.1c.181.56.719.947 1.333.947h1.311z" /><path fill="url(#fluentColorLightbulbFilament160)" d="M8.762 13.998a1.38 1.38 0 0 0 1.254-1.042l.724-3.026a.15.15 0 0 1 .044-.075c1.136-1.048 1.717-2.223 1.717-3.505c0-2.403-2.015-4.352-4.501-4.352S3.499 3.947 3.499 6.35c0 1.282.58 2.457 1.717 3.505q.034.032.045.075l.722 3.025l.028.1c.181.56.719.947 1.333.947h1.311z" /><path fill="url(#fluentColorLightbulbFilament167)" fill-opacity="0.2" d="M8.762 13.998a1.38 1.38 0 0 0 1.254-1.042l.724-3.026a.15.15 0 0 1 .044-.075c1.136-1.048 1.717-2.223 1.717-3.505c0-2.403-2.015-4.352-4.501-4.352S3.499 3.947 3.499 6.35c0 1.282.58 2.457 1.717 3.505q.034.032.045.075l.722 3.025l.028.1c.181.56.719.947 1.333.947h1.311z" /><path fill="url(#fluentColorLightbulbFilament168)" fill-opacity="0.2" d="M8.762 13.998a1.38 1.38 0 0 0 1.254-1.042l.724-3.026a.15.15 0 0 1 .044-.075c1.136-1.048 1.717-2.223 1.717-3.505c0-2.403-2.015-4.352-4.501-4.352S3.499 3.947 3.499 6.35c0 1.282.58 2.457 1.717 3.505q.034.032.045.075l.722 3.025l.028.1c.181.56.719.947 1.333.947h1.311z" /><path fill="url(#fluentColorLightbulbFilament169)" fill-opacity="0.2" d="M8.762 13.998a1.38 1.38 0 0 0 1.254-1.042l.724-3.026a.15.15 0 0 1 .044-.075c1.136-1.048 1.717-2.223 1.717-3.505c0-2.403-2.015-4.352-4.501-4.352S3.499 3.947 3.499 6.35c0 1.282.58 2.457 1.717 3.505q.034.032.045.075l.722 3.025l.028.1c.181.56.719.947 1.333.947h1.311z" /><path fill="url(#fluentColorLightbulbFilament16a)" fill-opacity="0.2" d="M8.762 13.998a1.38 1.38 0 0 0 1.254-1.042l.724-3.026a.15.15 0 0 1 .044-.075c1.136-1.048 1.717-2.223 1.717-3.505c0-2.403-2.015-4.352-4.501-4.352S3.499 3.947 3.499 6.35c0 1.282.58 2.457 1.717 3.505q.034.032.045.075l.722 3.025l.028.1c.181.56.719.947 1.333.947h1.311z" /><rect width="1.023" height="4.708" x="7.487" y="6.998" fill="url(#fluentColorLightbulbFilament161)" rx=".512" /><rect width=".992" height="1.988" x="7.502" y="4.005" fill="url(#fluentColorLightbulbFilament162)" rx=".496" /><path fill="url(#fluentColorLightbulbFilament163)" d="M5.413 6.019a.522.522 0 0 1 .738-.738l.686.686a.522.522 0 0 1-.738.738z" /><path fill="url(#fluentColorLightbulbFilament164)" d="M10.584 6.019a.522.522 0 1 0-.738-.738l-.686.686a.522.522 0 0 0 .738.738z" /><path fill="url(#fluentColorLightbulbFilament165)" d="M5.755 12h4.49l.24-1h-4.97z" /><defs><linearGradient id="fluentColorLightbulbFilament160" x1="8" x2="8" y1="1.998" y2="14.002" gradientUnits="userSpaceOnUse"><stop offset=".766" stop-color="#d34719" stop-opacity="0" /><stop offset=".791" stop-color="#d34719" /><stop offset="1" stop-color="#d34719" stop-opacity="0" /></linearGradient><linearGradient id="fluentColorLightbulbFilament161" x1="7.999" x2="7.999" y1="6.998" y2="11.708" gradientUnits="userSpaceOnUse"><stop stop-color="#fff2be" /><stop offset=".437" stop-color="#ffd638" /></linearGradient><linearGradient id="fluentColorLightbulbFilament162" x1="7.502" x2="8.495" y1="4.999" y2="4.999" gradientUnits="userSpaceOnUse"><stop stop-color="#fff2be" /><stop offset="1" stop-color="#ffd638" /></linearGradient><linearGradient id="fluentColorLightbulbFilament163" x1="5.776" x2="6.478" y1="6.352" y2="5.65" gradientUnits="userSpaceOnUse"><stop stop-color="#fff2be" /><stop offset="1" stop-color="#ffd638" /></linearGradient><linearGradient id="fluentColorLightbulbFilament164" x1="9.492" x2="10.189" y1="5.677" y2="6.374" gradientUnits="userSpaceOnUse"><stop stop-color="#fff2be" /><stop offset="1" stop-color="#ffd638" /></linearGradient><linearGradient id="fluentColorLightbulbFilament165" x1="7.607" x2="8.173" y1="11.299" y2="12.798" gradientUnits="userSpaceOnUse"><stop stop-color="#ffc7a3" /><stop offset="1" stop-color="#ff9c70" /></linearGradient><radialGradient id="fluentColorLightbulbFilament166" cx="0" cy="0" r="1" gradientTransform="matrix(2.95979 10.31121 -15.69548 4.50532 4.998 3.177)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffe06b" /><stop offset=".376" stop-color="#ffa43d" /><stop offset="1" stop-color="#e67505" /></radialGradient><radialGradient id="fluentColorLightbulbFilament167" cx="0" cy="0" r="1" gradientTransform="matrix(.66817 .9495 -.75915 .53422 6.44 6.827)" gradientUnits="userSpaceOnUse"><stop offset=".165" stop-color="#741c06" /><stop offset=".854" stop-color="#741c06" stop-opacity="0" /></radialGradient><radialGradient id="fluentColorLightbulbFilament168" cx="0" cy="0" r="1" gradientTransform="matrix(0 1.27773 -.9583 0 8 5.96)" gradientUnits="userSpaceOnUse"><stop offset=".165" stop-color="#741c06" /><stop offset=".854" stop-color="#741c06" stop-opacity="0" /></radialGradient><radialGradient id="fluentColorLightbulbFilament169" cx="0" cy="0" r="1" gradientTransform="matrix(-.7534 .87431 -.65573 -.56505 9.758 6.898)" gradientUnits="userSpaceOnUse"><stop offset=".165" stop-color="#741c06" /><stop offset=".854" stop-color="#741c06" stop-opacity="0" /></radialGradient><radialGradient id="fluentColorLightbulbFilament16a" cx="0" cy="0" r="1" gradientTransform="matrix(-1.14899 0 0 -3.30922 8 9.29)" gradientUnits="userSpaceOnUse"><stop offset=".165" stop-color="#741c06" /><stop offset=".777" stop-color="#741c06" stop-opacity="0" /></radialGradient></defs></g></svg>
          {open && isProjectsHovered && (
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded shadow bg-white dark:bg-zinc-800 text-black dark:text-white whitespace-nowrap z-10">
              Projects
            </span>
          )}
        </button>
        <button
          onClick={() => document.getElementById('experience').scrollIntoView()}
          className="bg-slate-300 dark:bg-zinc-900/95 rounded-full shadow-lg p-2 hover:scale-110 transition relative"
          title="Experience"
          onMouseEnter={() => setIsExperienceHovered(true)}
          onMouseLeave={() => setIsExperienceHovered(false)}
        >
          {/* SVG Experience Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 16 16"><g fill="none"><path fill="url(#fluentColorBuildingPeople160)" d="M3 3.5A1.5 1.5 0 0 1 4.5 2h4A1.5 1.5 0 0 1 10 3.5V14H3.5a.5.5 0 0 1-.5-.5z" /><path fill="url(#fluentColorBuildingPeople16b)" d="M3 3.5A1.5 1.5 0 0 1 4.5 2h4A1.5 1.5 0 0 1 10 3.5V14H3.5a.5.5 0 0 1-.5-.5z" /><path fill="url(#fluentColorBuildingPeople16c)" d="M3 3.5A1.5 1.5 0 0 1 4.5 2h4A1.5 1.5 0 0 1 10 3.5V14H3.5a.5.5 0 0 1-.5-.5z" /><path fill="url(#fluentColorBuildingPeople161)" d="M6 9.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0" /><path fill="url(#fluentColorBuildingPeople162)" d="M8 7a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0" /><path fill="url(#fluentColorBuildingPeople163)" d="M6 7a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0" /><path fill="url(#fluentColorBuildingPeople164)" d="M8 4.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0" /><path fill="url(#fluentColorBuildingPeople165)" d="M6 4.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0" /><path fill="url(#fluentColorBuildingPeople166)" d="M13.75 14c1.65 0 2.25-.912 2.25-1.8a1.2 1.2 0 0 0-1.2-1.2h-2.1a1.2 1.2 0 0 0-1.2 1.2c0 .888.6 1.8 2.25 1.8" /><path fill="url(#fluentColorBuildingPeople16d)" fill-opacity="0.5" d="M13.75 14c1.65 0 2.25-.912 2.25-1.8a1.2 1.2 0 0 0-1.2-1.2h-2.1a1.2 1.2 0 0 0-1.2 1.2c0 .888.6 1.8 2.25 1.8" /><path fill="url(#fluentColorBuildingPeople167)" d="M15 8.75a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0" /><path fill="url(#fluentColorBuildingPeople168)" d="M10 15c2.2 0 3-1.216 3-2.4a1.6 1.6 0 0 0-1.6-1.6H8.6A1.6 1.6 0 0 0 7 12.6c0 1.184.8 2.4 3 2.4" /><path fill="url(#fluentColorBuildingPeople169)" d="M10 15c2.2 0 3-1.216 3-2.4a1.6 1.6 0 0 0-1.6-1.6H8.6A1.6 1.6 0 0 0 7 12.6c0 1.184.8 2.4 3 2.4" /><path fill="url(#fluentColorBuildingPeople16a)" d="M11.75 8.25a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0" /><defs><linearGradient id="fluentColorBuildingPeople160" x1="3" x2="13.981" y1="2.375" y2="10.576" gradientUnits="userSpaceOnUse"><stop stop-color="#29c3ff" /><stop offset="1" stop-color="#2764e7" /></linearGradient><linearGradient id="fluentColorBuildingPeople161" x1="5.9" x2="9.508" y1="3.333" y2="9.829" gradientUnits="userSpaceOnUse"><stop stop-color="#fdfdfd" /><stop offset="1" stop-color="#b3e0ff" /></linearGradient><linearGradient id="fluentColorBuildingPeople162" x1="5.9" x2="9.508" y1="3.333" y2="9.829" gradientUnits="userSpaceOnUse"><stop stop-color="#fdfdfd" /><stop offset="1" stop-color="#b3e0ff" /></linearGradient><linearGradient id="fluentColorBuildingPeople163" x1="5.9" x2="9.508" y1="3.333" y2="9.829" gradientUnits="userSpaceOnUse"><stop stop-color="#fdfdfd" /><stop offset="1" stop-color="#b3e0ff" /></linearGradient><linearGradient id="fluentColorBuildingPeople164" x1="5.9" x2="9.508" y1="3.333" y2="9.829" gradientUnits="userSpaceOnUse"><stop stop-color="#fdfdfd" /><stop offset="1" stop-color="#b3e0ff" /></linearGradient><linearGradient id="fluentColorBuildingPeople165" x1="5.9" x2="9.508" y1="3.333" y2="9.829" gradientUnits="userSpaceOnUse"><stop stop-color="#fdfdfd" /><stop offset="1" stop-color="#b3e0ff" /></linearGradient><linearGradient id="fluentColorBuildingPeople166" x1="12.57" x2="13.778" y1="11.399" y2="14.293" gradientUnits="userSpaceOnUse"><stop offset=".125" stop-color="#9c6cfe" /><stop offset="1" stop-color="#7a41dc" /></linearGradient><linearGradient id="fluentColorBuildingPeople167" x1="13.095" x2="14.369" y1="7.832" y2="9.867" gradientUnits="userSpaceOnUse"><stop offset=".125" stop-color="#9c6cfe" /><stop offset="1" stop-color="#7a41dc" /></linearGradient><linearGradient id="fluentColorBuildingPeople168" x1="8.427" x2="10.038" y1="11.532" y2="15.391" gradientUnits="userSpaceOnUse"><stop offset=".125" stop-color="#bd96ff" /><stop offset="1" stop-color="#9c6cfe" /></linearGradient><linearGradient id="fluentColorBuildingPeople169" x1="10" x2="12.293" y1="10.524" y2="16.952" gradientUnits="userSpaceOnUse"><stop stop-color="#885edb" stop-opacity="0" /><stop offset="1" stop-color="#e362f8" /></linearGradient><linearGradient id="fluentColorBuildingPeople16a" x1="9.082" x2="10.866" y1="6.965" y2="9.813" gradientUnits="userSpaceOnUse"><stop offset=".125" stop-color="#bd96ff" /><stop offset="1" stop-color="#9c6cfe" /></linearGradient><radialGradient id="fluentColorBuildingPeople16b" cx="0" cy="0" r="1" gradientTransform="matrix(4.10763 -.0625 .0499 3.27938 8.906 13.281)" gradientUnits="userSpaceOnUse"><stop stop-color="#4a43cb" /><stop offset=".914" stop-color="#4a43cb" stop-opacity="0" /></radialGradient><radialGradient id="fluentColorBuildingPeople16c" cx="0" cy="0" r="1" gradientTransform="matrix(.04862 2.28125 -1.77483 .03783 8.712 9.969)" gradientUnits="userSpaceOnUse"><stop stop-color="#4a43cb" /><stop offset="1" stop-color="#4a43cb" stop-opacity="0" /></radialGradient><radialGradient id="fluentColorBuildingPeople16d" cx="0" cy="0" r="1" gradientTransform="matrix(2.96146 -.4375 .51533 3.48828 10.93 12.5)" gradientUnits="userSpaceOnUse"><stop offset=".392" stop-color="#3b148a" /><stop offset="1" stop-color="#3b148a" stop-opacity="0" /></radialGradient></defs></g></svg>
          {open && isExperienceHovered && (
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded shadow bg-white dark:bg-zinc-800 text-black dark:text-white whitespace-nowrap z-10">
              Experience
            </span>
          )}
        </button>
      </div>
      {/* Main FAB */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-200 focus:outline-none"
      >
        {open ? (
          // Close (X) icon
          <svg className="w-6 h-6 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="12" stroke-dashoffset="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="12;0"/></path></svg>
        ) : (
          // Menu icon (person)
          <svg className="w-6 h-6 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 5h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"/></path><path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="16;0"/></path><path d="M5 19h14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="16;0"/></path></g></svg>
        )}
      </button>
    </div>
  );
}
