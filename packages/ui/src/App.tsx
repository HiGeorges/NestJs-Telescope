import { useState, useEffect } from 'react';
import SidebarLayout from './layouts/SidebarLayout';
import RequestsList from './components/RequestsList';
import RequestDetails from './components/RequestDetails';

export interface RequestDetails {
  method: string;
  url: string;
  path: string;
  query: Record<string, any>;
  params: Record<string, any>;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  body: any;
  ip: string;
  userAgent: string;
  referer?: string;
  origin?: string;
  hostname: string;
  protocol: string;
  timestamp: Date;
}

export interface ResponseDetails {
  statusCode: number;
  statusMessage: string;
  headers: Record<string, string>;
  body: any;
  responseTime: number;
}

export interface TelescopeEntry {
  id: string;
  type: 'request' | 'exception';
  timestamp: Date;
  
  // Request details
  request?: RequestDetails;
  
  // Response details (for requests)
  response?: ResponseDetails;
  
  // Legacy fields for backward compatibility
  method?: string;
  path?: string;
  statusCode?: number;
  duration?: number;
  message?: string;
  headers?: Record<string, string>;
  body?: any;
  stack?: string;
}

export default function App() {
  const [entries, setEntries] = useState<TelescopeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<TelescopeEntry | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/telescope/api/entries')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        // Adapter le mapping pour la compatibilité
        setEntries(
          data.map((e: any) => ({
            ...e,
            // Assurer la compatibilité avec les champs legacy
            method: e.method || e.request?.method,
            path: e.path || e.request?.path,
            statusCode: e.statusCode || e.status || e.response?.statusCode,
            duration: e.duration || e.response?.responseTime,
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des requêtes');
        setLoading(false);
      });
  }, []);

  return (
    <SidebarLayout>
      {loading && <div className="text-center text-gray-500 py-8">Chargement...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      {!loading && !error && (
        <RequestsList
          requests={entries}
          onSelect={setSelectedRequest}
          selectedId={selectedRequest?.id}
        />
      )}
      {selectedRequest && <RequestDetails entry={selectedRequest} />}
    </SidebarLayout>
  );
}
