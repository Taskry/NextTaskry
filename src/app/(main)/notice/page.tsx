"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import EmptyNotice from "@/components/features/notice/EmptyNotice";
import NoticeList from "@/components/features/notice/NoticeList";
import { SectionHeader } from "@/components/shared/SectionHeader";
import Container from "@/components/shared/Container";
import { Notice } from "@/app/data/mockNotices";
import { getNotices, deleteNotice } from "@/lib/api/notices";
import NoticePagination from "@/components/features/notice/NoticePagination";
import Button from "@/components/ui/Button";
import { showToast } from "@/lib/utils/toast";

const ITEMS_PER_PAGE = 8;

export default function NoticePage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await getNotices(currentPage, ITEMS_PER_PAGE);
      setNotices(res.data);
      setTotalItems(res.totalCount);
    } catch (error) {
      console.error("공지사항 로드 오류:", error);
      showToast("공지사항을 불러오는 데 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      try {
        await deleteNotice(id);
        showToast("공지사항이 삭제되었습니다.", "success");
        // 목록 새로고침
        fetchNotices();
      } catch (error) {
        console.error("삭제 오류:", error);
        showToast("삭제 중 오류가 발생했습니다.", "error");
      }
    }
  };

  const finalTotalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <Container>
      <SectionHeader
        title="공지사항"
        description="공지사항을 안내합니다."
        className="mb-15"
      />

      {isLoading ? (
        <p className="text-center">공지사항을 불러오고 있는 중입니다...</p>
      ) : notices.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-5">
            <p className="text-base font-bold">총 {totalItems}개</p>
            {isAdmin && (
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
            itemsPerPage={ITEMS_PER_PAGE}
            totalCount={totalItems}
            isAdmin={isAdmin}
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
          {isAdmin && (
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
