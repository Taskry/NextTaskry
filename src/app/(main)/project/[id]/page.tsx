"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import CalendarView from "@/components/features/CalendarView/CalendarView";
import KanbanBoard from "@/components/features/kanban/KanbanBoard";
import BottomNavigation from "@/components/layout/BottomNavigation";

import { Task } from "@/types/kanban";
import { showToast } from "@/lib/utils/toast";

import {
  getTasksByBoardId,
  createTask,
  updateTask,
  deleteTask,
} from "@/app/api/tasks/tasks";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase/supabase";
import { ProjectRole } from "@/types";
import MemoView from "@/components/features/kanban/MemoView";
import { el } from "date-fns/locale";

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
  const [userRole, setUserRole] = useState<ProjectRole | null>(null);
  const { data: session } = useSession();

  //해당 프로젝트에 대한 로그인한 유저의 role 조회
  useEffect(() => {
    // console.log("ProjectPage 실행 유저 역할조회")

    //임시데이터
    // console.log("session.user.user_id:", session?.user?.user_id);
    // console.log("projectId:", projectId);
    // 원찬 id : dada0d9d-0dbd-4d3e-b0b8-61a0bee576c3
    // 8b492a03-f167-4523-b9d0-1e94ce499889
    // leader

    const fetchRole = async () => {
      if (!session?.user?.user_id || !projectId) return;
      const { data, error } = await supabase
        .from("project_members")
        .select("role")
        .eq("project_id", projectId)
        .eq("user_id", session.user.user_id)
        .maybeSingle();

      if (error) {
        console.error("프로젝트 멤버 역할 조회 오류:", error);
        return;
      }

      if (data) setUserRole(data.role as ProjectRole);
    };
    fetchRole();
  }, [projectId, session?.user?.user_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!projectId || projectId === "undefined" || projectId === "null") {
          console.warn("⚠️ Invalid projectId:", projectId);
          setLoading(false);
          return;
        }

        // 1. 프로젝트 정보 가져오기 - API Route 사용
        const projectRes = await fetch(`/api/projects/${projectId}`);
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProjectName(projectData.project_name || "이름 없는 프로젝트");
        } else {
          setProjectName("알 수 없는 프로젝트");
        }

        // 2. 칸반보드 ID 가져오기 (또는 생성) - API Route 사용
        let boardId = null;

        // GET으로 칸반보드 조회
        const kanbanRes = await fetch(
          `/api/kanban/boards?projectId=${projectId}`
        );

        if (kanbanRes.ok) {
          const kanbanData = await kanbanRes.json();

          if (kanbanData && kanbanData.length > 0) {
            // 이미 칸반보드가 있는 경우
            boardId = kanbanData[0].id;
          } else {
            // 칸반보드가 없으면 생성
            console.log("⚠️ 칸반보드가 없어서 새로 생성합니다.");

            const createRes = await fetch("/api/kanban/boards", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                project_id: projectId,
                columns: "todo,inprogress,done",
              }),
            });

            if (createRes.ok) {
              const newKanban = await createRes.json();
              boardId = newKanban.id;
            } else {
              console.error("칸반보드 생성 실패");
            }
          }
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

  // 리얼타임 업데이트 설정
  useEffect(() => {
    console.log("🔥 구독 시작 횟수 확인");
    if (!projectId || !kanbanBoardId) return;
    console.log("리얼타임 업데이트 설정 실행");

    const channel = supabase
      .channel(`taskry-board-${kanbanBoardId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `kanban_board_id=eq.${kanbanBoardId}`,
        },
        (payload) => {
          console.log("리얼타임 업데이트 수신:", payload.eventType, payload);

          if (payload.eventType === "INSERT") {
            const newTask = payload.new as Task;
            setTasks((prev) => {
              // 중복 추가 방지
              if (prev.some((t) => t.id === newTask.id)) {
                console.log("이미 존재하는 Task");
                return prev;
              }
              console.log("새로운 Task 추가:", newTask.title);
              return [...prev, newTask];
            });
          } else if (payload.eventType === "UPDATE") {
            const updatedTask = payload.new as Task;
            setTasks((prev) =>
              prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
          } else if (payload.eventType === "DELETE") {
            const deletedTask = payload.old as Task;
            setTasks((prev) => prev.filter((t) => t.id !== deletedTask.id));
            console.log("Task 삭제:", deletedTask.title);
          }
        }
      )
      .subscribe((status) => {
        console.log("Supabase 채널 상태:", status);
      });

    return () => {
      console.log("Supabase 채널 해제");
      supabase.removeChannel(channel);
    };
  }, [projectId, kanbanBoardId]);

  const handleCreateTask = async (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    const { data, error } = await createTask(taskData);

    if (error) {
      showToast("작업 생성 실패", "error");
      return;
    }

    if (data) {
      //    setTasks((prev) => [...prev, data]);
      showToast("작업이 생성되었습니다.", "success");
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    const result = await updateTask(taskId, updates);

    // if (result.data) {
    //   setTasks((prev) =>
    //     prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    //   );
    // }
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await deleteTask(taskId);

    if (error) {
      showToast("작업 삭제 실패", "error");
      return;
    }

    //  setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast("작업이 삭제되었습니다.", "success");
  };

  const handleRefresh = async () => {
    const { data: tasksData, error: tasksError } = await getTasksByBoardId(
      projectId
    );

    if (tasksError) {
      console.error("Tasks 조회 실패:", tasksError);
    } else {
      setTasks(tasksData || []);
    }
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
        <p className="text-gray-400 dark:text-gray-500 text-lg">
          불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex overflow-hidden gap-4 min-h-0 p-6">
        {/* 칸반 + 캘린더 영역 */}
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
                userRole={userRole}
                projectId={projectId}
              />
            )}

            {currentView === "calendar" && (
              <CalendarView
                tasks={tasks}
                boardId={kanbanBoardId}
                projectId={projectId}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onSelectTask={() => {}}
                onTaskCreated={handleRefresh}
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
          <MemoView projectId={projectId} />
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
