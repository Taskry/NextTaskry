import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "@/components/features/task/card/TaskCard";
import { Task, TaskStatus } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { getTaskStatusColor } from "@/lib/utils/taskUtils";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  projectId: string;
  onTaskClick: (task: Task) => void;
}

const KanbanColumn = ({
  id,
  title,
  tasks,
  projectId,
  onTaskClick,
}: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  // 다크 모드는 CSS 클래스로 처리하도록 변경
  const statusColors = getTaskStatusColor(id as TaskStatus);

  return (
    <div className="flex flex-col shrink-0 w-[calc(100vw-4rem)] min-w-[280px] sm:w-96 sm:min-w-[320px] lg:w-80 lg:min-w-[320px] bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-500 shadow-sm">
      {/* 컬럼 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-500 rounded-t-lg bg-white dark:bg-gray-600">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${statusColors.bg}`} />
          <h3 className={`font-semibold text-base ${statusColors.text}`}>
            {title}
          </h3>
        </div>
        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-200">
          {tasks.length}
        </span>
      </div>

      {/* Task Cards */}
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="p-3 flex flex-col gap-3 overflow-y-auto flex-1 transition-all duration-200"
        >
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                projectId={projectId}
                onClick={() => onTaskClick(task)}
              />
            ))
          ) : (
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
