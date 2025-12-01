"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { updateNotice } from "@/lib/api/notices";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { showToast } from "@/lib/utils/toast";
import { useNoticeDetail } from "@/hooks/notice/useNoticeDetail";
import { NoticeViewMode } from "@/components/features/notice/NoticeViewMode";
import { NoticeForm } from "@/components/features/notice/NoticeForm";
import { NoticeNavigation } from "@/components/features/notice/NoticeNavigation";
import { NoticeActionButtons } from "@/components/features/notice/NoticeActionButtons";
import { useNoticeDelete } from "@/hooks/notice/useNoticeDelete";
import { useNoticeForm } from "@/hooks/notice/useNoticeForm";
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

  // ------------------ 폼 상태 및 유효성 검사(커스텀 훅 사용)
  const {
    formData,
    errors,
    validateForm,
    handleTitleChange,
    handleContentChange,
    handleImportantChange,
    resetForm,
  } = useNoticeForm();

  // ------------------ formData 초기화 플래그(한 번만 초기화하기 위함)
  const [isInitialized, setIsInitialized] = useState(false);

  // ------------------ notice 데이터가 처음 로드되었을 때만 formData 초기화
  // 조건: 공지사항이 존재하고, 수정 모드이고, 아직 초기화가 안 됐을 때
  if (notice && isEditing && !isInitialized) {
    resetForm({
      title: notice.title,
      content: notice.content,
      isImportant: notice.is_important,
    });
    setIsInitialized(true);
  }

  // ------------------ 수정 모드 진입
  const handleEdit = useCallback(() => {
    if (notice) {
      resetForm({
        title: notice.title,
        content: notice.content,
        isImportant: notice.is_important,
      });
    }
    setIsEditing(true);
  }, [notice, resetForm]);

  // ------------------ 수정 취소
  const handleCancel = useCallback(() => {
    setIsEditing(false); // 조회 모드로 전환
    setIsInitialized(false); // 초기화 플래그 리셋
    if (notice) {
      resetForm({
        title: notice.title,
        content: notice.content,
        isImportant: notice.is_important,
      });
    }
  }, [notice, resetForm]);

  // ------------------ 수정 시 저장 핸들러
  const handleSave = useCallback(async () => {
    if (!notice) return;

    // 유효성 검사(제목/내용 필수, 제목 길이 제한)
    if (!validateForm()) {
      return;
    }

    try {
      await updateNotice(notice.announcement_id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        is_important: formData.isImportant,
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
  }, [notice, formData, validateForm, reload, router]);

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
        className="mb-10"
      />

      <article className="mx-auto">
        {isEditing ? (
          // 수정 모드
          <NoticeForm
            formData={formData}
            errors={errors}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            onImportantChange={handleImportantChange}
            mode="edit"
          />
        ) : (
          // 조회 모드: 상세 내용 확인
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
