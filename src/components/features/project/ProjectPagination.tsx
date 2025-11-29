"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/shadcn/Pagination";

interface ProjectPaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export default function ProjectPagination({
  currentPage,
  totalPage,
  onPageChange,
}: ProjectPaginationProps) {
  const PAGE_GROUP_SIZE = 10;
  const currentGroup = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE);
  const startPage = currentGroup * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPage);

  const hasPrevGroup = startPage > 1;
  const hasNextGroup = endPage < totalPage;

  const prevGroupPage = startPage - 1;
  const nextGroupPage = endPage + 1;

  return (
    <Pagination className="mx-auto mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            // href={currentPage > 1 ? buildPageUrl(prevGroupPage) : undefined}
            onClick={() => currentPage > 1 && onPageChange(prevGroupPage)}
            className={
              !hasPrevGroup ? "invisible" : "cursor-pointer cursor-target"
            }
          />
        </PaginationItem>
        {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
          const pageNum = startPage + i;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => onPageChange(pageNum)}
                isActive={currentPage === pageNum}
                className="cursor-pointer cursor-target"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPage ? onPageChange(nextGroupPage) : undefined
            }
            className={
              !hasNextGroup ? "invisible" : "cursor-pointer cursor-target"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
