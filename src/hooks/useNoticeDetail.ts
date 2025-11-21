import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getNotices } from "@/lib/api/notices";
import { Notice } from "@/types/notice";
import { NOTICE_MESSAGES } from "@/lib/constants/notices";

export function useNoticeDetail(noticeId: string) {
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [nextNotice, setNextNotice] = useState<Notice | null>(null);
  const [prevNotice, setPrevNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotice = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!noticeId) {
      setError("잘못된 접근입니다.");
      setIsLoading(false);
      return;
    }

    try {
      // 모든 공지사항 가져옴. 다만 수정할 필요는 있음
      const { data: allNotices } = await getNotices(1, 1000);
      const currentIndex = allNotices.findIndex(
        (n) => n.announcement_id === noticeId
      );

      if (currentIndex === -1) {
        setError(NOTICE_MESSAGES.NOT_FOUND);
        router.replace("/notice");
        return;
      }

      const currentNotice = allNotices[currentIndex];
      setNotice(currentNotice);
      setNextNotice(allNotices[currentIndex - 1] || null);
      setPrevNotice(allNotices[currentIndex + 1] || null);
    } catch (e) {
      console.error("공지사항 불러오기 오류:", e);
      setError("공지사항을 불러오는 중 오류가 발생했습니다.");
      setNotice(null);
    } finally {
      setIsLoading(false);
    }
  }, [noticeId, router]);

  useEffect(() => {
    loadNotice();
  }, [loadNotice]);

  return {
    notice,
    nextNotice,
    prevNotice,
    isLoading,
    error,
    reload: loadNotice,
  };
}
