"use client";

import { useCallback, useEffect, useState } from "react";
import { getNotices, ITEM_PER_PAGE } from "@/lib/api/notices";
import { showToast } from "@/lib/utils/toast";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NoticeWithNumber } from "@/types/notice";
import { useSession } from "next-auth/react";
import { NOTICE_MESSAGES } from "@/lib/constants/notices";
import { isAdmin } from "@/lib/utils/auth";
import { useNoticeDelete } from "@/hooks/useNoticeDelete";
import Link from "next/link";
import EmptyNotice from "@/components/features/notice/EmptyNotice";
import NoticeList from "@/components/features/notice/NoticeList";
import Container from "@/components/shared/Container";
import Button from "@/components/ui/Button";
import CommonPagination from "@/components/ui/CommonPagination";

export default function NoticePage() {
  const { data: session } = useSession();
  const admin = isAdmin(session);

  const [notices, setNotices] = useState<NoticeWithNumber[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 251128 기존 fetchNotices 함수가 매 렌더링마다 새로 생성되게 작성돼있었음
  // 의존성 배열에 포함되지 않아서 에러린트 발생
  // -> useCallback으로 함수 메모이제이션, 의존성 배열에 currentPage 추가
  // -> useEffect 의존성 배열에 fetchNotices 추가
  const fetchNotices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getNotices(currentPage, ITEM_PER_PAGE);

      // 251128 NoticeList에서 게시글 넘버를 계산하지 않고 해당 컴포넌트에서 계산하기
      const noticesNumber = res.data.map((notice, index) => ({
        ...notice,
        displayNumber:
          res.totalCount - ((currentPage - 1) * ITEM_PER_PAGE + index),
      }));

      setNotices(noticesNumber);
      setTotalItems(res.totalCount);
    } catch (error) {
      console.error("공지사항 로드 오류:", error);
      showToast(NOTICE_MESSAGES.LOAD_ERROR, "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // 251128 기존 삭제 핸들러 작성 -> hooks로 따로 빼서 호출
  const handleDelete = useNoticeDelete({
    onSuccess: fetchNotices,
  });

  // 총 페이지수 계산
  const finalTotalPages = Math.ceil(totalItems / ITEM_PER_PAGE);

  return (
    <Container>
      <SectionHeader
        title="공지사항"
        description="공지사항을 안내합니다."
        className="mb-15"
      />

      {isLoading ? (
        <p className="text-center">{NOTICE_MESSAGES.LOADING}</p>
      ) : notices.length > 0 ? (
        // 공지사항 있을 때
        <>
          <div className="flex justify-between items-center mb-5">
            <p className="text-base font-bold">총 {totalItems}개</p>
            {admin && (
              <Link href="/admin/notice/create">
                <Button
                  btnType="form_s"
                  variant="primary"
                  icon="plus"
                  size={18}
                  hasIcon={true}
                >
                  새 공지사항
                </Button>
              </Link>
            )}
          </div>

          {/* 공지사항 리스트 */}
          <NoticeList notices={notices} admin={admin} onDelete={handleDelete} />

          {/* 공지사항 페이지네이션 */}
          <CommonPagination
            currentPage={currentPage}
            totalPages={finalTotalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        // 공지사항 없을 때
        <div className="flex flex-col items-center">
          <EmptyNotice />
          {admin && (
            <Link href="/admin/notice/create" className="mt-4">
              <Button btnType="basic" variant="new">
                첫 공지사항 작성하기
              </Button>
            </Link>
          )}
        </div>
      )}
    </Container>
  );
}
