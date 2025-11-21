import { Notice } from "@/types/notice";
import { formatDate } from "@/lib/utils/utils";
import { NoticeViewModeProps } from "@/types/notice";

export function NoticeViewMode({ notice }: NoticeViewModeProps) {
  return (
    <>
      <header className="border-b p-5 flex items-center justify-between">
        <h1 className="text-lg font-bold">{notice.title}</h1>
        <div className="text-base font-normal">
          <span className="font-medium">작성일</span>
          <span className="pl-2" aria-hidden="true">
            |
          </span>
          <time dateTime={notice.created_at} className="pl-2">
            {formatDate(notice.created_at)}
          </time>
        </div>
      </header>
      <section
        className="min-h-[350px] py-7 px-5"
        dangerouslySetInnerHTML={{ __html: notice.content }}
        aria-label="공지사항 내용"
      />
    </>
  );
}
