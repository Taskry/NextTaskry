"use client";

import { Icon } from "@/components/shared/Icon";
import { Notice, NoticeListProps } from "@/types/notice";
import { formatDate } from "@/lib/utils/utils";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NoticeList({
  notices,
  currentPage,
  itemsPerPage,
  totalCount,
  admin = true,
  onDelete,
}: NoticeListProps) {
  const tableHeaders = [
    { label: "NO", className: "w-[150px] min-w-[150px]" },
    { label: "제목", className: "w-full max-w-0" },
    { label: "작성일", className: "w-[150px] min-w-[150px]" },
    // 관리자 admin 일 때만 관리 컬럼 추가
    ...(admin ? [{ label: "관리", className: "w-[150px] min-w-[150px]" }] : []),
  ];

  return (
    <table className="w-full border-t border-border border-collapse">
      <thead className="hidden lg:table-header-group border-b border-border text-sm uppercase">
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

      <tbody className="divide-y text-sm border-b border-border">
        {notices.map((notice, index) => {
          const noticeNumber =
            totalCount - ((currentPage - 1) * itemsPerPage + index);

          return (
            <tr
              key={notice.announcement_id}
              className={`transition-colors text-center text-base ${
                notice.is_important ? "bg-[#FAFAFA] dark:bg-[#141414]" : ""
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
                    className="truncate block font-semibold text-foreground hover:text-main-200"
                  >
                    {notice.title}
                  </Link>
                  {/* 모바일에서만 작성일 보여주기 */}
                  <div className="text-muted-foreground text-base mt-1 lg:hidden">
                    {formatDate(notice.created_at)}
                  </div>
                </div>
              </td>

              {/* 작성일 - 데스크탑만 */}
              <td className="hidden lg:table-cell py-6 px-4 text-base text-foreground">
                {formatDate(notice.created_at)}
              </td>

              {/* 관리 컬럼 - 데스크탑만 */}
              {admin && (
                <td className="y-6 px-4 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/notice/${notice.announcement_id}?edit=true`}>
                      <Button
                        btnType="icon"
                        icon="edit"
                        size={16}
                        variant="basic"
                        aria-label="공지사항 수정"
                      />
                    </Link>

                    <Button
                      onClick={() => onDelete?.(notice.announcement_id)}
                      btnType="icon"
                      icon="trash"
                      size={16}
                      variant="basic"
                      aria-label="공지사항 삭제"
                    />
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
