// app/page.tsx

"use client";

import { useState } from "react";
import KanbanBoard from "./components/kanban/KanbanBoard";
import MemoPanel from "./components/kanban/MemoPanel";
import BottomNavigation from "./components/BottomNavigation";
import Button from "./components/Button/Button";
import Modal from "./components/Modal/Modal";
import TaskForm from "./components/task/TaskForm";
import ProjectCard from "./components/project/ProjectCard";
import { Task } from "./types/kanban";
import { mockTasks } from "./data/mockTasks";

type ViewType = "calendar" | "kanban" | "memo" | "project";

const Home = () => {
  const [currentView, setCurrentView] = useState<ViewType>("project");
  const [showMemoPanel, setShowMemoPanel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const handleViewChange = (view: ViewType) => {
    if (view === "memo") {
      setShowMemoPanel(!showMemoPanel);
    } else {
      setCurrentView(view);
      setShowMemoPanel(false);
      // 프로젝트 뷰로 돌아갈 때 선택된 프로젝트 초기화
      if (view === "project") {
        setSelectedProjectId(null);
      }
    }
  };

  const handleSelectProject = (projectId: string) => {
    console.log("프로젝트 선택됨:", projectId);
    setSelectedProjectId(projectId);
    setCurrentView("kanban");
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setCurrentView("project");
  };

  const handleCreateTask = (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      kanban_board_id: selectedProjectId || taskData.kanban_board_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsModalOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const projectTasks = selectedProjectId
    ? tasks.filter((task) => task.kanban_board_id === selectedProjectId)
    : [];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 버튼 영역 */}
      <div className="px-6 pt-6 pb-2 flex justify-between items-center">
        {/* 뒤로가기 버튼 - 칸반보드 뷰에서만 표시 */}
        {currentView === "kanban" && selectedProjectId && (
          <Button
            variant="basic"
            size="base"
            icon="arrowLeft"
            onClick={handleBackToProjects}
          >
            프로젝트 목록
          </Button>
        )}
        <div className="flex-1" />
        {/* 새 작업 버튼 - 칸반보드 뷰에서만 표시 */}
        {currentView === "kanban" && selectedProjectId && (
          <Button
            variant="bgMain300"
            size="base"
            textColor="white"
            onClick={() => setIsModalOpen(true)}
          >
            + 새 작업
          </Button>
        )}
      </div>

      {/* 메인 영역 */}
      <div className="flex-1 flex overflow-hidden pl-6 pb-6 gap-6 min-h-0">
        {/* 왼쪽: 메인 뷰 */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 min-h-0 ${
            showMemoPanel ? "flex-[0.7]" : "flex-1"
          }`}
        >
          {/* 컨텐츠 영역 */}
          <div className="flex-1 overflow-hidden min-h-0">
            {currentView === "kanban" && selectedProjectId && (
              <KanbanBoard
                projectName="선택된 프로젝트"
                tasks={projectTasks}
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
              <ProjectCard onSelectProject={handleSelectProject} />
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

      {/* Task 생성 모달 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsModalOpen(false)}
          boardId={selectedProjectId || "main-board"}
        />
      </Modal>
    </div>
  );
};

export default Home;
