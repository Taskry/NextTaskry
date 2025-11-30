"use client";

import { useMemo, useCallback, useEffect, useRef } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Task } from "@/types/kanban";
import WeekGrid from "@/components/features/calendarView/weekViews/WeekGrid";
import WeekMultiDayEvents from "@/components/features/calendarView/weekViews/WeekMultiDayEvents";

interface WeekViewProps {
  tasks: Task[];
  currentDate: Date;
  projectStartedAt?: string;
  projectEndedAt?: string;
  onSelectSlot: (
    startDate: Date,
    endDate: Date,
    startHour?: number,
    endHour?: number
  ) => void;
  onSelectEvent: (task: Task) => void;
}

export default function WeekView({
  tasks,
  currentDate,
  projectStartedAt,
  projectEndedAt,
  onSelectSlot,
  onSelectEvent,
}: WeekViewProps) {
  // 스크롤 컨테이너 ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 주의 시작일 (일요일)
  const weekStart = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 0 }),
    [currentDate]
  );

  // 주간 날짜 배열 (일~토)
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // 시간 배열 (7시~22시 - 업무 시간 기준)
  const hours = useMemo(() => Array.from({ length: 16 }, (_, i) => i + 7), []);

  // 날짜별 태스크 그룹핑 (월간 뷰와 동일한 로직)
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};

    tasks.forEach((task) => {
      if (!task.started_at && !task.ended_at) return;

      // 날짜 문자열만 추출 (시간대 무시)
      const taskStartStr = task.started_at
        ? task.started_at.split("T")[0]
        : task.ended_at!.split("T")[0];
      const taskEndStr = task.ended_at
        ? task.ended_at.split("T")[0]
        : task.started_at!.split("T")[0];

      // 시작일부터 종료일까지 모든 날짜에 태스크 추가 (주간 범위 내만)
      weekDays.forEach((day) => {
        const dateKey = format(day, "yyyy-MM-dd");
        // 현재 날짜가 일정 범위 내에 있는지 확인
        if (dateKey >= taskStartStr && dateKey <= taskEndStr) {
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(task);
        }
      });
    });

    return grouped;
  }, [tasks, weekDays]);

  // 프로젝트 범위 체크
  const isOutsideProjectRange = useCallback(
    (date: Date) => {
      if (!projectStartedAt || !projectEndedAt) return false;
      const dateStr = format(date, "yyyy-MM-dd");
      return dateStr < projectStartedAt || dateStr > projectEndedAt;
    },
    [projectStartedAt, projectEndedAt]
  );

  // 자동 스크롤 (오전 9시 위치로 - 업무 시작 시간)
  useEffect(() => {
    if (scrollContainerRef.current) {
      // 7시부터 시작하므로 9시 = 2칸 아래 (2 * 50px = 100px)
      scrollContainerRef.current.scrollTop = 2 * 50;
    }
  }, [currentDate]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-gray-900">
      {/* 헤더: 요일 (고정) */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
        {/* 시간 컬럼 헤더 */}
        <div className="w-10 sm:w-16 shrink-0 border-r border-gray-200 dark:border-gray-700" />

        {/* 요일 헤더 */}
        {weekDays.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          const isOutside = isOutsideProjectRange(day);
          const isSunday = index === 0;
          const isSaturday = index === 6;

          return (
            <div
              key={day.toISOString()}
              className={`
                  flex-1 p-1.5 sm:p-3 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0
                  ${isOutside ? "opacity-30" : ""}
                `}
            >
              <div
                className={`
                  text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1
                  ${
                    isToday
                      ? "text-main-600 dark:text-main-400"
                      : isSunday
                      ? "text-red-500 dark:text-red-400"
                      : isSaturday
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }
                `}
              >
                {format(day, "E", { locale: ko })}
              </div>
              <div
                className={`
                  text-base sm:text-lg font-semibold
                  ${
                    isToday
                      ? "text-white bg-main-500 dark:bg-main-400 rounded-full w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center mx-auto"
                      : isSunday
                      ? "text-red-500 dark:text-red-400"
                      : isSaturday
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-800 dark:text-gray-200"
                  }
                `}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* 기간 일정 (여러 날에 걸친 일정) - 별도 영역 */}
      <div className="shrink-0 bg-gray-50 dark:bg-gray-800/50">
        <WeekMultiDayEvents
          tasks={tasks}
          weekDays={weekDays}
          onSelectEvent={onSelectEvent}
        />
      </div>

      {/* 스크롤 컨테이너 - 그리드 영역 (스크롤바 숨김) */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* 그리드: 시간 x 요일 */}
        <WeekGrid
          weekDays={weekDays}
          hours={hours}
          tasksByDate={tasksByDate}
          isOutsideProjectRange={isOutsideProjectRange}
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
        />
      </div>
    </div>
  );
}
