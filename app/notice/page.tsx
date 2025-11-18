"use client";

import { useEffect } from "react";
import Button from "../components/Button/Button";
import EmptyNotice from "../components/Notice/EmptyNotice";
import NoticeList from "../components/Notice/NoticeList";
import { SectionHeader } from "../components/SectionHeader";
import Container from "../components/UI/Container";
import { primaryBgColor, primaryBorderColor } from "../sample/color/page";

export default function Page() {
  const data = [
    {
      id: "120",
      type: "key",
      title: "중요 공지로 설정한 공지사항이 들어갑니다.",
      date: "2025-11-10",
    },
    {
      id: "119",
      type: "normal",
      title: "공지사항 제목이 들어갑니다.",
      date: "2025-11-13",
    },
    {
      id: "118",
      type: "normal",
      title: "공지사항 제목이 들어갑니다.",
      date: "2025-11-12",
    },
    {
      id: "117",
      type: "normal",
      title: "공지사항 제목이 들어갑니다.",
      date: "2025-11-11",
    },
    {
      id: "116",
      type: "normal",

      title: "공지사항 제목이 들어갑니다.",
      date: "2025-11-10",
    },
    {
      id: "115",
      type: "normal",

      title: "공지사항 제목이 들어갑니다.",
      date: "2025-11-09",
    },
    {
      id: "114",
      type: "normal",
      title: "공지사항 제목이 들어갑니다.",
      date: "2025-11-09",
    },
    {
      id: "113",
      type: "normal",
      title: "공지사항 제목이 들어갑니다.",
      date: "2025-11-09",
    },
  ];
  const allNotices = data.length;

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
      <SectionHeader
        title="공지사항"
        description="공지사항을 안내합니다."
        className="mb-15"
      />

      {data ? (
        <div>
          <p
            className={`pb-2 border-b text-base font-bold ${primaryBorderColor.Color2[0]}`}
          >
            총 {allNotices}개
          </p>
          <NoticeList data={data} />
        </div>
      ) : (
        <EmptyNotice />
      )}
    </Container>
  );
}
