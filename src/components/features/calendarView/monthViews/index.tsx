"use client";

import { useMemo, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";
import { Task } from "@/types/kanban";
import MonthGrid from "./MonthGrid";

interface MonthViewProps {
  tasks: Task[];
  currentDate: Date;
  projectStartedAt?: string;
  projectEndedAt?: string;
  onSelectSlot: (date: Date) => void;
  onSelectRange?: (startDate: Date, endDate: Date) => void;
  onSelectEvent: (task: Task) => void;
}

export default function MonthView({
  tasks,
  currentDate,
  projectStartedAt,
  projectEndedAt,
  onSelectSlot,
  onSelectRange,
  onSelectEvent,
}: MonthViewProps) {
  // 월의 시작일과 끝일
  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate]);
  const monthEnd = useMemo(() => endOfMonth(currentDate), [currentDate]);

  // 달력에 표시할 시작일 (해당 월 시작 주의 일요일)
  const calendarStart = useMemo(
    () => startOfWeek(monthStart, { weekStartsOn: 0 }),
    [monthStart]
  );

  // 달력에 표시할 끝일 (해당 월 마지막 주의 토요일)
  const calendarEnd = useMemo(
    () => endOfWeek(monthEnd, { weekStartsOn: 0 }),
    [monthEnd]
  );

  // 달력에 표시할 모든 날짜 (6주 = 42일)
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [calendarStart, calendarEnd]);

  // 주 단위로 그룹핑
  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  // 날짜별 태스크 그룹핑
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};

    tasks.forEach((task) => {
      if (!task.started_at && !task.ended_at) return;

      const startDate = task.started_at
        ? new Date(task.started_at)
        : new Date(task.ended_at!);
      const endDate = task.ended_at
        ? new Date(task.ended_at)
        : new Date(task.started_at!);

      // 시작일부터 종료일까지 모든 날짜에 태스크 추가
      let current = new Date(startDate);
      current.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      while (current <= end) {
        const dateKey = format(current, "yyyy-MM-dd");
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(task);
        current = addDays(current, 1);
      }
    });

    return grouped;
  }, [tasks]);

  // 프로젝트 범위 체크
  const isOutsideProjectRange = useCallback(
    (date: Date) => {
      if (!projectStartedAt || !projectEndedAt) return false;
      const dateStr = format(date, "yyyy-MM-dd");
      return dateStr < projectStartedAt || dateStr > projectEndedAt;
    },
    [projectStartedAt, projectEndedAt]
  );

  // 해당 월인지 체크
  const isCurrentMonth = useCallback(
    (date: Date) => isSameMonth(date, currentDate),
    [currentDate]
  );

  // 요일 헤더
  const weekDayHeaders = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-gray-900 overflow-hidden">
      {/* 요일 헤더 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
        {weekDayHeaders.map((day, index) => (
          <div
            key={day}
            className={`
              flex-1 p-1.5 sm:p-3 text-center text-xs sm:text-sm font-semibold border-r border-gray-200 dark:border-gray-700 last:border-r-0
              ${
                index === 0
                  ? "text-red-500 dark:text-red-400"
                  : index === 6
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <MonthGrid
        weeks={weeks}
        tasksByDate={tasksByDate}
        isOutsideProjectRange={isOutsideProjectRange}
        isCurrentMonth={isCurrentMonth}
        onSelectSlot={onSelectSlot}
        onSelectRange={onSelectRange}
        onSelectEvent={onSelectEvent}
      />
    </div>
  );
}
