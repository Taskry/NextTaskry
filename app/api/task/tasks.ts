import { supabase } from "@/lib/supabase/client";
import { Task } from "@/app/types";
/**
 * Task 생성
 */
export async function createTask(
  taskData: Omit<Task, "id" | "created_at" | "updated_at">
) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert(taskData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Task 생성 실패:", error);
    return { data: null, error };
  }
}

/**
 * 특정 칸반 보드의 모든 Task 조회
 */
export async function getTasksByBoardId(boardId: string) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", boardId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Task 조회 실패:", error);
    return { data: null, error };
  }
}

/**
 * Task 업데이트
 */
export async function updateTask(
  taskId: string,
  updates: Partial<Omit<Task, "id" | "created_at" | "updated_at">>
) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Task 업데이트 실패:", error);
    return { data: null, error };
  }
}

/**
 * Task 삭제
 */
export async function deleteTask(taskId: string) {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Task 삭제 실패:", error);
    return { error };
  }
}
