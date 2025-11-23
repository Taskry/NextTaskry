import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "@/components/features/task/card/TaskCard";
import { Task, TaskStatus } from "@/types";

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
  // 이 컬럼을 드롭 가능하게 만들기
  const { setNodeRef } = useDroppable({
    id: id, // 컬럼 id (예: 'todo', 'inprogress', 'done')
  });

  // 칸반 컬럼별 색상 반환
  const getColumnColor = (status: TaskStatus) => {
    const colors = {
      todo: "bg-gray-400 dark:bg-gray-600",
      inprogress: "bg-blue-400 dark:bg-blue-600",
      done: "bg-green-400 dark:bg-green-600",
    };
    return colors[status];
  };

  return (
    <div className="flex flex-col w-80 shrink-0 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* 컬럼 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 rounded-t-lg bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          {/* 상태별 컬러 동그라미 */}
          <span
            className={`w-3 h-3 rounded-full ${getColumnColor(
              id as TaskStatus
            )}`}
          />

          {/* 컬럼명에 컬러 적용 */}
          <h3
            className={`font-semibold text-base ${
              id === "todo"
                ? "text-gray-700 dark:text-gray-200"
                : id === "inprogress"
                ? "text-blue-700 dark:text-blue-300"
                : "text-green-700 dark:text-green-300"
            }`}
          >
            {title}
          </h3>
        </div>
        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-200">
          {tasks.length}
        </span>
      </div>

      {/* Task Cards - SortableContext로 감싸기 */}
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef} // 드롭 영역 연결
          className="p-3 flex flex-col gap-3 overflow-y-auto flex-1"
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
            <div className="py-10 text-center text-sm text-gray-300 dark:text-gray-400">
              작업이 없습니다.
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;
