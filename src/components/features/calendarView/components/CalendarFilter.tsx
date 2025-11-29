"use client";

import { TaskPriority } from "@/types/kanban";

interface CalendarFilterType {
  priority: TaskPriority | "all";
  assignee: "all" | "assigned" | "unassigned" | "me";
  date: "all" | "today" | "thisWeek" | "overdue";
}

interface CalendarFilterProps {
  filter: CalendarFilterType;
  onFilterChange: (newFilter: Partial<CalendarFilterType>) => void;
  taskCount: number;
  totalCount: number;
}

export default function CalendarFilter({
  filter,
  onFilterChange,
  taskCount,
  totalCount,
}: CalendarFilterProps) {
  return (
    <div className="mx-4 mb-4 px-5 py-4 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="flex flex-col gap-3">
        {/* 우선순위 */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium w-16">
            우선순위
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onFilterChange({ priority: "all" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.priority === "all"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => onFilterChange({ priority: "high" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.priority === "high"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              높음
            </button>
            <button
              onClick={() => onFilterChange({ priority: "normal" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.priority === "normal"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              보통
            </button>
            <button
              onClick={() => onFilterChange({ priority: "low" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.priority === "low"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              낮음
            </button>
          </div>
        </div>

        {/* 담당자 */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium w-16">
            담당자
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onFilterChange({ assignee: "all" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.assignee === "all"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => onFilterChange({ assignee: "me" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.assignee === "me"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              내 작업
            </button>
            <button
              onClick={() => onFilterChange({ assignee: "assigned" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.assignee === "assigned"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              할당됨
            </button>
            <button
              onClick={() => onFilterChange({ assignee: "unassigned" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.assignee === "unassigned"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              미할당
            </button>
          </div>
        </div>

        {/* 기간 */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium w-16">
            기간
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onFilterChange({ date: "all" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.date === "all"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => onFilterChange({ date: "today" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.date === "today"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              오늘
            </button>
            <button
              onClick={() => onFilterChange({ date: "thisWeek" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.date === "thisWeek"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              이번주
            </button>
            <button
              onClick={() => onFilterChange({ date: "overdue" })}
              className={`text-sm px-3 py-1.5 rounded transition-all ${
                filter.date === "overdue"
                  ? "bg-main-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              지연
            </button>
          </div>
        </div>

        {/* 구분선 + 결과 카운트 */}
        <div className="pt-3 mt-1 border-t border-gray-200 dark:border-gray-600">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {taskCount}개 / 전체 {totalCount}개
          </span>
        </div>
      </div>
    </div>
  );
}
