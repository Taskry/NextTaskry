"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Task, TaskStatus } from "@/types/kanban";
import {
  getTaskStatusBarStyle,
  getTaskStatusDotColor,
  getTaskStatusBgColor,
  isTaskOverdue,
  getPriorityIconColor,
} from "@/lib/utils/taskUtils";

interface WeekMultiDayEventsProps {
  tasks: Task[];
  weekDays: Date[];
  onSelectEvent: (task: Task) => void;
}

interface MultiDayTask extends Task {
  startCol: number;
  endCol: number;
  row: number;
}

export default function WeekMultiDayEvents({
  tasks,
  weekDays,
  onSelectEvent,
}: WeekMultiDayEventsProps) {
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [isHoveringArea, setIsHoveringArea] = useState(false);

  // 주간 날짜 문자열 배열
  const weekDayStrings = useMemo(
    () => weekDays.map((d) => format(d, "yyyy-MM-dd")),
    [weekDays]
  );

  // 기간 일정 또는 종일 일정 필터링
  const multiDayTasks = useMemo(() => {
    const weekStartStr = weekDayStrings[0];
    const weekEndStr = weekDayStrings[6];

    return tasks.filter((task) => {
      if (!task.started_at || !task.ended_at) return false;

      // 날짜 문자열만 추출 (시간대 무시)
      const taskStartStr = task.started_at.split("T")[0];
      const taskEndStr = task.ended_at.split("T")[0];

      // 시간이 지정되고 실제 시간값이 있는 경우 -> 시간 그리드에서 표시
      const hasActualTime = task.use_time && task.start_time;

      // 기간 일정 (여러 날) 또는 종일 일정 (시간 미지정)
      const isMultiDay = taskStartStr !== taskEndStr;
      const isAllDayEvent = !hasActualTime; // 시간이 없으면 종일 일정으로 처리

      // 주간 범위와 겹치는지 확인
      const overlapsWeek =
        taskStartStr <= weekEndStr && taskEndStr >= weekStartStr;

      return (isMultiDay || isAllDayEvent) && overlapsWeek;
    });
  }, [tasks, weekDayStrings]);

  // 기간 일정 배치 계산
  const positionedTasks = useMemo(() => {
    const weekStartStr = weekDayStrings[0];
    const weekEndStr = weekDayStrings[6];
    const rows: MultiDayTask[][] = [];

    const sortedTasks = [...multiDayTasks].sort((a, b) => {
      const aStartStr = a.started_at!.split("T")[0];
      const bStartStr = b.started_at!.split("T")[0];
      if (aStartStr !== bStartStr) {
        return aStartStr.localeCompare(bStartStr);
      }
      return b.ended_at!.split("T")[0].localeCompare(a.ended_at!.split("T")[0]);
    });

    sortedTasks.forEach((task) => {
      const taskStartStr = task.started_at!.split("T")[0];
      const taskEndStr = task.ended_at!.split("T")[0];

      // 주간 범위로 클램핑
      const clampedStartStr =
        taskStartStr < weekStartStr ? weekStartStr : taskStartStr;
      const clampedEndStr = taskEndStr > weekEndStr ? weekEndStr : taskEndStr;

      // 컬럼 인덱스 찾기
      const startCol = weekDayStrings.indexOf(clampedStartStr);
      const endCol = weekDayStrings.indexOf(clampedEndStr);

      if (startCol === -1 || endCol === -1) return;

      const multiDayTask: MultiDayTask = { ...task, startCol, endCol, row: 0 };

      let rowIndex = 0;
      let placed = false;

      while (!placed) {
        if (!rows[rowIndex]) rows[rowIndex] = [];
        const hasOverlap = rows[rowIndex].some(
          (t) => !(endCol < t.startCol || startCol > t.endCol)
        );
        if (!hasOverlap) {
          multiDayTask.row = rowIndex;
          rows[rowIndex].push(multiDayTask);
          placed = true;
        } else {
          rowIndex++;
        }
      }
    });

    return rows.flat();
  }, [multiDayTasks, weekDayStrings]);

  const maxRows = useMemo(() => {
    if (positionedTasks.length === 0) return 0;
    return Math.max(...positionedTasks.map((t) => t.row)) + 1;
  }, [positionedTasks]);

  // 기간 일정이 없으면 표시 안함
  if (multiDayTasks.length === 0) return null;

  const ROW_HEIGHT = 22;
  const MAX_ROWS = 3;
  const visibleRows = Math.max(Math.min(maxRows, MAX_ROWS), 1);
  const visibleTasks = positionedTasks.filter((t) => t.row < MAX_ROWS);
  const hiddenCount = positionedTasks.length - visibleTasks.length;

  return (
    <div
      className="flex border-b border-gray-200 dark:border-gray-700 overflow-visible relative"
      style={{ height: `${visibleRows * ROW_HEIGHT + 6}px` }}
      onMouseEnter={() => setIsHoveringArea(true)}
      onMouseLeave={() => setIsHoveringArea(false)}
    >
      {/* 시간 컬럼 공간 */}
      <div className="w-10 sm:w-16 shrink-0 border-r border-gray-200 dark:border-gray-700 flex items-center justify-end pr-1 sm:pr-2">
        <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500">
          기간
        </span>
      </div>

      {/* 요일별 컬럼 */}
      <div className="flex-1 flex relative overflow-hidden">
        {weekDays.map((_, colIndex) => (
          <div
            key={colIndex}
            className="flex-1 border-r border-gray-100 dark:border-gray-800 last:border-r-0"
          />
        ))}

        {/* 기간 일정 바들 */}
        {visibleTasks.map((task) => {
          const leftPercent = (task.startCol / 7) * 100;
          const widthPercent = ((task.endCol - task.startCol + 1) / 7) * 100;
          const isHovered = hoveredTask === task.id;
          const overdue = isTaskOverdue(task);

          return (
            <div
              key={task.id}
              className="absolute cursor-pointer px-0.5"
              style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                top: `${task.row * ROW_HEIGHT + 2}px`,
                height: "18px",
              }}
              onClick={() => onSelectEvent(task)}
              onMouseEnter={() => setHoveredTask(task.id)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              <div
                className={`
                  w-full h-full rounded transition-all flex items-center px-1.5 gap-1
                  ${getTaskStatusBarStyle(task.status as TaskStatus)}
                  ${
                    isHovered
                      ? "ring-2 ring-offset-1 ring-gray-400 dark:ring-gray-500 brightness-95"
                      : ""
                  }
                `}
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
                  <span
                    className={`text-[9px] shrink-0 ${getPriorityIconColor(
                      task.priority
                    )}`}
                  >
                    ▲
                  </span>
                )}
                <span className="text-[10px] sm:text-[11px] truncate font-medium">
                  {task.title}
                </span>
              </div>
            </div>
          );
        })}

        {/* 숨겨진 일정 수 표시 */}
        {hiddenCount > 0 && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 dark:text-gray-500">
            +{hiddenCount}
          </div>
        )}
      </div>

      {/* 호버 시 전체 기간 일정 요약 팝업 */}
      {isHoveringArea && multiDayTasks.length > 0 && (
        <div className="absolute left-10 sm:left-16 top-full mt-1 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 min-w-[220px] max-w-[280px]">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 pb-1 border-b border-gray-100 dark:border-gray-700">
            기간/종일 일정 ({multiDayTasks.length}개)
          </div>
          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            {multiDayTasks.map((task) => {
              const overdue = isTaskOverdue(task);
              return (
                <div
                  key={task.id}
                  className={`p-2 rounded-md text-xs cursor-pointer hover:brightness-95 dark:hover:brightness-110 transition-all ${getTaskStatusBgColor(
                    task.status as TaskStatus
                  )}`}
                  onClick={() => onSelectEvent(task)}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${getTaskStatusDotColor(
                        task.status as TaskStatus
                      )}`}
                    />
                    {overdue && (
                      <div className="w-2 h-2 rounded-full shrink-0 bg-red-500" />
                    )}
                    <span className="font-medium truncate text-gray-800 dark:text-gray-200">
                      {task.title}
                    </span>
                  </div>
                  {task.started_at && task.ended_at && (
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 ml-3.5">
                      {task.started_at.split("T")[0]} ~{" "}
                      {task.ended_at.split("T")[0]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
