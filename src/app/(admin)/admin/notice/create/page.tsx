"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/utils/toast";
import { createNotice } from "@/lib/api/notices";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NOTICE_MESSAGES } from "@/lib/constants/notices";
import { NoticeForm } from "@/components/features/notice/NoticeForm";
import { useNoticeForm } from "@/hooks/notice/useNoticeForm";
import Button from "@/components/ui/Button";

export default function AdminNoticeCreatePage() {
  const router = useRouter();

  // ------------------ 폼 상태 및 핸들러(커스텀 훅 사용)
  const {
    formData,
    errors,
    validateForm,
    handleTitleChange,
    handleContentChange,
    handleImportantChange,
  } = useNoticeForm();

  // ------------------ body 스크롤 설정
  useEffect(() => {
    document.body.classList.remove("overflow-hidden");
    document.body.classList.remove("h-full");

    return () => {
      document.body.classList.add("overflow-hidden");
      document.body.classList.add("h-full");
    };
  }, []);

  // ------------------ 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 유효성 검사 실패 시 리턴
      if (!validateForm()) {
        return;
      }

      // 앞뒤 공백 제거 후 API 호출
      await createNotice({
        title: formData.title.trim(),
        content: formData.content.trim(),
        is_important: formData.isImportant,
      });

      showToast(NOTICE_MESSAGES.CREATE_SUCCESS, "success");
      router.refresh();
      router.push("/notice");
    } catch (error) {
      console.log("오류 발생: ", error);
      showToast(NOTICE_MESSAGES.UNKNOWN_ERROR, "error");
    }
  };

  return (
    <div className="max-w-4xl m-auto py-25">
      <SectionHeader
        title="공지사항 작성"
        description="새로운 공지사항을 작성하고 관리합니다."
        className="mb-10"
      />
      <form onSubmit={handleSubmit}>
        <NoticeForm
          formData={formData}
          errors={errors}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          onImportantChange={handleImportantChange}
          mode="create"
        />

        <div className="flex justify-end pt-4 gap-3">
          <Button
            onClick={() => router.back()}
            btnType="icon"
            icon="x"
            size={16}
            aria-label="취소"
            type="button"
          />
          <Button
            btnType="icon"
            icon="deviceFloppy"
            size={16}
            aria-label="공지사항 등록"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
