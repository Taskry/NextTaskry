import { supabase } from "@/lib/supabase/client";
import { Task } from "@/app/types";

/**
 * Task 생성
 */
export async function createTask(
  taskData: Omit<Task, "id" | "created_at" | "updated_at">
) {
  try {
    // ✅ undefined 값 제거 및 안전한 데이터만 추출
    const cleanData: any = {};

    if (taskData.kanban_board_id)
      cleanData.kanban_board_id = taskData.kanban_board_id;
    if (taskData.project_id) cleanData.project_id = taskData.project_id;
    if (taskData.title) cleanData.title = taskData.title;
    if (taskData.description) cleanData.description = taskData.description;
    if (taskData.status) cleanData.status = taskData.status;
    if (taskData.priority) cleanData.priority = taskData.priority;
    if (taskData.assigned_to) cleanData.assigned_to = taskData.assigned_to;
    if (taskData.started_at) cleanData.started_at = taskData.started_at;
    if (taskData.ended_at) cleanData.ended_at = taskData.ended_at;
    if (taskData.memo) cleanData.memo = taskData.memo;
    if (taskData.subtasks) cleanData.subtasks = taskData.subtasks;

    console.log("🔥 Creating task with:", cleanData);

    const { data, error } = await supabase
      .from("tasks")
      .insert(cleanData)
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    console.log("✅ Task created:", data);
    return { data: data as Task, error: null };
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
      .eq("kanban_board_id", boardId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data: (data as Task[]) || [], error: null };
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
    return { data: data as Task, error: null };
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
