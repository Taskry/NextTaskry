"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KanbanPage() {
  const router = useRouter();

  useEffect(() => {
    // 기본 보드로 리다이렉트 (또는 목록 페이지 표시)
    router.push("/kanban/board-001");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">로딩 중...</div>
  );
}
