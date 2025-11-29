"use client";

import Button from "@/components/ui/Button";
import AdminPageWrapper from "@/components/features/admin/AdminPageWrapper";
import Link from "next/link";
import NoticePagination from "@/components/features/notice/NoticePagination";
import { useCallback, useEffect, useState } from "react";
import { getNotices, ITEM_PER_PAGE } from "@/lib/api/notices";
import { showToast } from "@/lib/utils/toast";
import { Notice } from "@/types/notice";
import { formatDate } from "@/lib/utils/utils";
import { NOTICE_MESSAGES } from "@/lib/constants/notices";
import { useNoticeDelete } from "@/hooks/useNoticeDelete";
import CommonPagination from "@/components/ui/CommonPagination";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
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
      setNotices(res.data);
      setTotalItems(res.totalCount);
    } catch (error) {
      console.error("공지사항 로드 오류: ", error);
      showToast(NOTICE_MESSAGES.LOAD_ERROR, "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // 251128 기존 삭제 핸들러 작성 -> hooks로 따로 빼서 호출
  // + 추가 로직
  const handleDelete = useNoticeDelete({
    onSuccess: async () => {
      // 마지막 항목 삭제 시 이전 페이지로 이동
      const remainingItems = totalItems - 1;
      const totalPages = Math.ceil(remainingItems / ITEM_PER_PAGE);

      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else {
        await fetchNotices();
      }
    },
  });

  const totalPages = Math.ceil(totalItems / ITEM_PER_PAGE);

  return (
    <AdminPageWrapper
      title="공지사항 관리"
      titleIcon="bellFilled"
      action={
        <div className="flex gap-2">
          <Button btnType="form_s" icon="plus" size={18} hasIcon={true}>
            <Link href="/admin/notice/create">새 공지사항</Link>
          </Button>
          <Button btnType="form_s">
            <Link href="/notice">목록으로 이동</Link>
          </Button>
        </div>
      }
    >
      {!isLoading && notices.length > 0 && (
        <div className="mb-4">
          <p className="text-base font-medium">총 {totalItems}개</p>
        </div>
      )}

      {isLoading ? (
        <p className="text-center py-10">{NOTICE_MESSAGES.LOADING}</p>
      ) : notices.length > 0 ? (
        <>
          {notices.map((notice, index) => (
            <div
              key={notice.announcement_id || index}
              className={`border border-border py-7 px-5 rounded-xl mb-4`}
            >
              <div className="flex flex-col items-start lg:flex-row lg:justify-between lg:items-center  ">
                <Link
                  href={`notice/${notice.announcement_id}`}
                  className="flex-1"
                >
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {notice.is_important && "[중요 공지] "}
                      {notice.title}
                    </h3>
                    <ul className="flex gap-5 mt-3">
                      <li className="text-sm text-muted-foreground">
                        작성일: {formatDate(notice.created_at)}
                      </li>
                    </ul>
                  </div>
                </Link>
                <div className="flex flex-wrap justify-end gap-2 w-full lg:justify-between lg:w-auto">
                  <Link href={`/notice/${notice.announcement_id}?edit=true`}>
                    <Button
                      btnType="icon"
                      icon="edit"
                      size={16}
                      variant="primary"
                    />
                  </Link>
                  <Button
                    btnType="icon"
                    icon="trash"
                    size={16}
                    variant="warning"
                    onClick={() => handleDelete(notice.announcement_id)}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* 페이지네이션 */}
          <CommonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">등록된 공지사항이 없습니다.</p>
          <Link href="/admin/notice/create">
            <Button btnType="basic" variant="new">
              첫 공지사항 작성하기
            </Button>
          </Link>
        </div>
      )}
    </AdminPageWrapper>
  );
}
