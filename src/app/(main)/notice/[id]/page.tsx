"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { updateNotice, deleteNotice } from "@/lib/api/notices";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { showToast } from "@/lib/utils/toast";
import { useNoticeDetail } from "@/hooks/useNoticeDetail";
import { NoticeViewMode } from "@/components/features/notice/NoticeViewMode";
import { NoticeEditMode } from "@/components/features/notice/NoticeEditMode";
import { NoticeNavigation } from "@/components/features/notice/NoticeNavigation";
import { NoticeActionButtons } from "@/components/features/notice/NoticeActionButtons";
import { NoticeEditState } from "@/types/notice";
import { isAdmin } from "@/lib/utils/auth";
import { NOTICE_MESSAGES } from "@/lib/constants/notices";
import Link from "next/link";
import Container from "@/components/shared/Container";
import Button from "@/components/ui/Button";

export default function NoticeDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ID 추출 및 타입 안정성 확보
  const { data: session } = useSession();
  const noticeId = (Array.isArray(params.id) ? params.id[0] : params.id) ?? "";
  const admin = isAdmin(session);

  // 공지사항 데이터 로드
  const { notice, nextNotice, prevNotice, isLoading, error, reload } =
    useNoticeDetail(noticeId);

  // 수정 모드 상태 관리
  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true"
  );
  const [editState, setEditState] = useState<NoticeEditState>({
    title: "",
    content: "",
    isImportant: false,
  });

  // 공지사항 로드 시 수정 상태 초기화
  useEffect(() => {
    if (notice) {
      setEditState({
        title: notice.title,
        content: notice.content,
        isImportant: notice.is_important,
      });
    }
  }, [notice]);

  const handleEdit = useCallback(() => setIsEditing(true), []);
  const handleCancel = useCallback(() => setIsEditing(false), []);
  const handleSave = useCallback(async () => {
    if (!notice) return;

    try {
      await updateNotice(notice.announcement_id, {
        title: editState.title,
        content: editState.content,
        is_important: editState.isImportant,
      });
      showToast(NOTICE_MESSAGES.UPDATE_SUCCESS, "success");
      setIsEditing(false);
      await reload();
      router.refresh();
    } catch (error) {
      console.error("수정 오류:", error);
      showToast(NOTICE_MESSAGES.UPDATE_ERROR, "error");
    }
  }, [notice, editState, reload, router]);

  const handleDelete = useCallback(async () => {
    if (!notice) return;
    if (!confirm(NOTICE_MESSAGES.DELETE_CONFIRM)) return;

    try {
      await deleteNotice(notice.announcement_id);
      showToast(NOTICE_MESSAGES.DELETE_SUCCESS, "success");
      router.refresh();
      router.push("/notice");
    } catch (error) {
      console.error("삭제 오류:", error);
      showToast(NOTICE_MESSAGES.DELETE_ERROR, "error");
    }
  }, [notice, router]);

  if (isLoading) {
    return (
      <Container>
        <div className="text-center py-10" role="status" aria-live="polite">
          <p>{NOTICE_MESSAGES.LOADING}</p>
        </div>
      </Container>
    );
  }

  if (error || !notice) {
    return (
      <Container>
        <div className="text-center py-10" role="alert">
          <p>{error || NOTICE_MESSAGES.NOT_FOUND}</p>
          <Link href="/notice" className="mt-4 inline-block">
            <Button btnType="basic">목록으로 돌아가기</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <SectionHeader
        title="공지사항"
        description="공지사항을 안내합니다."
        className="mb-10"
      />

      <article className="mx-auto border-t border-t-gray-600">
        {/* // ---------------------------- 상세, 수정 모드 토글 */}
        {isEditing ? (
          <NoticeEditMode
            editState={editState}
            onTitleChange={(title) =>
              setEditState((prev) => ({ ...prev, title }))
            }
            onContentChange={(content) =>
              setEditState((prev) => ({ ...prev, content }))
            }
            onImportantChange={(isImportant) =>
              setEditState((prev) => ({ ...prev, isImportant }))
            }
          />
        ) : (
          <NoticeViewMode notice={notice} />
        )}
      </article>

      {/* // ---------------------------- 이전, 다음글 */}
      <NoticeNavigation nextNotice={nextNotice} prevNotice={prevNotice} />

      {/* // ---------------------------- 수정, 삭제, 저장 버튼 */}
      <NoticeActionButtons
        admin={admin}
        isEditing={isEditing}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </Container>
  );
}
