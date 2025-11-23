// components/TaskCard.tsx

// dnd-kit 사용을 위한 import
import { useSortable } from "@dnd-kit/sortable";

import { Task } from "@/types";
import { CSS } from "@dnd-kit/utilities";
import PriorityBadge from "@/components/features/task/fields/PriorityBadge";
import AssigneeInfo from "@/components/features/task/fields/AssigneeInfo";
import SubtaskList from "@/components/features/task/fields/SubtaskList";
import DateInfo from "@/components/features/task/fields/DateInfo";

interface TaskCardProps {
  task: Task;
  projectId: string;
  onClick?: () => void;
}

const TaskCard = ({ task, projectId, onClick }: TaskCardProps) => {
  // useSortable 훅을 사용하여 드래그 앤 드롭 기능 활성화
  const {
    attributes, // 드래그에 필요한 HTML 속성들
    listeners, // 드래그 이벤트 리스너들
    setNodeRef, // DOM 요소 연결
    transform, // 드래그 중 이동 변환
    transition, // 애니메이션
    isDragging, // 현재 드래그 중인지 여부
  } = useSortable({
    id: task.id,
  });

  // 드래그 중일 때 스타일 적용
  const dragstyle = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1, // 드래그 중일 때 반투명
  };

  return (
    <div
      ref={setNodeRef} // DOM 연결
      style={dragstyle} // 드래그 스타일 적용
      {...attributes} // 드래그 속성 적용
      {...listeners} // 드래그 이벤트 적용
      onClick={onClick}
      className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing"
      // cursor-grab: 드래그 가능한 커서
      // active:cursor-grabbing: 드래그 중 커서
    >
      {/* 제목 & 우선순위 */}
      <div className="flex items-start justify-between gap-2 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
        <h3 className="font-bold text-lg flex-1 line-clamp-2 text-gray-800 dark:text-gray-100">
          {task.title}
        </h3>
        {task.priority && <PriorityBadge priority={task.priority} />}
      </div>

      {/* 설명 */}
      {task.description && (
        <p className="text-gray-600 dark:text-gray-400 bg-accent p-2 rounded border border-accent-200 dark:border-accent-700 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* 담당자 */}
      {task.assigned_user_id && (
        <div className="mb-3 bg-accent p-2 rounded border border-accent-200 dark:border-accent-700">
          <AssigneeInfo userId={task.assigned_user_id} projectId={projectId} />
        </div>
      )}

      {/* 기간 */}
      {(task.started_at || task.ended_at) && (
        <div className="mb-3 bg-accent-50 dark:bg-accent-900/20 p-2 rounded border border-accent-200 dark:border-accent-700">
          <DateInfo
            startedAt={task.started_at ?? undefined}
            endedAt={task.ended_at ?? undefined}
          />
        </div>
      )}

      {/* 하위 작업 */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-3 bg-accent-50 dark:bg-accent-900/20 p-2 rounded border border-accent-200 dark:border-accent-700">
          <SubtaskList subtasks={task.subtasks} />
        </div>
      )}

      {/* 메모 */}
      {task.memo && (
        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded text-xs text-gray-700 dark:text-yellow-200 line-clamp-2">
          {task.memo}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
