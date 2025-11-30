"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { isSameDay } from "date-fns";
import { Task, TaskStatus } from "@/types/kanban";
import {
  getTaskStatusDotColor,
  getTaskStatusBarStyle,
  isTaskOverdue,
} from "@/lib/utils/taskUtils";

// 우선순위별 삼각형 아이콘
const getPriorityIcon = (priority: string | undefined) => {
  switch (priority) {
    case "high":
      return <span className="text-red-500">▲</span>;
    case "normal":
      return <span className="text-yellow-500">▲</span>;
    case "low":
      return <span className="text-green-500">▲</span>;
    default:
      return null;
  }
};

interface DayGridProps {
  currentDate: Date;
  hours: number[];
  tasks: Task[];
  isOutsideProjectRange: boolean;
  onSelectSlot: (date: Date, startHour?: number, endHour?: number) => void;
  onSelectEvent: (task: Task) => void;
}

// 시간 문자열을 분 단위로 변환 (예: "09:30" -> 570)
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + (minutes || 0);
};

// 드래그 상태 인터페이스
interface DragState {
  isDragging: boolean;
  startHour: number | null;
  endHour: number | null;
}

// 시간대 기반 태스크 위치/높이 계산
interface PositionedTask extends Task {
  top: number; // 시작 위치 (%)
  height: number; // 높이 (%)
  startHour: number; // 시작 시간
  endHour: number; // 종료 시간
  column: number; // 겹침 시 열 위치
  totalColumns: number; // 총 열 수
}

/**
 * 시간 기반 태스크의 위치 계산
 */
const getPositionedTasks = (
  tasks: Task[],
  hours: number[]
): PositionedTask[] => {
  const minHour = hours[0];
  const maxHour = hours[hours.length - 1] + 1;
  const totalMinutes = (maxHour - minHour) * 60;

  // 시간 있는 태스크만 필터링
  const timedTasks = tasks.filter((task) => task.use_time && task.start_time);

  // 위치 계산
  const positioned: PositionedTask[] = timedTasks.map((task) => {
    const startMinutes = timeToMinutes(task.start_time!);
    const endMinutes = task.end_time
      ? timeToMinutes(task.end_time)
      : startMinutes + 60; // 종료 시간 없으면 1시간

    // 그리드 범위 내로 클램핑
    const clampedStart = Math.max(startMinutes, minHour * 60);
    const clampedEnd = Math.min(endMinutes, maxHour * 60);

    const top = ((clampedStart - minHour * 60) / totalMinutes) * 100;
    const height = Math.max(
      ((clampedEnd - clampedStart) / totalMinutes) * 100,
      2
    ); // 최소 2%

    return {
      ...task,
      top,
      height,
      startHour: Math.floor(startMinutes / 60),
      endHour: Math.ceil(endMinutes / 60),
      column: 0,
      totalColumns: 1,
    };
  });

  // 두 태스크가 겹치는지 확인
  const isOverlapping = (a: PositionedTask, b: PositionedTask) => {
    return a.startHour < b.endHour && a.endHour > b.startHour;
  };

  // 겹치는 그룹 찾기
  const findOverlapGroup = (
    task: PositionedTask,
    allTasks: PositionedTask[]
  ): PositionedTask[] => {
    const group: PositionedTask[] = [task];
    let added = true;

    while (added) {
      added = false;
      for (const t of allTasks) {
        if (!group.includes(t)) {
          // 그룹 내 어떤 태스크와도 겹치면 추가
          if (group.some((g) => isOverlapping(g, t))) {
            group.push(t);
            added = true;
          }
        }
      }
    }

    return group;
  };

  // 처리된 태스크 추적
  const processed = new Set<string>();

  // 각 태스크에 대해 겹침 그룹 처리
  for (const task of positioned) {
    if (processed.has(task.id)) continue;

    const group = findOverlapGroup(task, positioned);

    // 그룹 내 태스크들을 시작 시간순으로 정렬하고 열 할당
    const sortedGroup = group.sort(
      (a, b) => a.startHour - b.startHour || a.id.localeCompare(b.id)
    );

    // 각 태스크에 사용 가능한 첫 번째 열 할당
    const columns: PositionedTask[][] = [];

    for (const t of sortedGroup) {
      let placed = false;

      for (let col = 0; col < columns.length; col++) {
        // 이 열의 마지막 태스크와 겹치지 않으면 이 열에 배치
        const lastInColumn = columns[col][columns[col].length - 1];
        if (!isOverlapping(lastInColumn, t)) {
          columns[col].push(t);
          t.column = col;
          placed = true;
          break;
        }
      }

      if (!placed) {
        // 새 열 생성
        t.column = columns.length;
        columns.push([t]);
      }
    }

    // 총 열 수 설정
    const totalCols = columns.length;
    for (const t of sortedGroup) {
      t.totalColumns = totalCols;
      processed.add(t.id);
    }
  }

  return positioned;
};

