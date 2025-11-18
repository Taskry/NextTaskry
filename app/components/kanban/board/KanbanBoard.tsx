// components/kanban/KanbanBoard.tsx
"use client";

import { useState } from "react";
import { KANBAN_COLUMNS } from "@/lib/constants";
import { Task, TaskStatus } from "@/app/types";
import KanbanColumn from "../column/KanbanColumn";
import Modal from "../../Modal/Modal";
import TaskDetail from "../../task/TaskDetail";
import TaskAdd from "../../task/TaskAdd";

interface KanbanBoardProps {
  projectName: string;
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateTask: (task: Omit<Task, "id" | "created_at" | "updated_at">) => void;
}

const KanbanBoard = ({
  projectName,
  tasks,
  onUpdateTask,
  onDeleteTask,
  onCreateTask,
}: KanbanBoardProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskAddModal, setShowTaskAddModal] = useState(false);

  // 상태별로 작업 그룹화
  const groupedTasks = KANBAN_COLUMNS.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const handleCreateTask = (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    onCreateTask(taskData);
    setShowTaskAddModal(false);
  };

  return (
    <div className="mx-20 my-10">
      <div className="h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden w-full">
        {/* 헤더 */}
        <div className="flex justify-between px-6 py-4 border-b border-gray-200 bg-main-200/80">
          <h2 className="text-2xl content-center font-bold p-1 text-gray-800">
            {projectName}
          </h2>
          <button
            onClick={() => setShowTaskAddModal(true)}
            className="px-4 py-2 bg-main-500 text-white rounded-lg hover:bg-main-600 transition-colors"
          >
            새 작업 추가
          </button>
        </div>

        {/* 캔반 그리드 */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 py-4">
          <div className="flex gap-4 h-full">
            {KANBAN_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                tasks={groupedTasks[column.id] || []}
                onTaskClick={(task) => setSelectedTask(task)}
              />
            ))}
          </div>
        </div>

        {/* Task 상세 모달 */}
        {selectedTask && (
          <Modal isOpen={true} onClose={() => setSelectedTask(null)}>
            <div className="p-6">
              <TaskDetail
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
              />
            </div>
          </Modal>
        )}

        {/* Task 추가 모달 */}
        {showTaskAddModal && (
          <Modal isOpen={true} onClose={() => setShowTaskAddModal(false)}>
            <div className="p-6">
              <TaskAdd
                boardId="board-001"
                onSubmit={handleCreateTask}
                onCancel={() => setShowTaskAddModal(false)}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
