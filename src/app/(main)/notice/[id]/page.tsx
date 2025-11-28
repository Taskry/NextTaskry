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
  const params = useParams(); // notice/123
  const router = useRouter();
  const searchParams = useSearchParams(); // notice/123?edit=true

  // ------------------ ID 추출 및 타입 안정성 확보
  const { data: session } = useSession();
  const noticeId = (Array.isArray(params.id) ? params.id[0] : params.id) ?? "";
  const admin = isAdmin(session);

  // ------------------ 공지사항 데이터 로드
  const { notice, nextNotice, prevNotice, isLoading, error, reload } =
    // 게시판 목록에서 -> 상세로 접근하는데, 이때 notice id는 알고 있음?
    // prop으로 정보를 받으면 되지 않을까? -> 지금은 전체 공지사항 목록 불러다가 아이디를 찾고 있음
    // -> 찾아보고 수정해볼 것
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

  // ------------------ 공지사항 로드 시 수정 상태 초기화
  // 251128 기존에 notice가 바뀔 때마다 상태를 업데이트해서 에러린트 발생
  // -> editState는 수정 모드에서만 사용되므로 수정 모드 진입 시에만 초기화하도록 수정
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

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    if (notice) {
      setEditState({
        title: notice.title,
        content: notice.content,
        isImportant: notice.is_important,
      });
    }
  }, [notice]);
  // ------------------ END 공지사항 로드 시 수정 상태 초기화

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
      await reload();
      router.refresh();
    } catch (error) {
      console.error("수정 오류:", error);
      showToast(NOTICE_MESSAGES.UPDATE_ERROR, "error");
    }
  }, [notice, editState, reload, router]);

  // 251128 기존 삭제 핸들러 작성 -> hooks로 따로 빼서 호출
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

      <NoticeNavigation nextNotice={nextNotice} prevNotice={prevNotice} />

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
