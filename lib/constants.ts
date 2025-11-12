// 상수 & 목 데이터

import { Task, TaskStatus, TaskPriority } from "@/app/types";

/**
 * Task: Task 인터페이스 타입
 * TaskStatus: "todo" | "inprogress" | "done" 타입
 * TaskPriority: "low" | "normal" | "high" 타입
 */

// ============================================
// UI에서 사용할 칸반보드 열 정의
// ============================================

export const KANBAN_COLUMNS = [
  {
    id: "todo" as const, // as const = 값을 변경 불가능하게
    title: "할 일",
    color: "bg-gray-500",
  },
  {
    id: "inprogress" as const,
    title: "진행 중",
    color: "bg-blue-500",
  },
  {
    id: "done" as const,
    title: "완료",
    color: "bg-green-500",
  },
];

// ============================================
// 우선순위별 색상 (Tailwind CSS 클래스)
// ============================================
export const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800",
  normal: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

/**
 * 💡 사용 예시:
 * <span className={PRIORITY_COLORS[task.priority]}>
 *   높음
 * </span>
 */

// ============================================
// 테스트용 목 데이터 - 실제 DB 구조 그대로!
// ============================================
export const MOCK_TASKS_DATA = {
  todo: [
    {
      id: "task-1",
      kanban_board_id: "board-1",
      title: "로그인 페이지 디자인",
      description:
        "Figma에서 작성된 디자인을 바탕으로 로그인 페이지를 구현합니다.",
      status: "todo" as TaskStatus,
      priority: "high" as TaskPriority,
      assigned_to: "user-1",
      subtasks: [
        {
          id: "sub-1",
          title: "와이어프레임 작성",
          completed: true,
        },
        {
          id: "sub-2",
          title: "UI 컴포넌트 구현",
          completed: false,
        },
      ],
      memo: "디자인 시스템 참고하기",
      started_at: "2025-11-15",
      ended_at: "2025-11-20",
      created_at: "2025-11-12T10:00:00Z",
      updated_at: "2025-11-12T10:00:00Z",
    },
    {
      id: "task-2",
      kanban_board_id: "board-1",
      title: "API 문서 작성",
      description: "REST API 엔드포인트에 대한 상세 문서를 작성합니다.",
      status: "todo" as TaskStatus,
      priority: "normal" as TaskPriority,
      assigned_to: "user-2",
      memo: "Swagger 사용",
      ended_at: "2025-11-22",
      created_at: "2025-11-12T10:00:00Z",
      updated_at: "2025-11-12T10:00:00Z",
    },
    {
      id: "task-3",
      kanban_board_id: "board-1",
      title: "이메일 초대 기능",
      description: "프로젝트 멤버를 이메일로 초대할 수 있는 기능을 구현합니다.",
      status: "todo" as TaskStatus,
      priority: "high" as TaskPriority,
      assigned_to: "user-1",
      started_at: "2025-11-18",
      ended_at: "2025-11-25",
      created_at: "2025-11-12T10:00:00Z",
      updated_at: "2025-11-12T10:00:00Z",
    },
  ] as Task[],

  inprogress: [
    {
      id: "task-4",
      kanban_board_id: "board-1",
      title: "데이터베이스 스키마 설계",
      description: "Supabase 테이블 구조를 설계하고 생성합니다.",
      status: "inprogress" as TaskStatus,
      priority: "high" as TaskPriority,
      assigned_to: "user-3",
      subtasks: [
        { id: "sub-3", title: "ERD 작성", completed: true },
        { id: "sub-4", title: "SQL 스크립트 작성", completed: false },
        { id: "sub-5", title: "테이블 생성", completed: false },
      ],
      started_at: "2025-11-10",
      ended_at: "2025-11-18",
      created_at: "2025-11-10T10:00:00Z",
      updated_at: "2025-11-12T10:00:00Z",
    },
    {
      id: "task-5",
      kanban_board_id: "board-1",
      title: "드래그 앤 드롭 기능",
      description: "칸반보드에서 Task를 드래그해서 이동할 수 있게 만듭니다.",
      status: "inprogress" as TaskStatus,
      priority: "normal" as TaskPriority,
      assigned_to: "user-2",
      memo: "react-beautiful-dnd 라이브러리 사용",
      ended_at: "2025-11-20",
      created_at: "2025-11-11T10:00:00Z",
      updated_at: "2025-11-12T10:00:00Z",
    },
  ] as Task[],

  done: [
    {
      id: "task-6",
      kanban_board_id: "board-1",
      title: "프로젝트 초기 설정",
      description:
        "Next.js 프로젝트 생성 및 필요한 라이브러리 설치를 완료했습니다.",
      status: "done" as TaskStatus,
      priority: "low" as TaskPriority,
      assigned_to: "user-4",
      started_at: "2025-11-08",
      ended_at: "2025-11-10",
      created_at: "2025-11-08T10:00:00Z",
      updated_at: "2025-11-10T10:00:00Z",
    },
    {
      id: "task-7",
      kanban_board_id: "board-1",
      title: "TypeScript 타입 정의",
      description: "프로젝트에 필요한 기본 타입들을 정의했습니다.",
      status: "done" as TaskStatus,
      priority: "normal" as TaskPriority,
      assigned_to: "user-1",
      subtasks: [
        { id: "sub-6", title: "Task 타입 정의", completed: true },
        { id: "sub-7", title: "KanbanBoard 타입 정의", completed: true },
      ],
      started_at: "2025-11-11",
      ended_at: "2025-11-12",
      created_at: "2025-11-11T10:00:00Z",
      updated_at: "2025-11-12T10:00:00Z",
    },
  ] as Task[],
};
