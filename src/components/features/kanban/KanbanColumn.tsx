import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "@/components/features/task/card/TaskCard";
import { Task, TaskStatus } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { getTaskStatusColor, isTaskOverdue } from "@/lib/utils/taskUtils";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  projectId: string;
  onTaskClick: (task: Task) => void;
  isDragging?: boolean; // 현재 드래그 중인지
}

const KanbanColumn = ({
  id,
  title,
  tasks,
  projectId,
  onTaskClick,
  isDragging = false,
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  // 다크 모드는 CSS 클래스로 처리하도록 변경
  const statusColors = getTaskStatusColor(id as TaskStatus);

  // 지연된 태스크 개수 (완료 컬럼 제외)
  const overdueCount =
    id !== "done" ? tasks.filter((task) => isTaskOverdue(task)).length : 0;

  // 드래그 오버 시 컬럼 스타일
  const getColumnStyle = () => {
    if (isOver) {
      // 드롭 대상 컬럼 하이라이트
      switch (id) {
        case "todo":
          return "ring-2 ring-gray-400 dark:ring-gray-500 bg-gray-100 dark:bg-gray-600";
        case "inprogress":
          return "ring-2 ring-blue-400 dark:ring-blue-500 bg-blue-50 dark:bg-blue-900/30";
        case "done":
          return "ring-2 ring-green-400 dark:ring-green-500 bg-green-50 dark:bg-green-900/30";
        default:
          return "";
      }
    }
    if (isDragging) {
      // 드래그 중일 때 모든 컬럼 약간 강조
      return "border-dashed";
    }
    return "";
  };

  return (
    <div
      className={`
        flex flex-col shrink-0 h-full min-h-0
        w-[calc(100vw-3rem)] min-w-[260px] 
        sm:w-80 sm:min-w-[280px] 
        md:w-[300px] md:min-w-[300px]
        lg:w-80 lg:min-w-[320px] 
        bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-500 shadow-sm
        transition-all duration-200
        ${getColumnStyle()}
      `}
    >
      {/* 컬럼 헤더 */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-500 rounded-t-lg bg-white dark:bg-gray-600">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full ${statusColors.bg}`}
          />
          <h3
            className={`font-semibold text-sm sm:text-base ${statusColors.text}`}
          >
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* 지연 태스크 뱃지 - 동그라미에 숫자만 표시 */}
          {overdueCount > 0 && (
            <span
              className="flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold"
              title={`지연된 작업 ${overdueCount}개`}
            >
              {overdueCount}
            </span>
          )}
          {/* 전체 개수 */}
          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-200">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* 드래그 오버 시 안내 메시지 */}
      {isOver && (
        <div
          className={`
          mx-3 mt-3 px-3 py-2 rounded-lg text-center text-sm font-medium
          ${
            id === "todo"
              ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
              : ""
          }
          ${
            id === "inprogress"
              ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              : ""
          }
          ${
            id === "done"
              ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
              : ""
          }
        `}
        >
          여기에 놓기
        </div>
      )}

      {/* Task Cards */}
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`
            p-2 sm:p-3 flex flex-col gap-2 sm:gap-3 overflow-y-auto flex-1 transition-all duration-200
            ${isOver ? "min-h-[100px]" : ""}
          `}
        >
          {tasks.length > 0
            ? tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  onClick={() => onTaskClick(task)}
                />
              ))
            : !isOver && (
                <EmptyState
                  icon="clipboard"
                  title="작업이 없어요"
                  variant="minimal"
                  className="py-10"
                />
              )}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;
