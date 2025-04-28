import type { ChatCategory } from './types';

interface Props {
  selected: ChatCategory;
  onSelect: (cat: ChatCategory) => void;
}

const categories: ChatCategory[] = ['Basic', 'Work', 'Skills', 'Hobbies'];

const categoryIcons: Record<ChatCategory, preact.JSX.Element> = {
  Basic: (
    <svg className="inline-block mr-2 w-5 h-5 text-muted" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-book"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6l0 13" /><path d="M12 6l0 13" /><path d="M21 6l0 13" /></svg>
  ),
  Work: (
    <svg className="inline-block mr-2 w-5 h-5 text-muted" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-briefcase"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /><path d="M12 12l0 .01" /><path d="M3 13a20 20 0 0 0 18 0" /></svg>
  ),
  Skills: (
    <svg className="inline-block mr-2 w-5 h-5 text-muted" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-bulb"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" /><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" /><path d="M9.7 17l4.6 0" /></svg>
  ),
  Hobbies: (
    <svg className="inline-block mr-2 w-5 h-5 text-muted" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-heartbeat"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.5 13.572l-7.5 7.428l-2.896 -2.868m-6.117 -8.104a5 5 0 0 1 9.013 -3.022a5 5 0 1 1 7.5 6.572" /><path d="M3 13h2l2 3l2 -6l1 3h3" /></svg>
  ),
};

export default function ChatCategorySelector({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap sm:flex-row justify-center gap-2 sm:gap-4 mb-6 w-full items-center">
      {categories.map(cat => (
        <button
          type="button"
          key={cat}
          className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-200
            shadow-sm
            ${cat === selected
              ? 'bg-blue-600/30 text-blue-600 shadow-lg font-bold' 
              : 'bg-blue-500/30 dark:bg-neutral-800 text-black dark:text-neutral-200/50 hover:bg-blue-500/80 dark:hover:bg-neutral-700/80' 
            }
             
          `}
          onClick={() => onSelect(cat)}
        >
          {categoryIcons[cat]}{cat}
        </button>
      ))}
    </div>
  );
}
