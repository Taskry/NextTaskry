// app/page.tsx

import TaskCard from "./components/TaskCard";
import { MOCK_TASKS_DATA, KANBAN_COLUMNS } from "@/lib/constants";

const Home = () => {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Taskry 칸반보드</h1>

      {/* 3개 열을 가로로 배치 */}
      <div className="grid grid-cols-3 gap-6">
        {KANBAN_COLUMNS.map((column) => (
          <div key={column.id} className="bg-gray-50 p-4 rounded-lg">
            {/* 열 제목 */}
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${column.color}`}></span>
              {column.title}
              <span className="text-sm text-gray-500 font-normal">
                ({MOCK_TASKS_DATA[column.id].length})
              </span>
            </h2>

            {/* Task 카드 목록 */}
            <div className="space-y-3">
              {MOCK_TASKS_DATA[column.id].map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
