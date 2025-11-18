"use client";
import Button from "@/app/components/Button/Button";
import { Icon } from "@/app/components/Icon/Icon";
import Container from "@/app/components/UI/Container";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    document.body.classList.remove("overflow-hidden");
    document.body.classList.remove("h-full");

    return () => {
      document.body.classList.add("overflow-hidden");
      document.body.classList.add("h-full");
    };
  }, []);

  return (
    <Container>
      <article className="max-w-4xl mx-auto bg-white border-t border-t-gray-600">
        <header className="border-b p-5 flex items-center justify-between">
          <h1 className="text-lg font-bold text-main-700">
            공지사항 제목이 들어갑니다.
          </h1>

          <div className="text-base text-gray-600 font-normal">
            <span className="font-medium">작성일</span>
            <span className="pl-2">|</span>
            <time datetime="2025-11-10" className="pl-2">
              2025-11-10
            </time>
          </div>
        </header>

        <section className="min-h-[350px] py-7 px-5 bg-[#FAFAFA]">
          <h2 className="sr-only">공지사항 내용</h2>
          <p className="text-base text-gray-700 leading-relaxed">
            공지사항 내용
          </p>
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

          <Button
            btnType="basic"
            variant="list"
            className="mx-auto mt-15 !block"
          >
            목록
          </Button>
        </footer>
      </article>
    </Container>
  );
}
