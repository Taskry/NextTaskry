import { TaskStatus, TaskPriority } from "@/types";

/**
 * Task 관련 유틸리티 함수들
 */

// Task 상태별 색상 정의 (Tailwind CSS 다크모드 클래스 사용)
export const getTaskStatusColor = (status: TaskStatus) => {
  const colors = {
    todo: {
      bg: "bg-gray-400 dark:bg-gray-600",
      text: "text-gray-700 dark:text-gray-200",
      border: "border-gray-300 dark:border-gray-500",
    },
    inprogress: {
      bg: "bg-blue-400 dark:bg-blue-600",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-300 dark:border-blue-500",
    },
    done: {
      bg: "bg-green-400 dark:bg-green-600",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-300 dark:border-green-500",
    },
  };
  return colors[status];
}; // Task 우선순위별 색상 정의
export const getTaskPriorityColor = (
  priority: TaskPriority,
  isDark = false
) => {
  const colors = {
    high: {
      bg: isDark ? "bg-red-600" : "bg-red-500",
      text: isDark ? "text-red-300" : "text-red-600",
      icon: isDark ? "text-red-400" : "text-red-500",
    },
    normal: {
      bg: isDark ? "bg-yellow-600" : "bg-yellow-500",
      text: isDark ? "text-yellow-300" : "text-yellow-600",
      icon: isDark ? "text-yellow-400" : "text-yellow-500",
    },
    low: {
      bg: isDark ? "bg-green-600" : "bg-green-500",
      text: isDark ? "text-green-300" : "text-green-600",
      icon: isDark ? "text-green-400" : "text-green-500",
    },
  };
  return colors[priority];
};

// Task 상태별 라벨 정의
export const getTaskStatusLabel = (status: TaskStatus) => {
  const labels = {
    todo: "할 일",
    inprogress: "진행중",
    done: "완료",
  };
  return labels[status];
};

// Task 우선순위별 라벨 정의
export const getTaskPriorityLabel = (priority: TaskPriority) => {
  const labels = {
    high: "높음",
    normal: "보통",
    low: "낮음",
  };
  return labels[priority];
};

// 캘린더 이벤트용 색상 (react-big-calendar)
export const getCalendarEventColor = (status: TaskStatus, isDark = false) => {
  const colors = {
    todo: isDark ? "#4B5563" : "#9CA3AF", // 회색
    inprogress: isDark ? "#2563ebcc" : "#60a5facc", // 파란색
    done: isDark ? "#16a34acc" : "#57bc71cc", // 초록색
  };
  return colors[status];
};

// Task 완료율 계산
export const getTaskProgress = (subtasks?: any[]) => {
  if (!subtasks || subtasks.length === 0) return 0;

  const completedCount = subtasks.filter((subtask) => subtask.completed).length;
  return Math.round((completedCount / subtasks.length) * 100);
};

// Task 마감일 상태 확인
export const getTaskDeadlineStatus = (endedAt?: string) => {
  if (!endedAt) return null;

  const today = new Date();
  const deadline = new Date(endedAt);
  const diffDays = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "overdue"; // 지연
  if (diffDays <= 1) return "urgent"; // 급함
  if (diffDays <= 3) return "warning"; // 주의
  return "normal"; // 정상
};
