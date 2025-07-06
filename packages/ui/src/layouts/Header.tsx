export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-4 md:py-6 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight select-none">
        <span className="i-mdi:telescope text-blue-600 text-2xl mr-2 align-middle" />
        NestJS Telescope
      </div>
      <div className="flex gap-2 md:gap-3">
        <button title="Pause" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-xl p-2 rounded transition"><span className="i-mdi:pause" /></button>
        <button title="Clear" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-xl p-2 rounded transition"><span className="i-mdi:delete-outline" /></button>
        <button title="Refresh" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-xl p-2 rounded transition"><span className="i-mdi:refresh" /></button>
        <button title="Show" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-xl p-2 rounded transition"><span className="i-mdi:eye-outline" /></button>
      </div>
    </header>
  );
} 