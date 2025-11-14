"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import KanbanBoard from "@/app/components/kanban/KanbanBoard";
import MemoPanel from "@/app/components/kanban/MemoPanel";
import BottomNavigation from "@/app/components/BottomNavigation";
import Modal from "@/app/components/Modal/Modal";
import TaskForm from "@/app/components/task/TaskForm";
import { Task } from "@/app/types/kanban";
import { mockTasks } from "@/app/data/mockTasks";
import { showToast } from "@/lib/toast";
type NavItem = "calendar" | "kanban" | "memo" | "project";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [currentView, setCurrentView] = useState<NavItem>("kanban");
  const [showMemoPanel, setShowMemoPanel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const handleViewChange = (view: NavItem) => {
    if (view === "memo") {
      setShowMemoPanel(!showMemoPanel);
    } else if (view === "project") {
      // 프로젝트 목록으로 돌아가기
      window.location.href = "/";
    } else {
      setCurrentView(view);
      setShowMemoPanel(false);
    }
  };

  const handleAddTask = (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      kanban_board_id: projectId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    showToast("태스크가 추가되었습니다.", "success");
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) =>
        task.id === updatedTask.id
          ? { ...updatedTask, updated_at: new Date().toISOString() }
          : task
      )
    );
    showToast("태스크가 업데이트되었습니다.", "success");
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    showToast("태스크가 삭제되었습니다.", "success");
  };

  const filteredTasks = tasks.filter(
    (task) => task.kanban_board_id === projectId
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 메인 영역 */}
      <div className="flex-1 flex overflow-hidden gap-6 min-h-0 p-6">
        {/* 왼쪽: 칸반보드 */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 min-h-0 ${
            showMemoPanel ? "flex-[0.7]" : "flex-1"
          }`}
        >
          <div className="flex-1 overflow-hidden min-h-0">
            {currentView === "kanban" && (
              <KanbanBoard
                projectName={`프로젝트 ${projectId}`}
                tasks={filteredTasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {currentView === "calendar" && (
              <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-sm">
                <p className="text-gray-400 text-lg">📅 캘린더 (준비 중)</p>
              </div>
            )}

            {currentView === "project" && (
              <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-sm">
                <p className="text-gray-400 text-lg">
                  📋 프로젝트 세부 (준비중)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 메모 패널 */}
        <div
          className={`flex flex-col transition-all duration-300 overflow-hidden min-h-0 ${
            showMemoPanel ? "flex-[0.3] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <MemoPanel />
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="shrink-0">
        <BottomNavigation
          activeView={showMemoPanel ? "memo" : currentView}
          onViewChange={handleViewChange}
        />
      </div>

      {/* 태스크 추가 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="새 태스크 추가"
      >
        <TaskForm
          boardId={projectId}
          onSubmit={handleAddTask}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
