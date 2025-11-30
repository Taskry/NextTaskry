"use client";

import { useMemo } from "react";
import {
  format,
  addDays,
  startOfDay,
  endOfDay,
  isToday,
  isBefore,
} from "date-fns";
import { ko } from "date-fns/locale";
import { Task } from "@/types/kanban";
import AgendaEventCard from "./AgendaEventCard";

interface AgendaViewProps {
  tasks: Task[];
  currentDate: Date;
  projectStartedAt?: string;
  projectEndedAt?: string;
  onSelectSlot: (date: Date) => void;
  onSelectEvent: (task: Task) => void;
}

// 30일 기간으로 표시
const AGENDA_DAYS = 30;

export default function AgendaView({
  tasks,
  currentDate,
  projectStartedAt,
  projectEndedAt,
  onSelectSlot,
  onSelectEvent,
}: AgendaViewProps) {
  // 표시할 날짜 범위 (현재 날짜부터 30일)
  const dateRange = useMemo(() => {
    const days: Date[] = [];
    let day = startOfDay(currentDate);
    for (let i = 0; i < AGENDA_DAYS; i++) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentDate]);

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

      // 표시 범위 내의 날짜만 처리
      dateRange.forEach((day) => {
        const dateKey = format(day, "yyyy-MM-dd");
        // 현재 날짜가 일정 범위 내에 있는지 확인
        if (dateKey >= taskStartStr && dateKey <= taskEndStr) {
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(task);
        }
      });
    });

    return grouped;
  }, [tasks, dateRange]);

  // 일정이 있는 날짜만 필터링
  const datesWithTasks = useMemo(() => {
    return dateRange.filter((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      return tasksByDate[dateKey] && tasksByDate[dateKey].length > 0;
    });
  }, [dateRange, tasksByDate]);

  // 프로젝트 범위 체크
  const isOutsideProjectRange = (date: Date) => {
    if (!projectStartedAt || !projectEndedAt) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    return dateStr < projectStartedAt || dateStr > projectEndedAt;
  };

  // 요일 색상 결정
  const getDayColor = (date: Date) => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return "text-red-500 dark:text-red-400"; // 일요일
    if (dayOfWeek === 6) return "text-blue-500 dark:text-blue-400"; // 토요일
    return "text-gray-700 dark:text-gray-300";
  };

  // 전체 일정 수 계산
  const totalTaskCount = useMemo(() => {
    return Object.values(tasksByDate).reduce(
      (sum, tasks) => sum + tasks.length,
      0
    );
  }, [tasksByDate]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-gray-900 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {format(currentDate, "yyyy년 M월", { locale: ko })}부터{" "}
            {AGENDA_DAYS}일간
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({datesWithTasks.length}일, {totalTaskCount}개 일정)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-main-400"></span>
            <span className="text-gray-600 dark:text-gray-400">할일</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="text-gray-600 dark:text-gray-400">진행중</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="text-gray-600 dark:text-gray-400">완료</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <span className="text-gray-600 dark:text-gray-400">지연</span>
          </span>
        </div>
      </div>

      {/* 일정 목록 */}
      <div className="flex-1 overflow-y-auto">
        {datesWithTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <svg
              className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm font-medium">일정이 없습니다</p>
            <p className="text-xs mt-1">해당 기간에 등록된 일정이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {datesWithTasks.map((date) => {
              const dateKey = format(date, "yyyy-MM-dd");
              const dayTasks = tasksByDate[dateKey] || [];
              const isDateToday = isToday(date);
              const isPast =
                isBefore(endOfDay(date), new Date()) && !isDateToday;
              const isOutside = isOutsideProjectRange(date);

              return (
                <div
                  key={dateKey}
                  className={`
                    flex
                    ${isOutside ? "opacity-50" : ""}
                    ${isPast ? "bg-gray-50/50 dark:bg-gray-800/30" : ""}
                    ${isDateToday ? "bg-main-50/50 dark:bg-main-900/20" : ""}
                  `}
                >
                  {/* 날짜 컬럼 */}
                  <div
                    className={`
                      w-24 sm:w-32 shrink-0 p-3 sm:p-4 border-r border-gray-100 dark:border-gray-800
                      flex flex-col items-center justify-start
                      ${isDateToday ? "bg-main-100/50 dark:bg-main-900/30" : ""}
                      cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                    `}
                    onClick={() => !isOutside && onSelectSlot(date)}
                  >
                    <span
                      className={`text-2xl sm:text-3xl font-bold ${getDayColor(
                        date
                      )}`}
                    >
                      {format(date, "d")}
                    </span>
                    <span className={`text-xs ${getDayColor(date)}`}>
                      {format(date, "EEEE", { locale: ko })}
                    </span>
                    {isDateToday && (
                      <span className="mt-1 px-1.5 py-0.5 text-[10px] font-medium bg-main-500 text-white rounded">
                        오늘
                      </span>
                    )}
                  </div>

                  {/* 일정 컬럼 */}
                  <div className="flex-1 p-2 sm:p-3">
                    <AgendaEventCard
                      tasks={dayTasks}
                      onSelectEvent={onSelectEvent}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
