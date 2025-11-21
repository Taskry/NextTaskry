"use client";

import { useEffect, useState } from "react";
import { getNotices, deleteNotice, ITEM_PER_PAGE } from "@/lib/api/notices";
import { showToast } from "@/lib/utils/toast";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Notice } from "@/types/notice";
import { useSession } from "next-auth/react";
import { NOTICE_MESSAGES } from "@/lib/constants/notices";
import { isAdmin } from "@/lib/utils/auth";
import Link from "next/link";
import EmptyNotice from "@/components/features/notice/EmptyNotice";
import NoticeList from "@/components/features/notice/NoticeList";
import Container from "@/components/shared/Container";
import NoticePagination from "@/components/features/notice/NoticePagination";
import Button from "@/components/ui/Button";

export default function NoticePage() {
  const { data: session } = useSession();
  const admin = isAdmin(session);

  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await getNotices(currentPage, ITEM_PER_PAGE);
      setNotices(res.data);
      setTotalItems(res.totalCount);
    } catch (error) {
      console.error("공지사항 로드 오류:", error);
      showToast(NOTICE_MESSAGES.LOAD_ERROR, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (confirm(NOTICE_MESSAGES.DELETE_CONFIRM)) {
      try {
        await deleteNotice(id);
        showToast(NOTICE_MESSAGES.DELETE_SUCCESS, "success");
        fetchNotices();
      } catch (error) {
        console.error("삭제 오류:", error);
        showToast(NOTICE_MESSAGES.DELETE_ERROR, "error");
      }
    }
  };

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
        <>
          <div className="flex justify-between items-center mb-5">
            <p className="text-base font-bold">총 {totalItems}개</p>
            {admin && (
              <Link href="/admin/notice/create">
                <Button btnType="form_s" icon="plus" size={18} hasIcon={true}>
                  새 공지사항
                </Button>
              </Link>
            )}
          </div>
          <NoticeList
            notices={notices}
            currentPage={currentPage}
            itemsPerPage={ITEM_PER_PAGE}
            totalCount={totalItems}
            admin={admin}
            onDelete={handleDelete}
          />
          <NoticePagination
            currentPage={currentPage}
            totalPages={finalTotalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="flex flex-col items-center">
          <EmptyNotice />
          {admin && (
            <Link href="/admin/admin/notice/create" className="mt-4">
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
