"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import KanbanBoard from "@/app/components/kanban/board/KanbanBoard";
import MemoPanel from "@/app/components/kanban/board/MemoPanel";
import BottomNavigation from "@/app/components/BottomNavigation";

import { Task } from "@/app/types/kanban";
import { showToast } from "@/lib/toast";
import { supabase } from "@/lib/supabase/client";

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

  const [projectName, setProjectName] = useState<string>("");
  const [kanbanBoardId, setKanbanBoardId] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<NavItem>("kanban");
  const [showMemoPanel, setShowMemoPanel] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // projectId가 유효하지 않으면 로딩 종료
        if (!projectId || projectId === "undefined" || projectId === "null") {
          console.warn("⚠️ Invalid projectId:", projectId);
          setLoading(false);
          return;
        }

        // 1. 프로젝트 정보 가져오기
        const { data: projectData, error: projectError } = await (
          supabase as any
        )
          .from("projects")
          .select("*")
          .eq("project_id", projectId)
          .single();

        if (projectError) {
          console.error("프로젝트 조회 실패:", projectError);
          setProjectName("알 수 없는 프로젝트");
        } else if (projectData) {
          setProjectName(projectData.project_name || "이름 없는 프로젝트");
        }

        // 2. 칸반보드 ID 가져오기 (또는 생성)
        const { data: kanbanData, error: kanbanError } = await (supabase as any)
          .from("kanban_boards")
          .select("id")
          .eq("project_id", projectId)
          .single();

        let boardId = null; // 👈 재할당될 변수

        // 칸반보드가 없으면 생성
        if (kanbanError && kanbanError.code === "PGRST116") {
          console.log("⚠️ 칸반보드가 없어서 새로 생성합니다.");

          const { data: newKanban, error: createError } = await (
            supabase as any
          )
            .from("kanban_boards")
            .insert({
              project_id: projectId,
              columns: "todo,inprogress,done",
            })
            .select("id")
            .single();

          if (createError) {
            console.error("칸반보드 생성 실패:", createError);
          } else if (newKanban) {
            boardId = newKanban.id; // 👈 생성된 ID 저장
          }
        } else if (kanbanError) {
          console.error("칸반보드 조회 실패:", kanbanError);
        } else if (kanbanData) {
          boardId = kanbanData.id; // 👈 조회된 ID 저장
        }

        if (boardId) {
          setKanbanBoardId(boardId);
        }

        // 3. Tasks 가져오기
        const { data: tasksData, error: tasksError } = await getTasksByBoardId(
          projectId
        );

        if (tasksError) {
          console.error("Tasks 조회 실패:", tasksError);
        } else {
          setTasks(tasksData || []);
        }
      } catch (error) {
        console.error("데이터 로딩 중 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

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
      showToast("작업이 생성되었습니다.", "success");
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    const result = await updateTask(taskId, updates);

    if (result.data) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
    }
  };

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
      <div className="flex-1 flex overflow-hidden gap-6 min-h-0 p-6">
        {/* 칸반보드 */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 min-h-0 ${
            showMemoPanel ? "flex-[0.7]" : "flex-1"
          }`}
        >
          <div className="flex-1 overflow-hidden min-h-0">
            {currentView === "kanban" && (
              <KanbanBoard
                projectName={projectName}
                boardId={kanbanBoardId}
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

      {/* 하단 네비게이션 */}
      <div className="shrink-0">
        <BottomNavigation
          activeView={showMemoPanel ? "memo" : currentView}
          onViewChange={handleViewChange}
        />
      </div>
    </div>
  );
}
