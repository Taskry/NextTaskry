// components/TaskCard.tsx

import { Task } from "@/app/types";
import PriorityBadge from "./PriorityBadge";
import AssigneeInfo from "./AssigneeInfo";
import SubtaskList from "./SubtaskList";
import DateInfo from "./DateInfo";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
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
        {task.assigned_to && <AssigneeInfo assignedTo={task.assigned_to} />}

        {/* 우선순위 */}
        {task.priority && <PriorityBadge priority={task.priority} />}
      </div>

      {/* 날짜 정보 */}
      <DateInfo startedAt={task.started_at} endedAt={task.ended_at} />
    </div>
  );
};

export default TaskCard;
