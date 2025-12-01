"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { format, isSameDay } from "date-fns";
import { Task } from "@/types/kanban";
import EventCard from "@/components/features/calendarView/weekViews/EventCard";

interface WeekGridProps {
  weekDays: Date[];
  hours: number[];
  tasksByDate: Record<string, Task[]>;
  isOutsideProjectRange: (date: Date) => boolean;
  onSelectSlot: (
    startDate: Date,
    endDate: Date,
    startHour?: number,
    endHour?: number
  ) => void;
  onSelectEvent: (task: Task) => void;
}

/**
 * 해당 시간대에 표시할 태스크 필터링
 * - use_time이 true이고 start_time이 있으면 해당 시간대에만 표시
 * - 종일/기간 일정은 WeekMultiDayEvents에서 처리
 */
const getTasksForHour = (tasks: Task[], hour: number): Task[] => {
  return tasks.filter((task) => {
    // 시간 지정 태스크만 표시
    if (task.use_time && task.start_time) {
      const taskHour = parseInt(task.start_time.split(":")[0], 10);
      return taskHour === hour;
    }
    return false; // 종일/기간 일정은 상단 바에서 표시
  });
};

// 드래그 상태 인터페이스
interface DragState {
  isDragging: boolean;
  startDay: Date | null;
  startHour: number | null;
  endDay: Date | null;
  endHour: number | null;
}

