/**
 * 토스트 메시지를 표시합니다.
 * @param message 표시할 메시지
 * @param type 토스트 타입 ("success" | "error")
 * @example
 * showToast("저장되었습니다.", "success")
 * showToast("에러가 발생했습니다.", "error")
 * showApiError('서버 연결 실패')
 * -> /sample/toast/page.tsx
 */

import toast from "react-hot-toast";
import { Icon } from "@/app/components/Icon/Icon";
import { bgColorOpacity } from "@/app/sample/color/page";
import {
  TOAST_COLORS,
  BASE_TOAST_STYLE,
  BASE_TOAST_CLASSNAME,
  ICON_MAP,
} from "./toast-style";

type ToastType = "success" | "error" | "deleted" | "alert";

export const showToast = (message: string, type: ToastType = "success") => {
  const toastColors = TOAST_COLORS[type];

  const options = {
    icon: ICON_MAP[type],
    duration: 3000,

    style: {
      ...BASE_TOAST_STYLE,
      background: toastColors.background,
    },
  };

  if (type === "success") {
    toast.success(message, options);
  } else if (type === "error" || type === "deleted") {
    toast.error(message, options);
  } else {
    toast(message, options);
  }
};

export const showApiError = (message: string) => {
  showToast(`${message}`, "alert");
};
