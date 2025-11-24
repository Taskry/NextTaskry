import { formatDate } from "@/lib/utils/utils";
import { NoticeViewModeProps } from "@/types/notice";

// 마크다운을 HTML로 변환하는 함수
const renderMarkdown = (text: string) => {
  if (!text) return "";

  return (
    text
      // ------------------------------------ 제목
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      // ------------------------------------ 굵게 (먼저 처리) - [\s\S]로 줄바꿈 포함
      .replace(/\*\*([\s\S]+?)\*\*/g, '<strong class="font-bold">$1</strong>')
      // ------------------------------------ 기울임 (굵게가 아닌 단일 * 만 매칭)
      .replace(
        /(?<!\*)\*(?!\*)([\s\S]+?)(?<!\*)\*(?!\*)/g,
        '<em class="italic">$1</em>'
      )
      // ------------------------------------ 목록
      .replace(/^- (.+)(\n)?/gm, '<li class="ml-4 list-disc">$1</li>')
      // ------------------------------------ 줄바꿈
      .replace(/\n/g, "<br />")
  );
};

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
        className="min-h-[350px] py-7 px-5 prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(notice.content) }}
        aria-label="공지사항 내용"
      />
    </>
  );
}