/**
 * 종일 태스크 필터링
 */
const getAllDayTasks = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => !task.use_time || !task.start_time);
};

export default function DayGrid({
  currentDate,
  hours,
  tasks,
  isOutsideProjectRange,
  onSelectSlot,
  onSelectEvent,
}: DayGridProps) {
  // 현재 시간 상태 (1분마다 업데이트)
  const [currentTime, setCurrentTime] = useState(new Date());

  // 드래그 상태
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startHour: null,
    endHour: null,
  });

  // 마우스 버튼 눌림 상태 추적
  const isMouseDownRef = useRef(false);

  // 종일 태스크
  const allDayTasks = useMemo(() => getAllDayTasks(tasks), [tasks]);

  // 시간 기반 태스크 (위치 계산됨)
  const positionedTasks = useMemo(
    () => getPositionedTasks(tasks, hours),
    [tasks, hours]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 현재 시간선 위치 계산 (전체 그리드 기준)
  const getCurrentTimePosition = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const minHour = hours[0];
    const maxHour = hours[hours.length - 1] + 1;

    if (currentHour < minHour || currentHour >= maxHour) return null;

    const totalMinutes = (maxHour - minHour) * 60;
    const elapsedMinutes = (currentHour - minHour) * 60 + currentMinute;

    return (elapsedMinutes / totalMinutes) * 100;
  };

  // 오늘인지 확인
  const isToday = isSameDay(currentDate, currentTime);

  // 업무시간인지 확인 (9시~18시)
  const isWorkingHour = (hour: number) => hour >= 9 && hour < 18;

  // 드래그 시작
  const handleMouseDown = useCallback(
    (hour: number) => {
      if (isOutsideProjectRange) return;

      isMouseDownRef.current = true;
      setDragState({
        isDragging: true,
        startHour: hour,
        endHour: hour,
      });
    },
    [isOutsideProjectRange]
  );

  // 드래그 중
  const handleMouseEnter = useCallback(
    (hour: number) => {
      if (!isMouseDownRef.current || isOutsideProjectRange) return;

      setDragState((prev) => ({
        ...prev,
        endHour: hour,
      }));
    },
    [isOutsideProjectRange]
  );

  // 드래그 종료
  const handleMouseUp = useCallback(() => {
    if (!isMouseDownRef.current) return;

    isMouseDownRef.current = false;

    if (dragState.startHour !== null && dragState.endHour !== null) {
      // 시작/종료 정렬
      let startHour = dragState.startHour;
      let endHour = dragState.endHour + 1; // 종료 시간은 다음 시간

      if (startHour > dragState.endHour) {
        startHour = dragState.endHour;
        endHour = dragState.startHour + 1;
      }

      onSelectSlot(currentDate, startHour, endHour);
    }

    setDragState({
      isDragging: false,
      startHour: null,
      endHour: null,
    });
  }, [dragState, currentDate, onSelectSlot]);

  // 전역 마우스업 이벤트
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
    (hour: number) => {
      if (
        !dragState.isDragging ||
        dragState.startHour === null ||
        dragState.endHour === null
      ) {
        return false;
      }

      const minHour = Math.min(dragState.startHour, dragState.endHour);
      const maxHour = Math.max(dragState.startHour, dragState.endHour);

      return hour >= minHour && hour <= maxHour;
    },
    [dragState]
  );

  const currentTimePosition = isToday ? getCurrentTimePosition() : null;

  return (
    <div className="relative">
      {/* 종일 태스크 섹션 */}
      {allDayTasks.length > 0 && (
        <div className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex min-h-[50px]">
            {/* 레이블 */}
            <div className="w-14 sm:w-20 shrink-0 p-2 text-right pr-3 border-r border-gray-200 dark:border-gray-700 flex items-center justify-end">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                종일
              </span>
            </div>

            {/* 종일 태스크 목록 */}
            <div className="flex-1 p-2 flex flex-wrap gap-2">
              {allDayTasks.map((task) => {
                const overdue = isTaskOverdue(task);
                return (
                  <div
                    key={task.id}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer
                      hover:shadow-md transition-all border
                      ${getTaskStatusBarStyle(task.status as TaskStatus)}
                    `}
                    onClick={() => onSelectEvent(task)}
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${getTaskStatusDotColor(
                        task.status as TaskStatus
                      )}`}
                    />
                    {overdue && (
                      <div className="w-2 h-2 rounded-full shrink-0 bg-red-500" />
                    )}
                    {task.priority && (
                      <span className="text-xs">
                        {getPriorityIcon(task.priority)}
                      </span>
                    )}
                    <span className="font-medium truncate max-w-[200px]">
                      {task.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 시간대별 그리드 + 이벤트 오버레이 컨테이너 */}
      <div className="relative">
        {/* 시간대 그리드 (배경) */}
        {hours.map((hour) => (
          <div
            key={hour}
            className="flex border-b border-gray-100 dark:border-gray-800 last:border-b-0 h-[70px] sm:h-[80px]"
          >
            {/* 시간 레이블 */}
            <div className="w-14 sm:w-20 shrink-0 p-2 text-right pr-3 border-r border-gray-200 dark:border-gray-700">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                {hour.toString().padStart(2, "0")}:00
              </span>
            </div>

            {/* 시간 슬롯 */}
            <div
              className={`
                flex-1 relative transition-colors cursor-pointer
                ${
                  isOutsideProjectRange
                    ? "bg-gray-100 dark:bg-gray-900 cursor-not-allowed"
                    : isInDragRange(hour)
                    ? "bg-main-200 dark:bg-main-700/50"
                    : isWorkingHour(hour)
                    ? "bg-main-100/20 dark:bg-main-800/15 hover:bg-main-100/40 dark:hover:bg-main-800/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              `}
              onMouseDown={() => handleMouseDown(hour)}
              onMouseEnter={() => handleMouseEnter(hour)}
              onMouseUp={handleMouseUp}
            >
              {/* 30분 구분선 */}
              <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-gray-200 dark:border-gray-700 pointer-events-none" />
            </div>
          </div>
        ))}

        {/* 현재 시간 표시선 (전체 그리드에 걸쳐) */}
        {currentTimePosition !== null && (
          <div
            className="absolute left-14 sm:left-20 right-0 z-30 pointer-events-none"
            style={{ top: `${currentTimePosition}%` }}
          >
            <div className="flex items-center">
              <div className="w-3 h-3 bg-main-500 rounded-full -ml-1.5" />
              <div className="flex-1 border-t-2 border-main-500" />
            </div>
          </div>
        )}

        {/* 이벤트 오버레이 (시간에 걸쳐 표시) */}
        <div className="absolute left-14 sm:left-20 right-2 top-0 bottom-0 pointer-events-none">
          {positionedTasks.map((task) => {
            const overdue = isTaskOverdue(task);
            const width = task.totalColumns > 1 ? 100 / task.totalColumns : 100;
            const left = task.column * width;

            return (
              <div
                key={task.id}
                className={`
                  absolute rounded-lg border cursor-pointer pointer-events-auto
                  hover:shadow-lg hover:scale-[1.02] transition-all duration-200
                  ${getTaskStatusBarStyle(task.status as TaskStatus)}
                `}
                style={{
                  top: `${task.top}%`,
                  height: `${task.height}%`,
                  left: `${left}%`,
                  width: `calc(${width}% - 4px)`,
                  minHeight: "24px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(task);
                }}
              >
                <div className="p-2 h-full flex flex-col overflow-hidden">
                  {/* 상단: 상태 + 지연 + 제목 + 우선순위 */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${getTaskStatusDotColor(
                        task.status as TaskStatus
                      )}`}
                    />
                    {overdue && (
                      <div className="w-2 h-2 rounded-full shrink-0 bg-red-500" />
                    )}
                    <span className="font-semibold text-sm truncate flex-1">
                      {task.title}
                    </span>
                    {task.priority && (
                      <span className="text-xs shrink-0">
                        {getPriorityIcon(task.priority)}
                      </span>
                    )}
                  </div>

                  {/* 시간 표시 (공간이 있으면) */}
                  {task.height > 5 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {task.start_time}
                      {task.end_time ? ` - ${task.end_time}` : ""}
                    </div>
                  )}

                  {/* 설명 (공간이 충분하면) */}
                  {task.height > 10 && task.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {task.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
