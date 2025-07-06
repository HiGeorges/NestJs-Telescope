import { useState, useEffect, type ReactNode } from 'react';
import Header from './Header';

const sidebarItems = [
  { label: 'Requests', icon: 'i-mdi:file-document-outline' },
  { label: 'Exceptions', icon: 'i-mdi:alert-circle-outline' },
  { label: 'Jobs', icon: 'i-mdi:hammer-wrench' },
  { label: 'Logs', icon: 'i-mdi:clipboard-text-outline' },
  { label: 'Events', icon: 'i-mdi:bullhorn-outline' },
];

interface SidebarLayoutProps {
  children: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [activeSidebar, setActiveSidebar] = useState('Requests');

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
      <aside className="w-60 min-w-[200px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm z-10">
        <div className="flex items-center gap-2 text-2xl font-bold text-blue-600 py-6 pl-8 tracking-wide select-none">
          <span className="i-mdi:telescope text-3xl" />
          Telescope
        </div>
        <nav className="flex-1">
          {sidebarItems.map(item => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-8 py-3 cursor-pointer transition-all border-l-4 select-none text-base font-medium
                ${activeSidebar === item.label
                  ? 'bg-blue-50 dark:bg-gray-800 text-blue-600 border-blue-600'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600'}
              `}
              onClick={() => setActiveSidebar(item.label)}
            >
              <span className={`text-xl ${item.icon}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
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
      <main className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-w-0">
        <Header />
        <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
          {children}
        </section>
      </main>
    </div>
  );
} 