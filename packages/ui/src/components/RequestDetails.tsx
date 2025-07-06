import { useState } from 'react';
import type { TelescopeEntry } from '../App';

interface RequestDetailsProps {
  entry: TelescopeEntry;
}

const tabs = ['Request', 'Response', 'Headers', 'Query', 'Body'];

export default function RequestDetails({ entry }: RequestDetailsProps) {
  const [activeTab, setActiveTab] = useState('Request');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Request':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400">ID</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{entry.id}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Méthode</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{entry.method}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Path</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{entry.path}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Status</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{entry.statusCode}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Durée</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{entry.duration} ms</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">IP</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{entry.request?.ip || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">User Agent</div>
              <div className="font-mono text-gray-800 dark:text-gray-100 text-xs truncate">{entry.request?.userAgent || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Timestamp</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">
                {entry.timestamp instanceof Date ? entry.timestamp.toISOString() : String(entry.timestamp)}
              </div>
            </div>
          </div>
        );

      case 'Response':
        return (
          <div className="space-y-4">
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-2">Status</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">
                {entry.response?.statusCode} {entry.response?.statusMessage}
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-2">Response Time</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">
                {entry.response?.responseTime} ms
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-2">Response Body</div>
              <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(entry.response?.body, null, 2) || 'No response body'}
              </pre>
            </div>
          </div>
        );

      case 'Headers':
        return (
          <div>
            <div className="text-gray-500 dark:text-gray-400 mb-2">Request Headers</div>
            <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(entry.request?.headers, null, 2) || 'No headers'}
            </pre>
          </div>
        );

      case 'Query':
        return (
          <div>
            <div className="text-gray-500 dark:text-gray-400 mb-2">Query Parameters</div>
            <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(entry.request?.query, null, 2) || 'No query parameters'}
            </pre>
          </div>
        );

      case 'Body':
        return (
          <div>
            <div className="text-gray-500 dark:text-gray-400 mb-2">Request Body</div>
            <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(entry.request?.body, null, 2) || 'No request body'}
            </pre>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white dark:bg-gray-950 rounded-xl shadow border border-gray-200 dark:border-gray-800">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 px-6 pt-4">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-t transition-colors
                ${activeTab === tab
                  ? 'bg-gray-100 dark:bg-gray-900 text-blue-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600'}
              `}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 