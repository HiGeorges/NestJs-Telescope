import { useState, useEffect } from 'react';
import type { TelescopeEntry } from '../types';
import { EntryTable } from '../components/EntryTable';
import type { EntryTableColumn } from '../components/EntryTable';
import { EntryFilters } from '../components/EntryFilters';
import { Badge } from '../components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import ExceptionDetailModal from '../components/ExceptionDetailModal';

// Loads exceptions from the API and provides loading/error state
function useExceptionsData() {
  const [exceptions, setExceptions] = useState<ExceptionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/telescope/api/entries')
      .then(res => res.json())
      .then(data => {
        // Filter and adapt exceptions from the API response
        const exceptions = (data as TelescopeEntry[] || [])
          .filter((e) => e.type === 'exception')
          .map((e) => ({
            id: e.id,
            name: e.exception?.name || 'Exception',
            message: e.exception?.message || '',
            status: typeof e.exception?.context?.statusCode === 'number' ? e.exception.context.statusCode : 500,
            timestamp: new Date(e.timestamp),
            ip: typeof (e.request && (e.request as any).ip) === 'string' ? (e.request as any).ip : '',
            stack: e.exception?.stack || '',
            context: e.exception?.context || {},
          }));
        setExceptions(exceptions);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load exceptions');
        setLoading(false);
      });
  }, []);

  return { exceptions, loading, error };
}

const filterOptions = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: '4xx', label: '4xx Client Error' },
      { value: '5xx', label: '5xx Server Error' },
    ],
  },
];

type ExceptionListItem = {
  id: string;
  name: string;
  message: string;
  status: number;
  timestamp: Date;
  ip: string;
  stack: string;
  context: Record<string, unknown>;
};

const columns: EntryTableColumn<ExceptionListItem>[] = [
  {
    label: 'Name',
    accessor: 'name',
    render: (v) => <span className="text-white font-semibold">{v}</span>,
  },
  {
    label: 'Message',
    accessor: 'message',
    render: (v) => <span className="text-gray-200">{v}</span>,
  },
  {
    label: 'Status',
    accessor: 'status',
    render: (value) => <Badge variant={
      value >= 400 && value < 500 ? 'warning' :
      value >= 500 ? 'danger' : 'default'
    } className="text-xs font-bold">{value}</Badge>,
  },
  {
    label: 'IP',
    accessor: 'ip',
    render: (v) => <span className="text-gray-400 text-sm font-mono">{v}</span>,
  },
  {
    label: 'Time',
    accessor: 'timestamp',
    render: (v) => <span className="text-gray-400 text-sm">{formatDistanceToNow(v, { addSuffix: true })}</span>,
  },
];

export default function Exceptions() {
  const { exceptions, loading, error } = useExceptionsData();
  const [filteredExceptions, setFilteredExceptions] = useState<ExceptionListItem[]>([]);
  const [selectedException, setSelectedException] = useState<ExceptionListItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({ status: undefined });

  useEffect(() => {
    let filtered = exceptions;
    if (filters.status) {
      filtered = filtered.filter(e => {
        const status = e.status;
        if (filters.status === '4xx') return status >= 400 && status < 500;
        if (filters.status === '5xx') return status >= 500;
        return true;
      });
    }
    setFilteredExceptions(filtered);
  }, [exceptions, filters]);

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  const handleClearAllFilters = () => {
    setFilters({ status: undefined });
  };
  const handleExceptionClick = (exception: ExceptionListItem) => {
    setSelectedException(exception);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="flex-1 bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-white">Exceptions</h1>
      </div>
      <div className="p-6">
        {loading && <div className="text-gray-400">Loading exceptions...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <>
            <EntryFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAllFilters}
              filterOptions={filterOptions}
            />
            <EntryTable
              entries={filteredExceptions}
              columns={columns}
              onRowClick={handleExceptionClick}
            />
            <ExceptionDetailModal
              exception={selectedException}
              open={isDetailModalOpen}
              onClose={() => setIsDetailModalOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
} 