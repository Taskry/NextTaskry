"use client";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { Notice } from "@/app/data/mockNotices";
import { primaryBorderColor } from "@/app/sample/color/page";
import { formatDate } from "@/lib/utils/utils";

export default function NoticeList({
  notices,
  currentPage,
  itemsPerPage,
  totalCount,
  isAdmin = true,
  onDelete,
}: {
  notices: Notice[];
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
}) {
  const tableHeaders = [
    { label: "NO", className: "w-[150px] min-w-[150px]" },
    { label: "제목", className: "w-full max-w-0" },
    { label: "작성일", className: "w-[150px] min-w-[150px]" },
    // 관리자 admin 일 때만 관리 컬럼 추가
    ...(isAdmin
      ? [{ label: "관리", className: "w-[150px] min-w-[150px]" }]
      : []),
  ];

  return (
    <table
      className={`w-full border-collapse border-t ${primaryBorderColor.Color2[0]}`}
    >
      <thead className="border-b border-b-gray-100 text-sm uppercase">
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
              className="transition-colors text-center "
            >
              <td className="items-center py-6 px-4 text-sm font-semibold">
                {notice.is_important ? (
                  <span className="flex items-center justify-center gap-1">
                    <Icon type="bellFilled" size={18} />
                    중요 공지
                  </span>
                ) : (
                  noticeNumber
                )}
              </td>
              <td className="py-6 px-4 text-sm font-semibold text-left w-full max-w-0 overflow-hidden">
                <Link
                  href={`/notice/${notice.announcement_id}`}
                  className="truncate block hover:text-main-200"
                >
                  {notice.title}
                </Link>
              </td>
              <td className="py-6 px-4 text-sm">
                {formatDate(notice.created_at)}
              </td>

              {isAdmin && (
                <td className="py-6 px-4 text-sm">
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
