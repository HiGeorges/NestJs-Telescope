import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, AlertTriangle, Settings } from 'lucide-react';

export default function SidebarLayout({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) {
  const [theme] = useState(() => localStorage.getItem('theme') || 'dark');
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const navLinks = [
    { to: '/', label: 'Requests', icon: List },
    { to: '/exceptions', label: 'Exceptions', icon: AlertTriangle },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-72 min-w-[260px] bg-gray-950 border-r border-gray-800 flex flex-col shadow-sm z-10">
        <div className="flex items-center gap-3 text-2xl font-bold text-white py-6 pl-8 tracking-wide select-none">
          <span className="bg-blue-600 text-white rounded-full p-2"><LayoutDashboard size={28} /></span>
          NestJS Telescope
        </div>
        <nav className="flex-1 flex flex-col gap-2 px-4">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-base transition-colors
                ${location.pathname === to ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>
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