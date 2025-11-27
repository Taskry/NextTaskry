"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Container from "@/components/shared/Container";
import AdminProjectsPage from "./projects/page";
import AdminNoticesPage from "./notice/page";
import AdminUsersPage from "./users/page";
import Button from "@/components/ui/Button";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "projects";

  const tabsData = [
    { key: "projects", label: "프로젝트 관리" },
    { key: "users", label: "유저 관리" },
    { key: "notices", label: "공지사항 관리" },
  ];

  const handleTabChange = (tabkey: string) => {
    router.push(`?tab=${tabkey}`, { scroll: false });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return <AdminProjectsPage />;
      case "users":
        return <AdminUsersPage />;
      case "notices":
        return <AdminNoticesPage />;
      default:
        return null;
    }
  };

  useEffect(() => {
    // 공지사항 페이지 진입 시 스크롤 활성화
    document.body.classList.remove("overflow-hidden", "h-full");

    return () => {
      // 공지사항 페이지 떠날 때 다시 비활성화
      document.body.classList.add("overflow-hidden", "h-full");
    };
  }, []);

  return (
    <section className="max-w-4xl m-auto py-25">
      <SectionHeader
        title="관리자 대시보드"
        description="사이트 운영을 관리합니다."
      />
      <nav className="flex gap-3 mb-8">
        {tabsData.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Button
              key={tab.key}
              btnType="tab"
              isActive={isActive}
              onClick={() => handleTabChange(tab.key)}
              className="bg-transparent"
            >
              {tab.label}
            </Button>
          );
        })}
      </nav>
      {renderContent()}
    </section>
  );
}
