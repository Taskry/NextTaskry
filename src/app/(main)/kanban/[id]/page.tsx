"use client";

import { useState, useEffect } from "react";
import { KanbanBoardType, Task } from "@/types";
import {
  createTask,
  getTasksByBoardId,
  updateTask,
  deleteTask,
} from "@/app/api/tasks/tasks";
import KanbanBoard from "@/components/features/kanban/KanbanBoard";

interface PageProps {
  params: {
    id: string; // 동적 라우트로 받아오는 boardId
  };
}

export default function KanbanBoardPage({ params }: PageProps) {
  const [board, setBoard] = useState<KanbanBoardType | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const boardId = params.id; // ✅ URL에서 동적으로 받아옴!

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [boardResponse, tasksResponse] = await Promise.all([
          fetch(`/api/kanban-board?id=${boardId}`),
          getTasksByBoardId(boardId),
        ]);

        if (boardResponse.ok) {
          const boardData = await boardResponse.json();
          setBoard(boardData.data);
        }

        const { data, error } = tasksResponse;
        if (error) {
          console.error("작업 조회 실패:", error);
          return;
        }
        setTasks(data || []);
      } catch (error) {
        console.error("작업 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [boardId]); // boardId가 바뀔 때마다 다시 조회

  const handleCreateTask = async (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const { data, error } = await createTask({
        ...taskData,
        kanban_board_id: boardId,
      });

      if (error) {
        console.error("❌ [Page] Task 생성 실패:", error);
        return;
      }

      if (data) {
        setTasks((prev) => {
          const newTasks = [data, ...prev];

          return newTasks;
        });
      }
    } catch (error) {
      console.error("작업 생성 실패:", error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await updateTask(taskId, updates);

      if (error) {
        console.error("Task 수정 실패:", error);
        return;
      }

      if (data) {
        setTasks((prev) =>
          prev.map((task) => (task.id === data.id ? data : task))
        );
      }
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await deleteTask(taskId);

      if (error) {
        console.error("Task 삭제 실패:", error);
        return;
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );
  }
  if (!board) {
    return (
      <div className="flex items-center justify-center h-screen">
        칸반보드를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* ✅ 헤더에 칸반보드 정보 표시 */}
      <div className="px-6 py-4 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
        {board.description && (
          <p className="text-gray-600 mt-1">{board.description}</p>
        )}
      </div>

      {/* ✅ 칸반보드 컴포넌트 */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          boardId={boardId}
          projectName={board.name}
          projectId={board.project_id}
          userRole={null}
          tasks={tasks}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}
