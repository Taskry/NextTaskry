"use client";

import { Icon } from "@/components/shared/Icon";
import { Notice } from "@/types/notice";
import { primaryBorderColor } from "@/app/sample/color/page";
import { formatDate } from "@/lib/utils/utils";
import Link from "next/link";

export default function NoticeList({
  notices,
  currentPage,
  itemsPerPage,
  totalCount,
  admin = true,
  onDelete,
}: {
  notices: Notice[]; // 공지사항 데이터 배열
  currentPage: number; // 현재 페이지
  itemsPerPage: number; // 페이지 당 게시글 수
  totalCount: number; // 전체 게시글 수
  admin?: boolean; // 어드민인지 여부 확인
  onDelete?: (id: number) => void;
}) {
  const tableHeaders = [
    { label: "NO", className: "w-[150px] min-w-[150px]" },
    { label: "제목", className: "w-full max-w-0" },
    { label: "작성일", className: "w-[150px] min-w-[150px]" },
    // 관리자 admin 일 때만 관리 컬럼 추가
    ...(admin ? [{ label: "관리", className: "w-[150px] min-w-[150px]" }] : []),
  ];

  return (
    <table
      className={`w-full border-collapse border-t dark:border-gray-100/40 ${primaryBorderColor.Color2[0]}`}
    >
      <thead className="hidden lg:table-header-group border-b border-b-gray-100 dark:border-b-gray-100/40 text-sm uppercase">
        <tr>
          {tableHeaders.map((header) => (
            <th
              className={`py-3 px-4 text-center text-base ${
                header.className || ""
              }`}
              key={header.label}
            >
              {header.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y text-sm border-b">
        {notices.map((notice, index) => {
          const noticeNumber =
            totalCount - ((currentPage - 1) * itemsPerPage + index);

          return (
            <tr
              key={notice.announcement_id}
              className={`transition-colors text-center text-base ${
                notice.is_important ? "bg-[#FAFAFA] dark:bg-[#1A1A1A]" : ""
              }`}
            >
              <td className="hidden lg:table-cell py-6 px-4 font-regular ">
                {notice.is_important ? (
                  <span className="flex items-center justify-center gap-1 font-semibold">
                    <Icon type="bellFilled" size={18} />
                    중요 공지
                  </span>
                ) : (
                  noticeNumber
                )}
              </td>

              {/* 제목 + 모바일 작성일 */}
              <td className="py-6 px-4 text-left w-full max-w-0 overflow-hidden">
                <div>
                  <Link
                    href={`/notice/${notice.announcement_id}`}
                    className="truncate block font-semibold hover:text-main-200"
                  >
                    {notice.title}
                  </Link>
                  {/* 모바일에서만 작성일 보여주기 */}
                  <div className="text-gray-500 text-base mt-1 lg:hidden">
                    {formatDate(notice.created_at)}
                  </div>
                </div>
              </td>

              {/* 작성일 - 데스크탑만 */}
              <td className="hidden lg:table-cell py-6 px-4 text-base">
                {formatDate(notice.created_at)}
              </td>

              {/* 관리 컬럼 - 데스크탑만 */}
              {admin && (
                <td className="y-6 px-4 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/notice/${notice.announcement_id}?edit=true`}
                      className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => onDelete?.(notice.announcement_id)}
                      className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
