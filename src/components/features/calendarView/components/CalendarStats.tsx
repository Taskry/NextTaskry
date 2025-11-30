/**
 * 캘린더 통계 컴포넌트
 *
 * 사용 위치: CalendarView 하단 또는 측면
 * 표시 내용: 할일/진행중/완료/지연 일정 개수
 */

import { useMemo } from "react";
import { Task } from "@/types/kanban";
import { format } from "date-fns";

interface CalendarStatsProps {
  tasks: Task[];
  compact?: boolean;
}

export default function CalendarStats({
  tasks,
  compact = false,
}: CalendarStatsProps) {
  // 태스크 통계 계산
  const stats = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    return {
      todo: tasks.filter((t) => t.status === "todo").length,
      inprogress: tasks.filter((t) => t.status === "inprogress").length,
      done: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter(
        (t) => t.status !== "done" && t.ended_at && t.ended_at < today
      ).length,
    };
  }, [tasks]);

  const total = stats.todo + stats.inprogress + stats.done;
  const completionRate = total > 0 ? Math.round((stats.done / total) * 100) : 0;

  if (compact) {
    // 컴팩트 모드 (모바일용)
    return (
      <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="text-gray-600 dark:text-gray-400">
              {stats.todo}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="text-gray-600 dark:text-gray-400">
              {stats.inprogress}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-600 dark:text-gray-400">
              {stats.done}
            </span>
          </span>
          {stats.overdue > 0 && (
            <span className="flex items-center gap-1 text-red-500">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>{stats.overdue}</span>
            </span>
          )}
          {/* 우선순위 범례 */}
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className="text-red-500">▲</span>
          <span className="text-yellow-500">▲</span>
          <span className="text-green-500">▲</span>
        </div>
        <div className="ml-auto text-xs font-medium text-gray-700 dark:text-gray-300">
          {completionRate}% 완료
        </div>
      </div>
    );
  }

  // 기본 모드
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      {/* 왼쪽: 상태별 통계 */}
      <div className="flex items-center gap-4 sm:gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-400"></span>
          <span className="text-gray-600 dark:text-gray-400">할일</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {stats.todo}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-400"></span>
          <span className="text-gray-600 dark:text-gray-400">진행중</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {stats.inprogress}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-gray-600 dark:text-gray-400">완료</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {stats.done}
          </span>
        </div>
        {stats.overdue > 0 && (
          <div className="flex items-center gap-2 text-red-500">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>지연</span>
            <span className="font-semibold">{stats.overdue}</span>
          </div>
        )}
        {/* 구분선 */}
        <span className="text-gray-300 dark:text-gray-600">|</span>
        {/* 우선순위 범례 */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="text-red-500">▲</span>
            <span className="text-gray-600 dark:text-gray-400">높음</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-500">▲</span>
            <span className="text-gray-600 dark:text-gray-400">보통</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-green-500">▲</span>
            <span className="text-gray-600 dark:text-gray-400">낮음</span>
          </span>
        </div>
      </div>

      {/* 오른쪽: 진행률 */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-main-500 transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {completionRate}% 완료
        </span>
      </div>
    </div>
  );
}
