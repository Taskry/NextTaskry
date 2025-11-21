"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getNotices, updateNotice, deleteNotice } from "@/lib/api/notices";
import { Notice } from "@/app/data/mockNotices";
import Container from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import RichTextEditor from "@/components/features/notice/RichTextEditor";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils/utils";
import { showToast } from "@/lib/utils/toast";
import { Icon } from "@/components/shared/Icon";

export default function NoticeDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const noticeId = rawId;

  const isAdmin = session?.user?.role === "admin";

  // 데이터 상태
  const [notice, setNotice] = useState<Notice | null>(null);
  const [nextNotice, setNextNotice] = useState<Notice | null>(null);
  const [prevNotice, setPrevNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedIsImportant, setEditedIsImportant] = useState(false);

  // 데이터 로드 함수
  const loadNotice = async () => {
    try {
      setIsLoading(true);
      // 이전/다음 글을 위해 전체 목록을 가져옴
      const { data: allNotices } = await getNotices(1, 1000);
      const currentIndex = allNotices.findIndex(
        (n) => n.announcement_id === noticeId
      );

      // ---------------------------- 디버깅 로그 추가
      console.log("[상세 페이지 디버그]", {
        noticeId,
        allNotices,
        currentIndex,
        currentNotice: allNotices[currentIndex],
        nextNotice: allNotices[currentIndex - 1],
        prevNotice: allNotices[currentIndex + 1],
      });
      // ----------------------------

      if (currentIndex === -1) {
        showToast("공지사항을 찾을 수 없습니다.", "error");
        router.replace("/notice");
        return;
      }

      const currentNotice = allNotices[currentIndex];
      setNotice(currentNotice);
      setNextNotice(allNotices[currentIndex - 1] || null);
      setPrevNotice(allNotices[currentIndex + 1] || null);

      // 수정용 상태 초기화
      setEditedTitle(currentNotice.title);
      setEditedContent(currentNotice.content);
      setEditedIsImportant(currentNotice.is_important);
    } catch (e) {
      console.error("공지사항 불러오기 오류:", e);
      setNotice(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (noticeId) {
      loadNotice();
    }
  }, [noticeId]);

  // ---------------------------- 핸들러 함수들

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async () => {
    if (!notice) return;
    try {
      await updateNotice(notice.announcement_id, {
        title: editedTitle,
        content: editedContent,
        is_important: editedIsImportant,
      });
      showToast("성공적으로 수정되었습니다.", "success");
      setIsEditing(false);
      // 수정된 내용으로 현재 페이지를 다시 로드하여 모든 정보(이전/다음 글 포함)를 갱신
      loadNotice();
      router.refresh(); // 목록 페이지의 캐시를 갱신
    } catch (error) {
      console.error("수정 오류:", error);
      showToast("수정 중 오류가 발생했습니다.", "error");
    }
  };

  const handleDelete = async () => {
    if (!notice) return;
    if (confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      try {
        await deleteNotice(notice.announcement_id);
        showToast("공지사항이 삭제되었습니다.", "success");
        router.refresh(); // 캐시 갱신
        router.push("/notice"); // 목록으로 이동
      } catch (error) {
        console.error("삭제 오류:", error);
        showToast("삭제 중 오류가 발생했습니다.", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <Container>
        <p className="text-center">공지사항을 불러오는 중입니다...</p>
      </Container>
    );
  }

  if (!notice) {
    return (
      <Container>
        <p className="text-center">공지사항을 찾을 수 없습니다.</p>
      </Container>
    );
  }

  return (
    <Container>
      <SectionHeader
        title="공지사항"
        description="공지사항을 안내합니다."
        className="mb-10"
      />

      <article className="mx-auto border-t border-t-gray-600">
        {!isEditing ? (
          // ---------------------------- 조회
          <>
            <header className="border-b p-5 flex items-center justify-between">
              <h1 className="text-lg font-bold">{notice.title}</h1>
              <div className="text-base font-normal">
                <span className="font-medium">작성일</span>
                <span className="pl-2">|</span>
                <time dateTime={notice.created_at} className="pl-2">
                  {formatDate(notice.created_at)}
                </time>
              </div>
            </header>
            <section
              className="min-h-[350px] py-7 px-5"
              dangerouslySetInnerHTML={{ __html: notice.content }}
            />
          </>
        ) : (
          // ---------------------------- 수정
          <div className="p-5">
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="p-3 text-lg font-bold border rounded-lg w-full"
              />
              <Checkbox
                id="isImportantEdit"
                label="중요 공지로 설정"
                checked={editedIsImportant}
                onChange={(e) => setEditedIsImportant(e.target.checked)}
              />
              <RichTextEditor
                value={editedContent}
                onChange={(e: any) => setEditedContent(e.target.value)}
                rows={15}
              />
            </div>
          </div>
        )}
      </article>

      <footer className="text-sm">
        <ul className="divide-y border-t border-b">
          {nextNotice && (
            <li className="py-6 px-5 flex">
              <span className="flex items-center gap-2 w-25 text-base font-semibold">
                <Icon type="arrowDown" size={16} className="rotate-180" />
                <span className="shrink-0">다음글</span>
              </span>
              <Link
                href={`/notice/${nextNotice.announcement_id}`}
                className="flex-1 text-base font-semibold truncate"
              >
                {nextNotice.title}
              </Link>
            </li>
          )}
          {prevNotice && (
            <li className="py-6 px-5 flex">
              <span className="flex items-center gap-2 w-25 text-base font-semibold">
                <Icon type="arrowDown" size={16} />
                <span className="shrink-0">이전글</span>
              </span>
              <Link
                href={`/notice/${prevNotice.announcement_id}`}
                className="flex-1 text-base font-semibold truncate"
              >
                {prevNotice.title}
              </Link>
            </li>
          )}
        </ul>
      </footer>

      <div className="flex justify-end items-center mt-8 gap-3">
        {isAdmin && !isEditing && (
          <>
            <Button onClick={handleEdit} btnType="basic">
              수정
            </Button>
            <Button onClick={handleDelete} btnType="basic" variant="warning">
              삭제
            </Button>
          </>
        )}
        {isAdmin && isEditing && (
          <>
            <Button onClick={handleCancel} btnType="basic">
              취소
            </Button>
            <Button onClick={handleSave} btnType="basic" variant="new">
              저장
            </Button>
          </>
        )}
        <Link href="/notice">
          <Button btnType="basic" variant="list">
            목록
          </Button>
        </Link>
      </div>
    </Container>
  );
}
