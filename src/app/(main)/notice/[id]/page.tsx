"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { updateNotice } from "@/lib/api/notices";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { showToast } from "@/lib/utils/toast";
import { useNoticeDetail } from "@/hooks/useNoticeDetail";
import { NoticeViewMode } from "@/components/features/notice/NoticeViewMode";
import { NoticeEditMode } from "@/components/features/notice/NoticeEditMode";
import { NoticeNavigation } from "@/components/features/notice/NoticeNavigation";
import { NoticeActionButtons } from "@/components/features/notice/NoticeActionButtons";
import { useNoticeDelete } from "@/hooks/useNoticeDelete";
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

  // ------------------ ID 추출 및 타입 안정성 확보
  const { data: session } = useSession();
  const noticeId = (Array.isArray(params.id) ? params.id[0] : params.id) ?? "";
  const admin = isAdmin(session);

  // ------------------ 공지사항 데이터 로드
  const { notice, nextNotice, prevNotice, isLoading, error, reload } =
    useNoticeDetail(noticeId);

  // ------------------ 수정 모드 상태 관리
  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true"
  );
  const [editState, setEditState] = useState<NoticeEditState>({
    title: "",
    content: "",
    isImportant: false,
  });

  // ------------------ notice 데이터가 처음 로드되었을 때만 editState 초기화
  const [isInitialized, setIsInitialized] = useState(false);

  if (notice && isEditing && !isInitialized) {
    setEditState({
      title: notice.title,
      content: notice.content,
      isImportant: notice.is_important,
    });
    setIsInitialized(true);
  }

  // ------------------ 수정 모드 진입
  const handleEdit = useCallback(() => {
    if (notice) {
      setEditState({
        title: notice.title,
        content: notice.content,
        isImportant: notice.is_important,
      });
    }
    setIsEditing(true);
  }, [notice]);

  // ------------------ 수정 취소
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setIsInitialized(false); // 취소 시 초기화 플래그 리셋
    if (notice) {
      setEditState({
        title: notice.title,
        content: notice.content,
        isImportant: notice.is_important,
      });
    }
  }, [notice]);

  // ------------------ 수정 시 저장 핸들러
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
      setIsInitialized(false); // 저장 후 초기화 플래그 리셋
      await reload();
      router.refresh();
    } catch (error) {
      console.error("수정 오류:", error);
      showToast(NOTICE_MESSAGES.UPDATE_ERROR, "error");
    }
  }, [notice, editState, reload, router]);

  // ------------------ 삭제 핸들러
  const handleDelete = useNoticeDelete({
    redirectTo: "/notice",
  });

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

  const content = (
    <>
      <SectionHeader
        title="공지사항"
        description="공지사항을 안내합니다."
        className="mb-10 "
      />

      <article className="mx-auto">
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

      {!isEditing && (
        <NoticeNavigation nextNotice={nextNotice} prevNotice={prevNotice} />
      )}

      <NoticeActionButtons
        admin={admin}
        isEditing={isEditing}
        onEdit={handleEdit}
        onDelete={() => notice && handleDelete(notice.announcement_id)}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </>
  );

  return isEditing ? (
    <div className="max-w-4xl m-auto py-25">{content}</div>
  ) : (
    <Container>{content}</Container>
  );
}
