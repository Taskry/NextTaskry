"use client";

import { Icon } from "@/components/shared/Icon";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/shadcn/Pagination";
import { cn } from "@/lib/utils/utils";
import { NoticePaginationProps } from "@/types/notice";

export default function NoticePagination({
  currentPage,
  totalPages,
  onPageChange,
}: NoticePaginationProps) {
  if (totalPages === 0) return null;

  return (
    <Pagination className="mx-auto mt-10">
      <PaginationContent>
        {/* 이전 */}
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              "px-2 py-2 border border-border rounded cursor-pointer",
              currentPage === 1 &&
                "opacity-40 pointer-events-none cursor-not-allowed"
            )}
            onClick={(e) => {
              if (currentPage === 1) {
                e.preventDefault();
                return;
              }
              onPageChange(currentPage - 1);
            }}
            aria-disabled={currentPage === 1}
          >
            <Icon type="arrowDown" className="rotate-90" size={17} />
          </PaginationPrevious>
        </PaginationItem>

        {/* 
          페이지 번호
          251128 기존 generatePages 함수 내 totalPages 만큼 for문을 돌려서 페이지 번호를 생성했었음
          -> 굳이 짧은 코드 함수로 map 돌릴 필요 없이 Array.from 으로 배열 생성해서 페이지 번호 생성
         */}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={page === currentPage}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 다음 */}
        <PaginationItem>
          <PaginationNext
            className={cn(
              "px-2 py-2 border border-border rounded cursor-pointer",
              currentPage === totalPages &&
                "opacity-40 pointer-events-none cursor-not-allowed"
            )}
            onClick={(e) => {
              if (currentPage === totalPages) {
                e.preventDefault();
                return;
              }
              onPageChange(currentPage + 1);
            }}
            aria-disabled={currentPage === totalPages}
          >
            <Icon type="arrowDown" className="rotate-270" size={16} />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
