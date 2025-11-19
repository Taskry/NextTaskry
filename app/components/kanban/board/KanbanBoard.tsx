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
  boardId: string;
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateTask: (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => void;
}

const KanbanBoard = ({
  projectName,
  boardId,
  tasks,
  onUpdateTask,
  onDeleteTask,
  onCreateTask,
}: KanbanBoardProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskAddModal, setShowTaskAddModal] = useState(false);

  // 상태별로 Task 그룹핑
  const groupedTasks = KANBAN_COLUMNS.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  // Task 생성 핸들러
  const handleCreateTask = (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    onCreateTask(taskData);
    setShowTaskAddModal(false);
  };

  // Task 수정 핸들러
  const handleUpdateTask = (updatedTask: Task) => {
    onUpdateTask(updatedTask);
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  // Task 삭제 핸들러
  const handleDeleteTask = (taskId: string) => {
    onDeleteTask(taskId);
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  return (
    <div className="mx-20 my-10">
      <div className="h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden w-full">
        {/* 헤더 */}
        <Header
          projectName={projectName}
          onAddClick={() => setShowTaskAddModal(true)}
        />

        {/* 칸반 컬럼 */}
        <ColumnGrid groupedTasks={groupedTasks} onTaskClick={setSelectedTask} />

        {/* Task 상세 모달 */}
        {selectedTask && (
          <Modal isOpen onClose={() => setSelectedTask(null)}>
            <TaskDetail
              task={selectedTask}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onClose={() => setSelectedTask(null)}
            />
          </Modal>
        )}

        {/* Task 추가 모달 */}
        {showTaskAddModal && (
          <Modal isOpen onClose={() => setShowTaskAddModal(false)}>
            <TaskAdd
              boardId={boardId}
              onSuccess={handleCreateTask}
              onCancel={() => setShowTaskAddModal(false)}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

// 헤더 컴포넌트 분리
function Header({
  projectName,
  onAddClick,
}: {
  projectName: string;
  onAddClick: () => void;
}) {
  return (
    <div className="flex justify-between px-6 py-4 border-b border-gray-200 bg-main-200/80">
      <h2 className="text-2xl font-bold text-gray-800">{projectName}</h2>
      <button
        onClick={onAddClick}
        className="px-4 py-2 bg-main-500 text-white rounded-lg hover:bg-main-600 transition-colors"
      >
        새 작업 추가
      </button>
    </div>
  );
}

// 컬럼 그리드 컴포넌트 분리
function ColumnGrid({
  groupedTasks,
  onTaskClick,
}: {
  groupedTasks: Record<TaskStatus, Task[]>;
  onTaskClick: (task: Task) => void;
}) {
  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 py-4">
      <div className="flex gap-4 h-full">
        {KANBAN_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={groupedTasks[column.id] || []}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
