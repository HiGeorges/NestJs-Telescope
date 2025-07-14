import { useEffect, useRef, useState } from 'react';
import { Badge } from './ui/Badge';

export interface Request {
  id: string;
  method: string;
  url: string;
  status: number;
  duration: number;
  timestamp: Date;
  ip: string;
  userAgent?: string;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  body?: any;
  response?: any;
}

interface RequestDetailModalProps {
  open: boolean;
  onClose: () => void;
  request: Request | null;
}

const tabs = ['Request', 'Response', 'Headers', 'Query'] as const;
type Tab = typeof tabs[number];

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 rounded-t-md font-medium text-sm focus:outline-none transition-colors ${
      active ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400 hover:text-white'
    }`}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
);

const Section: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-4">
    <div className="text-xs text-gray-400 mb-1">{label}</div>
    <div className="bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm break-all">{children}</div>
  </div>
);

const RequestDetailModal: React.FC<RequestDetailModalProps> = ({ open, onClose, request }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Request');

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [open]);

  useEffect(() => {
    setActiveTab('Request');
  }, [request]);

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  if (!open || !request) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={e => {
        if (e.target === overlayRef.current) onClose();
      }}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div className="relative w-full max-w-3xl mx-4 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Header */}
        <div className="px-8 pt-8 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <Badge className={`text-xs font-mono font-bold ${
              request.method === 'GET' ? 'bg-blue-600 text-white' :
              request.method === 'POST' ? 'bg-green-600 text-white' :
              request.method === 'PUT' ? 'bg-yellow-600 text-white' :
              request.method === 'DELETE' ? 'bg-red-600 text-white' :
              request.method === 'PATCH' ? 'bg-purple-600 text-white' :
              'bg-gray-600 text-white'
            }`}>{request.method}</Badge>
            <span className="text-lg font-bold text-white">{request.url}</span>
            <Badge variant={
              request.status >= 200 && request.status < 300 ? 'success' :
              request.status >= 300 && request.status < 400 ? 'info' :
              request.status >= 400 && request.status < 500 ? 'warning' :
              request.status >= 500 ? 'danger' : 'default'
            } className="text-xs ml-2">{request.status}</Badge>
          </div>
          <div className="flex flex-wrap gap-6 text-xs text-gray-400">
            <span>Duration: <span className="text-gray-200 font-medium">{request.duration}ms</span></span>
            <span>IP: <span className="text-gray-200 font-medium">{request.ip}</span></span>
            <span>Time: <span className="text-gray-200 font-medium">{new Date(request.timestamp).toLocaleString()}</span></span>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 px-8 pt-4 border-b border-gray-800">
          {tabs.map(tab => (
            <TabButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</TabButton>
          ))}
        </div>
        {/* Tab content */}
        <div className="px-8 py-6">
          {activeTab === 'Request' && (
            <>
              <Section label="Body">
                {request.body ? (
                  <pre className="whitespace-pre-wrap break-all">{typeof request.body === 'string' ? request.body : JSON.stringify(request.body, null, 2)}</pre>
                ) : 'No data'}
              </Section>
              <Section label="User Agent">
                {request.userAgent || 'N/A'}
              </Section>
            </>
          )}
          {activeTab === 'Response' && (
            <Section label="Response">
              {request.response ? (
                <pre className="whitespace-pre-wrap break-all">{typeof request.response === 'string' ? request.response : JSON.stringify(request.response, null, 2)}</pre>
              ) : 'No data'}
            </Section>
          )}
          {activeTab === 'Headers' && (
            <Section label="Headers">
              {request.headers ? (
                <pre className="whitespace-pre-wrap break-all">{JSON.stringify(request.headers, null, 2)}</pre>
              ) : 'No data'}
            </Section>
          )}
          {activeTab === 'Query' && (
            <Section label="Query Params">
              {request.query ? (
                <pre className="whitespace-pre-wrap break-all">{JSON.stringify(request.query, null, 2)}</pre>
              ) : 'No data'}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal; 