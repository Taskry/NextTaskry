// app/page.tsx

"use client";

import { useState } from "react";
import KanbanBoard from "./components/kanban/KanbanBoard";
import MemoPanel from "./components/kanban/MemoPanel";
import BottomNavigation from "./components/BottomNavigation";

type ViewType = "calendar" | "kanban" | "memo" | "project";

const Home = () => {
  const [currentView, setCurrentView] = useState<ViewType>("kanban");
  const [showMemoPanel, setShowMemoPanel] = useState(false);

  // 메모 버튼 클릭 시 토글
  const handleViewChange = (view: ViewType) => {
    if (view === "memo") {
      // 메모 버튼 누르면 토글
      setShowMemoPanel(!showMemoPanel);
    } else {
      // 다른 뷰로 전환
      setCurrentView(view);
      setShowMemoPanel(false); // 메모패널 닫기
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 메인 영역 */}
      <div className="flex-1 flex overflow-hidden gap-6 p-6">
        {/* 메인 뷰 - 메모패널 열리면 좁아짐 */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showMemoPanel ? "flex-[0.7]" : "flex-1"
          }`}
        >
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

        {/* 메모 패널 - 토글로 나타남/사라짐 */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showMemoPanel ? "flex-[0.3] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <MemoPanel />
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation
        activeView={showMemoPanel ? "memo" : currentView}
        onViewChange={handleViewChange}
      />
    </div>
  );
};

export default Home;
