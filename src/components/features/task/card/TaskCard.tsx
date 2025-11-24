import { useSortable } from "@dnd-kit/sortable";
import { Task } from "@/types";
import { CSS } from "@dnd-kit/utilities";
import PriorityBadge from "@/components/features/task/fields/PriorityBadge";
import AssigneeInfo from "@/components/features/task/fields/AssigneeInfo";
import SubtaskList from "@/components/features/task/fields/SubtaskList";
import DateInfo from "@/components/features/task/fields/DateInfo";

/**
 * TaskCard: 개별 작업 카드 컴포넌트
 * @param task - 작업 정보
 * @param projectId - 프로젝트 id
 * @param onClick - 카드 클릭 이벤트
 */
interface TaskCardProps {
  task: Task;
  projectId: string;
  onClick?: () => void;
}

const TaskCard = ({ task, projectId, onClick }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const dragStyle = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-500 hover:shadow-lg hover:border-main-300 dark:hover:border-main-400 transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2 mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">
        <h3 className="font-bold text-lg flex-1 line-clamp-2 text-gray-800 dark:text-gray-100">
          {task.title}
        </h3>
        {task.priority && <PriorityBadge priority={task.priority} />}
      </div>

      {task.description && (
        <p className="text-gray-600 dark:text-gray-400 bg-accent p-2 rounded border border-accent-200 dark:border-accent-700 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {task.assigned_user_id && (
        <div className="mb-3 bg-accent p-2 rounded border border-accent-200 dark:border-accent-700">
          <AssigneeInfo userId={task.assigned_user_id} projectId={projectId} />
        </div>
      )}

      {(task.started_at || task.ended_at) && (
        <div className="mb-3 bg-accent-50 dark:bg-accent-900/20 p-2 rounded border border-accent-200 dark:border-accent-700">
          <DateInfo
            startedAt={task.started_at ?? undefined}
            endedAt={task.ended_at ?? undefined}
          />
        </div>
      )}

      {task.subtasks?.length > 0 && (
        <div className="mb-3 bg-accent-50 dark:bg-accent-900/20 p-2 rounded border border-accent-200 dark:border-accent-700">
          <SubtaskList subtasks={task.subtasks} />
        </div>
      )}

      {task.memo && (
        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded text-xs text-gray-700 dark:text-yellow-200 line-clamp-2">
          {task.memo}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
