"use client";

import { useState, useEffect, useCallback } from "react";

interface UseTaskManagementProps {
  boardId: string;
  projectId: string;
}

interface TaskManagementResult {
  tasks: any[];
  isLoading: boolean;
  error: string | null;
  createTask: (taskData: any) => Promise<void>;
  updateTask: (taskId: string, updates: any) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

/**
 * useTaskManagement - Task CRUD 작업을 관리하는 커스텀 훅
 *
 * 칸반보드와 캘린더에서 공통으로 사용되는 Task 관리 로직을 캡슐화
 */
export function useTaskManagement({
  boardId,
  projectId,
}: UseTaskManagementProps): TaskManagementResult {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Task 목록 조회
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/tasks?boardId=${boardId}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const result = await response.json();
      setTasks(result.data || []);
    } catch (err) {
      console.error("Task 조회 실패:", err);
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  // Task 생성
  const createTask = async (taskData: any) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskData,
          kanban_board_id: boardId,
          project_id: projectId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      const result = await response.json();
      if (result.data) {
        setTasks((prev) => [result.data, ...prev]);
      }
    } catch (err) {
      console.error("Task 생성 실패:", err);
      throw err;
    }
  };

  // Task 수정
  const updateTask = async (taskId: string, updates: any) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const result = await response.json();
      if (result.data) {
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? result.data : task))
        );
      }
    } catch (err) {
      console.error("Task 수정 실패:", err);
      throw err;
    }
  };

  // Task 삭제
  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Task 삭제 실패:", err);
      throw err;
    }
  };

  // 컴포넌트 마운트 시 Task 목록 조회
  useEffect(() => {
    if (boardId) {
      fetchTasks();
    }
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
  };
}
