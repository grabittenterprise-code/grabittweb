type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (nextPage: number) => void;
};

export function AdminPagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/75 disabled:opacity-40"
      >
        Prev
      </button>
      <span className="text-xs text-white/60">
        Page {page} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/75 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
