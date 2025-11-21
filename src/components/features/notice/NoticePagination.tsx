"use client";

import { Icon } from "@/components/shared/Icon";
import Button from "@/components/ui/Button";

interface NoticePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function NoticePagination({
  currentPage,
  totalPages,
  onPageChange,
}: NoticePaginationProps) {
  if (totalPages === 0) return null;

  const generatePages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <nav className="flex justify-center mt-10">
      <ul className="inline-flex items-center space-x-2">
        {/* 이전 */}
        <li>
          <button
            className="px-2 py-2 border border-gray-100 rounded disabled:opacity-50 cursor-pointer"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Icon type="arrowDown" className="rotate-90" size={17} />
          </button>
        </li>

        {/* 페이지 번호 */}
        {generatePages().map((page) => (
          <li key={page}>
            <button
              className={`px-3 py-1 border rounded cursor-pointer ${
                page === currentPage
                  ? "border-main-200 text-main-200"
                  : "border-gray-100"
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
            className="px-2 py-2 border border-gray-100 rounded disabled:opacity-50 cursor-pointer"
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
