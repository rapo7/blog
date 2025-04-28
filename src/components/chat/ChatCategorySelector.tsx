import type { ChatCategory } from './types';

interface Props {
  selected: ChatCategory;
  onSelect: (cat: ChatCategory) => void;
}

const categories: ChatCategory[] = ['Create', 'Explore', 'Code', 'Learn'];

const categoryIcons: Record<ChatCategory, preact.JSX.Element> = {
  Create: (
    <svg className="inline-block mr-2 w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M11 3a1 1 0 10-2 0v1.07A7.002 7.002 0 003 11c0 2.386 1.2 4.47 3 5.74V18a1 1 0 001 1h6a1 1 0 001-1v-1.26A7.002 7.002 0 0017 11a7.002 7.002 0 00-6-6.93V3zM10 5a6 6 0 016 6c0 1.657-.672 3.156-1.757 4.243A1 1 0 0014 16H6a1 1 0 00-.243-1.757A6.002 6.002 0 0110 5z" />
    </svg>
  ),
  Explore: (
    <svg className="inline-block mr-2 w-5 h-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm2.94 5.06a1 1 0 01.13 1.13l-2 5a1 1 0 01-.52.52l-5 2a1 1 0 01-1.13-.13 1 1 0 01-.13-1.13l2-5a1 1 0 01.52-.52l5-2a1 1 0 011.13.13z" />
    </svg>
  ),
  Code: (
    <svg className="inline-block mr-2 w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M8.293 6.293a1 1 0 011.414 0L13 9.586a1 1 0 010 1.414l-3.293 3.293a1 1 0 01-1.414-1.414L10.586 11H4a1 1 0 110-2h6.586l-2.293-2.293a1 1 0 010-1.414z" />
    </svg>
  ),
  Learn: (
    <svg className="inline-block mr-2 w-5 h-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12v-1a1 1 0 00-2 0v1a1 1 0 002 0zm.293-3.707a1 1 0 00-1.414 0L7 12.172V11a1 1 0 10-2 0v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-.293-.707z" />
    </svg>
  ),
};

export default function ChatCategorySelector({ selected, onSelect }: Props) {
  return (
    <div className="flex justify-center gap-4 mb-6">
      {categories.map(cat => (
        <button
          type="button"
          key={cat}
          className={`px-4 py-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:ring-offset-2 focus:ring-offset-background
            ${cat === selected
              ? 'bg-blue-600 text-white shadow-md dark:bg-blue-700 dark:text-white'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-blue-900 dark:border-gray-700'}
          `}
          onClick={() => onSelect(cat)}
        >
          {categoryIcons[cat]}{cat}
        </button>
      ))}
    </div>
  );
}