export default function WeekGrid({
  weekDays,
  hours,
  tasksByDate,
  isOutsideProjectRange,
  onSelectSlot,
  onSelectEvent,
}: WeekGridProps) {
  // 현재 시간 상태 (1분마다 업데이트)
  const [currentTime, setCurrentTime] = useState(new Date());

  // 드래그 상태
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startDay: null,
    startHour: null,
    endDay: null,
    endHour: null,
  });

  // 마우스 버튼 눌림 상태 추적
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트
    return () => clearInterval(interval);
  }, []);

  // 현재 시간선 위치 계산 (해당 시간 슬롯 내 %)
  const getCurrentTimePosition = (hour: number) => {
    const now = currentTime;
    if (now.getHours() !== hour) return null;
    return (now.getMinutes() / 60) * 100;
  };

  // 오늘인지 확인
  const isToday = (day: Date) => isSameDay(day, currentTime);

  // 업무시간인지 확인 (9시~18시)
  const isWorkingHour = (hour: number) => hour >= 9 && hour < 18;

  // 드래그 시작
  const handleMouseDown = useCallback(
    (day: Date, hour: number, isOutside: boolean) => {
      if (isOutside) return;

      isMouseDownRef.current = true;
      setDragState({
        isDragging: true,
        startDay: day,
        startHour: hour,
        endDay: day,
        endHour: hour,
      });
    },
    []
  );

  // 드래그 중
  const handleMouseEnter = useCallback(
    (day: Date, hour: number, isOutside: boolean) => {
      if (!isMouseDownRef.current || isOutside) return;

      setDragState((prev) => ({
        ...prev,
        endDay: day,
        endHour: hour,
      }));
    },
    []
  );

  // 드래그 종료
  const handleMouseUp = useCallback(() => {
    if (!isMouseDownRef.current) return;

    isMouseDownRef.current = false;

    if (
      dragState.startDay &&
      dragState.startHour !== null &&
      dragState.endDay &&
      dragState.endHour !== null
    ) {
      // 시작/종료 정렬 (시작이 끝보다 나중일 수 있음)
      let startDay = dragState.startDay;
      let endDay = dragState.endDay;
      let startHour = dragState.startHour;
      let endHour = dragState.endHour + 1; // 종료 시간은 다음 시간

      // 날짜 정렬
      if (format(startDay, "yyyy-MM-dd") > format(endDay, "yyyy-MM-dd")) {
        [startDay, endDay] = [endDay, startDay];
        [startHour, endHour] = [dragState.endHour, dragState.startHour + 1];
      } else if (
        format(startDay, "yyyy-MM-dd") === format(endDay, "yyyy-MM-dd") &&
        startHour > dragState.endHour
      ) {
        // 같은 날인데 시간이 역순이면
        startHour = dragState.endHour;
        endHour = dragState.startHour + 1;
      }

      onSelectSlot(startDay, endDay, startHour, endHour);
    }

    setDragState({
      isDragging: false,
      startDay: null,
      startHour: null,
      endDay: null,
      endHour: null,
    });
  }, [dragState, onSelectSlot]);

  // 전역 마우스업 이벤트 (그리드 밖에서 놓았을 때)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDownRef.current) {
        handleMouseUp();
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [handleMouseUp]);

  // 셀이 드래그 선택 범위 내에 있는지 확인
  const isInDragRange = useCallback(
    (day: Date, hour: number) => {
      if (
        !dragState.isDragging ||
        !dragState.startDay ||
        dragState.startHour === null ||
        !dragState.endDay ||
        dragState.endHour === null
      ) {
        return false;
      }

      const dayStr = format(day, "yyyy-MM-dd");
      const startDayStr = format(dragState.startDay, "yyyy-MM-dd");
      const endDayStr = format(dragState.endDay, "yyyy-MM-dd");

      // 날짜 범위 정렬
      const [minDayStr, maxDayStr] =
        startDayStr <= endDayStr
          ? [startDayStr, endDayStr]
          : [endDayStr, startDayStr];

      // 시간 범위 정렬
      const [minHour, maxHour] =
        dragState.startHour <= dragState.endHour
          ? [dragState.startHour, dragState.endHour]
          : [dragState.endHour, dragState.startHour];

      // 날짜가 범위 내에 있고, 시간도 범위 내에 있어야 함
      if (dayStr >= minDayStr && dayStr <= maxDayStr) {
        // 같은 날이면 시간 체크
        if (minDayStr === maxDayStr) {
          return hour >= minHour && hour <= maxHour;
        }
        // 여러 날이면 모든 시간 포함
        return hour >= minHour && hour <= maxHour;
      }

      return false;
    },
    [dragState]
  );

  return (
    <div className="select-none">
      {hours.map((hour) => (
        <div
          key={hour}
          className="flex border-b border-gray-100 dark:border-gray-800 last:border-b-0 min-h-[50px] sm:min-h-[60px]"
        >
          {/* 시간 레이블 */}
          <div className="w-10 sm:w-16 shrink-0 p-1 sm:p-2 text-right pr-1 sm:pr-3 border-r border-gray-200 dark:border-gray-700">
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              {hour.toString().padStart(2, "0")}:00
            </span>
          </div>

          {/* 요일별 타임 슬롯 */}
          {weekDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayTasks = tasksByDate[dateKey] || [];
            const hourTasks = getTasksForHour(dayTasks, hour);
            const isOutside = isOutsideProjectRange(day);
            const isSelected = isInDragRange(day, hour);

            return (
              <div
                key={`${dateKey}-${hour}`}
                className={`
                  flex-1 relative border-r border-gray-100 dark:border-gray-800 last:border-r-0
                  transition-colors cursor-pointer
                  ${
                    isOutside
                      ? "bg-gray-100 dark:bg-gray-900 cursor-not-allowed"
                      : isSelected
                      ? "bg-main-200 dark:bg-main-700/50"
                      : isWorkingHour(hour)
                      ? "bg-main-100/20 dark:bg-main-800/15 hover:bg-main-100/40 dark:hover:bg-main-800/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
                onMouseDown={() => handleMouseDown(day, hour, isOutside)}
                onMouseEnter={() => handleMouseEnter(day, hour, isOutside)}
                onMouseUp={handleMouseUp}
              >
                {/* 30분 구분선 */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-gray-200 dark:border-gray-700 pointer-events-none" />

                {/* 현재 시간 표시선 (오늘의 현재 시간대에만 표시) */}
                {isToday(day) && getCurrentTimePosition(hour) !== null && (
                  <div
                    className="absolute left-0 right-0 z-20 pointer-events-none"
                    style={{ top: `${getCurrentTimePosition(hour)}%` }}
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-main-500 rounded-full -ml-1" />
                      <div className="flex-1 border-t-2 border-main-500" />
                    </div>
                  </div>
                )}

                {/* 이 시간대의 이벤트 표시 */}
                {hourTasks.length > 0 && (
                  <EventCard tasks={hourTasks} onSelectEvent={onSelectEvent} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
