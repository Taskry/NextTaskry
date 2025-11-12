// components/kanban/KanbanBoard.tsx

import { KANBAN_COLUMNS, MOCK_TASKS_DATA } from "@/lib/constants";
import KanbanColumn from "./KanbanColumn";
import Button from "../Button/Button";

const KanbanBoard = () => {
  return (
    <div className="min-h-screen p-8 bg-white">
      {/* 버튼 */}
      <div className="mb-6 flex justify-end">
        <Button variant="bgMain300" size="base" textColor="white">
          + 새 작업
        </Button>
      </div>

      {/* 칸반 박스 */}
      <div className="bg-main-200/40 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">
            프로젝트명이 들어갑니다
          </h2>
        </div>

        {/* 칸반 그리드 */}
        <div className="p-6 bg-white">
          <div className="grid grid-cols-3 gap-6">
            {KANBAN_COLUMNS.map((column) => (
              <KanbanColumn
                id={column.id}
                title={column.title}
                color={column.color}
                tasks={MOCK_TASKS_DATA[column.id]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
