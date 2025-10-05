// components/PaginationControls.tsx
'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationControlsProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button (Icon Only) */}
        <PaginationItem>
          <PaginationLink
            href={`${baseUrl}?page=${currentPage - 1}`}
            className={cn(!hasPreviousPage && 'pointer-events-none opacity-50')}
            aria-disabled={!hasPreviousPage}
            tabIndex={hasPreviousPage ? undefined : -1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        {/* Page Number Indicator */}
        <PaginationItem>
          <span className="px-4 py-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>

        {/* Next Button (Icon Only) */}
        <PaginationItem>
          <PaginationLink
            href={`${baseUrl}?page=${currentPage + 1}`}
            className={cn(!hasNextPage && 'pointer-events-none opacity-50')}
            aria-disabled={!hasNextPage}
            tabIndex={hasNextPage ? undefined : -1}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}