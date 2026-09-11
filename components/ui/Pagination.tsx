import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 disabled:opacity-50 text-gray-500"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <div key={`dots-${index}`} className="flex h-8 w-8 items-center justify-center text-gray-400">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 disabled:opacity-50 text-gray-500"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
