"use client";

import { useState, useCallback } from "react";
import { format, isSameDay } from "date-fns";
import { Task } from "@/types/kanban";
import MonthEventCard from "./MonthEventCard";

interface MonthGridProps {
  weeks: Date[][];
  tasksByDate: Record<string, Task[]>;
  isOutsideProjectRange: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  onSelectSlot: (date: Date) => void;
  onSelectRange?: (startDate: Date, endDate: Date) => void;
  onSelectEvent: (task: Task) => void;
}

// 더블클릭 감지 임계값 (ms)
const DOUBLE_CLICK_THRESHOLD = 300;

export default function MonthGrid({
  weeks,
  tasksByDate,
  isOutsideProjectRange,
  isCurrentMonth,
  onSelectSlot,
  onSelectRange,
  onSelectEvent,
}: MonthGridProps) {
  // 더블클릭 감지를 위한 상태
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [lastClickedSlot, setLastClickedSlot] = useState<string>("");

  // 드래그 선택을 위한 상태
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDate, setDragStartDate] = useState<Date | null>(null);
  const [dragEndDate, setDragEndDate] = useState<Date | null>(null);

  // 드래그 시작
  const handleMouseDown = useCallback((day: Date, isOutside: boolean) => {
    if (isOutside) return;
    setIsDragging(true);
    setDragStartDate(day);
    setDragEndDate(day);
  }, []);

  // 드래그 중
  const handleMouseEnter = useCallback(
    (day: Date, isOutside: boolean) => {
      if (!isDragging || isOutside) return;
      setDragEndDate(day);
    },
    [isDragging]
  );

  // 드래그 종료
  const handleMouseUp = useCallback(() => {
    if (!isDragging || !dragStartDate || !dragEndDate) {
      setIsDragging(false);
      return;
    }

    // 시작일과 종료일 정렬
    const start = dragStartDate <= dragEndDate ? dragStartDate : dragEndDate;
    const end = dragStartDate <= dragEndDate ? dragEndDate : dragStartDate;

    // 여러 날짜 선택 시 범위 선택 콜백 호출
    if (!isSameDay(start, end) && onSelectRange) {
      onSelectRange(start, end);
    }

    // 상태 초기화
    setIsDragging(false);
    setDragStartDate(null);
    setDragEndDate(null);
  }, [isDragging, dragStartDate, dragEndDate, onSelectRange]);

  // 날짜가 드래그 범위 내에 있는지 확인
  const isInDragRange = useCallback(
    (day: Date) => {
      if (!isDragging || !dragStartDate || !dragEndDate) return false;
      const start = dragStartDate <= dragEndDate ? dragStartDate : dragEndDate;
      const end = dragStartDate <= dragEndDate ? dragEndDate : dragStartDate;
      return day >= start && day <= end;
    },
    [isDragging, dragStartDate, dragEndDate]
  );

  // 슬롯 클릭 핸들러 (더블클릭 감지)
  const handleSlotClick = useCallback(
    (day: Date, isOutside: boolean) => {
      if (isOutside) return;

      const slotKey = format(day, "yyyy-MM-dd");
      const now = Date.now();
      const timeDiff = now - lastClickTime;

      // 더블클릭 감지
      if (slotKey === lastClickedSlot && timeDiff < DOUBLE_CLICK_THRESHOLD) {
        // 더블클릭! 일정 추가 모달 열기
        onSelectSlot(day);
        setLastClickTime(0);
        setLastClickedSlot("");
      } else {
        // 첫 클릭 - 대기 상태
        setLastClickTime(now);
        setLastClickedSlot(slotKey);
      }
    },
    [lastClickTime, lastClickedSlot, onSelectSlot]
  );

  return (
    <div
      className="flex-1 min-h-0 flex flex-col select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {weeks.map((week, weekIndex) => (
        <div
          key={weekIndex}
          className="flex flex-1 min-h-0 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
        >
          {week.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayTasks = tasksByDate[dateKey] || [];
            const isOutside = isOutsideProjectRange(day);
            const isOtherMonth = !isCurrentMonth(day);
            const isToday = isSameDay(day, new Date());
            const dayOfWeek = day.getDay();
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;
            const inDragRange = isInDragRange(day);

            return (
              <div
                key={dateKey}
                className={`
                  flex-1 min-w-0 relative border-r border-gray-100 dark:border-gray-800 last:border-r-0
                  transition-colors cursor-pointer p-1 overflow-hidden flex flex-col
                  ${
                    inDragRange
                      ? "bg-main-100/30 dark:bg-main-700/20"
                      : isOutside
                      ? "bg-gray-100 dark:bg-gray-900 cursor-not-allowed"
                      : isOtherMonth
                      ? "bg-gray-50 dark:bg-gray-850"
                      : isSaturday
                      ? "bg-blue-50/30 dark:bg-blue-900/10"
                      : isSunday
                      ? "bg-red-50/30 dark:bg-red-900/10"
                      : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
                onClick={() => handleSlotClick(day, isOutside)}
                onMouseDown={() => handleMouseDown(day, isOutside)}
                onMouseEnter={() => handleMouseEnter(day, isOutside)}
              >
                {/* 날짜 숫자 */}
                <div
                  className={`
                    text-xs sm:text-sm font-medium w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-full shrink-0
                    ${
                      isToday
                        ? "bg-main-500 dark:bg-main-400 text-white"
                        : isOutside
                        ? "text-gray-300 dark:text-gray-600"
                        : isOtherMonth
                        ? "text-gray-400 dark:text-gray-500"
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

                {/* 이벤트 표시 */}
                {dayTasks.length > 0 && (
                  <MonthEventCard
                    tasks={dayTasks}
                    onSelectEvent={onSelectEvent}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
