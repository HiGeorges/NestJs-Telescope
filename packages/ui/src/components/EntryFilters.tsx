import { Filter, X } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface EntryFiltersProps {
  filters: Record<string, string | undefined>;
  onFilterChange: (key: string, value: string | undefined) => void;
  onClearAll: () => void;
  filterOptions: FilterOption[];
}

export function EntryFilters({ filters, onFilterChange, onClearAll, filterOptions }: EntryFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Filters:</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {filterOptions.map(opt => (
            <div className="flex items-center gap-2" key={opt.key}>
              <label className="text-sm text-gray-400">{opt.label}:</label>
              <select
                value={filters[opt.key] || ''}
                onChange={e => onFilterChange(opt.key, e.target.value === 'all' ? undefined : e.target.value)}
                className="w-32 bg-gray-800 border border-gray-700 text-gray-200 rounded-md py-1 px-2"
              >
                <option value="all">All</option>
                {opt.options.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md px-3 py-1 flex items-center gap-1 text-sm"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 