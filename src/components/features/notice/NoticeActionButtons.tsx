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
          <Button
            onClick={onEdit}
            btnType="icon"
            icon="edit"
            size={16}
            variant="basic"
            aria-label="공지사항 수정"
          />

          <Button
            onClick={onDelete}
            btnType="icon"
            icon="trash"
            size={16}
            variant="basic"
            aria-label="공지사항 삭제"
          />
        </>
      )}
      {admin && isEditing && (
        <>
          <Button
            onClick={onCancel}
            btnType="icon"
            icon="x"
            size={16}
            aria-label="수정 취소"
          ></Button>
          <Button
            onClick={onSave}
            btnType="icon"
            icon="deviceFloppy"
            size={16}
            aria-label="변경사항 저장"
          ></Button>
        </>
      )}
      <Link href="/notice">
        <Button
          btnType="icon"
          variant="basic"
          icon="list"
          size={16}
          aria-label="목록으로 돌아가기"
        ></Button>
      </Link>
    </div>
  );
}
