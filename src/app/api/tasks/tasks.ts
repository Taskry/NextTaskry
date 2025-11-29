import { supabase } from "@/lib/supabase/supabase";
import { Task } from "@/types";

// DB 테이블에 실제 존재하는 컬럼들
const DB_TASK_FIELDS = [
  "kanban_board_id",
  "title",
  "description",
  "status",
  "priority",
  "assigned_user_id",
  "started_at",
  "ended_at",
  "start_time",
  "end_time",
  "use_time",
  "memo",
  "subtasks",
] as const;

/**
 * API 응답 타입 정의
 */
type ApiResponse<T> = {
  data: T | null;
  error: any;
};

/**
 * 객체에서 유효한 DB 필드만 추출하고 null/undefined 값 처리
 */
function sanitizeTaskData<T extends Record<string, any>>(
  data: T
): Record<string, any> {
  const sanitized: Record<string, any> = {};

  DB_TASK_FIELDS.forEach((field) => {
    if (field in data) {
      const value = data[field];
      // null, undefined, 빈 문자열 처리
      if (value !== undefined && value !== "") {
        sanitized[field] = value === null ? null : value;
      }
    }
  });

  return sanitized;
}

/**
 * 에러 핸들링 헬퍼
 */
function handleApiError(operation: string, error: any): ApiResponse<any> {
  console.error(`${operation} 실패:`, error);
  return { data: null, error };
}

/**
 * Task 생성
 */
export async function createTask(
  taskData: Omit<Task, "id" | "created_at" | "updated_at">
): Promise<ApiResponse<Task>> {
  try {
    const cleanData = sanitizeTaskData(taskData);

    // 필수 필드 검증
    if (!cleanData.kanban_board_id || !cleanData.title) {
      throw new Error("kanban_board_id와 title은 필수 필드입니다.");
    }

    // console.log("🔥 Creating task with:", cleanData);

    const { data, error } = await supabase
      .from("tasks")
      .insert(cleanData)
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    return { data: data as Task, error: null };
  } catch (error) {
    return handleApiError("Task 생성", error);
  }
}

/**
 * 특정 프로젝트의 모든 Task 조회
 * ✅ JOIN을 사용해 한 번의 쿼리로 처리
 */
export async function getTasksByBoardId(
  projectId: string
): Promise<ApiResponse<Task[]>> {
  try {
    if (!projectId) {
      throw new Error("프로젝트 ID가 필요합니다.");
    }

    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        kanban_boards!inner(project_id)
      `
      )
      .eq("kanban_boards.project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // project_id를 Task 객체에 포함시키기
    const tasksWithProjectId = (data || []).map((task: any) => {
      const { kanban_boards, ...taskData } = task;
      return {
        ...taskData,
        project_id: kanban_boards.project_id,
      };
    });

    return { data: tasksWithProjectId as Task[], error: null };
  } catch (error) {
    return handleApiError("Task 조회", error);
  }
}

/**
 * Task 업데이트
 */
export async function updateTask(
  taskId: string,
  updates: Partial<Omit<Task, "id" | "created_at" | "updated_at">>
): Promise<ApiResponse<Task>> {
  try {
    if (!taskId) {
      throw new Error("Task ID가 필요합니다.");
    }

    const cleanUpdates = sanitizeTaskData(updates);

    if (Object.keys(cleanUpdates).length === 0) {
      throw new Error("업데이트할 유효한 필드가 없습니다.");
    }

    const { data, error } = await supabase
      .from("tasks")
      .update(cleanUpdates)
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;

    return { data: data as Task, error: null };
  } catch (error) {
    return handleApiError("Task 업데이트", error);
  }
}

/**
 * Task 삭제
 */
export async function deleteTask(taskId: string): Promise<ApiResponse<void>> {
  try {
    if (!taskId) {
      throw new Error("Task ID가 필요합니다.");
    }

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) throw error;

    return { data: null, error: null };
  } catch (error) {
    return handleApiError("Task 삭제", error);
  }
}
