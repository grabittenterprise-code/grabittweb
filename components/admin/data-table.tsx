type Column<T> = {
  key: string;
  title: string;
  render: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  items: T[];
  columns: Column<T>[];
  emptyLabel?: string;
};

export function DataTable<T>({ items, columns, emptyLabel = "No records found." }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-white/[0.03]">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium text-white/70">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, rowIndex) => (
            <tr key={rowIndex} className="border-b border-white/5 last:border-b-0">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-white/85">
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-white/55" colSpan={columns.length}>
                {emptyLabel}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
