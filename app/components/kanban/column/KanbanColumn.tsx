import TaskCard from "../../task/TaskCard";
import { Task } from "@/app/types";

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const KanbanColumn = ({
  id,
  title,
  color,
  tasks,
  onTaskClick,
}: KanbanColumnProps) => {
  return (
    <div className="flex flex-col w-80 flex-shrink-0 bg-gray-50 rounded-lg border shadow-sm">
      {/* Column Header */}
      <div
        className="p-4 border-b text-white rounded-t-lg"
        style={{ backgroundColor: color }}
      >
        <h3 className="font-semibold">{title}</h3>
      </div>

      {/* Task Cards */}
      <div className="p-3 flex flex-col gap-3 overflow-y-auto">
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
