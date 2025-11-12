// components/kanban/KanbanBoard.tsx

import { KANBAN_COLUMNS, MOCK_TASKS_DATA } from "@/lib/constants";
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* 3개 열을 가로로 배치 */}
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
  );
};

export default KanbanBoard;
