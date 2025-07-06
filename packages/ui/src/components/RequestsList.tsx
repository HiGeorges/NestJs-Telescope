import type { TelescopeEntry } from '../App';

interface RequestsListProps {
  requests: TelescopeEntry[];
  selectedId?: string;
  onSelect?: (req: TelescopeEntry) => void;
}

function statusColor(status: number) {
  if (status >= 200 && status < 300) return 'bg-green-100 text-green-700';
  if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-700';
  if (status >= 500) return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
}

function methodColor(method: string) {
  if (method === 'POST') return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-700';
}

export default function RequestsList({ requests, selectedId, onSelect }: RequestsListProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-950 rounded-xl shadow border border-gray-200 dark:border-gray-800 mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="font-semibold text-gray-800 dark:text-gray-100 text-base">Requests</span>
          {/* Search input peut être ajouté ici si besoin */}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              <th className="px-6 py-2 text-left font-medium">Verb</th>
              <th className="px-6 py-2 text-left font-medium">Path</th>
              <th className="px-6 py-2 text-left font-medium">Status</th>
              <th className="px-6 py-2 text-left font-medium">Duration</th>
              <th className="px-6 py-2 text-left font-medium">Timestamp</th>
              <th className="px-6 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr
                key={req.id}
                className={`border-t border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-gray-800 transition cursor-pointer ${selectedId === req.id ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
                onClick={() => onSelect?.(req)}
              >
                <td className="px-6 py-2">
                  <span className={`px-2 py-0.5 rounded font-bold text-xs ${methodColor(req.method || 'GET')}`}>{req.method || 'GET'}</span>
                </td>
                <td className="px-6 py-2 text-gray-800 dark:text-gray-100 font-mono">{req.path}</td>
                <td className="px-6 py-2">
                  <span className={`px-2 py-0.5 rounded font-bold text-xs ${statusColor(req.statusCode || 0)}`}>{req.statusCode || 0}</span>
                </td>
                <td className="px-6 py-2 text-gray-700 dark:text-gray-300">{req.duration}ms</td>
                <td className="px-6 py-2 text-gray-500 dark:text-gray-400">
                  {req.timestamp instanceof Date ? req.timestamp.toISOString() : String(req.timestamp)}
                </td>
                <td className="px-6 py-2 text-right">
                  <span className="i-mdi:chevron-right text-xl text-gray-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 