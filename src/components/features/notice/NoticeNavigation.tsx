import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { NoticeNavigationProps } from "@/types/notice";

export function NoticeNavigation({
  nextNotice,
  prevNotice,
}: NoticeNavigationProps) {
  const navigationItems = [
    { notice: nextNotice, type: "next" as const, label: "다음글" },
    { notice: prevNotice, type: "prev" as const, label: "이전글" },
  ];

  return (
    <footer className="text-sm">
      <ul className="divide-y border-t border-b">
        {navigationItems.map(
          ({ notice, type, label }) =>
            notice && (
              <li key={notice.announcement_id} className="py-6 px-5 flex">
                <span className="flex items-center gap-2 w-25 text-base font-semibold">
                  <Icon
                    type="arrowDown"
                    size={16}
                    className={type === "next" ? "rotate-180" : ""}
                    aria-hidden="true"
                  />
                  <span className="shrink-0">{label}</span>
                </span>
                <Link
                  href={`/notice/${notice.announcement_id}`}
                  className="flex-1 text-base font-semibold truncate hover:underline"
                >
                  {notice.title}
                </Link>
              </li>
            )
        )}
      </ul>
    </footer>
  );
}
