import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { Notice } from "@/app/data/mockNotices";
import { primaryBorderColor } from "@/app/sample/color/page";
import { formatDate } from "@/lib/utils/utils";

export default function NoticeList({ notices }: { notices: Notice[] }) {
  const tableHeaders = [
    {
      label: "NO",
      className: "w-[150px] min-w-[150px]",
    },
    {
      label: "제목",
      className: "w-full max-w-0",
    },
    {
      label: "작성일",
      className: "w-[150px] min-w-[150px]",
    },
  ];

  // 중요, 일반 공지 분리
  const pinnedNotices = notices.filter((n) => n.is_pinned);
  const normalNotices = notices.filter((n) => !n.is_pinned);

  return (
    <>
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
          {/* 중요 공지 렌더링 */}
          {pinnedNotices.map((notice) => (
            <tr
              key={notice.announcement_id}
              className=" transition-colors text-center"
            >
              <td className="items-center py-6 px-4 text-sm font-semibold">
                <div>
                  <Icon type="bellFilled" size={18} className="inline mb-0.5" />
                  <span className="pl-2">중요 공지</span>
                </div>
              </td>
              <td className="py-6 px-4 text-sm font-semibold text-left w-full max-w-0 overflow-hidden">
                <Link
                  href={`/notice/${notice.announcement_id}`}
                  className="truncate block"
                >
                  {notice.title}
                </Link>
              </td>
              <td className="py-6 px-4 text-sm">
                {formatDate(notice.created_at)}
              </td>
            </tr>
          ))}
          {/* 일반 공지 렌더링 */}
          {normalNotices.map((notice, index) => (
            <tr
              key={notice.announcement_id}
              className=" transition-colors text-center"
            >
              <td className="items-center py-6 px-4 text-sm font-semibold">
                {normalNotices.length - index}
              </td>
              <td className="py-6 px-4 text-sm font-semibold text-left w-full max-w-0 overflow-hidden">
                <Link
                  href={`/notice/${notice.announcement_id}`}
                  className="truncate block"
                >
                  {notice.title}
                </Link>
              </td>
              <td className="py-6 px-4 text-sm">
                {formatDate(notice.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
