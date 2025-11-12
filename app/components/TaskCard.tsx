// components/TaskCard.tsx

import { Task } from "@/app/types";
import { PRIORITY_COLORS } from "@/lib/constants";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
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
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">
            하위 작업 ({task.subtasks.filter((s) => s.completed).length}/
            {task.subtasks.length})
          </p>
          <div className="space-y-1">
            {task.subtasks.slice(0, 2).map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  readOnly
                  className="w-4 h-4"
                />
                <span
                  className={
                    subtask.completed ? "line-through text-gray-400" : ""
                  }
                >
                  {subtask.title}
                </span>
              </div>
            ))}
            {task.subtasks.length > 2 && (
              <p className="text-xs text-gray-400">
                +{task.subtasks.length - 2}개 더
              </p>
            )}
          </div>
        </div>
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
        {task.assigned_to && (
          <span className="text-sm text-gray-600">
            👤 User {task.assigned_to.slice(-1)}
          </span>
        )}

        {/* 우선순위 */}
        {task.priority && (
          <span
            className={`text-xs px-2 py-1 rounded font-medium ${
              PRIORITY_COLORS[task.priority]
            }`}
          >
            {task.priority === "high"
              ? "높음"
              : task.priority === "normal"
              ? "보통"
              : "낮음"}
          </span>
        )}
      </div>

      {/* 날짜 정보 */}
      <div className="mt-2 flex gap-3 text-xs text-gray-500">
        {task.started_at && <span>🚀 {task.started_at}</span>}
        {task.ended_at && <span>📅 {task.ended_at}</span>}
      </div>
    </div>
  );
};

export default TaskCard;
