import TaskCard from "../../task/TaskCard";
import { Task, TaskStatus } from "@/app/types";

import { todo } from "node:test";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const KanbanColumn = ({ id, title, tasks, onTaskClick }: KanbanColumnProps) => {
  // 칸반 컬럼별 색상 반환
  const getColumnColor = (status: TaskStatus) => {
    const colors = {
      todo: "bg-gray-400",
      inprogress: "bg-blue-400",
      done: "bg-green-400",
    };
    return colors[status];
  };
  return (
    <div className="flex flex-col w-80 flex-shrink-0 bg-gray-50 rounded-lg border shadow-sm">
      {/* Column Header - CVA 적용 */}
      <div className="flex items-center justify-between px-4 py-3 border-b rounded-t-lg bg-white">
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
                ? "text-gray-700"
                : id === "inprogress"
                ? "text-blue-700"
                : "text-green-700"
            }`}
          >
            {title}
          </h3>
        </div>
        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
          {tasks.length}
        </span>
      </div>

      {/* Task Cards */}
      <div className="p-3 flex flex-col gap-3 overflow-y-auto flex-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))
        ) : (
          <div className="py-10 text-center text-sm text-gray-400">
            작업이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
