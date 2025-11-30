"use client";

import { Task, TaskStatus } from "@/types/kanban";
import { format } from "date-fns";
import {
  getTaskStatusBarStyle,
  getTaskStatusDotColor,
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

interface AgendaEventCardProps {
  tasks: Task[];
  onSelectEvent: (task: Task) => void;
}

// 시간 포맷팅
const formatTime = (dateStr: string | null | undefined) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  if (hours === 0 && minutes === 0) return null; // 종일 일정
  return format(date, "HH:mm");
};

// 날짜 범위 포맷팅
const formatDateRange = (
  startedAt: string | null | undefined,
  endedAt: string | null | undefined
) => {
  if (!startedAt && !endedAt) return "";

  const startStr = startedAt?.split("T")[0];
  const endStr = endedAt?.split("T")[0];

  if (startStr === endStr || !endStr) {
    return ""; // 같은 날이면 범위 표시 안함
  }

  const start = startedAt ? format(new Date(startedAt), "M/d") : "";
  const end = endedAt ? format(new Date(endedAt), "M/d") : "";

  return `${start} ~ ${end}`;
};

export default function AgendaEventCard({
  tasks,
  onSelectEvent,
}: AgendaEventCardProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const startTime = formatTime(task.started_at);
        const endTime = formatTime(task.ended_at);
        const dateRange = formatDateRange(task.started_at, task.ended_at);
        const hasTime = startTime || endTime;
        const overdue = isTaskOverdue(task);

        return (
          <div
            key={task.id}
            className={`
              flex items-start gap-3 p-3 rounded-lg cursor-pointer
              hover:shadow-md transition-all duration-200
              ${getTaskStatusBarStyle(task.status as TaskStatus)}
            `}
            onClick={() => onSelectEvent(task)}
          >
            {/* 상태 도트 + 지연 도트 */}
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <div
                className={`w-3 h-3 rounded-full ${getTaskStatusDotColor(
                  task.status as TaskStatus
                )}`}
              />
              {overdue && <div className="w-3 h-3 rounded-full bg-red-500" />}
            </div>

            {/* 내용 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {/* 우선순위 삼각형 */}
                {task.priority && (
                  <span className="text-xs">
                    {getPriorityIcon(task.priority)}
                  </span>
                )}
                {/* 제목 */}
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                  {task.title}
                </span>
              </div>

              {/* 시간 및 기간 정보 */}
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                {hasTime && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {startTime}
                    {endTime && startTime !== endTime && ` ~ ${endTime}`}
                  </span>
                )}
                {dateRange && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {dateRange}
                  </span>
                )}
                {!hasTime && !dateRange && (
                  <span className="text-gray-400 dark:text-gray-500">종일</span>
                )}
              </div>

              {/* 설명 (있으면) */}
              {task.description && (
                <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* 오른쪽 화살표 */}
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
