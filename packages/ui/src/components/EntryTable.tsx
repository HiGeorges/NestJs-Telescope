export interface EntryTableColumn<T> {
  label: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
}

interface EntryTableProps<T> {
  entries: T[];
  columns: EntryTableColumn<T>[];
  onRowClick?: (row: T) => void;
}

export function EntryTable<T extends { id: string }>({ entries, columns, onRowClick }: EntryTableProps<T>) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              {columns.map(col => (
                <th key={col.label} className="text-left p-4 text-sm font-medium text-gray-300">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                  No entries found
                </td>
              </tr>
            ) : (
              entries.map(row => (
                <tr
                  key={row.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map(col => (
                    <td key={col.label} className="p-4">
                      {col.render ? col.render(row[col.accessor], row) : String(row[col.accessor])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 