import type { HeaderProps } from '../types';
import { Button } from '../components/ui/Button';
import { apiUtils } from '../services/api';

export default function Header({ stats, onClearEntries, isLoading = false }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-4 md:py-6 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center space-x-6">
        <div className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight select-none">
          <span className="i-mdi:telescope text-blue-600 text-2xl mr-2 align-middle" />
          NestJS Telescope
        </div>
        
        {/* Statistics */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{stats.totalEntries} entries</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{stats.requests} requests</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span>{stats.exceptions} exceptions</span>
          </div>
          {stats.averageResponseTime > 0 && (
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>{apiUtils.formatResponseTime(stats.averageResponseTime)} avg</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="danger"
          size="sm"
          onClick={onClearEntries}
          loading={isLoading}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          }
        >
          Clear All
        </Button>
      </div>
    </header>
  );
} 