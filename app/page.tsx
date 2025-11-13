// app/page.tsx

"use client";

import { useState } from "react";
import KanbanBoard from "./components/kanban/KanbanBoard";
import MemoPanel from "./components/kanban/MemoPanel";
import BottomNavigation from "./components/BottomNavigation";
import Button from "./components/Button/Button";

type ViewType = "calendar" | "kanban" | "memo" | "project";

const Home = () => {
  const [currentView, setCurrentView] = useState<ViewType>("kanban");
  const [showMemoPanel, setShowMemoPanel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewChange = (view: ViewType) => {
    if (view === "memo") {
      setShowMemoPanel(!showMemoPanel);
    } else {
      setCurrentView(view);
      setShowMemoPanel(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 ">
      {/* 버튼 영역 -> 오른쪽 끝 위치고정 */}
      <div className="px-6 pt-6 pb-2 flex justify-end">
        <Button
          variant="bgMain300"
          size="base"
          textColor="white"
          onClick={() => setIsModalOpen(true)}
        >
          + 새 작업
        </Button>
      </div>

      {/* 메인 영역 */}
      <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-6 min-h-0">
        {/* 왼쪽: 메인 뷰 */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 min-h-0 ${
            showMemoPanel ? "flex-[0.7]" : "flex-1"
          }`}
        >
          {/* 컨텐츠 영역 */}
          <div className="flex-1 overflow-hidden min-h-0">
            {currentView === "kanban" && <KanbanBoard />}

            {currentView === "calendar" && (
              <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-sm">
                <p className="text-gray-400 text-lg">📅 캘린더 (준비 중)</p>
              </div>
            )}

            {currentView === "project" && (
              <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-sm">
                <p className="text-gray-400 text-lg">📁 프로젝트 (준비 중)</p>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 메모 패널 */}
        <div
          className={`flex flex-col transition-all duration-300 overflow-hidden min-h-0 ${
            showMemoPanel ? "flex-[0.3] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <MemoPanel />
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="shrink-0">
        <BottomNavigation
          activeView={showMemoPanel ? "memo" : currentView}
          onViewChange={handleViewChange}
        />
      </div>
    </div>
  );
};

export default Home;
