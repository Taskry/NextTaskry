/**
 * 칸반보드 통계 + 범례 컴포넌트
 *
 * 표시 내용:
 * - 통계: 할일/진행중/완료/지연/긴급(오늘 마감, D-3 이내)
 * - 범례: 지연 표시, 완료 표시, 우선순위 아이콘
 * - 진행률 표시
 */

import { useMemo } from "react";
import { Task } from "@/types/kanban";
import { format, addDays } from "date-fns";
import { AlertTriangle, Clock } from "lucide-react";

interface KanbanLegendProps {
  tasks?: Task[];
  compact?: boolean;
}

export default function KanbanLegend({
  tasks = [],
  compact = false,
}: KanbanLegendProps) {
  // 태스크 통계 계산
  const stats = useMemo(() => {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const threeDaysLater = format(addDays(now, 3), "yyyy-MM-dd");

    return {
      todo: tasks.filter((t) => t.status === "todo").length,
      inprogress: tasks.filter((t) => t.status === "inprogress").length,
      done: tasks.filter((t) => t.status === "done").length,
      // 지연: 완료되지 않았고 마감일이 지남
      overdue: tasks.filter((t) => {
        if (t.status === "done" || !t.ended_at) return false;
        const endDate = t.ended_at.split("T")[0];
        if (endDate < today) return true;
        // 오늘인데 시간까지 체크
        if (endDate === today && t.use_time && t.end_time) {
          const [hours, minutes] = t.end_time.split(":").map(Number);
          const deadline = new Date();
          deadline.setHours(hours, minutes, 0, 0);
          return now > deadline;
        }
        return false;
      }).length,
      // 긴급: 오늘 마감 (아직 지연 아님)
      urgent: tasks.filter((t) => {
        if (t.status === "done" || !t.ended_at) return false;
        const endDate = t.ended_at.split("T")[0];
        if (endDate !== today) return false;
        // 오늘이고 아직 시간 안 지남
        if (t.use_time && t.end_time) {
          const [hours, minutes] = t.end_time.split(":").map(Number);
          const deadline = new Date();
          deadline.setHours(hours, minutes, 0, 0);
          return now <= deadline;
        }
        return true;
      }).length,
      // 임박: D-3 이내 (오늘 제외)
      upcoming: tasks.filter((t) => {
        if (t.status === "done" || !t.ended_at) return false;
        const endDate = t.ended_at.split("T")[0];
        return endDate > today && endDate <= threeDaysLater;
      }).length,
    };
  }, [tasks]);

  const total = stats.todo + stats.inprogress + stats.done;
  const completionRate = total > 0 ? Math.round((stats.done / total) * 100) : 0;

  if (compact) {
    // 컴팩트 모드 (모바일용)
    return (
      <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs">
          {/* 통계 */}
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
          {stats.urgent > 0 && (
            <span className="flex items-center gap-1 text-orange-500">
              <AlertTriangle size={10} />
              <span>{stats.urgent}</span>
            </span>
          )}
          {/* 구분선 */}
          <span className="text-gray-300 dark:text-gray-600">|</span>
          {/* 범례 */}
          <span className="w-1 h-3 bg-red-500 rounded-sm" title="지연" />
          <span className="w-1 h-3 bg-green-500 rounded-sm" title="완료" />
          <span className="text-gray-300 dark:text-gray-600">|</span>
          {/* 우선순위 */}
          <span className="text-red-500">▲</span>
          <span className="text-yellow-500">▲</span>
          <span className="text-green-500">▲</span>
        </div>
        <div className="ml-auto text-xs font-medium text-gray-700 dark:text-gray-300">
          {completionRate}%
        </div>
      </div>
    );
  }

  // 기본 모드 - CalendarStats와 동일한 스타일
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      {/* 왼쪽: 통계 + 범례 */}
      <div className="flex items-center gap-4 sm:gap-6 text-sm flex-wrap">
        {/* 상태별 통계 */}
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

        {/* 긴급/임박/지연 표시 */}
        {(stats.urgent > 0 || stats.upcoming > 0 || stats.overdue > 0) && (
          <>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            {stats.urgent > 0 && (
              <div className="flex items-center gap-1 text-orange-500">
                <AlertTriangle size={14} />
                <span className="text-xs font-medium">오늘 {stats.urgent}</span>
              </div>
            )}
            {stats.upcoming > 0 && (
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                <Clock size={14} />
                <span className="text-xs font-medium">
                  D-3 이내 {stats.upcoming}
                </span>
              </div>
            )}
            {stats.overdue > 0 && (
              <div className="flex items-center gap-2 text-red-500">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>지연</span>
                <span className="font-semibold">{stats.overdue}</span>
              </div>
            )}
          </>
        )}

        {/* 구분선 */}
        <span className="text-gray-300 dark:text-gray-600">|</span>

        {/* 범례 */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" title="지연된 태스크">
            <span className="w-1 h-4 bg-red-500 rounded-sm" />
            <span className="text-gray-600 dark:text-gray-400">지연</span>
          </span>
          <span className="flex items-center gap-1" title="완료된 태스크">
            <span className="w-1 h-4 bg-green-500 rounded-sm" />
            <span className="text-gray-600 dark:text-gray-400">완료</span>
          </span>
        </div>

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
