"use client";
import Button from "@/app/components/Button/Button";
import { Icon } from "@/app/components/Icon/Icon";
import { SectionHeader } from "@/app/components/SectionHeader";
import Container from "@/app/components/UI/Container";
import { Notice, STORAGE_KEY } from "@/app/data/mockNotices";
import { getNoticeById } from "@/lib/noticeService";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NoticeDetail() {
  const params = useParams();
  const noticeId = params.id as string;

  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!noticeId) {
      setIsLoading(false);
      return;
    }

    async function loadNotice() {
      try {
        const foundNotice = await getNoticeById(noticeId);
        setNotice(foundNotice || null);
      } catch (error) {
        console.error("상세 정보 불러오기 실패: ", error);
        setNotice(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadNotice();
  }, [noticeId]);

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
      <article className="max-w-4xl mx-auto bg-white border-t border-t-gray-600">
        <header className="border-b p-5 flex items-center justify-between">
          <h1 className="text-lg font-bold text-main-700">{notice.title}</h1>

          <div className="text-base text-gray-600 font-normal">
            <span className="font-medium">작성일</span>
            <span className="pl-2">|</span>
            <time dateTime={notice.created_at} className="pl-2">
              {formatDate(notice.created_at)}
            </time>
          </div>
        </header>

        <section className="min-h-[350px] py-7 px-5 bg-[#FAFAFA]">
          <h2 className="sr-only">공지사항 내용</h2>
          <p
            className="text-base text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          ></p>
        </section>

        <footer className="text-sm">
          <h2 className="sr-only">글 목록 이동</h2>

          <ul className="divide-y divide-gray-100 border-t border-b">
            <li className="py-6 px-5 flex">
              <span className="flex items-center gap-2 w-25 text-base font-semibold text-gray-600">
                <Icon type="arrowDown" size={16} className="rotate-180" />
                <span className="shrink-0">다음글</span>
              </span>
              <Link
                href="/notice/next-id"
                className="flex-1 text-base font-semibold text-gray-700 transition truncate"
              >
                공지사항 다음글입니다.
              </Link>
            </li>

            <li className="py-6 px-5 flex">
              <span className="flex items-center gap-2 w-25 text-base font-semibold text-gray-600">
                <Icon type="arrowDown" size={16} />
                <span className="shrink-0">이전글</span>
              </span>
              <Link
                href="/notice/prev-id"
                className="flex-1 text-base font-semibold text-gray-700 transition truncate"
              >
                공지사항 이전글이 들어갑니다.
              </Link>
            </li>
          </ul>

          <Link href="/notice">
            <Button
              btnType="basic"
              variant="list"
              className="mx-auto mt-15 !block"
            >
              목록
            </Button>
          </Link>
        </footer>
      </article>
    </Container>
  );
}
