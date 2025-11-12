// components/kanban/KanbanBoard.tsx

import { KANBAN_COLUMNS, MOCK_TASKS_DATA } from "@/lib/constants";
import KanbanColumn from "./KanbanColumn";
import Button from "../Button/Button";

const KanbanBoard = () => {
  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            프로젝트명이 들어갑니다
          </h2>
          <Button variant="bgMain300" size="base" textColor="white">
            + 새 작업
          </Button>
        </div>
      </div>

      {/* 칸반 그리드 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-6">
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
