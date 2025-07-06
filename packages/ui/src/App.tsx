/**
 * Telescope App Component
 * 
 * Main application component for the NestJS Telescope debugging interface.
 * Provides a comprehensive view of HTTP requests, responses, and exceptions
 * captured by the Telescope backend with real-time updates and filtering.
 */

import React, { useState } from 'react';
import SidebarLayout from './layouts/SidebarLayout';
import Header from './layouts/Header';
import { RequestsList } from './components/RequestsList';
import { RequestDetails } from './components/RequestDetails';
import { useTelescopeData } from './hooks/useTelescopeData';
import type { TelescopeEntry } from './types';

/**
 * Telescope App Component
 */
export const App: React.FC = () => {
  // State for selected entry
  const [selectedEntry, setSelectedEntry] = useState<TelescopeEntry | null>(null);
  
  // Custom hook for telescope data
  const {
    entries,
    stats,
    isLoading,
    error,
    refresh,
    clearEntries,
  } = useTelescopeData();

  /**
   * Handle entry selection
   */
  const handleEntrySelect = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    setSelectedEntry(entry || null);
  };

  /**
   * Handle close details
   */
  const handleCloseDetails = () => {
    setSelectedEntry(null);
  };

  /**
   * Handle clear entries
   */
  const handleClearEntries = async () => {
    try {
      await clearEntries();
      setSelectedEntry(null);
    } catch (error) {
      console.error('Failed to clear entries:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      <SidebarLayout
        header={
          <Header
            stats={stats}
            onClearEntries={handleClearEntries}
            isLoading={isLoading}
          />
        }
        sidebar={
          <RequestsList
            entries={entries}
            selectedEntryId={selectedEntry?.id}
            onEntrySelect={handleEntrySelect}
            onClearEntries={handleClearEntries}
            isLoading={isLoading}
          />
        }
      >
        {error ? (
          <ErrorDisplay error={error} onRetry={refresh} />
        ) : selectedEntry ? (
          <RequestDetails
            entry={selectedEntry}
            onClose={handleCloseDetails}
          />
        ) : (
          <EmptyState />
        )}
      </SidebarLayout>
    </div>
  );
};

/**
 * Error Display Component
 */
const ErrorDisplay: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 text-red-500 mb-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
      <p className="text-gray-500 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Retry
      </button>
    </div>
  </div>
);

/**
 * Empty State Component
 */
const EmptyState: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Entry Selected</h3>
      <p className="text-gray-500">
        Select an entry from the list to view its details
      </p>
    </div>
  </div>
);

export default App;
