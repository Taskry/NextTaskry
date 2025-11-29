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

interface CalendarHeaderProps {
  projectName: string;
  projectStartedAt?: string;
  projectEndedAt?: string;
  currentView: View;
  currentDate: Date;
  eventsCount: number;
  showHelp: boolean;
  onToggleHelp: () => void;
}

export default function CalendarHeader({
  projectName,
  projectStartedAt,
  projectEndedAt,
  currentView,
  currentDate,
  eventsCount,
  showHelp,
  onToggleHelp,
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
   *
   * @returns
   * - totalDays: 총 기간 일수
   * - elapsedDays: 경과 일수
   * - remainingDays: 남은 일수
   * - progress: 진행률 (백분율)
   * - startStr: 시작일 (포맷된 문자열)
   * - endStr: 종료일 (포맷된 문자열)
   * 프로젝트 진행률 계산
   */
  const getProjectProgress = () => {
    if (!projectStartedAt || !projectEndedAt) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(projectStartedAt);
    start.setHours(0, 0, 0, 0);
    const end = new Date(projectEndedAt);
    end.setHours(0, 0, 0, 0);

    const totalDays =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const elapsedDays = Math.ceil(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const remainingDays = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const progress = Math.round((elapsedDays / totalDays) * 100);

    return {
      progress,
      totalDays,
      elapsedDays,
      remainingDays,
      startStr: format(start, "yyyy.MM.dd", { locale: ko }),
      endStr: format(end, "yyyy.MM.dd", { locale: ko }),
    };
  };

  const projectProgress = getProjectProgress();

  // 툴팁 내용
  const getTooltipContent = () => {
    if (!projectProgress) return "";
    const { elapsedDays, remainingDays, startStr, endStr } = projectProgress;
    return `기간: ${startStr} - ${endStr}\n경과: ${elapsedDays}일\n남은 기간: ${remainingDays}일`;
  };

  // 프로젝트 기간 포맷
  const getProjectPeriodFormat = () => {
    if (!projectStartedAt || !projectEndedAt) return null;

    const start = format(new Date(projectStartedAt), "yyyy.MM.dd", {
      locale: ko,
    });
    const end = format(new Date(projectEndedAt), "yyyy.MM.dd", { locale: ko });

    // 총 일수 계산
    const startDate = new Date(projectStartedAt);
    const endDate = new Date(projectEndedAt);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const dayCount = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;

    return `${start} - ${end} (${dayCount}일)`;
  };

  return (
    <div className="px-3 sm:px-6 py-3 sm:py-4 mb-2 sm:mb-4 border-b border-gray-200 dark:border-gray-500 bg-main-200 dark:bg-main-600 shadow-sm">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 제목 + 프로젝트 기간 */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg sm:text-xl font-bold text-white dark:text-gray-100">
            {projectName || "캘린더"}
          </h2>
          {/* 프로젝트 기간 & D-Day (한 줄 컴팩트) */}
          {projectProgress && (
            <div
              className="hidden sm:flex items-center gap-2 text-xs text-white/80 dark:text-gray-200 cursor-help"
              title={getTooltipContent()}
            >
              <span>|</span>
              <span>
                {projectProgress.startStr} ~ {projectProgress.endStr}
              </span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full font-medium">
                D-{projectProgress.remainingDays}
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
