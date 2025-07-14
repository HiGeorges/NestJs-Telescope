import { useEffect, useRef, useState } from 'react';

interface ExceptionDetailModalProps {
  open: boolean;
  onClose: () => void;
  exception: any | null;
}

const tabs = ['Exception', 'Stack', 'Context'] as const;
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

const ExceptionDetailModal: React.FC<ExceptionDetailModalProps> = ({ open, onClose, exception }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Exception');

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [open]);

  useEffect(() => {
    setActiveTab('Exception');
  }, [exception]);

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  if (!open || !exception) return null;

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
      <div className="relative w-full max-w-2xl mx-4 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
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
            <span className="text-lg font-bold text-white">{exception.name}</span>
            <span className="text-xs bg-yellow-700 text-white rounded px-2 py-0.5 ml-2">{exception.status}</span>
          </div>
          <div className="flex flex-wrap gap-6 text-xs text-gray-400">
            <span>IP: <span className="text-gray-200 font-medium">{exception.ip}</span></span>
            <span>Time: <span className="text-gray-200 font-medium">{new Date(exception.timestamp).toLocaleString()}</span></span>
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
          {activeTab === 'Exception' && (
            <>
              <Section label="Message">
                {exception.message}
              </Section>
            </>
          )}
          {activeTab === 'Stack' && (
            <Section label="Stack Trace">
              <pre className="whitespace-pre-wrap break-all">{exception.stack}</pre>
            </Section>
          )}
          {activeTab === 'Context' && (
            <Section label="Context">
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(exception.context, null, 2)}</pre>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExceptionDetailModal; 