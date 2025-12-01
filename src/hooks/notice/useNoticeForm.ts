// --------------------------------------------------------
// 1. formData 상태 초기화
// 2. errors 상태로 각 필드의 에러 메시지 관리
// 3. 사용자가 입력할 때마다 handle___Change 함수 호출
// 4. 입력 시 해당 필드의 에러 메시지 자동 제거
// 5. 폼 제출 시 validateForm()으로 전체 유효성 검사
// 6. 유효성 검사 실패 시 errors 상태 업데이트, 성공 시 에러 초기화
// --------------------------------------------------------

import { useState, useCallback } from "react";
import { NoticeFormData } from "@/types/notice";
import { NOTICE_CONSTANS, NOTICE_MESSAGES } from "@/lib/constants/notices";

interface UseNoticeFormProps {
  initialData?: NoticeFormData;
}

export function useNoticeForm({ initialData }: UseNoticeFormProps = {}) {
  // 폼 상태 초기화
  const [formData, setFormData] = useState<NoticeFormData>(
    initialData || {
      title: "",
      content: "",
      isImportant: false,
    }
  );

  // 에러 메시지 관리
  const [errors, setErrors] = useState({ title: "", content: "" });

  // 유효성 검사
  const validateForm = useCallback(() => {
    // 빈 에러 객체로 시작
    const newErrors = { title: "", content: "" };

    // 제목 검사
    if (!formData.title.trim()) {
      newErrors.title = NOTICE_MESSAGES.TITLE_REQUIRED;
    } else if (formData.title.length > NOTICE_CONSTANS.TITLE_MAX_LENGTH) {
      newErrors.title = NOTICE_MESSAGES.TITLE_TOO_LONG;
    }

    // 내용 검사
    if (!formData.content.trim()) {
      newErrors.content = NOTICE_MESSAGES.CONTENT_REQUIRED;
      setErrors(newErrors);
      return false;
    }

    // 모든 검사 완료 후 상태 업데이트
    setErrors(newErrors);

    // 에러가 하나라도 있으면 false
    return !newErrors.title && !newErrors.content;
  }, [formData]);

  // 제목 변경 핸들러
  const handleTitleChange = useCallback(
    (title: string) => {
      setFormData((prev) => ({ ...prev, title }));
      if (errors.title) {
        setErrors((prev) => ({ ...prev, title: "" }));
      }
    },
    [errors.title]
  );

  // 내용 변경 핸들러
  const handleContentChange = useCallback(
    (content: string) => {
      setFormData((prev) => ({ ...prev, content }));
      if (errors.content) {
        setErrors((prev) => ({ ...prev, content: "" }));
      }
    },
    [errors.content]
  );

  // 중요 공지 변경 핸들러
  const handleImportantChange = useCallback((isImportant: boolean) => {
    setFormData((prev) => ({ ...prev, isImportant }));
  }, []);

  // 폼 데이터 리셋
  const resetForm = useCallback((data?: NoticeFormData) => {
    if (data) {
      setFormData(data);
    } else {
      setFormData({
        title: "",
        content: "",
        isImportant: false,
      });
    }
    setErrors({ title: "", content: "" });
  }, []);

  // 에러 초기화
  const clearErrors = useCallback(() => {
    setErrors({ title: "", content: "" });
  }, []);

  return {
    formData,
    errors,
    validateForm,
    handleTitleChange,
    handleContentChange,
    handleImportantChange,
    resetForm,
    clearErrors,
    setFormData,
  };
}
