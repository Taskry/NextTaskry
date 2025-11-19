"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import KanbanBoard from "@/app/components/kanban/board/KanbanBoard";
import MemoPanel from "@/app/components/kanban/board/MemoPanel";
import BottomNavigation from "@/app/components/BottomNavigation";

import { Task } from "@/app/types/kanban";
import { showToast } from "@/lib/toast";

import {
  getTasksByBoardId,
  createTask,
  updateTask,
  deleteTask,
} from "@/app/api/task/tasks";

type NavItem = "calendar" | "kanban" | "memo" | "project";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<NavItem>("kanban");
  const [showMemoPanel, setShowMemoPanel] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 👇 Supabase에서 Task 불러오기
    const fetchTasks = async () => {
      const { data, error } = await getTasksByBoardId(projectId);
      console.log(data);

      if (error) {
        console.error(error);
        return;
      }

      setTasks(data || []);
      setLoading(false);
    };

    fetchTasks();
  }, [projectId]);

  // 👇 생성
  const handleCreateTask = async (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    const { data, error } = await createTask(taskData);

    if (error) {
      showToast("작업 생성 실패", "error");
      return;
    }

    if (data) {
      setTasks((prev) => [...prev, data]);
    }
    showToast("작업이 생성되었습니다.", "success");
  };

  // 👇 수정
  const handleUpdateTask = async (updated: Task) => {
    const { data, error } = await updateTask(updated.id, updated);

    if (error) {
      showToast("작업 수정 실패", "error");
      return;
    }

    if (data) {
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? data : t)));
    }
    showToast("작업이 업데이트되었습니다.", "success");
  };

  // 👇 삭제
  const handleDeleteTask = async (taskId: string) => {
    const { error } = await deleteTask(taskId);

    if (error) {
      showToast("작업 삭제 실패", "error");
      return;
    }

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast("작업이 삭제되었습니다.", "success");
  };

  const handleViewChange = (view: NavItem) => {
    if (view === "memo") {
      setShowMemoPanel((prev) => !prev);
    } else if (view === "project") {
      window.location.href = "/";
    } else {
      setCurrentView(view);
      setShowMemoPanel(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-lg">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 메인 */}
      <div className="flex-1 flex overflow-hidden gap-6 min-h-0 p-6">
        {/* 칸반 */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 min-h-0 ${
            showMemoPanel ? "flex-[0.7]" : "flex-1"
          }`}
        >
          <div className="flex-1 overflow-hidden min-h-0">
            {currentView === "kanban" && (
              <KanbanBoard
                projectName={`프로젝트 ${projectId}`}
                boardId={projectId} // 임시로 projectId를 boardId로 사용
                tasks={tasks}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </div>
        </div>

        {/* 메모 패널 */}
        <div
          className={`flex flex-col transition-all duration-300 overflow-hidden min-h-0 ${
            showMemoPanel ? "flex-[0.3] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <MemoPanel />
        </div>
      </div>

      {/* 네비 */}
      <div className="shrink-0">
        <BottomNavigation
          activeView={showMemoPanel ? "memo" : currentView}
          onViewChange={handleViewChange}
        />
      </div>
    </div>
  );
}
