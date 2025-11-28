"use client";

import { Icon } from "@/components/shared/Icon";
import { NoticePaginationProps } from "@/types/notice";

export default function NoticePagination({
  currentPage,
  totalPages,
  onPageChange,
}: NoticePaginationProps) {
  if (totalPages === 0) return null;

  return (
    <nav className="flex justify-center mt-10">
      <ul className="inline-flex items-center space-x-2">
        {/* 이전 */}
        <li>
          <button
            className="px-2 py-2 border border-border rounded disabled:opacity-40 cursor-pointer"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Icon type="arrowDown" className="rotate-90" size={17} />
          </button>
        </li>

        {/* 
          페이지 번호
          251128 기존 generatePages 함수 내 totalPages 만큼 for문을 돌려서 페이지 번호를 생성했었음
          -> 굳이 짧은 코드 함수로 map 돌릴 필요 없이 Array.from 으로 배열 생성해서 페이지 번호 생성
         */}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <button
              className={`px-3 py-1 border border-border rounded cursor-pointer ${
                page === currentPage ? "border-main-200 text-main-200" : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        {/* 다음 */}
        <li>
          <button
            className="px-2 py-2 border border-border rounded disabled:opacity-40 cursor-pointer"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Icon type="arrowDown" className="rotate-270" size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
