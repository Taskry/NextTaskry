"use client";

import { useEffect } from "react";

export default function NoticesLayout({ children }) {
  useEffect(() => {
    // 공지사항 페이지 진입 시 스크롤 활성화
    document.body.classList.remove("overflow-hidden", "h-full");

    return () => {
      // 공지사항 페이지 떠날 때 다시 비활성화
      document.body.classList.add("overflow-hidden", "h-full");
    };
  }, []);

  return <>{children}</>;
}
