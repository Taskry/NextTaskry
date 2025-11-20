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
  onClick?: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
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
      className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing"
      // cursor-grab: 드래그 가능한 커서
      // active:cursor-grabbing: 드래그 중 커서
    >
      {/* 제목 */}
      <h3 className="font-bold text-lg mb-2">{task.title}</h3>

      {/* 설명 */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <SubtaskList subtasks={task.subtasks} />
      )}

      {/* 메모 */}
      {task.memo && (
        <div className="mb-3 p-2 bg-yellow-50 rounded text-sm">
          📝 {task.memo}
        </div>
      )}

      {/* 하단 정보 */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        {/* 담당자 */}
        {task.assigned_user_id && (
          <AssigneeInfo assignedTo={task.assigned_user_id} />
        )}

        {/* 우선순위 */}
        {task.priority && <PriorityBadge priority={task.priority} />}
      </div>

      {/* 날짜 정보 */}
      <DateInfo
        startedAt={task.started_at ?? undefined}
        endedAt={task.ended_at ?? undefined}
      />
    </div>
  );
};

export default TaskCard;
