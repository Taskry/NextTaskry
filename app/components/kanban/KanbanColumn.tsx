// components/kanban/KanbanColumn.tsx

import { Task, TaskStatus } from "@/app/types";
import TaskCard from "../TaskCard";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
}

const KanbanColumn = ({ id, title, color, tasks }: KanbanColumnProps) => {
  return (
    <div className="w-80 shrink-0">
      {" "}
      {/* 👈 320px 고정 */}
      <div className="bg-gray-50 p-3 rounded-lg h-full flex flex-col">
        {/* 열 제목 */}
        <div className="mb-3">
          <h2 className="font-bold text-base flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
            {title}
            <span className="text-xs text-gray-500 font-normal ml-1">
              {tasks.length}
            </span>
          </h2>
        </div>

        {/* Task 카드 목록 - 세로 스크롤 */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
