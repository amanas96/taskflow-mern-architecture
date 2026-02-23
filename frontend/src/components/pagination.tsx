"use client";

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationComponent({
  page,
  pages,
  onPageChange,
}: PaginationProps) {
  if (pages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-8">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-sm text-gray-600">
        Page {page} of {pages}
      </span>

      <button
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
