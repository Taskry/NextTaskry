// components/kanban/KanbanBoard.tsx
"use client";

import { useState } from "react";
import { KANBAN_COLUMNS } from "@/lib/constants";
import { Task, TaskStatus } from "@/app/types";
import KanbanColumn from "./KanbanColumn";
import Modal from "../Modal/Modal";
import TaskDetail from "../task/TaskDetail";

interface KanbanBoardProps {
  projectName: string;
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanBoard = ({
  projectName,
  tasks,
  onUpdateTask,
  onDeleteTask,
}: KanbanBoardProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 상태별로 작업 그룹화
  const groupedTasks = KANBAN_COLUMNS.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const handleUpdateTask = (updatedTask: Task) => {
    onUpdateTask(updatedTask);
    setSelectedTask(updatedTask); // 모달 유지하며 데이터 업데이트
  };

  const handleDeleteTask = (taskId: string) => {
    onDeleteTask(taskId);
    setSelectedTask(null);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden w-full">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-200 bg-main-200/80">
        <h2 className="text-xl font-bold text-gray-800">{projectName}</h2>
        <p className="text-sm text-gray-600 mt-1">칸반보드</p>
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
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default KanbanBoard;
