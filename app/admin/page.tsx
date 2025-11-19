"use client";

import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import Container from "../components/UI/Container";
import AdminProjectsPage from "./projects/page";
import AdminNoticesPage from "./notice/page";
import AdminUsersPage from "./users/page";
import Button from "../components/Button/Button";

export default function Page() {
  const [activeTab, setActiveTab] = useState("projects");
  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return <AdminProjectsPage />;
      case "users":
        return <AdminUsersPage />;
      case "notices":
        return <AdminNoticesPage />;
    }
  };

  return (
    <Container>
      <SectionHeader title="관리자 대시보드" />
      <nav className="flex gap-3 mb-8">
        <Button onClick={() => setActiveTab("projects")}>프로젝트 관리</Button>
        <Button onClick={() => setActiveTab("users")}>유저 관리</Button>
        <Button onClick={() => setActiveTab("notices")}>공지사항 관리</Button>
      </nav>
      {renderContent()}
    </Container>
  );
}
