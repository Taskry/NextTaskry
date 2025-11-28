"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { deleteNotice } from "@/lib/api/notices";
import { showToast } from "@/lib/utils/toast";
import { NOTICE_MESSAGES } from "@/lib/constants/notices";
import { UseNoticeDeleteProps } from "@/types/notice";

export function useNoticeDelete(options: UseNoticeDeleteProps = {}) {
  const router = useRouter();
  const { onSuccess, redirectTo } = options;

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm(NOTICE_MESSAGES.DELETE_CONFIRM)) {
        return;
      }

      try {
        await deleteNotice(id);
        showToast(NOTICE_MESSAGES.DELETE_SUCCESS, "success");

        // -------------------- 성공 콜백 실행
        if (onSuccess) {
          await onSuccess();
        }

        // -------------------- 리다이렉트 필요 시
        if (redirectTo) {
          router.refresh();
          router.push(redirectTo);
        }
      } catch (error) {
        console.error("삭제 오류:", error);
        showToast(NOTICE_MESSAGES.DELETE_ERROR, "error");
      }
    },
    [onSuccess, redirectTo, router]
  );

  return handleDelete;
}
