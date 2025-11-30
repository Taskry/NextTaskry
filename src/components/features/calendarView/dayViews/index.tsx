"use client";

import { useMemo, useRef, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Task } from "@/types/kanban";
import DayGrid from "@/components/features/calendarView/dayViews/DayGrid";

interface DayViewProps {
  tasks: Task[];
  currentDate: Date;
  projectStartedAt?: string;
  projectEndedAt?: string;
  onSelectSlot: (date: Date, startHour?: number, endHour?: number) => void;
  onSelectEvent: (task: Task) => void;
}

export default function DayView({
  tasks,
  currentDate,
  projectStartedAt,
  projectEndedAt,
  onSelectSlot,
  onSelectEvent,
}: DayViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 시간 범위: 7시 ~ 22시
  const hours = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => i + 7);
  }, []);

  // 현재 날짜의 태스크 필터링 (월간 뷰와 동일한 로직)
  const dayTasks = useMemo(() => {
    const dateKey = format(currentDate, "yyyy-MM-dd");

    return tasks.filter((task) => {
      if (!task.started_at && !task.ended_at) return false;

      // 날짜 문자열만 추출 (시간대 무시)
      const taskStartStr = task.started_at
        ? task.started_at.split("T")[0]
        : task.ended_at!.split("T")[0];
      const taskEndStr = task.ended_at
        ? task.ended_at.split("T")[0]
        : task.started_at!.split("T")[0];

      // 현재 날짜가 일정 범위 내에 있는지 확인
      return dateKey >= taskStartStr && dateKey <= taskEndStr;
    });
  }, [tasks, currentDate]);

  // 프로젝트 범위 체크
  const isOutsideProjectRange = useMemo(() => {
    if (!projectStartedAt || !projectEndedAt) return false;
    const dateStr = format(currentDate, "yyyy-MM-dd");
    return dateStr < projectStartedAt || dateStr > projectEndedAt;
  }, [currentDate, projectStartedAt, projectEndedAt]);

  // 오늘인지 확인
  const isToday = isSameDay(currentDate, new Date());

  // 요일 정보
  const dayOfWeek = format(currentDate, "EEEE", { locale: ko });
  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

  // 초기 스크롤 (9시로)
  useEffect(() => {
    if (scrollRef.current) {
      const hourHeight = 80;
      const scrollTo = (9 - 7) * hourHeight;
      scrollRef.current.scrollTop = scrollTo;
    }
  }, [currentDate]);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* 일간 헤더 */}
      <div
        className={`
          flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700
          ${
            isOutsideProjectRange
              ? "bg-gray-100 dark:bg-gray-900"
              : isToday
              ? "bg-main-50 dark:bg-main-900/20"
              : isWeekend
              ? "bg-red-50/50 dark:bg-red-900/10"
              : "bg-white dark:bg-gray-800"
          }
        `}
      >
        {/* 왼쪽: 요일 + 날짜 */}
        <div className="flex items-baseline gap-3">
          <span
            className={`
              text-lg sm:text-xl font-semibold
              ${
                isOutsideProjectRange
                  ? "text-gray-400 dark:text-gray-600 line-through"
                  : isToday
                  ? "text-main-600 dark:text-main-400"
                  : isWeekend
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-700 dark:text-gray-300"
              }
            `}
          >
            {dayOfWeek}
          </span>
          <span
            className={`
              text-2xl sm:text-3xl font-bold
              ${
                isOutsideProjectRange
                  ? "text-gray-400 dark:text-gray-600 line-through"
                  : isToday
                  ? "text-main-600 dark:text-main-400"
                  : isWeekend
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-800 dark:text-gray-200"
              }
            `}
          >
            {format(currentDate, "d")}
          </span>

          {/* 일정 개수 */}
          {dayTasks.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({dayTasks.length}개)
            </span>
          )}
        </div>

        {/* 오른쪽: 년월 + Today 뱃지 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {format(currentDate, "yyyy년 M월", { locale: ko })}
          </span>
          {isToday && !isOutsideProjectRange && (
            <span className="px-2 py-1 bg-main-500 text-white text-xs font-semibold rounded-full">
              Today
            </span>
          )}
          {isOutsideProjectRange && (
            <span className="px-2 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full">
              프로젝트 기간 외
            </span>
          )}
        </div>
      </div>

      {/* 시간 그리드 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide">
        <DayGrid
          currentDate={currentDate}
          hours={hours}
          tasks={dayTasks}
          isOutsideProjectRange={isOutsideProjectRange}
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
        />
      </div>
    </div>
  );
}
