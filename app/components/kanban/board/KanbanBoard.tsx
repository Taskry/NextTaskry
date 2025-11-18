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

const COLUMNS = [
  { id: "todo" as TaskStatus, title: "할 일", color: "bg-gray-100" },
  { id: "inprogress" as TaskStatus, title: "진행 중", color: "bg-blue-100" },
  { id: "done" as TaskStatus, title: "완료", color: "bg-green-100" },
];

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

  /**
   * 🔥 1. 칸반 컬럼 별로 작업을 그룹핑
   *    tasks 배열 전체 →  { todo: [], inprogress: [], done: [] }
   */
  const groupedTasks = KANBAN_COLUMNS.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  /**
   * 🔥 2. 새로운 Task 생성
   */
  const handleCreateTask = (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    onCreateTask(taskData);
    setShowTaskAddModal(false);
  };

  /**
   * 🔥 3. Task 업데이트
   */
  const handleUpdateTask = (updatedTask: Task) => {
    onUpdateTask(updatedTask);

    // 현재 선택된 Task도 업데이트
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  /**
   * 🔥 4. Task 삭제
   */
  const handleDeleteTask = (taskId: string) => {
    onDeleteTask(taskId);

    // 삭제된 Task를 보고 있었다면 모달 닫기
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  return (
    <div className="mx-20 my-10">
      <div className="h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden w-full">
        {/* 헤더 */}
        <div className="flex justify-between px-6 py-4 border-b border-gray-200 bg-main-200/80">
          <h2 className="text-2xl font-bold text-gray-800">{projectName}</h2>

          <button
            onClick={() => setShowTaskAddModal(true)}
            className="px-4 py-2 bg-main-500 text-white rounded-lg hover:bg-main-600 transition-colors"
          >
            새 작업 추가
          </button>
        </div>

        {/* 칸반 컬럼 그리드 */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 py-4">
          <div className="flex gap-4 h-full">
            {KANBAN_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={groupedTasks[column.id] || []}
                onTaskClick={(task) => setSelectedTask(task)}
              />
            ))}
          </div>
        </div>

        {/* 🔥 Task 상세 모달 */}
        {selectedTask && (
          <Modal isOpen onClose={() => setSelectedTask(null)}>
            <div className="p-6">
              <TaskDetail
                task={selectedTask}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                onClose={() => setSelectedTask(null)}
              />
            </div>
          </Modal>
        )}

        {/* 🔥 Task 추가 모달 */}
        {showTaskAddModal && (
          <Modal isOpen onClose={() => setShowTaskAddModal(false)}>
            <div className="p-6">
              <TaskAdd
                boardId={boardId}
                onSuccess={handleCreateTask}
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
