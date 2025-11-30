import { NoticeEditModeProps } from "@/types/notice";
import RichTextEditor from "./RichTextEditor";
import Checkbox from "@/components/ui/Checkbox";

export function NoticeEditMode({
  editState,
  onTitleChange,
  onContentChange,
  onImportantChange,
}: NoticeEditModeProps) {
  return (
    <div className="px-5 py-7 lg:p-7 space-y-10 bg-[#FAFAFA] dark:bg-[#1A1A1A] rounded-xl">
      <fieldset className="p-6 border border-border rounded-xl space-y-6 shadow-lg bg-white dark:bg-transparent">
        <legend className="text-lg font-bold px-2 mb-0">기본 정보</legend>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="notice-title-edit"
            className="text-sm font-medium flex items-center"
          >
            제목
            <span className="text-red-100" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="notice-title-edit"
            type="text"
            placeholder="공지사항 제목을 입력해주세요."
            value={editState.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="p-3 mb-0 border border-border rounded-lg transition duration-150 w-full focus:border-[#87BAC3] focus:outline-none focus:ring focus:ring-[#87BAC3]/30"
          />
        </div>

        <div className="flex items-center">
          <Checkbox
            id="isImportantEdit"
            label="중요 공지로 설정(상단에 고정됩니다.)"
            checked={editState.isImportant}
            onChange={(e) => onImportantChange(e.target.checked)}
          />
        </div>
      </fieldset>

      <fieldset className="p-6 border border-border rounded-xl space-y-6 shadow-lg bg-white dark:bg-transparent">
        <legend className="text-lg font-bold px-2 mb-0">내용 작성</legend>

        <div className="flex flex-col space-y-2">
          <RichTextEditor
            value={editState.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onContentChange(e.target.value)
            }
            placeholder="공지사항 내용을 입력해주세요."
            rows={15}
            className="focus:border-[#87BAC3] focus:outline-none focus:ring focus:ring-[#87BAC3]/30"
          />
        </div>
      </fieldset>
    </div>
  );
}
