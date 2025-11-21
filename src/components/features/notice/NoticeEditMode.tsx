import RichTextEditor from "@/components/features/notice/RichTextEditor";
import Checkbox from "@/components/ui/Checkbox";
import { NoticeEditModeProps } from "@/types/notice";

export function NoticeEditMode({
  editState,
  onTitleChange,
  onContentChange,
  onImportantChange,
}: NoticeEditModeProps) {
  return (
    <div className="p-5">
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={editState.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="p-3 text-lg font-bold border rounded-lg w-full"
          aria-label="공지사항 제목"
        />
        <Checkbox
          id="isImportantEdit"
          label="중요 공지로 설정"
          checked={editState.isImportant}
          onChange={(e) => onImportantChange(e.target.checked)}
        />
        <RichTextEditor
          value={editState.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onContentChange(e.target.value)
          }
          rows={15}
        />
      </div>
    </div>
  );
}
