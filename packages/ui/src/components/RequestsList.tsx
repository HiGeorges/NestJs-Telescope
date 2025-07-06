/**
 * Requests List Component
 * 
 * Displays a list of telescope entries with filtering, sorting, and selection capabilities.
 * Provides a clean interface for browsing HTTP requests and exceptions captured by Telescope.
 */

import React, { useState, useMemo } from 'react';
import type { RequestsListProps } from '../types';
import { Button } from './ui/Button';
import { HttpMethodBadge, StatusCodeBadge, EntryTypeBadge } from './ui/Badge';
import { apiUtils } from '../services/api';

/**
 * Filter options for the requests list
 */
interface FilterOptions {
  /** Filter by entry type */
  type?: 'request' | 'exception' | 'all';
  
  /** Filter by HTTP method */
  method?: string;
  
  /** Filter by status code */
  statusCode?: number;
  
  /** Search term */
  search?: string;
}

/**
 * Requests List Component
 */
export const RequestsList: React.FC<RequestsListProps> = ({
  entries,
  selectedEntryId,
  onEntrySelect,
  onClearEntries,
  isLoading = false,
}) => {
  // State for filtering
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: 'all',
    method: '',
    statusCode: undefined,
    search: '',
  });

  /**
   * Filter entries based on current options
   */
  const filteredEntries = useMemo(() => {
    const filtered = entries.filter((entry) => {
      // Filter by type
      if (filterOptions.type && filterOptions.type !== 'all' && entry.type !== filterOptions.type) {
        return false;
      }

      // Filter by method (for requests only)
      if (filterOptions.method && entry.request?.method !== filterOptions.method) {
        return false;
      }

      // Filter by status code (for requests only)
      if (filterOptions.statusCode && entry.response?.statusCode !== filterOptions.statusCode) {
        return false;
      }

      // Filter by search term
      if (filterOptions.search) {
        const searchTerm = filterOptions.search.toLowerCase();
        const searchableText = [
          entry.request?.url || '',
          entry.request?.method || '',
          entry.response?.statusCode?.toString() || '',
          entry.exception?.message || '',
          entry.exception?.name || '',
          entry.ip,
          entry.userAgent,
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    // Sort by timestamp (most recent first)
    filtered.sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return bTime - aTime;
    });

    return filtered;
  }, [entries, filterOptions]);

  /**
   * Handle filter change
   */
  const handleFilterChange = (key: keyof FilterOptions, value: string | number | undefined) => {
    setFilterOptions(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilterOptions({
      type: 'all',
      method: '',
      statusCode: undefined,
      search: '',
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Telescope Entries ({filteredEntries.length})
          </h2>
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

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Type filter */}
          <select
            value={filterOptions.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="request">Requests</option>
            <option value="exception">Exceptions</option>
          </select>

          {/* Method filter */}
          <select
            value={filterOptions.method}
            onChange={(e) => handleFilterChange('method', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          {/* Status code filter */}
          <select
            value={filterOptions.statusCode || ''}
            onChange={(e) => handleFilterChange('statusCode', e.target.value ? parseInt(e.target.value) : undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status Codes</option>
            <option value="200">200 OK</option>
            <option value="201">201 Created</option>
            <option value="400">400 Bad Request</option>
            <option value="401">401 Unauthorized</option>
            <option value="404">404 Not Found</option>
            <option value="500">500 Internal Server Error</option>
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={filterOptions.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Clear filters button */}
        {(filterOptions.type !== 'all' || filterOptions.method || filterOptions.statusCode || filterOptions.search) && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2">No entries found</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onEntrySelect(entry.id)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedEntryId === entry.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <EntryTypeBadge type={entry.type} size="sm" />
                      {entry.request && (
                        <HttpMethodBadge method={entry.request.method} size="sm" />
                      )}
                      {entry.response && (
                        <StatusCodeBadge statusCode={entry.response.statusCode} size="sm" />
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-900 truncate">
                      {entry.request?.url || entry.exception?.message || 'No details available'}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{apiUtils.formatTimestamp(entry.timestamp)}</span>
                      <span>{entry.ip}</span>
                      {entry.response?.responseTime && (
                        <span>{apiUtils.formatResponseTime(entry.response.responseTime)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 