import { useState, useEffect } from 'react';
import { EntryTable } from '../components/EntryTable';
import type { EntryTableColumn } from '../components/EntryTable';
import { EntryFilters } from '../components/EntryFilters';
import ExceptionDetailModal from '../components/ExceptionDetailModal';
import { Badge } from '../components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';

// Mock data for demonstration
const mockExceptions = [
  {
    id: 'e1',
    name: 'NotFoundException',
    message: 'User not found',
    status: 404,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    ip: '192.168.1.200',
    stack: 'Error: User not found\n    at ...',
    context: { userId: 123 },
  },
  {
    id: 'e2',
    name: 'UnauthorizedException',
    message: 'Invalid token',
    status: 401,
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    ip: '192.168.1.201',
    stack: 'Error: Invalid token\n    at ...',
    context: { token: '***' },
  },
  {
    id: 'e3',
    name: 'InternalServerError',
    message: 'Database connection failed',
    status: 500,
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    ip: '192.168.1.202',
    stack: 'Error: Database connection failed\n    at ...',
    context: { db: 'main' },
  },
];

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

const columns: EntryTableColumn<typeof mockExceptions[0]>[] = [
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
  const [exceptions] = useState(mockExceptions);
  const [filteredExceptions, setFilteredExceptions] = useState(mockExceptions);
  const [selectedException, setSelectedException] = useState<typeof mockExceptions[0] | null>(null);
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
  const handleExceptionClick = (exception: typeof mockExceptions[0]) => {
    setSelectedException(exception);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="flex-1 bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-white">Exceptions</h1>
      </div>
      <div className="p-6">
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
      </div>
    </div>
  );
} 