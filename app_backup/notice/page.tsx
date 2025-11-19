"use client";

import { useEffect, useState } from "react";
import EmptyNotice from "../components/Notice/EmptyNotice";
import NoticeList from "../components/Notice/NoticeList";
import { SectionHeader } from "../components/SectionHeader";
import Container from "../components/UI/Container";
import { mockNotices, Notice, STORAGE_KEY } from "../data/mockNotices";
import { getNotices } from "@/lib/noticeService";

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotices() {
      try {
        // localStorage 로직 대신, 추상화된 서비스 함수를 호출합니다.
        const data = await getNotices();
        setNotices(data);
      } catch (error) {
        console.error("공지사항 로드 오류:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadNotices();
  }, []);

  const allNotices = notices.length;

  return (
    <Container>
      <SectionHeader
        title="공지사항"
        description="공지사항을 안내합니다."
        className="mb-15"
      />

      {isLoading ? (
        <p className="text-center">공지사항을 불러오고 있는 중입니다...</p>
      ) : allNotices > 0 ? (
        <div>
          <p className={`mb-5 text-base font-bold`}>총 {allNotices}개</p>
          <NoticeList notices={notices} />
        </div>
      ) : (
        <EmptyNotice />
      )}
    </Container>
  );
}
