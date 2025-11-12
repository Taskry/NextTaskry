// components/kanban/KanbanColumn.tsx

import { Task, TaskStatus } from "@/app/types";
import TaskCard from "../TaskCard";

/**
 * 칸반보드의 열(Column) 하나
 * 예: "할 일", "진행 중", "완료"
 */
interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
}

const KanbanColumn = ({ id, title, color, tasks }: KanbanColumnProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {/* 열 제목 */}
      <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        {title}
        <span className="text-sm text-gray-500 font-normal">
          ({tasks.length})
        </span>
      </h2>

      {/* 이 열에 속한 Task들 */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
