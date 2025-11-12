// components/kanban/KanbanBoard.tsx
"use client";

import { useState } from "react";
import { KANBAN_COLUMNS, MOCK_TASKS_DATA } from "@/lib/constants";
import KanbanColumn from "./KanbanColumn";
import Button from "../Button/Button";

type ViewType = "calendar" | "kanban" | "memo" | "project";

const KanbanBoard = () => {
  const [activeView, setActiveView] = useState<ViewType>("kanban");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 p-8">
        {/* 캘린더 뷰 */}
        {activeView === "calendar" && (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-lg">캘린더 기능 준비 중...</p>
          </div>
        )}

        {/* 칸반보드 뷰 */}
        {activeView === "kanban" && (
          <>
            {/* 버튼 */}
            <div className="mb-6 flex justify-end">
              <Button variant="bgMain300" size="base" textColor="white">
                + 새 작업
              </Button>
            </div>

            {/* 칸반 박스 */}
            <div className="bg-main-200/40 rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  프로젝트명이 들어갑니다
                </h2>
              </div>

              {/* 칸반 그리드 */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-3 gap-6">
                  {KANBAN_COLUMNS.map((column) => (
                    <KanbanColumn
                      key={column.id}
                      id={column.id}
                      title={column.title}
                      color={column.color}
                      tasks={MOCK_TASKS_DATA[column.id]}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* 프로젝트 뷰 */}
        {activeView === "project" && (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-lg">프로젝트 기능 준비 중...</p>
          </div>
        )}
      </div>

      {/* 하단 메뉴 - 트렐로 스타일 */}
      <div className="border-t border-gray-200 bg-white">
        <div className="flex justify-center items-center gap-1 px-4 py-3">
          <button
            onClick={() => setActiveView("calendar")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-md border transition-all ${
              activeView === "calendar"
                ? "text-blue-600 bg-blue-50 border-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span
              className={`text-xs ${
                activeView === "calendar" ? "font-bold" : "font-medium"
              }`}
            >
              캘린더
            </span>
          </button>

          <button
            onClick={() => setActiveView("kanban")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-md border transition-all ${
              activeView === "kanban"
                ? "text-blue-600 bg-blue-50 border-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            <span
              className={`text-xs ${
                activeView === "kanban" ? "font-bold" : "font-medium"
              }`}
            >
              칸반보드
            </span>
          </button>

          <button
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-md border transition-all ${
              activeView === "memo"
                ? "text-blue-600 bg-blue-50 border-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span
              className={`text-xs ${
                activeView === "memo" ? "font-bold" : "font-medium"
              }`}
            >
              메모
            </span>
          </button>

          <div className="h-8 w-px bg-gray-300 mx-1"></div>

          <button
            onClick={() => setActiveView("project")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-md border transition-all ${
              activeView === "project"
                ? "text-blue-600 bg-blue-50 border-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <span
              className={`text-xs ${
                activeView === "project" ? "font-bold" : "font-medium"
              }`}
            >
              프로젝트
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
