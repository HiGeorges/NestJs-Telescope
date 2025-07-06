import { useState, useEffect } from 'react';
import type { SidebarLayoutProps } from '../types';

export default function SidebarLayout({ children, header, sidebar }: SidebarLayoutProps) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-80 min-w-[320px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm z-10">
        <div className="flex items-center gap-2 text-2xl font-bold text-blue-600 py-6 pl-8 tracking-wide select-none">
          <span className="i-mdi:telescope text-3xl" />
          Telescope
        </div>
        <div className="flex-1 overflow-hidden">
          {sidebar}
        </div>
        <div className="mt-auto flex justify-center py-4">
          <button
            className="text-2xl text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Switch theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-w-0">
        {header}
        <section className="flex-1 flex flex-col overflow-hidden">
          {children}
        </section>
      </main>
    </div>
  );
} 