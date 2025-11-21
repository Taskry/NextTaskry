import Link from "next/link";
import Button from "@/components/ui/Button";
import { NoticeActionButtonsProps } from "@/types/notice";

export function NoticeActionButtons({
  admin,
  isEditing,
  onEdit,
  onDelete,
  onCancel,
  onSave,
}: NoticeActionButtonsProps) {
  return (
    <div className="flex justify-end items-center mt-8 gap-3">
      {admin && !isEditing && (
        <>
          <Button onClick={onEdit} btnType="basic" aria-label="공지사항 수정">
            수정
          </Button>
          <Button
            onClick={onDelete}
            btnType="basic"
            variant="warning"
            aria-label="공지사항 삭제"
          >
            삭제
          </Button>
        </>
      )}
      {admin && isEditing && (
        <>
          <Button onClick={onCancel} btnType="basic" aria-label="수정 취소">
            취소
          </Button>
          <Button
            onClick={onSave}
            btnType="basic"
            variant="new"
            aria-label="변경사항 저장"
          >
            저장
          </Button>
        </>
      )}
      <Link href="/notice">
        <Button btnType="basic" variant="list" aria-label="목록으로 돌아가기">
          목록
        </Button>
      </Link>
    </div>
  );
}
