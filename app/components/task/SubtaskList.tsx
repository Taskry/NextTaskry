// components/task/SubtaskList.tsx

import { Subtask } from "@/app/types";

interface SubtaskListProps {
  subtasks: Subtask[];
}

const SubtaskList = ({ subtasks }: SubtaskListProps) => {
  const completedCount = subtasks.filter((s) => s.completed).length;

  return (
    <div className="mb-3">
      <p className="text-xs text-gray-500 mb-1">
        하위 작업 ({completedCount}/{subtasks.length})
      </p>
      <div className="space-y-1">
        {subtasks.slice(0, 2).map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={subtask.completed}
              readOnly
              className="w-4 h-4"
            />
            <span
              className={subtask.completed ? "line-through text-gray-400" : ""}
            >
              {subtask.title}
            </span>
          </div>
        ))}
        {subtasks.length > 2 && (
          <p className="text-xs text-gray-400">+{subtasks.length - 2}개 더</p>
        )}
      </div>
    </div>
  );
};

export default SubtaskList;
