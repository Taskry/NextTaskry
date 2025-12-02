/**
 * 캘린더 헤더 컴포넌트
 *
 * 사용 위치: CalendarView 상단
 * 표시 내용: 프로젝트명 , 기간, 진행률, 뷰 정보, 도움말
 */

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { View } from "react-big-calendar";
import { VIEW_LABELS } from "../constants/calendarConfig";
import { showToast } from "@/lib/utils/toast";

interface CalendarHeaderProps {
  projectName: string;
  projectStartedAt?: string;
  projectEndedAt?: string;
  currentView: View;
  currentDate: Date;
  eventsCount: number;
  showHelp: boolean;
  showFilter?: boolean;
  onToggleHelp: () => void;
  onToggleFilter?: () => void;
  onAddTask?: () => void;
  onProjectInfoClick?: () => void;
}

export default function CalendarHeader({
  projectName,
  projectStartedAt,
  projectEndedAt,
  currentView,
  currentDate,
  eventsCount,
  showHelp,
  showFilter,
  onToggleHelp,
  onToggleFilter,
  onAddTask,
  onProjectInfoClick,
}: CalendarHeaderProps) {
  console.log(projectName);
  // 뷰별 날짜 포맷
  const getDateFormat = () => {
    switch (currentView) {
      case "month":
        return format(currentDate, "yyyy년 M월", { locale: ko });
      case "week":
        return format(currentDate, "M월 d일 주", { locale: ko });
      case "day":
        return format(currentDate, "M월 d일 (E)", { locale: ko });
      case "agenda":
        return "전체 일정";
      default:
        return "";
    }
  };

  // 뷰 라벨 가져오기 (타입 안전하게)
  const getViewLabel = () => {
    if (currentView in VIEW_LABELS) {
      return VIEW_LABELS[currentView as keyof typeof VIEW_LABELS];
    }
    return currentView;
  };

  /**
   * 프로젝트 기간 정보 계산 (KanbanHeader와 동일한 로직)
   */
  const getProjectPeriodInfo = () => {
    if (!projectStartedAt || !projectEndedAt) return null;

    const startDate = new Date(projectStartedAt);
    const endDate = new Date(projectEndedAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startStr = startDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const endStr = endDate.toLocaleDateString("ko-KR", {
      year: "numeric",
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

  // 프로젝트 종료 체크 (KanbanHeader와 동일한 로직)
  const handleAddTaskClick = () => {
    if (projectStartedAt && projectEndedAt) {
      const today = new Date().toISOString().split("T")[0];

      if (today < projectStartedAt) {
        showToast("아직 프로젝트가 시작되지 않았습니다.", "warning");
        return;
      }

      if (today > projectEndedAt) {
        showToast("종료된 프로젝트입니다.", "warning");
        return;
      }
    }
    onAddTask?.();
  };

  return (
    <div className="px-3 sm:px-6 py-3 sm:py-4 mb-2 sm:mb-4 border-b border-gray-200 dark:border-gray-500 bg-main-200 dark:bg-main-600 shadow-sm">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 제목 + 프로젝트 정보 버튼 + 기간 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white dark:text-gray-100">
              {projectName || "캘린더"}
            </h2>
            {/* 프로젝트 정보 버튼 */}
            {onProjectInfoClick && (
              <button
                onClick={onProjectInfoClick}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                title="프로젝트 정보"
              >
                <svg
                  className="w-5 h-5 text-white/80 hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            )}
          </div>
          {/* 프로젝트 기간 & 상태 뱃지 (KanbanHeader와 동일) */}
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
          {/* 종료된 프로젝트 안내 문구 */}
          {projectPeriod?.status === "ended" && (
            <div className="flex items-center gap-1.5 text-xs bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-200 px-2.5 py-1 rounded-md border border-sky-300 dark:border-sky-700">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">
                이 프로젝트는 종료되었습니다. 일정 추가/수정이 제한됩니다.
              </span>
            </div>
          )}
        </div>

        {/* 오른쪽: 뷰/일정/도움말 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 현재 뷰 표시 */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="px-2 py-1 bg-white/20 rounded-full text-xs text-white font-medium">
              {getViewLabel()}
            </div>
          </div>

          {/* 일정 개수 및 날짜 */}
          <div className="text-sm font-medium text-white/90 dark:text-gray-200 text-right">
            <div>{eventsCount}개 일정</div>
            <div className="text-xs text-white/70 dark:text-gray-300">
              {getDateFormat()}
            </div>
          </div>

          {/* 새 작업 버튼 (KanbanHeader와 동일) */}
          {onAddTask && (
            <button
              onClick={handleAddTaskClick}
              className="px-3 sm:px-4 py-2 bg-main-400 dark:bg-main-500 text-white rounded-lg hover:bg-main-500 dark:hover:bg-main-400 active:bg-main-600 dark:active:bg-main-600 transition-all text-xs sm:text-sm font-medium shadow-sm"
            >
              <span className="hidden sm:inline">+ 새 작업</span>
              <span className="sm:hidden">+</span>
            </button>
          )}

          {/* 필터 버튼 */}
          {onToggleFilter && (
            <button
              onClick={onToggleFilter}
              className={`p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors ${
                showFilter ? "bg-white/20" : ""
              }`}
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
          )}

          {/* 도움말 버튼 */}
          <button
            onClick={onToggleHelp}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
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
    </div>
  );
}
