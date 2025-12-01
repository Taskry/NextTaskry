"use client";

import { Icon } from "@/components/shared/Icon";
import { NoticeListProps } from "@/types/notice";
import { formatDate } from "@/lib/utils/utils";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/Table";

export default function NoticeList({
  notices,
  admin = true,
  onDelete,
}: NoticeListProps) {
  const tableHeaders = [
    { label: "NO", className: "w-[150px] min-w-[150px]" },
    { label: "제목", className: "w-full max-w-0" },
    { label: "작성일", className: "w-[150px] min-w-[150px]" },
    ...(admin ? [{ label: "관리", className: "w-[150px] min-w-[150px]" }] : []),
  ];

  return (
    <Table className="border-t">
      <TableHeader className="hidden lg:table-header-group">
        <TableRow className="hover:bg-transparent">
          {tableHeaders.map((header) => (
            <TableHead
              key={header.label}
              className={`text-center text-base font-semibold py-3 uppercase ${
                header.className || ""
              }`}
            >
              {header.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {notices.map((notice) => (
          <TableRow
            key={notice.announcement_id}
            className={`text-center text-base py-6 ${
              notice.is_important ? "bg-[#FAFAFA] dark:bg-[#141414]" : ""
            }`}
          >
            {/* NO */}
            <TableCell className="hidden lg:table-cell font-regular py-5">
              {notice.is_important ? (
                <span className="flex items-center justify-center gap-1 font-semibold">
                  <Icon type="bellFilled" size={18} />
                  중요 공지
                </span>
              ) : (
                notice.displayNumber
              )}
            </TableCell>

            {/* 타이틀 */}
            <TableCell className="text-left w-full max-w-0 overflow-hidden p-5">
              <div>
                <Link
                  href={`/notice/${notice.announcement_id}`}
                  className="truncate block font-semibold text-foreground hover:text-main-200"
                >
                  {notice.title}
                </Link>
                {/* 작성일 - MO에서 노출 */}
                <div className="text-muted-foreground text-base mt-1 lg:hidden">
                  {formatDate(notice.created_at)}
                </div>
              </div>
            </TableCell>

            {/* 작성일 - PC 노출 */}
            <TableCell className="hidden lg:table-cell text-base text-foreground">
              {formatDate(notice.created_at)}
            </TableCell>

            {/* 관리 컬럼 액션 버튼 */}
            {admin && (
              <TableCell className="text-sm p-5 lg:p-0">
                <div className="flex items-center justify-center gap-2">
                  <Link href={`/notice/${notice.announcement_id}?edit=true`}>
                    <Button
                      btnType="icon"
                      icon="edit"
                      size={16}
                      variant="primary"
                      aria-label="공지사항 수정"
                    />
                  </Link>

                  <Button
                    onClick={() => onDelete?.(notice.announcement_id)}
                    btnType="icon"
                    icon="trash"
                    size={16}
                    variant="warning"
                    aria-label="공지사항 삭제"
                  />
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
