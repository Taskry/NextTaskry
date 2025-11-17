// app/kanban/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Task } from "@/app/types";
import tasksAPI from "../api/kanban/tasks/tasks";
import KanbanBoard from "../components/kanban/board/KanbanBoard";

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await tasksAPI.getTasks("board-001");
        setTasks(data);
      } catch (error) {
        console.error("작업 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    try {
      console.log("작업 생성:", taskData);
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Task;
      setTasks((prev) => [newTask, ...prev]);
    } catch (error) {
      console.error("작업 생성 실패:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );
  }

  return (
    <KanbanBoard
      projectName="board-001"
      tasks={tasks}
      onCreateTask={handleCreateTask}
      onUpdateTask={(task) => console.log("수정:", task)}
      onDeleteTask={(id) => console.log("삭제:", id)}
    />
  );
}
