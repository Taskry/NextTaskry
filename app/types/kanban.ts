// Task 상태 - DB: task_status ENUM
export type TaskStatus = "todo" | "inprogress" | "done";

// Task 우선순위 - DB: task_priority ENUM
export type TaskPriority = "low" | "normal" | "high";

// ============================================
// Subtask - DB에서 JSON으로 저장됨
// ============================================

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

// ============================================
// Task 인터페이스 - DB의 tasks 테이블
// ============================================

export interface Task {
  id: string; //UUID
  kanban_board_id: string; // 어느 칸반보드에 속하는지

  //Task 내용
  title: string;
  description?: string; // 설명

  // 상태 관리
  status: TaskStatus;
  priority?: TaskPriority;

  // 담당자 & 하위 작업
  assigned_to?: string; // 담당자의 user_id (선택)
  subtasks?: Subtask[]; // 하위 작업 배열 (선택)

  // 추가 정보
  memo?: string; // 메모

  // 날짜
  started_at?: string; // 시작일
  ended_at?: string; // 마감일

  // 자동 생성 (생성, 수정 기록)
  created_at: string; // 생성일시
  updated_at: string; // 수정일시
}

// ============================================
// KanbanBoard 인터페이스 - DB의 kanban_boards 테이블
// ============================================

export interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  project_id: string;
  columns: string; // "todo,inprogress,done" (쉼표로 구분)
  created_at: string;
  updated_at: string;
}

// ============================================
// Column - 화면에 보여주기 위한 구조
// ============================================
export interface Column {
  id: TaskStatus; // "todo", "inprogress", "done"
  title: string; // "할 일", "진행 중", "완료"
  tasks: Task[]; // 이 열에 속한 Task들
  color: string; // UI 색상
}
