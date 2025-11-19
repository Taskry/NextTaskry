import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 날짜 포맷팅 함수
export const formatDate = (dateString: string) => {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, "-")
      .replace(/\.$/, "");
  } catch {
    return dateString.split("T")[0];
  }
};
