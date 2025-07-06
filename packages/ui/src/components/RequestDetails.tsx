/**
 * Request Details Component
 * 
 * Displays detailed information about a telescope entry including request/response data,
 * headers, body content, and exception details. Provides a comprehensive view for
 * debugging and monitoring purposes.
 */

import React, { useState } from 'react';
import type { RequestDetailsProps, TelescopeEntry } from '../types';
import { Button } from './ui/Button';
import { HttpMethodBadge, StatusCodeBadge, EntryTypeBadge } from './ui/Badge';
import { apiUtils } from '../services/api';

/**
 * Tab types for the details view
 */
type DetailTab = 'overview' | 'request' | 'response' | 'headers' | 'body' | 'exception';

/**
 * Format JSON for display
 */
const formatJson = (data: unknown): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
};

/**
 * Request Details Component
 */
export const RequestDetails: React.FC<RequestDetailsProps> = ({
  entry,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  /**
   * Get available tabs based on entry type
   */
  const getAvailableTabs = (): DetailTab[] => {
    const tabs: DetailTab[] = ['overview'];
    
    if (entry.type === 'request') {
      tabs.push('request', 'response', 'headers', 'body');
    } else if (entry.type === 'exception') {
      tabs.push('exception');
    }
    
    return tabs;
  };

  /**
   * Render tab content
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab entry={entry} />;
      case 'request':
        return <RequestTab entry={entry} />;
      case 'response':
        return <ResponseTab entry={entry} />;
      case 'headers':
        return <HeadersTab entry={entry} />;
      case 'body':
        return <BodyTab entry={entry} />;
      case 'exception':
        return <ExceptionTab entry={entry} />;
      default:
        return <OverviewTab entry={entry} />;
    }
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <EntryTypeBadge type={entry.type} />
          {entry.request && <HttpMethodBadge method={entry.request.method} />}
          {entry.response && <StatusCodeBadge statusCode={entry.response.statusCode} />}
          <span className="text-sm text-gray-500">#{entry.id}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        >
          Close
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

/**
 * Overview Tab Component
 */
const OverviewTab: React.FC<{ entry: TelescopeEntry }> = ({ entry }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        <dl className="space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Entry ID</dt>
            <dd className="text-sm text-gray-900 font-mono">{entry.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Type</dt>
            <dd className="text-sm text-gray-900">
              <EntryTypeBadge type={entry.type} size="sm" />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
            <dd className="text-sm text-gray-900">{apiUtils.formatTimestamp(entry.timestamp)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">IP Address</dt>
            <dd className="text-sm text-gray-900 font-mono">{entry.ip}</dd>
          </div>
        </dl>
      </div>

      {/* Request/Response Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {entry.type === 'request' ? 'Request Details' : 'Exception Details'}
        </h3>
        <dl className="space-y-2">
          {entry.request && (
            <>
              <div>
                <dt className="text-sm font-medium text-gray-500">Method</dt>
                <dd className="text-sm text-gray-900">
                  <HttpMethodBadge method={entry.request.method} size="sm" />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">URL</dt>
                <dd className="text-sm text-gray-900 font-mono break-all">{entry.request.url}</dd>
              </div>
            </>
          )}
          {entry.response && (
            <>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status Code</dt>
                <dd className="text-sm text-gray-900">
                  <StatusCodeBadge statusCode={entry.response.statusCode} size="sm" />
                </dd>
              </div>
              {entry.response.responseTime && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Response Time</dt>
                  <dd className="text-sm text-gray-900">{apiUtils.formatResponseTime(entry.response.responseTime)}</dd>
                </div>
              )}
            </>
          )}
          {entry.exception && (
            <>
              <div>
                <dt className="text-sm font-medium text-gray-500">Exception Name</dt>
                <dd className="text-sm text-gray-900 font-mono">{entry.exception.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Message</dt>
                <dd className="text-sm text-gray-900">{entry.exception.message}</dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </div>

    {/* User Agent */}
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-gray-900">User Agent</h3>
      <div className="bg-gray-50 p-3 rounded-md">
        <code className="text-sm text-gray-700 break-all">{entry.userAgent}</code>
      </div>
    </div>
  </div>
);

/**
 * Request Tab Component
 */
const RequestTab: React.FC<{ entry: TelescopeEntry }> = ({ entry }) => {
  if (!entry.request) return <div>No request data available</div>;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Request URL</h3>
        <div className="bg-gray-50 p-3 rounded-md">
          <code className="text-sm text-gray-700 break-all">{entry.request.url}</code>
        </div>
      </div>

      {entry.request.query && Object.keys(entry.request.query).length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Query Parameters</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {formatJson(entry.request.query)}
            </pre>
          </div>
        </div>
      )}

      {entry.request.body !== undefined && entry.request.body !== null && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Request Body</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {formatJson(entry.request.body)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Response Tab Component
 */
const ResponseTab: React.FC<{ entry: TelescopeEntry }> = ({ entry }) => {
  if (!entry.response) return <div>No response data available</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Status Code</h3>
          <StatusCodeBadge statusCode={entry.response.statusCode} size="lg" />
        </div>
        {entry.response.responseTime && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Response Time</h3>
            <div className="text-2xl font-mono text-gray-700">
              {apiUtils.formatResponseTime(entry.response.responseTime)}
            </div>
          </div>
        )}
      </div>

      {entry.response.body !== undefined && entry.response.body !== null && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Response Body</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {formatJson(entry.response.body)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Headers Tab Component
 */
const HeadersTab: React.FC<{ entry: TelescopeEntry }> = ({ entry }) => {
  const requestHeaders = entry.request?.headers || {};
  const responseHeaders = entry.response?.headers || {};

  return (
    <div className="space-y-6">
      {Object.keys(requestHeaders).length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Request Headers</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <dl className="space-y-1">
              {Object.entries(requestHeaders).map(([key, value]) => (
                <div key={key} className="flex">
                  <dt className="text-sm font-medium text-gray-500 w-1/3">{key}:</dt>
                  <dd className="text-sm text-gray-700 flex-1 break-all">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {Object.keys(responseHeaders).length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Response Headers</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <dl className="space-y-1">
              {Object.entries(responseHeaders).map(([key, value]) => (
                <div key={key} className="flex">
                  <dt className="text-sm font-medium text-gray-500 w-1/3">{key}:</dt>
                  <dd className="text-sm text-gray-700 flex-1 break-all">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {Object.keys(requestHeaders).length === 0 && Object.keys(responseHeaders).length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No headers available
        </div>
      )}
    </div>
  );
};

/**
 * Body Tab Component
 */
const BodyTab: React.FC<{ entry: TelescopeEntry }> = ({ entry }) => {
  const requestBody = entry.request?.body;
  const responseBody = entry.response?.body;

  return (
    <div className="space-y-6">
      {requestBody !== undefined && requestBody !== null && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Request Body</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {formatJson(requestBody)}
            </pre>
          </div>
        </div>
      )}

      {responseBody !== undefined && responseBody !== null && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Response Body</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {formatJson(responseBody)}
            </pre>
          </div>
        </div>
      )}

      {!requestBody && !responseBody && (
        <div className="text-center text-gray-500 py-8">
          No body content available
        </div>
      )}
    </div>
  );
};

/**
 * Exception Tab Component
 */
const ExceptionTab: React.FC<{ entry: TelescopeEntry }> = ({ entry }) => {
  if (!entry.exception) return <div>No exception data available</div>;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Exception Name</h3>
        <div className="bg-red-50 p-3 rounded-md">
          <code className="text-sm text-red-700 font-mono">{entry.exception.name}</code>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Exception Message</h3>
        <div className="bg-red-50 p-3 rounded-md">
          <p className="text-sm text-red-700">{entry.exception.message}</p>
        </div>
      </div>

      {entry.exception.stack && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Stack Trace</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">
              {entry.exception.stack}
            </pre>
          </div>
        </div>
      )}

      {entry.exception.context && Object.keys(entry.exception.context).length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Context</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {formatJson(entry.exception.context)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}; 