// src/components/features/kanban/components/KanbanHeader.tsx
"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { showToast } from "@/lib/utils/toast";

interface KanbanHeaderProps {
  projectName: string;
  onAddClick: () => void;
  onToggleFilter: () => void;
  onToggleHelp: () => void;
  showHelp: boolean;
  tasksCount: number;
  project?: {
    project_id?: string;
    project_name: string;
    started_at?: string;
    ended_at?: string;
  } | null;
}

export default function KanbanHeader({
  projectName,
  onAddClick,
  onToggleFilter,
  onToggleHelp,
  showHelp,
  tasksCount,
  project,
}: KanbanHeaderProps) {
  // 프로젝트 기간 정보 계산
  const getProjectPeriodInfo = () => {
    if (!project?.started_at || !project?.ended_at) return null;

    const startDate = new Date(project.started_at);
    const endDate = new Date(project.ended_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startStr = startDate.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
    const endStr = endDate.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });

    // 남은 일수 계산
    const timeDiff = endDate.getTime() - today.getTime();
    const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // 시작까지 남은 일수
    const timeToStart = startDate.getTime() - today.getTime();
    const daysToStart = Math.ceil(timeToStart / (1000 * 3600 * 24));

    // 프로젝트 상태 판단
    let status: "before" | "active" | "warning" | "ended";
    let badgeText: string;
    let badgeColor: string;

    if (today < startDate) {
      // 시작 전
      status = "before";
      badgeText = `시작 D-${daysToStart}`;
      badgeColor = "bg-blue-500 text-white";
    } else if (today > endDate) {
      // 종료
      status = "ended";
      badgeText = "종료";
      badgeColor = "bg-red-500 text-white";
    } else if (remainingDays <= 3) {
      // 마감 임박 (3일 이하)
      status = "warning";
      badgeText = `D-${remainingDays} ⚠️`;
      badgeColor = "bg-orange-500 text-white";
    } else {
      // 진행 중
      status = "active";
      badgeText = `D-${remainingDays}`;
      badgeColor = "bg-white/20 text-white";
    }

    return {
      startStr,
      endStr,
      remainingDays,
      status,
      badgeText,
      badgeColor,
    };
  };

  const projectPeriod = getProjectPeriodInfo();

  // 프로젝트 종료 체크
  const handleAddClick = () => {
    if (project?.ended_at) {
      const today = new Date().toISOString().split("T")[0];
      const startDate = project.started_at;

      if (today < startDate!) {
        showToast("아직 프로젝트가 시작되지 않았습니다.", "warning");
        return;
      }

      if (today > project.ended_at) {
        showToast("종료된 프로젝트입니다.", "warning");
        return;
      }
    }
    onAddClick();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-4 mb-4 border-b border-gray-200 dark:border-gray-500 bg-main-200 dark:bg-main-600 rounded-lg shadow-sm gap-3 sm:gap-0">
      {/* 왼쪽: 프로젝트명 + 기간 정보 */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-gray-100">
          {projectName}
        </h2>
        {projectPeriod && (
          <div className="flex items-center gap-2 text-xs text-white/80 dark:text-gray-200">
            <span>|</span>
            <span>
              {projectPeriod.startStr} ~ {projectPeriod.endStr}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full font-medium ${projectPeriod.badgeColor}`}
            >
              {projectPeriod.badgeText}
            </span>
          </div>
        )}
      </div>

      {/* 오른쪽: 칸반보드 표시 + 작업 개수 + 오늘 날짜 + 버튼들 */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* 칸반보드 뷰 표시 */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="px-2 py-1 bg-white/20 rounded-full text-xs text-white font-medium">
            칸반보드
          </div>
        </div>

        {/* 작업 개수 및 오늘 날짜 */}
        <div className="text-sm font-medium text-white/90 dark:text-gray-200 text-right">
          <div>{tasksCount}개 작업</div>
          <div className="text-xs text-white/70 dark:text-gray-300">
            {format(new Date(), "M월 d일 (E)", { locale: ko })}
          </div>
        </div>

        <button
          onClick={handleAddClick}
          className="px-3 sm:px-4 py-2 bg-main-400 dark:bg-main-500 text-white rounded-lg hover:bg-main-500 dark:hover:bg-main-400 active:bg-main-600 dark:active:bg-main-600 transition-all text-xs sm:text-sm font-medium shadow-sm"
        >
          <span className="hidden sm:inline">+ 새 작업</span>
          <span className="sm:hidden">+</span>
        </button>

        <button
          onClick={onToggleFilter}
          className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
          title="필터"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
            />
          </svg>
        </button>

        {/* 도움말 버튼 */}
        <button
          onClick={onToggleHelp}
          className={`p-1.5 hover:bg-white/20 rounded-lg transition-colors ${
            showHelp ? "bg-white/20" : ""
          }`}
          title={showHelp ? "도움말 닫기" : "도움말 열기"}
        >
          <svg
            className={`w-4 h-4 text-white transition-transform duration-300 ${
              showHelp ? "scale-110" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
