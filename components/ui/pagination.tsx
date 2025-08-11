"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showTotal?: boolean;
  className?: string;
}

export function Pagination({
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 48, 96],
  showPageSizeSelector = true,
  showTotal = true,
  className = "",
}: PaginationProps) {
  const { page, pageSize, pageCount, total } = meta;

  // Calculate range of products being shown
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (pageCount <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(pageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < pageCount - 2) {
        pages.push("...");
      }

      // Show last page
      if (pageCount > 1) {
        pages.push(pageCount);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Total count and range */}
      {showTotal && (
        <div className="text-sm text-muted">
          Mostrando {startItem}-{endItem} de {total} productos
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => (
            <div key={index}>
              {pageNum === "..." ? (
                <span className="px-2 py-1 text-sm text-muted">...</span>
              ) : (
                <Button
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum as number)}
                  className={`h-8 w-8 p-0 ${pageNum === page ? "text-white hover:text-main hover:border-main border-main" : "text-main hover:text-white hover:bg-primary"}`}
                >
                  {pageNum}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageCount)}
          disabled={page === pageCount}
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page size selector */}
      {showPageSizeSelector && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">Mostrar:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
