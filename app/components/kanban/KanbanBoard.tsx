// components/kanban/KanbanBoard.tsx

import { KANBAN_COLUMNS, MOCK_TASKS_DATA } from "@/lib/constants";
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = () => {
  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-200 bg-main-200/80">
        <h2 className="text-xl font-bold text-gray-800">
          프로젝트명이 들어갑니다
        </h2>
      </div>

      {/* 칸반 그리드 */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 py-4">
        <div className="flex gap-4 h-full">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              tasks={MOCK_TASKS_DATA[column.id]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
