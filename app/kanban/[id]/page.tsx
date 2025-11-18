// app/kanban/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Task, KanbanBoard } from "@/app/types/kanban";
import KanbanBoardComponent from "../../components/kanban/board/KanbanBoard";
import Button from "../../components/Button/Button";
import { Icon } from "../../components/Icon/Icon";
import Modal from "../../components/Modal/Modal";
import TaskAdd from "../../components/task/TaskAdd";
import { showToast } from "@/lib/toast";

export default function KanbanBoardPage() {
  const params = useParams();
  const boardId = params.id as string;

  const [board, setBoard] = useState<KanbanBoard | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 칸반보드 정보 조회
  const fetchBoard = useCallback(async () => {
    try {
      const response = await fetch(`/api/kanban/boards?id=${boardId}`);
      if (response.ok) {
        const boardData = await response.json();
        setBoard(boardData);
      } else {
        showToast("칸반보드를 찾을 수 없습니다.", "error");
      }
    } catch (error) {
      console.error("칸반보드 조회 실패:", error);
      showToast("칸반보드 조회 중 오류가 발생했습니다.", "error");
    }
  }, [boardId]);

  // 작업 목록 조회
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`/api/kanban/board?kanbanBoardId=${boardId}`);
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error("작업 목록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    if (boardId) {
      fetchBoard();
      fetchTasks();
    }
  }, [boardId, fetchBoard, fetchTasks]);

  // 작업 생성
  const handleCreateTask = async (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const response = await fetch("/api/kanban/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prev) => [...prev, newTask]);
        showToast("작업이 생성되었습니다.", "success");
      } else {
        const error = await response.json();
        showToast(error.error || "작업 생성 실패", "error");
      }
    } catch (error) {
      console.error("작업 생성 실패:", error);
      showToast("작업 생성 중 오류가 발생했습니다.", "error");
    }
  };

  // 작업 수정
  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`/api/kanban/board?id=${updatedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        showToast("작업이 수정되었습니다.", "success");
      } else {
        const error = await response.json();
        showToast(error.error || "작업 수정 실패", "error");
      }
    } catch (error) {
      console.error("작업 수정 실패:", error);
      showToast("작업 수정 중 오류가 발생했습니다.", "error");
    }
  };

  // 작업 삭제
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/kanban/board?id=${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        showToast("작업이 삭제되었습니다.", "success");
      } else {
        const error = await response.json();
        showToast(error.error || "작업 삭제 실패", "error");
      }
    } catch (error) {
      console.error("작업 삭제 실패:", error);
      showToast("작업 삭제 중 오류가 발생했습니다.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Icon type="alertTriangle" size={48} color="#EF4444" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            칸반보드를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            요청하신 칸반보드가 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
          <Button variant="primary" onClick={() => window.history.back()}>
            뒤로 가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
            {board.description && (
              <p className="text-gray-600 mt-1">{board.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="basic"
              onClick={() => window.history.back()}
            >
              <Icon type="arrowLeft" size={16} className="mr-2" />
              목록으로
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <Icon type="plus" size={16} className="mr-2" />
              새 작업
            </Button>
          </div>
        </div>
      </div>

      {/* 칸반보드 */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoardComponent
          projectName={board.name}
          tasks={tasks}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      {/* 작업 생성 모달 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskAdd
          boardId={boardId}
          onSubmit={handleCreateTask}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}