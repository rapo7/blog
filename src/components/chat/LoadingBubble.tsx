export default function LoadingBubble() {
  return (
    <div className="flex justify-start w-full animate-pulse">
      <div className="max-w-[75%] px-4 py-2 rounded-2xl shadow text-base break-words mb-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm flex items-center gap-2">
        <span className="dot-flashing"></span>
        <span>rAvI is typing…</span>
      </div>
    </div>
  );
}
