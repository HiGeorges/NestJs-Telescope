import { useState, useEffect } from 'react';
import { EntryTable } from '../components/EntryTable';
import type { EntryTableColumn } from '../components/EntryTable';
import { EntryFilters } from '../components/EntryFilters';
import RequestDetailModal from '../components/RequestDetailModal';
import type { Request } from '../components/RequestDetailModal';
import { Badge } from '../components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { getEntries } from '../services/api';

// Define TelescopeEntry type for API response
interface RequestDetails {
  method: string;
  url: string;
  path: string;
  query: Record<string, unknown>;
  params: Record<string, unknown>;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  body: unknown;
  ip: string;
  userAgent: string;
  referer?: string;
  origin?: string;
  hostname: string;
  protocol: string;
  timestamp: Date;
}

interface ResponseDetails {
  statusCode: number;
  statusMessage: string;
  headers: Record<string, string>;
  body: unknown;
  responseTime: number;
}

interface TelescopeEntry {
  id: string;
  type: 'request' | 'exception';
  timestamp: string;
  method?: string;
  path?: string;
  status?: number;
  duration?: number;
  request?: RequestDetails;
  response?: ResponseDetails;
}

const filterOptions = [
  {
    key: 'method',
    label: 'Method',
    options: [
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
      { value: 'PUT', label: 'PUT' },
      { value: 'DELETE', label: 'DELETE' },
      { value: 'PATCH', label: 'PATCH' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: '2xx', label: '2xx Success' },
      { value: '3xx', label: '3xx Redirect' },
      { value: '4xx', label: '4xx Error' },
      { value: '5xx', label: '5xx Error' },
    ],
  },
  {
    key: 'timeRange',
    label: 'Time',
    options: [
      { value: '1h', label: 'Last hour' },
      { value: '24h', label: 'Last 24h' },
      { value: '7d', label: 'Last 7 days' },
    ],
  },
];

const columns: EntryTableColumn<Request>[] = [
  {
    label: 'Method',
    accessor: 'method',
    render: (value) => <Badge className={`text-xs font-mono font-bold ${
      value === 'GET' ? 'bg-blue-600 text-white' :
      value === 'POST' ? 'bg-green-600 text-white' :
      value === 'PUT' ? 'bg-yellow-600 text-white' :
      value === 'DELETE' ? 'bg-red-600 text-white' :
      value === 'PATCH' ? 'bg-purple-600 text-white' :
      'bg-gray-600 text-white'
    }`}>{value}</Badge>,
  },
  { label: 'URL', accessor: 'url', render: (v) => <span className="text-white font-semibold">{v}</span> },
  {
    label: 'Status',
    accessor: 'status',
    render: (value) => <Badge variant={
      value >= 200 && value < 300 ? 'success' :
      value >= 300 && value < 400 ? 'info' :
      value >= 400 && value < 500 ? 'warning' :
      value >= 500 ? 'danger' : 'default'
    } className="text-xs">{value}</Badge>,
  },
  { label: 'Duration', accessor: 'duration', render: (v) => <span className="text-gray-300 text-sm">{v}ms</span> },
  { label: 'IP', accessor: 'ip', render: (v) => <span className="text-gray-400 text-sm font-mono">{v}</span> },
  { label: 'Time', accessor: 'timestamp', render: (v) => <span className="text-gray-400 text-sm">{formatDistanceToNow(v, { addSuffix: true })}</span> },
];

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    method: undefined,
    status: undefined,
    timeRange: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const entries: TelescopeEntry[] = await getEntries();
      const reqs = entries
        .filter((e: TelescopeEntry) => e.type === 'request')
        .map((e: TelescopeEntry) => ({
          id: e.id,
          method: e.method || e.request?.method || '',
          url: e.path || e.request?.url || '',
          status: e.status || e.response?.statusCode || 0,
          duration: e.duration || e.response?.responseTime || 0,
          timestamp: new Date(e.timestamp),
          ip: e.request?.ip || '',
          userAgent: e.request?.userAgent || '',
          headers: e.request?.headers || {},
          query: Object.fromEntries(Object.entries(e.request?.query || {}).map(([k, v]) => [k, String(v)])),
          body: e.request?.body,
          response: e.response?.body,
        }));
      setRequests(reqs);
      setFilteredRequests(reqs);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load requests');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;
    if (searchValue) {
      filtered = filtered.filter(req =>
        req.url?.toLowerCase().includes(searchValue.toLowerCase()) ||
        req.method?.toLowerCase().includes(searchValue.toLowerCase()) ||
        req.ip?.includes(searchValue)
      );
    }
    if (filters.method) {
      filtered = filtered.filter(req => req.method === filters.method);
    }
    if (filters.status) {
      const statusRange = filters.status;
      filtered = filtered.filter(req => {
        const status = req.status;
        if (statusRange === '2xx') return status >= 200 && status < 300;
        if (statusRange === '3xx') return status >= 300 && status < 400;
        if (statusRange === '4xx') return status >= 400 && status < 500;
        if (statusRange === '5xx') return status >= 500;
        return true;
      });
    }
    if (filters.timeRange) {
      const now = Date.now();
      const ranges = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
      };
      const range = ranges[filters.timeRange as keyof typeof ranges];
      if (range) {
        filtered = filtered.filter(req =>
          now - req.timestamp.getTime() <= range
        );
      }
    }
    setFilteredRequests(filtered);
  }, [requests, searchValue, filters]);

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  const handleClearAllFilters = () => {
    setFilters({ method: undefined, status: undefined, timeRange: undefined });
    setSearchValue('');
  };
  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };
  const handleRefresh = () => {
    fetchRequests();
  };

  return (
    <div className="flex-1 bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-white">HTTP Requests</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
      <div className="p-6">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <EntryFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAllFilters}
          filterOptions={filterOptions}
        />
        <EntryTable
          entries={filteredRequests}
          columns={columns}
          onRowClick={handleRequestClick}
        />
        <RequestDetailModal
          request={selectedRequest}
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      </div>
    </div>
  );
} 